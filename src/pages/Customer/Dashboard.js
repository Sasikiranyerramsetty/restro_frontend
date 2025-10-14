import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  Star, 
  TrendingUp,
  Calendar,
  ChefHat,
  ArrowRight,
  Package,
  Users
} from 'lucide-react';
import { ROUTES } from '../../constants';
import DashboardLayout from '../../components/Common/DashboardLayout';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils';

const CustomerDashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteItems: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent orders
        const ordersResult = await orderService.getCustomerOrders();
        if (ordersResult.success) {
          setRecentOrders(ordersResult.data.slice(0, 5)); // Show last 5 orders
          
          // Calculate stats
          const totalOrders = ordersResult.data.length;
          const totalSpent = ordersResult.data.reduce((sum, order) => sum + order.total, 0);
          const averageRating = ordersResult.data.length > 0 
            ? ordersResult.data.reduce((sum, order) => sum + (order.rating || 0), 0) / ordersResult.data.length 
            : 0;
          
          setStats({
            totalOrders,
            totalSpent,
            favoriteItems: 0, // This would need to be calculated from order history
            averageRating: Math.round(averageRating * 10) / 10
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Browse Menu',
      description: 'Explore our delicious offerings',
      icon: <ChefHat className="h-6 w-6 text-primary-600" />,
      link: ROUTES.CUSTOMER_MENU,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Make Reservation',
      description: 'Book a table for your visit',
      icon: <Calendar className="h-6 w-6 text-primary-600" />,
      link: ROUTES.CUSTOMER_RESERVATIONS,
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'View Orders',
      description: 'Track your order history',
      icon: <Package className="h-6 w-6 text-primary-600" />,
      link: ROUTES.CUSTOMER_ORDERS,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Events',
      description: 'Discover upcoming events',
      icon: <Users className="h-6 w-6 text-primary-600" />,
      link: ROUTES.CUSTOMER_EVENTS,
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-4xl font-bold gradient-text restro-brand">Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's what's happening with your account.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card animate-slide-up animate-delay-100 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg animate-float">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 animate-count-up">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="card animate-slide-up animate-delay-200 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg animate-float animate-delay-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 animate-count-up">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </div>
          </div>

          <div className="card animate-slide-up animate-delay-300 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg animate-float animate-delay-200">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 animate-count-up">{stats.averageRating || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="card animate-slide-up animate-delay-400 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-orange-50 rounded-lg animate-float animate-delay-300">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Favorite Items</p>
                <p className="text-2xl font-bold text-gray-900 animate-count-up">{stats.favoriteItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="animate-slide-up animate-delay-500">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`p-6 rounded-lg border-2 ${action.color} hover:shadow-lg transition-all duration-300 group hover:scale-105 animate-slide-up`}
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">{action.description}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="group-hover:rotate-12 transition-transform duration-300">
                      {action.icon}
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 ml-2 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <Link
              to={ROUTES.CUSTOMER_ORDERS}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.items?.length || 0} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Start exploring our menu and place your first order!</p>
              <Link
                to={ROUTES.CUSTOMER_MENU}
                className="btn-primary inline-flex items-center"
              >
                Browse Menu
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
