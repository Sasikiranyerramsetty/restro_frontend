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
      assignedOrders: 8,
      completedTasks: 12,
      todayShifts: 1,
      pendingTasks: 3
    };

    const mockOrders = [
      {
        id: 1,
        orderNumber: 'ORD-001',
        customer: 'John Doe',
        status: 'preparing',
        total: 450,
        items: ['Chicken Biryani', 'Mutton Curry'],
        assignedAt: new Date().toISOString()
      },
      {
        id: 2,
        orderNumber: 'ORD-002',
        customer: 'Jane Smith',
        status: 'ready',
        total: 320,
        items: ['Mutton Curry'],
        assignedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
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
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">#{order.orderNumber}</span>
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Customer: {order.customer}</p>
                  <p className="text-sm text-gray-600 mb-2">Items: {order.items.join(', ')}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(order.assignedAt, 'HH:mm')}
                    </span>
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
