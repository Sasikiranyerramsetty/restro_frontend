import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Clock,
  ChefHat,
  Calendar,
  AlertTriangle,
  UserCheck,
  MapPin
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils';
import orderService from '../../services/orderService';
import menuService from '../../services/menuService';
import employeeService from '../../services/employeeService';
import customerService from '../../services/customerService';
import inventoryService from '../../services/inventoryService';
import tableService from '../../services/tableService';
import eventService from '../../services/eventService';
import AdminLayout from '../../components/Admin/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeOrders: 0,
    totalEmployees: 0,
    totalTables: 0,
    totalEvents: 0,
    inventoryItems: 0,
    lowStockItems: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          ordersResult, 
          menuResult, 
          statisticsResult,
          employeeStats,
          customerStats,
          inventoryStats,
          tableStats,
          eventStats
        ] = await Promise.all([
          orderService.getTodaysOrders(),
          menuService.getPopularItems(5),
          orderService.getOrderStatistics(),
          employeeService.getEmployeeStats(),
          customerService.getCustomerStats(),
          inventoryService.getInventoryStats(),
          tableService.getTableStats(),
          eventService.getEventStats()
        ]);

        if (ordersResult.success) {
          setRecentOrders(ordersResult.data.slice(0, 5));
          setStats(prev => ({
            ...prev,
            totalOrders: ordersResult.data.length,
            activeOrders: ordersResult.data.filter(order => 
              ['pending', 'preparing'].includes(order.status)
            ).length
          }));
        }

        if (menuResult.success) {
          setPopularItems(menuResult.data);
        }

        if (statisticsResult.success) {
          setStats(prev => ({
            ...prev,
            totalRevenue: statisticsResult.data.totalRevenue || 0,
            totalCustomers: customerStats.total || 0,
            totalEmployees: employeeStats.total || 0,
            totalTables: tableStats.total || 0,
            totalEvents: eventStats.total || 0,
            inventoryItems: inventoryStats.totalItems || 0,
            lowStockItems: inventoryStats.lowStock || 0
          }));
          setSalesData(statisticsResult.data.salesData || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarSign className="h-8 w-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
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
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <Users className="h-8 w-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: <UserCheck className="h-8 w-8" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Total Tables',
      value: stats.totalTables,
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
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: <AlertTriangle className="h-8 w-8" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const COLORS = ['#19183B', '#708993', '#A1C2BD', '#E7F2EF'];

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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#19183B" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Items</h3>
            <div className="space-y-4">
              {popularItems.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ChefHat className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">
                      {formatCurrency(item.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
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

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-primary flex items-center justify-center">
                <ChefHat className="h-5 w-5 mr-2" />
                Add Menu Item
              </button>
              <button className="w-full btn-outline flex items-center justify-center">
                <Calendar className="h-5 w-5 mr-2" />
                Generate Report
              </button>
              <button className="w-full btn-outline flex items-center justify-center">
                <Users className="h-5 w-5 mr-2" />
                Manage Employees
              </button>
              <button className="w-full btn-outline flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                View Alerts
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
