import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  Star, 
  MapPin, 
  Calendar,
  CreditCard,
  Filter,
  Search
} from 'lucide-react';
import DashboardLayout from '../../components/Common/DashboardLayout';
import { formatCurrency } from '../../utils';

const CustomerOrders = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Static order data
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-21',
      time: '14:30',
      status: 'delivered',
      type: 'delivery',
      total: 1250,
      items: [
        { name: 'Chicken Biryani', quantity: 2, price: 450 },
        { name: 'Mutton Curry', quantity: 1, price: 350 }
      ],
      deliveryAddress: '123 Main Street, City, State 12345',
      paymentMethod: 'Credit Card',
      rating: 5,
      notes: 'Delicious food, delivered on time!'
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      time: '19:45',
      status: 'delivered',
      type: 'pickup',
      total: 850,
      items: [
        { name: 'Vegetable Biryani', quantity: 1, price: 300 },
        { name: 'Dal Makhani', quantity: 1, price: 200 },
        { name: 'Naan', quantity: 2, price: 100 }
      ],
      deliveryAddress: null,
      paymentMethod: 'Cash',
      rating: 4,
      notes: 'Good food, quick pickup'
    },
    {
      id: 'ORD-003',
      date: '2024-01-19',
      time: '12:15',
      status: 'delivered',
      type: 'delivery',
      total: 2100,
      items: [
        { name: 'Family Pack Biryani', quantity: 1, price: 800 },
        { name: 'Chicken Tikka', quantity: 1, price: 400 },
        { name: 'Raita', quantity: 2, price: 100 },
        { name: 'Ice Cream', quantity: 2, price: 200 }
      ],
      deliveryAddress: '456 Oak Avenue, City, State 12345',
      paymentMethod: 'UPI',
      rating: 5,
      notes: 'Perfect for family dinner!'
    },
    {
      id: 'ORD-004',
      date: '2024-01-18',
      time: '18:30',
      status: 'delivered',
      type: 'delivery',
      total: 650,
      items: [
        { name: 'Fish Curry', quantity: 1, price: 350 },
        { name: 'Rice', quantity: 1, price: 50 },
        { name: 'Papad', quantity: 2, price: 50 }
      ],
      deliveryAddress: '789 Pine Street, City, State 12345',
      paymentMethod: 'Credit Card',
      rating: 4,
      notes: 'Fresh fish, well cooked'
    },
    {
      id: 'ORD-005',
      date: '2024-01-17',
      time: '20:00',
      status: 'delivered',
      type: 'pickup',
      total: 1200,
      items: [
        { name: 'Lamb Biryani', quantity: 1, price: 500 },
        { name: 'Chicken 65', quantity: 1, price: 300 },
        { name: 'Gulab Jamun', quantity: 4, price: 200 }
      ],
      deliveryAddress: null,
      paymentMethod: 'Cash',
      rating: 5,
      notes: 'Excellent taste and quality'
    },
    {
      id: 'ORD-006',
      date: '2024-01-16',
      time: '13:45',
      status: 'delivered',
      type: 'delivery',
      total: 950,
      items: [
        { name: 'Paneer Butter Masala', quantity: 1, price: 300 },
        { name: 'Jeera Rice', quantity: 1, price: 150 },
        { name: 'Garlic Naan', quantity: 2, price: 120 },
        { name: 'Lassi', quantity: 2, price: 100 }
      ],
      deliveryAddress: '321 Elm Street, City, State 12345',
      paymentMethod: 'UPI',
      rating: 4,
      notes: 'Good vegetarian option'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-for-delivery':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'preparing':
        return <Clock className="h-4 w-4" />;
      case 'out-for-delivery':
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track your order history and reorder favorites</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'delivered').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(orders.reduce((sum, order) => sum + order.rating, 0) / orders.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID or items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="preparing">Preparing</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status.replace('-', ' ')}</span>
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.type === 'delivery' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {order.type}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.total)}
                  </p>
                  <p className="text-xs text-gray-500">{order.date} at {order.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.quantity}x {item.name}</span>
                        <span className="text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Order Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Payment: {order.paymentMethod}</span>
                    </div>
                    {order.deliveryAddress && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{order.deliveryAddress}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-gray-600">Rating: {order.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Notes:</span> {order.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Order placed on {order.date} at {order.time}
                </span>
                <div className="flex space-x-2">
                  <button className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                    Reorder
                  </button>
                  <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerOrders;
