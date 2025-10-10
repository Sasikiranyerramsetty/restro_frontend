import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ShoppingBag, 
  Users, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import { formatCurrency, formatDate } from '../../utils';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    assignedOrders: 0,
    completedTasks: 0,
    todayShifts: 0,
    pendingTasks: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    // Mock data for employee dashboard
    const mockStats = {
      assignedOrders: 6,
      completedTasks: 12,
      todayShifts: 1,
      pendingTasks: 3
    };

    const mockOrders = [
      {
        id: 1,
        orderNumber: 'ORD-001',
        customer: 'John Doe',
        customerPhone: '9876543210',
        status: 'preparing',
        total: 850,
        items: [
          { name: 'Chicken Biryani', quantity: 2, price: 280 },
          { name: 'Mutton Curry', quantity: 1, price: 320 },
          { name: 'Garlic Naan', quantity: 2, price: 100 }
        ],
        tableNumber: 'T5',
        orderType: 'dine-in',
        assignedAt: new Date().toISOString(),
        estimatedTime: '25 mins',
        specialNotes: 'Extra spicy for biryani'
      },
      {
        id: 2,
        orderNumber: 'ORD-002',
        customer: 'Jane Smith',
        customerPhone: '9876543211',
        status: 'ready',
        total: 650,
        items: [
          { name: 'RESTRO Special Thali', quantity: 1, price: 350 },
          { name: 'Paneer Tikka', quantity: 1, price: 220 },
          { name: 'Fresh Lime Soda', quantity: 2, price: 90 }
        ],
        tableNumber: 'T3',
        orderType: 'dine-in',
        assignedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        estimatedTime: 'Ready',
        specialNotes: 'Birthday celebration'
      },
      {
        id: 3,
        orderNumber: 'ORD-003',
        customer: 'Mike Wilson',
        customerPhone: '9876543212',
        status: 'pending',
        total: 420,
        items: [
          { name: 'Chicken Biryani', quantity: 1, price: 280 },
          { name: 'Butter Chicken', quantity: 1, price: 290 }
        ],
        tableNumber: null,
        orderType: 'takeaway',
        assignedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        estimatedTime: '20 mins',
        specialNotes: 'Pickup at 8:30 PM'
      },
      {
        id: 4,
        orderNumber: 'ORD-004',
        customer: 'Emily Davis',
        customerPhone: '9876543213',
        status: 'preparing',
        total: 720,
        items: [
          { name: 'Mutton Curry', quantity: 1, price: 320 },
          { name: 'Dal Makhani', quantity: 1, price: 180 },
          { name: 'Butter Naan', quantity: 3, price: 90 },
          { name: 'Coca-Cola', quantity: 2, price: 45 }
        ],
        tableNumber: 'T7',
        orderType: 'dine-in',
        assignedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        estimatedTime: '15 mins',
        specialNotes: 'Anniversary dinner'
      },
      {
        id: 5,
        orderNumber: 'ORD-005',
        customer: 'Alice Wonderland',
        customerPhone: '9876543214',
        status: 'ready',
        total: 580,
        items: [
          { name: 'Paneer Tikka', quantity: 2, price: 220 },
          { name: 'Veg Spring Rolls', quantity: 1, price: 220 },
          { name: 'Mango Lassi', quantity: 2, price: 70 }
        ],
        tableNumber: 'T2',
        orderType: 'dine-in',
        assignedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        estimatedTime: 'Ready',
        specialNotes: 'Vegetarian options preferred'
      },
      {
        id: 6,
        orderNumber: 'ORD-006',
        customer: 'Bob The Builder',
        customerPhone: '9876543215',
        status: 'preparing',
        total: 1200,
        items: [
          { name: 'Chicken Biryani', quantity: 2, price: 280 },
          { name: 'Dal Makhani', quantity: 1, price: 180 },
          { name: 'RESTRO Special Thali', quantity: 1, price: 350 },
          { name: 'Garlic Naan', quantity: 4, price: 100 }
        ],
        tableNumber: null,
        orderType: 'delivery',
        assignedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        estimatedTime: '30 mins',
        specialNotes: 'Deliver to apartment 4B, ring doorbell twice'
      }
    ];

    const mockTasks = [
      {
        id: 1,
        title: 'Clean Table 5',
        description: 'Clean and set up table 5 for next customers',
        priority: 'high',
        status: 'pending',
        dueTime: '14:30'
      },
      {
        id: 2,
        title: 'Check Inventory',
        description: 'Check stock levels for popular items',
        priority: 'medium',
        status: 'completed',
        dueTime: '12:00'
      },
      {
        id: 3,
        title: 'Prepare Order ORD-003',
        description: 'Prepare order for table 3',
        priority: 'high',
        status: 'in_progress',
        dueTime: '15:00'
      }
    ];

    setStats(mockStats);
    setRecentOrders(mockOrders);
    setTodayTasks(mockTasks);
  }, []);

  const statCards = [
    {
      title: 'Assigned Orders',
      value: stats.assignedOrders,
      icon: <ShoppingBag className="h-8 w-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Today\'s Shifts',
      value: stats.todayShifts,
      icon: <Clock className="h-8 w-8" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: <AlertCircle className="h-8 w-8" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your work overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">#{order.orderNumber}</span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(order.assignedAt, 'HH:mm')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {order.tableNumber ? `Table ${order.tableNumber}` : order.orderType}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{order.orderType}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Order Items:</p>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-xs text-gray-600">
                          <span>{item.quantity}x {item.name}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      Total: {formatCurrency(order.total)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.estimatedTime === 'Ready' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.estimatedTime}
                    </span>
                  </div>

                  {order.specialNotes && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                      <p className="text-xs text-yellow-800">
                        <span className="font-medium">Notes:</span> {order.specialNotes}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex space-x-2">
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
              ))}
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {todayTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`status-badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`status-badge ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Due: {task.dueTime}
                    </span>
                    {task.status === 'pending' && (
                      <button className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">
                        Start
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="btn-primary flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              View Orders
            </button>
            <button className="btn-outline flex items-center justify-center">
              <MapPin className="h-5 w-5 mr-2" />
              Table Status
            </button>
            <button className="btn-outline flex items-center justify-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete Task
            </button>
            <button className="btn-outline flex items-center justify-center">
              <Calendar className="h-5 w-5 mr-2" />
              Check Schedule
            </button>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
