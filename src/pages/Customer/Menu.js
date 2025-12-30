import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  ShoppingCart,
  Star,
  ChefHat,
  Clock,
  Package,
  CheckCircle,
  TrendingUp,
  Utensils
} from 'lucide-react';
import { ROUTES } from '../../constants';
import userOrdersService from '../../services/userOrdersService';
import { formatCurrency } from '../../utils';
import toast from 'react-hot-toast';
import CustomerLayout from '../../components/Customer/CustomerLayout';
import { useAuth } from '../../context/AuthContext';
import { GlassCard, SectionHeading, MetricTile } from '../../components/Employee/EmployeeUI';

// Helper to get or generate user ID
const getUserId = (user) => {
  if (user?.id) return user.id;
  if (user?.user_id) return user.user_id;
  
  // Generate session ID for guests
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

const CustomerMenu = () => {
  const { user } = useAuth();
  const userId = useMemo(() => getUserId(user), [user]);
  
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({ items: [], subtotal: 0, tax: 0, total: 0, item_count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [vegFilter, setVegFilter] = useState(false);
  const [nonVegFilter, setNonVegFilter] = useState(false);

  // Fetch menu data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const result = await userOrdersService.getMenu();
        if (result.success && result.data) {
          const menuData = result.data;
          
          // Extract categories
          const categoryList = menuData.categories || [];
          setCategories(categoryList);
          
          // Flatten menu items from nested structure
          const flattenedItems = [];
          categoryList.forEach(category => {
            // Add veg items
            (category.veg || []).forEach(item => {
              flattenedItems.push({
                ...item,
                id: item.item_id,
                category: category.category_name,
                diet_type: 'veg'
              });
            });
            // Add non-veg items
            (category.non_veg || []).forEach(item => {
              flattenedItems.push({
                ...item,
                id: item.item_id,
                category: category.category_name,
                diet_type: 'non_veg'
              });
            });
          });
          
          setMenuItems(flattenedItems);
          setFilteredItems(flattenedItems);
        } else {
          toast.error(result.error || 'Failed to load menu');
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
        toast.error('Failed to load menu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const result = await userOrdersService.getCart(userId);
        if (result.success && result.data) {
          setCart(result.data);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
    // Refresh cart every 2 seconds
    const interval = setInterval(fetchCart, 2000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by veg/non-veg buttons
    if (vegFilter) {
      filtered = filtered.filter(item => item.diet_type === 'veg');
    } else if (nonVegFilter) {
      filtered = filtered.filter(item => item.diet_type === 'non_veg');
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery, menuItems, vegFilter, nonVegFilter]);

  const addToCart = async (item) => {
    // Prevent adding unavailable items
    if (!item.is_available) {
      toast.error('This item is currently not available');
      return;
    }
    
    try {
      const result = await userOrdersService.addToCart(userId, {
        item_id: item.item_id || item.id,
        quantity: 1,
        category: item.category,
        diet_type: item.diet_type
      });
      
      if (result.success) {
        toast.success(`${item.name} added to cart`);
        // Refresh cart
        const cartResult = await userOrdersService.getCart(userId);
        if (cartResult.success) {
          setCart(cartResult.data);
        }
      } else {
        toast.error(result.error || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (item) => {
    try {
      const result = await userOrdersService.removeFromCart(userId, item.item_id || item.id);
      
      if (result.success) {
        toast.success(`${item.name} removed from cart`);
        // Refresh cart
        const cartResult = await userOrdersService.getCart(userId);
        if (cartResult.success) {
          setCart(cartResult.data);
        }
      } else {
        toast.error(result.error || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(item);
      return;
    }

    try {
      const result = await userOrdersService.updateQuantity(userId, item.item_id || item.id, newQuantity);
      
      if (result.success) {
        // Refresh cart
        const cartResult = await userOrdersService.getCart(userId);
        if (cartResult.success) {
          setCart(cartResult.data);
        }
      } else {
        toast.error(result.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const getCartItemQuantity = (itemId) => {
    const cartItem = cart.items?.find(item => (item.item_id || item.id) === itemId);
    return cartItem?.quantity || 0;
  };

  const getCartItemCount = () => {
    return cart.item_count || 0;
  };

  const getCartTotal = () => {
    return cart.total || 0;
  };

  // Calculate stats for menu
  const menuStats = useMemo(() => {
    const totalItems = menuItems.length;
    const availableItems = menuItems.filter(item => item.is_available).length;
    const avgPrice = menuItems.length > 0 
      ? Math.round(menuItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0) / menuItems.length)
      : 0;
    const topCategory = categories.length > 0 ? categories[0]?.category_name || '—' : '—';
    
    return {
      totalItems,
      availableItems,
      avgPrice,
      topCategory
    };
  }, [menuItems, categories]);

  const statCards = useMemo(
    () => [
      {
        label: 'Total items',
        value: menuStats.totalItems,
        delta: `${menuStats.availableItems} available`,
        icon: Package,
        tone: 'sky'
      },
      {
        label: 'Available today',
        value: menuStats.availableItems,
        delta: 'Can be ordered now',
        icon: CheckCircle,
        tone: 'emerald'
      },
      {
        label: 'Avg price',
        value: menuStats.avgPrice > 0 ? `₹${menuStats.avgPrice}` : '—',
        delta: 'Per item',
        icon: TrendingUp,
        tone: 'amber'
      },
      {
        label: 'Top category',
        value: menuStats.topCategory,
        delta: 'Most popular',
        icon: ChefHat,
        tone: 'indigo'
      }
    ],
    [menuStats]
  );

  // Background style - solid dark navy blue
  const backgroundStyle = useMemo(() => ({
    backgroundColor: '#0a1628'
  }), []);

  if (isLoading) {
    return (
      <CustomerLayout backgroundStyle={backgroundStyle} backgroundClassName="bg-slate-950 text-slate-100">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-200">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-indigo-400" />
            <p className="text-sm text-slate-400">Loading menu...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout backgroundStyle={backgroundStyle} backgroundClassName="bg-slate-950 text-slate-100">
      <div className="space-y-6 px-4 py-6">
        {/* Hero Section - Matching Admin Dashboard */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 shadow-xl text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-slate-900 to-slate-950 opacity-95" />
          <div
            className="absolute inset-0 blur-3xl opacity-40"
            style={{ background: 'radial-gradient(circle at 15% 15%, rgba(16,185,129,0.35), transparent 55%)' }}
          />
          <div className="relative flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100 ring-1 ring-white/10">
                <ChefHat className="h-4 w-4 text-indigo-200" />
                <span>Customer · Menu</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-white">Our Delicious Menu</h1>
                <p className="text-sm text-white/80">
                  Explore our carefully crafted selection of authentic Indian dishes
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Live menu sync
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  Real-time availability
                </span>
              </div>
            </div>
            {getCartItemCount() > 0 && (
              <Link
                to={ROUTES.CUSTOMER_CART}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:shadow-xl"
              >
                <ShoppingCart className="h-4 w-4" />
                View Cart ({getCartItemCount()})
              </Link>
            )}
          </div>
        </section>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <MetricTile key={card.label} {...card} />
          ))}
        </div>

        {/* Search and Filters - Matching Admin Dashboard */}
        <GlassCard className="bg-white/90 border-slate-100 text-slate-900 dark:bg-slate-900/70 dark:border-slate-800">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-indigo-400"
                />
              </div>
              <div className="sm:w-64">
                <select
                  aria-label="Category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-indigo-400"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.category_name} value={category.category_name}>
                      {category.category_name.charAt(0).toUpperCase() + category.category_name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Veg/Non-Veg Filter Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setVegFilter(!vegFilter);
                  if (!vegFilter) {
                    setNonVegFilter(false);
                  }
                }}
                className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg border-2 ${
                  vegFilter
                    ? 'bg-green-500 border-green-600 text-white dark:bg-green-600 dark:border-green-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    vegFilter
                      ? 'border-white dark:border-white'
                      : 'border-green-500 dark:border-green-400'
                  } ${vegFilter ? 'bg-white dark:bg-white' : 'bg-transparent'}`}
                >
                  {vegFilter && (
                    <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400" />
                  )}
                </div>
                Veg
              </button>

              <button
                onClick={() => {
                  setNonVegFilter(!nonVegFilter);
                  if (!nonVegFilter) {
                    setVegFilter(false);
                  }
                }}
                className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg border-2 ${
                  nonVegFilter
                    ? 'bg-red-500 border-red-600 text-white dark:bg-red-600 dark:border-red-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={nonVegFilter ? 'text-white dark:text-white' : 'text-red-500 dark:text-red-400'}
                >
                  <path
                    d="M5 1L9 8H1L5 1Z"
                    fill="currentColor"
                  />
                </svg>
                Non Veg
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Menu Items Grid - Matching Admin Dashboard Style */}
        <GlassCard className="overflow-hidden bg-white/95 border-slate-100 text-slate-900 shadow-md dark:bg-slate-900/80 dark:border-slate-800">
          <SectionHeading
            title="Menu items"
            description="Browse and order from our delicious selection."
          />

          {filteredItems.length === 0 ? (
            <div className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
              <ChefHat className="h-16 w-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-lg font-semibold text-slate-900 dark:text-white">No menu items match your filters.</p>
              <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {filteredItems.map((item) => {
                const isUnavailable = !item.is_available;
                return (
                  <div 
                    key={item.id} 
                    className={`group relative rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 ${
                      isUnavailable ? 'opacity-60 grayscale' : ''
                    }`}
                  >
                    {/* Image Section */}
                    <div className="relative h-48 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                            isUnavailable ? 'grayscale' : ''
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-slate-700">
                          <Utensils className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      )}
                      {/* Price Badge */}
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg">
                        {formatCurrency(item.price)}
                      </div>
                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 rounded-full px-2.5 py-1.5 flex items-center gap-1 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur">
                        <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {item.rating || '4.5'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className={`text-lg font-semibold mb-2 line-clamp-1 ${
                          isUnavailable 
                            ? 'text-slate-400 dark:text-slate-500' 
                            : 'text-slate-900 dark:text-white'
                        }`}>
                          {item.name}
                        </h3>
                        
                        <p className={`text-sm line-clamp-2 ${
                          isUnavailable 
                            ? 'text-slate-400 dark:text-slate-500' 
                            : 'text-slate-600 dark:text-slate-300'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                      
                      {item.preparationTime && (
                        <div className={`flex items-center text-xs px-2.5 py-1 rounded-full mb-3 inline-flex ${
                          isUnavailable 
                            ? 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500' 
                            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        }`}>
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          {item.preparationTime} min
                        </div>
                      )}
                      
                      {/* Add to Cart Section */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        {!isUnavailable && getCartItemQuantity(item.id) > 0 ? (
                          <div className="flex items-center space-x-2 rounded-full px-3 py-1.5 bg-slate-50 dark:bg-slate-700/50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(item, getCartItemQuantity(item.id) - 1);
                              }}
                              className="p-1 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-all"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="font-semibold min-w-[20px] text-center text-sm text-slate-900 dark:text-white">
                              {getCartItemQuantity(item.id)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item);
                              }}
                              className="p-1 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-all"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : !isUnavailable ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item);
                            }}
                            className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-rose-500 hover:shadow-lg transition-all"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-4 py-2 rounded-full text-sm font-semibold text-slate-400 dark:text-slate-500 cursor-not-allowed bg-slate-100 dark:bg-slate-700"
                          >
                            Unavailable
                          </button>
                        )}
                        
                        {isUnavailable && (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>

        {/* Floating Cart Summary - Matching Admin Dashboard Style */}
        {getCartItemCount() > 0 && (
          <div className="fixed bottom-6 right-6 rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur shadow-2xl p-5 z-50 max-w-[calc(100vw-3rem)] min-w-[280px] max-w-[400px]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {getCartItemCount()}
                  </div>
                  <div className="text-xs text-slate-400">items</div>
                </div>
                <div className="h-12 w-px bg-white/10"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">
                    {formatCurrency(getCartTotal())}
                  </div>
                  <div className="text-xs text-slate-400">total</div>
                </div>
              </div>
              <Link
                to={ROUTES.CUSTOMER_CART}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-rose-500 hover:shadow-lg transition-all flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerMenu;
