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
import CustomerLayout from '../../components/Customer/CustomerLayout';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils';

const CustomerDashboard = () => {
  // Custom color palette (matching admin)
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const quickActions = [
    {
      title: 'Browse Menu',
      description: 'Explore our delicious offerings',
      icon: <ChefHat className="h-6 w-6" style={{ color: colors.red }} />,
      link: ROUTES.CUSTOMER_MENU,
      bgGradient: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
      borderColor: colors.red
    },
    {
      title: 'Make Reservation',
      description: 'Book a table for your visit',
      icon: <Calendar className="h-6 w-6" style={{ color: colors.mediumBlue }} />,
      link: ROUTES.CUSTOMER_RESERVATIONS,
      bgGradient: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`,
      borderColor: colors.mediumBlue
    },
    {
      title: 'View Orders',
      description: 'Track your order history',
      icon: <Package className="h-6 w-6" style={{ color: colors.darkNavy }} />,
      link: ROUTES.CUSTOMER_ORDERS,
      bgGradient: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
      borderColor: colors.darkNavy
    },
    {
      title: 'Events',
      description: 'Discover upcoming events',
      icon: <Users className="h-6 w-6" style={{ color: colors.red }} />,
      link: ROUTES.CUSTOMER_EVENTS,
      bgGradient: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.cream} 100%)`,
      borderColor: colors.red
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' };
      case 'preparing':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: colors.mediumBlue };
      case 'ready':
        return { bg: 'rgba(234, 179, 8, 0.1)', text: '#ca8a04' };
      case 'pending':
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' };
    }
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="space-y-6 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', width: '100%', padding: '1.5rem 2rem' }}>
          <div className="w-full max-w-full">
            <div className="h-8 rounded animate-pulse" style={{ backgroundColor: colors.lightBlue }}></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-lg animate-pulse" style={{ backgroundColor: colors.lightBlue }}></div>
              ))}
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', width: '100%', padding: '1.5rem 2rem' }}>
        <div className="w-full max-w-full">
          {/* Header */}
          <div className="mb-6 animate-slide-up">
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
              Dashboard
            </h1>
            <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '150px' }}></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div 
              className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
              style={{ 
                animationDelay: '0.1s',
                background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
                borderColor: colors.mediumBlue
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Orders</p>
                  <p className="text-3xl font-bold" style={{ color: colors.mediumBlue }}>{stats.totalOrders}</p>
                </div>
                <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                  <ShoppingBag className="h-8 w-8" style={{ color: colors.mediumBlue }} />
                </div>
              </div>
            </div>

            <div 
              className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
              style={{ 
                animationDelay: '0.2s',
                background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`,
                borderColor: colors.red
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Spent</p>
                  <p className="text-3xl font-bold" style={{ color: colors.red }}>{formatCurrency(stats.totalSpent)}</p>
                </div>
                <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                  <TrendingUp className="h-8 w-8" style={{ color: colors.red }} />
                </div>
              </div>
            </div>

            <div 
              className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
              style={{ 
                animationDelay: '0.3s',
                background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
                borderColor: colors.mediumBlue
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Average Rating</p>
                  <p className="text-3xl font-bold" style={{ color: colors.darkNavy }}>{stats.averageRating || 'N/A'}</p>
                </div>
                <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                  <Star className="h-8 w-8" style={{ color: colors.darkNavy }} />
                </div>
              </div>
            </div>

            <div 
              className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
              style={{ 
                animationDelay: '0.4s',
                background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.cream} 100%)`,
                borderColor: colors.red
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Favorite Items</p>
                  <p className="text-3xl font-bold" style={{ color: colors.red }}>{stats.favoriteItems}</p>
                </div>
                <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                  <Clock className="h-8 w-8" style={{ color: colors.red }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.darkNavy }}>Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 group hover:scale-105 animate-slide-up border-2"
                  style={{ 
                    animationDelay: `${0.6 + index * 0.1}s`,
                    background: action.bgGradient,
                    borderColor: action.borderColor
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold transition-colors duration-300" style={{ color: colors.darkNavy }}>
                        {action.title}
                      </h3>
                      <p className="text-sm mt-1 transition-colors duration-300" style={{ color: colors.mediumBlue }}>{action.description}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="group-hover:rotate-12 transition-transform duration-300">
                        {action.icon}
                      </div>
                      <ArrowRight className="h-4 w-4 ml-2 transition-all duration-300" style={{ color: colors.darkNavy }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: colors.darkNavy }}>Recent Orders</h2>
              <Link
                to={ROUTES.CUSTOMER_ORDERS}
                className="font-medium flex items-center transition-colors duration-200"
                style={{ color: colors.mediumBlue }}
                onMouseEnter={(e) => e.target.style.color = colors.red}
                onMouseLeave={(e) => e.target.style.color = colors.mediumBlue}
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div 
                className="rounded-2xl shadow-xl border-2 overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, #FFFFFF 0%, ${colors.cream} 100%)`,
                  borderColor: colors.lightBlue
                }}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y-2" style={{ borderColor: colors.lightBlue }}>
                    <thead style={{ backgroundColor: colors.lightBlue }}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                          Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2" style={{ borderColor: colors.lightBlue }}>
                      {recentOrders.map((order) => {
                        const statusColors = getStatusColor(order.status);
                        return (
                          <tr key={order.id} className="hover:opacity-80 transition-opacity duration-200" style={{ backgroundColor: colors.cream }}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: colors.darkNavy }}>
                              #{order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.mediumBlue }}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.mediumBlue }}>
                              {order.items?.length || 0} items
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold" style={{ color: colors.red }}>
                              {formatCurrency(order.total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span 
                                className="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                                style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div 
                className="rounded-2xl shadow-xl border-2 p-8 text-center"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
                  borderColor: colors.lightBlue
                }}
              >
                <div className="p-4 rounded-full inline-block mb-4" style={{ backgroundColor: colors.lightBlue }}>
                  <ShoppingBag className="h-12 w-12" style={{ color: colors.mediumBlue }} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors.darkNavy }}>No orders yet</h3>
                <p className="mb-4" style={{ color: colors.mediumBlue }}>Start exploring our menu and place your first order!</p>
                <Link
                  to={ROUTES.CUSTOMER_MENU}
                  className="px-8 py-3 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center"
                  style={{ backgroundColor: colors.red }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f3e'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = colors.red}
                >
                  Browse Menu
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
