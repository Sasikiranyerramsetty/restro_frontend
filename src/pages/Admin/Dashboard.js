import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Clock,
  Calendar,
  UserCheck,
  MapPin
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils';
import orderService from '../../services/orderService';
import employeeService from '../../services/employeeService';
import customerService from '../../services/customerService';
import tableService from '../../services/tableService';
import eventService from '../../services/eventService';
import AdminLayout from '../../components/Admin/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    todaysRevenue: 0,
    todaysOrders: 0,
    todaysEvents: 0,
    activeOrders: 0,
    activeEmployees: 0,
    availableTables: 0,
    totalEvents: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          ordersResult, 
          statisticsResult,
          employeeStats,
          activeEmployeesResult,
          tableStats,
          eventStats,
          todaysEventsResult
        ] = await Promise.all([
          orderService.getTodaysOrders(),
          orderService.getOrderStatistics(),
          employeeService.getEmployeeStats(),
          employeeService.getActiveEmployees(),
          tableService.getTableStats(),
          eventService.getEventStats(),
          eventService.getTodaysEvents()
        ]);

        if (ordersResult.success) {
          setRecentOrders(ordersResult.data.slice(0, 5));
          setStats(prev => ({
            ...prev,
            todaysOrders: ordersResult.data.length,
            activeOrders: ordersResult.data.filter(order => 
              ['pending', 'preparing'].includes(order.status)
            ).length
          }));
        }

        if (statisticsResult.success) {
          setStats(prev => ({
            ...prev,
            todaysRevenue: statisticsResult.data.todaysRevenue || 0,
            availableTables: tableStats.available || 0,
            totalEvents: eventStats.total || 0
          }));
        }

        if (activeEmployeesResult.success) {
          setStats(prev => ({
            ...prev,
            activeEmployees: activeEmployeesResult.data.length || 0
          }));
        }

        if (todaysEventsResult.success) {
          setStats(prev => ({
            ...prev,
            todaysEvents: todaysEventsResult.data.length || 0
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const statCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.todaysRevenue),
      icon: <DollarSign className="h-8 w-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: "Today's Orders",
      value: stats.todaysOrders,
      icon: <ShoppingBag className="h-8 w-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: <Clock className="h-8 w-8" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: "Today's Events",
      value: stats.todaysEvents,
      icon: <Calendar className="h-8 w-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Active Employees',
      value: stats.activeEmployees,
      icon: <UserCheck className="h-8 w-8" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Tables Available',
      value: stats.availableTables || 0,
      icon: <MapPin className="h-8 w-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: <Calendar className="h-8 w-8" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ];


  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-4xl font-bold gradient-text restro-brand">Dashboard</h1>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="card animate-slide-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} animate-float`} style={{ animationDelay: `${index * 0.1 + 0.5}s` }}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>


        <div className="grid grid-cols-1 gap-8">
          {/* Recent Orders */}
          <div className="card animate-slide-up animate-delay-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Recent Orders</h3>
              <button className="text-primary-600 hover:text-primary-700 font-semibold hover:scale-105 transition-transform duration-300">
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Order ID</th>
                    <th className="table-header">Customer</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Total</th>
                    <th className="table-header">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="table-cell font-medium">
                        #{order.orderNumber}
                      </td>
                      <td className="table-cell">
                        {order.customer?.name || 'Walk-in Customer'}
                      </td>
                      <td className="table-cell">
                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="table-cell font-medium">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="table-cell text-gray-500">
                        {formatDate(order.createdAt, 'HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
