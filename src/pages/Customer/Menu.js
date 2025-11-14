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
  Clock
} from 'lucide-react';
import { ROUTES } from '../../constants';
import userOrdersService from '../../services/userOrdersService';
import { formatCurrency } from '../../utils';
import toast from 'react-hot-toast';
import CustomerLayout from '../../components/Customer/CustomerLayout';
import { useAuth } from '../../context/AuthContext';

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
  
  // Custom color palette (matching admin)
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };
  
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

    // Filter by veg/non-veg toggles
    if (vegFilter || nonVegFilter) {
      filtered = filtered.filter(item => {
        const isVeg = item.diet_type === 'veg';
        const isNonVeg = item.diet_type === 'non_veg';
        
        if (vegFilter && nonVegFilter) {
          return isVeg || isNonVeg; // Show both
        } else if (vegFilter) {
          return isVeg;
        } else if (nonVegFilter) {
          return isNonVeg;
        }
        return true;
      });
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

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64" style={{ backgroundColor: colors.cream }}>
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.red }}
            ></div>
            <p className="font-semibold" style={{ color: colors.darkNavy }}>Loading menu...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-8 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', width: '100%', padding: '1.5rem 2rem', overflowX: 'hidden' }}>
        <div className="w-full max-w-full">
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <h1 
              className="text-3xl font-bold drop-shadow-lg mb-2" 
              style={{ 
                fontFamily: "'BBH Sans Bartle', sans-serif", 
                letterSpacing: '0.05em',
                color: colors.darkNavy,
                fontFeatureSettings: '"liga" off',
                fontVariantLigatures: 'none',
                textRendering: 'geometricPrecision',
                fontKerning: 'none'
              }}
            >
              Our Menu
            </h1>
            <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '150px' }}></div>
            <p className="text-lg mt-2" style={{ color: colors.mediumBlue }}>Discover our delicious offerings</p>
          </div>

          {/* Search Bar - Swiggy Style */}
          <div className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
              <input
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  borderColor: colors.lightBlue,
                  color: colors.darkNavy,
                  fontSize: '16px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.red;
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.lightBlue;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Toggle Switches - Veg/Non-Veg Filters */}
          <div className="mb-6 flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative" style={{ width: '56px', height: '32px' }}>
                <input
                  type="checkbox"
                  checked={vegFilter}
                  onChange={(e) => setVegFilter(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-full h-full rounded-lg border-2 relative overflow-hidden transition-all duration-300"
                  style={{ 
                    borderColor: '#d1d5db',
                    backgroundColor: '#f3f4f6'
                  }}
                >
                  {/* Track */}
                  <div
                    className="absolute inset-0 rounded-lg transition-all duration-300"
                    style={{ 
                      backgroundColor: vegFilter ? '#22c55e' : '#e5e7eb',
                      margin: '2px'
                    }}
                  />
                  {/* Thumb */}
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 rounded-lg transition-all duration-300 flex items-center justify-center ${
                      vegFilter ? 'translate-x-6' : 'translate-x-0'
                    }`}
                    style={{ 
                      backgroundColor: '#ffffff',
                      border: '2px solid',
                      borderColor: vegFilter ? '#16a34a' : '#9ca3af',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Green Circle */}
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: '#16a34a' }}
                    />
                  </div>
                </div>
              </div>
              <span className="font-medium text-sm" style={{ color: colors.darkNavy }}>Veg</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative" style={{ width: '56px', height: '32px' }}>
                <input
                  type="checkbox"
                  checked={nonVegFilter}
                  onChange={(e) => setNonVegFilter(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-full h-full rounded-lg border-2 relative overflow-hidden transition-all duration-300"
                  style={{ 
                    borderColor: '#d1d5db',
                    backgroundColor: '#f3f4f6'
                  }}
                >
                  {/* Track */}
                  <div
                    className="absolute inset-0 rounded-lg transition-all duration-300"
                    style={{ 
                      backgroundColor: nonVegFilter ? colors.red : '#e5e7eb',
                      margin: '2px'
                    }}
                  />
                  {/* Thumb */}
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 rounded-lg transition-all duration-300 flex items-center justify-center ${
                      nonVegFilter ? 'translate-x-6' : 'translate-x-0'
                    }`}
                    style={{ 
                      backgroundColor: '#ffffff',
                      border: '2px solid',
                      borderColor: nonVegFilter ? colors.red : '#9ca3af',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Red Triangle */}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 1L9 8H1L5 1Z"
                        fill={colors.red}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <span className="font-medium text-sm" style={{ color: colors.darkNavy }}>Non-Veg</span>
            </label>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 min-w-0">
            {/* Sidebar - Categories */}
            <div className="lg:w-1/4 min-w-0 flex-shrink-0">
              <div 
                className="rounded-2xl shadow-xl hover:shadow-2xl p-6 sticky top-8 transition-all duration-300 border-2"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
                  borderColor: colors.lightBlue
                }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.darkNavy }}>Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                      selectedCategory === '' 
                        ? 'text-white' 
                        : 'hover:bg-opacity-10'
                    }`}
                    style={selectedCategory === '' 
                      ? { backgroundColor: colors.red, color: '#FFFFFF' }
                      : { color: colors.darkNavy, backgroundColor: 'transparent' }
                    }
                    onMouseEnter={(e) => {
                      if (selectedCategory !== '') {
                        e.target.style.backgroundColor = 'rgba(168, 218, 220, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== '') {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    All Items
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.category_name}
                      onClick={() => setSelectedCategory(category.category_name)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                        selectedCategory === category.category_name 
                          ? 'text-white' 
                          : ''
                      }`}
                      style={selectedCategory === category.category_name 
                        ? { backgroundColor: colors.red, color: '#FFFFFF' }
                        : { color: colors.darkNavy, backgroundColor: 'transparent' }
                      }
                      onMouseEnter={(e) => {
                        if (selectedCategory !== category.category_name) {
                          e.target.style.backgroundColor = 'rgba(168, 218, 220, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory !== category.category_name) {
                          e.target.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {category.category_name.charAt(0).toUpperCase() + category.category_name.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Items - Swiggy Style Grid */}
            <div className="lg:w-3/4 min-w-0">
              {filteredItems.length === 0 ? (
                <div 
                  className="text-center py-16 rounded-2xl shadow-xl border-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
                    borderColor: colors.lightBlue
                  }}
                >
                  <ChefHat className="h-20 w-20 mx-auto mb-4" style={{ color: colors.lightBlue }} />
                  <h3 className="text-2xl font-semibold mb-2" style={{ color: colors.darkNavy }}>No items found</h3>
                  <p style={{ color: colors.mediumBlue }}>Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 min-w-0">
                  {filteredItems.map((item) => {
                    const isUnavailable = !item.is_available;
                    return (
                    <div 
                      key={item.id} 
                      className="rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105 border-2"
                      style={{ 
                        background: isUnavailable 
                          ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                          : `linear-gradient(135deg, #FFFFFF 0%, ${colors.cream} 100%)`,
                        borderColor: isUnavailable ? '#9ca3af' : colors.lightBlue,
                        filter: isUnavailable ? 'grayscale(100%)' : 'none',
                        opacity: isUnavailable ? 0.7 : 1
                      }}
                    >
                      {/* Image Section */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            style={{ filter: isUnavailable ? 'grayscale(100%)' : 'none' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: isUnavailable ? '#d1d5db' : colors.lightBlue }}>
                            <ChefHat className="h-16 w-16" style={{ color: isUnavailable ? '#6b7280' : colors.mediumBlue }} />
                          </div>
                        )}
                        {/* Rating Badge */}
                        <div 
                          className="absolute top-3 right-3 rounded-full px-3 py-1 flex items-center gap-1 shadow-lg"
                          style={{ backgroundColor: colors.cream }}
                        >
                          <Star className="h-4 w-4 fill-current" style={{ color: '#FFB800' }} />
                          <span className="text-sm font-semibold" style={{ color: colors.darkNavy }}>
                            {item.rating || '4.5'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Not Available Overlay */}
                      {isUnavailable && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-t-2xl">
                          <span 
                            className="text-white font-bold text-lg px-4 py-2 rounded-full"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                          >
                            Not Available
                          </span>
                        </div>
                      )}
                      
                      {/* Content Section */}
                      <div className="p-5" style={{ position: 'relative', zIndex: 1 }}>
                        <h3 className="text-xl font-bold mb-2 line-clamp-1" style={{ color: isUnavailable ? '#6b7280' : colors.darkNavy }}>
                          {item.name}
                        </h3>
                        
                        <p className="text-sm mb-4 line-clamp-2" style={{ color: isUnavailable ? '#9ca3af' : colors.mediumBlue }}>
                          {item.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-2xl font-bold" style={{ color: isUnavailable ? '#9ca3af' : colors.red }}>
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                          {item.preparationTime && (
                            <div 
                              className="flex items-center text-sm px-2 py-1 rounded-full" 
                              style={{ 
                                backgroundColor: isUnavailable ? 'rgba(156, 163, 175, 0.2)' : 'rgba(168, 218, 220, 0.2)', 
                                color: isUnavailable ? '#6b7280' : colors.mediumBlue 
                              }}
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              {item.preparationTime} min
                            </div>
                          )}
                        </div>
                        
                        {/* Add to Cart Section */}
                        <div className="flex items-center justify-between">
                          {!isUnavailable && getCartItemQuantity(item.id) > 0 ? (
                            <div 
                              className="flex items-center space-x-3 rounded-full px-4 py-2" 
                              style={{ backgroundColor: colors.cream }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(item, getCartItemQuantity(item.id) - 1);
                                }}
                                className="p-1 rounded-full hover:bg-opacity-80 transition-all"
                                style={{ backgroundColor: colors.red, color: '#FFFFFF' }}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="font-bold min-w-[24px] text-center" style={{ color: colors.darkNavy }}>
                                {getCartItemQuantity(item.id)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(item);
                                }}
                                className="p-1 rounded-full hover:bg-opacity-80 transition-all"
                                style={{ backgroundColor: colors.red, color: '#FFFFFF' }}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          ) : !isUnavailable ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item);
                              }}
                              className="px-6 py-2 rounded-full font-semibold text-white hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                              style={{ backgroundColor: colors.red }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f3e'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = colors.red}
                            >
                              ADD
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-6 py-2 rounded-full font-semibold text-gray-400 cursor-not-allowed transition-all shadow-lg"
                              style={{ backgroundColor: '#e5e7eb' }}
                            >
                              Not Available
                            </button>
                          )}
                          
                          {isUnavailable && (
                            <span 
                              className="text-sm font-medium px-3 py-1 rounded-full" 
                              style={{ backgroundColor: 'rgba(107, 114, 128, 0.2)', color: '#6b7280' }}
                            >
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Summary - Swiggy Style */}
      {getCartItemCount() > 0 && (
        <div 
          className="fixed bottom-6 right-6 rounded-2xl shadow-2xl p-5 z-50 animate-bounce-zoom max-w-[calc(100vw-3rem)]"
          style={{ 
            backgroundColor: colors.darkNavy,
            border: `2px solid ${colors.red}`,
            minWidth: '280px',
            maxWidth: '400px'
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {getCartItemCount()}
                </div>
                <div className="text-xs" style={{ color: colors.lightBlue }}>items</div>
              </div>
              <div className="h-12 w-px" style={{ backgroundColor: colors.mediumBlue }}></div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {formatCurrency(getCartTotal())}
                </div>
                <div className="text-xs" style={{ color: colors.lightBlue }}>total</div>
              </div>
            </div>
            <Link
              to={ROUTES.CUSTOMER_CART}
              className="px-6 py-3 rounded-full font-bold text-white hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              style={{ backgroundColor: colors.red }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f3e'}
              onMouseLeave={(e) => e.target.style.backgroundColor = colors.red}
            >
              <ShoppingCart className="h-5 w-5" />
              View Cart
            </Link>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
};

export default CustomerMenu;
