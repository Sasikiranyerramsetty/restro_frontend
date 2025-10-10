import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Filter, Search, Clock, CheckCircle, 
  AlertCircle, X, Eye, User, Phone, MapPin, Package,
  Utensils, Truck, Calendar, DollarSign
} from 'lucide-react';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import { formatCurrency, formatDate } from '../../utils';

const EmployeeOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    // Mock data for employee orders
    const mockOrders = [
      {
        id: 1,
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        customerPhone: '9876543210',
        customerEmail: 'john.doe@example.com',
        tableNumber: 'T5',
        orderType: 'dine-in',
        status: 'preparing',
        total: 850,
        items: [
          { name: 'Chicken Biryani', quantity: 2, price: 280, total: 560 },
          { name: 'Mutton Curry', quantity: 1, price: 320, total: 320 },
          { name: 'Garlic Naan', quantity: 2, price: 100, total: 200 }
        ],
        orderDate: '2024-01-20',
        orderTime: '19:30',
        assignedAt: new Date().toISOString(),
        estimatedTime: '25 mins',
        specialNotes: 'Extra spicy for biryani',
        paymentStatus: 'paid',
        paymentMethod: 'card'
      },
      {
        id: 2,
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        customerPhone: '9876543211',
        customerEmail: 'jane.smith@example.com',
        tableNumber: 'T3',
        orderType: 'dine-in',
        status: 'ready',
        total: 650,
        items: [
          { name: 'RESTRO Special Thali', quantity: 1, price: 350, total: 350 },
          { name: 'Paneer Tikka', quantity: 1, price: 220, total: 220 },
          { name: 'Fresh Lime Soda', quantity: 2, price: 90, total: 180 }
        ],
        orderDate: '2024-01-20',
        orderTime: '20:00',
        assignedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        estimatedTime: 'Ready',
        specialNotes: 'Birthday celebration',
        paymentStatus: 'paid',
        paymentMethod: 'upi'
      },
      {
        id: 3,
        orderNumber: 'ORD-003',
        customerName: 'Mike Wilson',
        customerPhone: '9876543212',
        customerEmail: 'mike.wilson@example.com',
        tableNumber: null,
        orderType: 'takeaway',
        status: 'pending',
        total: 420,
        items: [
          { name: 'Chicken Biryani', quantity: 1, price: 280, total: 280 },
          { name: 'Butter Chicken', quantity: 1, price: 290, total: 290 }
        ],
        orderDate: '2024-01-20',
        orderTime: '20:15',
        assignedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        estimatedTime: '20 mins',
        specialNotes: 'Pickup at 8:30 PM',
        paymentStatus: 'pending',
        paymentMethod: 'cash'
      },
      {
        id: 4,
        orderNumber: 'ORD-004',
        customerName: 'Emily Davis',
        customerPhone: '9876543213',
        customerEmail: 'emily.davis@example.com',
        tableNumber: 'T7',
        orderType: 'dine-in',
        status: 'preparing',
        total: 720,
        items: [
          { name: 'Mutton Curry', quantity: 1, price: 320, total: 320 },
          { name: 'Dal Makhani', quantity: 1, price: 180, total: 180 },
          { name: 'Butter Naan', quantity: 3, price: 90, total: 270 },
          { name: 'Coca-Cola', quantity: 2, price: 45, total: 90 }
        ],
        orderDate: '2024-01-20',
        orderTime: '19:45',
        assignedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        estimatedTime: '15 mins',
        specialNotes: 'Anniversary dinner',
        paymentStatus: 'paid',
        paymentMethod: 'card'
      },
      {
        id: 5,
        orderNumber: 'ORD-005',
        customerName: 'Alice Wonderland',
        customerPhone: '9876543214',
        customerEmail: 'alice@example.com',
        tableNumber: 'T2',
        orderType: 'dine-in',
        status: 'ready',
        total: 580,
        items: [
          { name: 'Paneer Tikka', quantity: 2, price: 220, total: 440 },
          { name: 'Veg Spring Rolls', quantity: 1, price: 220, total: 220 },
          { name: 'Mango Lassi', quantity: 2, price: 70, total: 140 }
        ],
        orderDate: '2024-01-20',
        orderTime: '20:30',
        assignedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        estimatedTime: 'Ready',
        specialNotes: 'Vegetarian options preferred',
        paymentStatus: 'paid',
        paymentMethod: 'upi'
      },
      {
        id: 6,
        orderNumber: 'ORD-006',
        customerName: 'Bob The Builder',
        customerPhone: '9876543215',
        customerEmail: 'bob@example.com',
        tableNumber: null,
        orderType: 'delivery',
        status: 'preparing',
        total: 1200,
        items: [
          { name: 'Chicken Biryani', quantity: 2, price: 280, total: 560 },
          { name: 'Dal Makhani', quantity: 1, price: 180, total: 180 },
          { name: 'RESTRO Special Thali', quantity: 1, price: 350, total: 350 },
          { name: 'Garlic Naan', quantity: 4, price: 100, total: 400 }
        ],
        orderDate: '2024-01-20',
        orderTime: '21:00',
        assignedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        estimatedTime: '30 mins',
        specialNotes: 'Deliver to apartment 4B, ring doorbell twice',
        paymentStatus: 'paid',
        paymentMethod: 'card'
      },
      {
        id: 7,
        orderNumber: 'ORD-007',
        customerName: 'Charlie Chaplin',
        customerPhone: '9876543216',
        customerEmail: 'charlie@example.com',
        tableNumber: null,
        orderType: 'takeaway',
        status: 'completed',
        total: 586,
        items: [
          { name: 'Paneer Tikka', quantity: 1, price: 220, total: 220 },
          { name: 'Butter Chicken', quantity: 1, price: 290, total: 290 },
          { name: 'Coca-Cola', quantity: 2, price: 45, total: 90 }
        ],
        orderDate: '2024-01-20',
        orderTime: '21:15',
        assignedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        estimatedTime: 'Completed',
        specialNotes: 'Pickup at 9:30 PM',
        paymentStatus: 'paid',
        paymentMethod: 'cash'
      },
      {
        id: 8,
        orderNumber: 'ORD-008',
        customerName: 'Diana Prince',
        customerPhone: '9876543217',
        customerEmail: 'diana@example.com',
        tableNumber: 'T4',
        orderType: 'dine-in',
        status: 'pending',
        total: 690,
        items: [
          { name: 'Chicken Biryani', quantity: 1, price: 280, total: 280 },
          { name: 'Mutton Curry', quantity: 1, price: 320, total: 320 },
          { name: 'Butter Naan', quantity: 2, price: 90, total: 180 }
        ],
        orderDate: '2024-01-20',
        orderTime: '21:30',
        assignedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        estimatedTime: '25 mins',
        specialNotes: 'Window seat preferred',
        paymentStatus: 'pending',
        paymentMethod: 'upi'
      }
    ];

    const mockStats = {
      totalOrders: 8,
      pendingOrders: 2,
      preparingOrders: 3,
      readyOrders: 2,
      completedOrders: 1,
      totalRevenue: 5696,
      averageOrderValue: 712
    };

    setOrders(mockOrders);
    setStats(mockStats);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.orderType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> },
      preparing: { color: 'bg-blue-100 text-blue-800', icon: <Package className="h-3 w-3" /> },
      ready: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
      completed: { color: 'bg-gray-100 text-gray-800', icon: <CheckCircle className="h-3 w-3" /> }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const getOrderTypeIcon = (type) => {
    switch (type) {
      case 'dine-in': return <Utensils className="h-4 w-4" />;
      case 'takeaway': return <ShoppingBag className="h-4 w-4" />;
      case 'delivery': return <Truck className="h-4 w-4" />;
      default: return <ShoppingBag className="h-4 w-4" />;
    }
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Manage your assigned orders</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Preparing</p>
                <p className="text-2xl font-bold text-gray-900">{stats.preparingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ready</p>
                <p className="text-2xl font-bold text-gray-900">{stats.readyOrders}</p>
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
                  placeholder="Search orders by number, customer name, or phone..."
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
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="dine-in">Dine-in</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = getStatusBadge(order.status);
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getOrderTypeIcon(order.orderType)}
                      <span className="font-medium text-gray-900">#{order.orderNumber}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                      {statusConfig.icon}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-gray-500">{order.orderTime}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{order.customerPhone}</span>
                    </div>
                    {order.tableNumber && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Table {order.tableNumber}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-xs text-gray-600">
                          <span>{item.quantity}x {item.name}</span>
                          <span>{formatCurrency(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {order.specialNotes && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">Notes:</span> {order.specialNotes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.estimatedTime === 'Ready' || order.estimatedTime === 'Completed'
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.estimatedTime}
                    </span>
                    <span className="text-xs text-gray-500">
                      Payment: {order.paymentStatus} ({order.paymentMethod})
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <button className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded hover:bg-green-200 transition-colors">
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                        Complete Order
                      </button>
                    )}
                    <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeOrders;
