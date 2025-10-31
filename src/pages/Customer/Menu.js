import React, { useState, useEffect } from 'react';
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
import { ROUTES, MENU_CATEGORIES } from '../../constants';
import menuService from '../../services/menuService';
import { formatCurrency } from '../../utils';
import toast from 'react-hot-toast';
import CustomerLayout from '../../components/Customer/CustomerLayout';

const CustomerMenu = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResult, itemsResult] = await Promise.all([
          menuService.getCategories(),
          menuService.getMenuItems()
        ]);

        if (categoriesResult.success) {
          setCategories(categoriesResult.data);
        }

        if (itemsResult.success) {
          setMenuItems(itemsResult.data);
          setFilteredItems(itemsResult.data);
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
        toast.error('Failed to load menu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery, menuItems]);

  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: {
        ...item,
        quantity: (prev[item.id]?.quantity || 0) + 1
      }
    }));
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId]) {
        newCart[itemId].quantity -= 1;
        if (newCart[itemId].quantity <= 0) {
          delete newCart[itemId];
        }
      }
      return newCart;
    });
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return Object.values(cart).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const categoryNames = {
    [MENU_CATEGORIES.STARTERS]: 'Starters',
    [MENU_CATEGORIES.CURRIES]: 'Curries',
    [MENU_CATEGORIES.BIRYANIS]: 'Biryanis',
    [MENU_CATEGORIES.FAMILY_PACK_BIRYANIS]: 'Family Pack Biryanis',
    [MENU_CATEGORIES.MEALS]: 'Meals',
    [MENU_CATEGORIES.BEVERAGES]: 'Beverages',
    [MENU_CATEGORIES.ICE_CREAMS]: 'Ice Creams',
    [MENU_CATEGORIES.RESTRO_SPECIALS]: 'RESTRO Specials'
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold gradient-text restro-brand">Our Menu</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                      selectedCategory === '' 
                        ? 'bg-primary-100 text-primary-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Items
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                        selectedCategory === category.id 
                          ? 'bg-primary-100 text-primary-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {categoryNames[category.id] || category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:w-3/4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ChefHat className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">
                            {item.rating || '4.5'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary-600">
                          {formatCurrency(item.price)}
                        </span>
                        {item.preparationTime && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {item.preparationTime} min
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {cart[item.id] ? (
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-medium">{cart[item.id].quantity}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="btn-primary flex items-center"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Cart
                          </button>
                        )}
                        
                        {!item.available && (
                          <span className="text-sm text-red-600 font-medium">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Cart Summary */}
      {getCartItemCount() > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {getCartItemCount()}
              </div>
              <div className="text-xs text-gray-600">items</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(getCartTotal())}
              </div>
              <div className="text-xs text-gray-600">total</div>
            </div>
            <Link
              to={ROUTES.CUSTOMER_CART}
              className="btn-primary text-sm"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
};

export default CustomerMenu;
