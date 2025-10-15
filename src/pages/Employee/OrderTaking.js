import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Plus, Minus, Search, Filter, Clock, 
  MapPin, Utensils, Truck, CreditCard,
  Save, X, CheckCircle, AlertCircle, Trash2
} from 'lucide-react';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import menuService from '../../services/menuService';
import orderService from '../../services/orderService';
import tableService from '../../services/tableService';
import { formatCurrency } from '../../utils';
import toast from 'react-hot-toast';

const OrderTaking = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [availableTables, setAvailableTables] = useState([
    { id: 'T1', tableNumber: 'T1', status: 'available', capacity: 4 },
    { id: 'T2', tableNumber: 'T2', status: 'available', capacity: 2 },
    { id: 'T3', tableNumber: 'T3', status: 'occupied', capacity: 6 },
    { id: 'T4', tableNumber: 'T4', status: 'available', capacity: 4 },
    { id: 'T5', tableNumber: 'T5', status: 'available', capacity: 8 },
    { id: 'T6', tableNumber: 'T6', status: 'occupied', capacity: 2 },
    { id: 'T7', tableNumber: 'T7', status: 'available', capacity: 4 },
    { id: 'T8', tableNumber: 'T8', status: 'available', capacity: 6 },
    { id: 'T9', tableNumber: 'T9', status: 'available', capacity: 2 },
    { id: 'T10', tableNumber: 'T10', status: 'occupied', capacity: 4 }
  ]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Order details
  const [orderDetails, setOrderDetails] = useState({
    tableNumber: '',
    orderType: 'dine-in',
    specialNotes: '',
    paymentMethod: 'cash'
  });


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [menuResult, tablesResult] = await Promise.all([
        menuService.getMenuItems(),
        tableService.getAvailableTables()
      ]);
      
      if (menuResult.success) {
        setMenuItems(menuResult.data);
      } else {
        toast.error('Failed to load menu items');
      }

      if (tablesResult.success) {
        setAvailableTables(tablesResult.data);
      } else {
        toast.error('Failed to load available tables');
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory && item.available;
  });

  const categories = [...new Set(menuItems.map(item => item.category))];

  const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => {
      const newDetails = {
        ...prev,
        [name]: value
      };
      
      // Clear table number if order type changes away from dine-in
      if (name === 'orderType' && value !== 'dine-in') {
        newDetails.tableNumber = '';
      }
      
      return newDetails;
    });
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      toast.error('Please add items to cart before placing order');
      return;
    }

    if (orderDetails.orderType === 'dine-in' && !orderDetails.tableNumber) {
      toast.error('Please select a table for dine-in orders');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: 'Walk-in Customer',
        customerPhone: 'N/A',
        customerEmail: '',
        tableNumber: orderDetails.orderType === 'dine-in' ? orderDetails.tableNumber : null,
        orderType: orderDetails.orderType,
        specialNotes: orderDetails.specialNotes || '',
        paymentMethod: orderDetails.paymentMethod,
        items: cart.map(item => ({
          menuItemId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        total: getCartTotal(),
        status: 'pending'
      };

      const result = await orderService.createOrder(orderData);
      if (result.success) {
        toast.success('Order placed successfully!');
        // Reset form
        setCart([]);
        setOrderDetails({
          tableNumber: '',
          orderType: 'dine-in',
          specialNotes: '',
          paymentMethod: 'cash'
        });
        // Refresh available tables
        const tablesResult = await tableService.getAvailableTables();
        if (tablesResult.success) {
          setAvailableTables(tablesResult.data);
        }
      } else {
        toast.error(result.error || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text restro-brand">Order Taking</h1>
            <p className="text-gray-600 mt-2 text-lg">Take new orders from customers</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="glass bg-primary-100/80 text-primary-800 px-6 py-3 rounded-xl">
              <span className="font-bold text-lg">{getCartItemCount()} items</span>
            </div>
            <div className="glass bg-green-100/80 text-green-800 px-6 py-3 rounded-xl">
              <span className="font-bold text-lg">{formatCurrency(getCartTotal())}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenuItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full btn-primary flex items-center justify-center hover:scale-105 transition-transform duration-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Type
                  </label>
                  <select
                    name="orderType"
                    value={orderDetails.orderType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="dine-in">Dine-in</option>
                    <option value="takeaway">Takeaway</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>

                {orderDetails.orderType === 'dine-in' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Table *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        name="tableNumber"
                        value={orderDetails.tableNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Select Table</option>
                        {availableTables
                          .filter(table => table.status === 'available')
                          .map((table) => (
                            <option key={table.id} value={table.tableNumber}>
                              {table.tableNumber} (Capacity: {table.capacity})
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Available tables: {availableTables.filter(table => table.status === 'available').length} of {availableTables.length}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={orderDetails.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Notes
                  </label>
                  <textarea
                    name="specialNotes"
                    value={orderDetails.specialNotes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any special instructions or notes..."
                  />
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No items in cart</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">{formatCurrency(getCartTotal())}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full btn-primary flex items-center justify-center hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default OrderTaking;
