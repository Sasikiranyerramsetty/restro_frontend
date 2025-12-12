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
import { formatCurrency, formatDate } from '../../utils';

const CustomerDashboard = () => {
  // Custom color palette (matching admin)
  const colors = {
    navy: '#0B1021',
    panel: '#0F172A',
    card: '#111A2E',
    border: '#1F2A44',
    accent: '#6366F1',
    accentAlt: '#0EA5E9',
    mint: '#22D3EE',
    danger: '#F43F5E',
    warning: '#F59E0B',
    text: '#E2E8F0',
    muted: '#94A3B8'
  };

  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteItems: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingBag className="h-8 w-8" />,
      valueColor: colors.accent,
      iconBg: colors.accent,
      bgGradient: `linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(14, 165, 233, 0.12) 100%)`,
      borderColor: colors.border
    },
    {
      title: 'Total Spent',
      value: formatCurrency(stats.totalSpent),
      icon: <TrendingUp className="h-8 w-8" />,
      valueColor: colors.danger,
      iconBg: colors.danger,
      bgGradient: `linear-gradient(135deg, rgba(244, 63, 94, 0.18) 0%, rgba(99, 102, 241, 0.12) 100%)`,
      borderColor: colors.border
    },
    {
      title: 'Average Rating',
      value: stats.averageRating || 'N/A',
      icon: <Star className="h-8 w-8" />,
      valueColor: colors.text,
      iconBg: colors.mint,
      bgGradient: `linear-gradient(135deg, rgba(34, 211, 238, 0.16) 0%, rgba(15, 23, 42, 0.5) 100%)`,
      borderColor: colors.border
    },
    {
      title: 'Favorite Items',
      value: stats.favoriteItems,
      icon: <Clock className="h-8 w-8" />,
      valueColor: colors.warning,
      iconBg: colors.warning,
      bgGradient: `linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(17, 26, 46, 0.7) 100%)`,
      borderColor: colors.border
    }
  ];

  const quickActions = [
    {
      title: 'Browse Menu',
      description: 'Explore our delicious offerings',
      icon: <ChefHat className="h-6 w-6" style={{ color: colors.accent }} />,
      link: ROUTES.CUSTOMER_MENU,
      bgGradient: `linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(14, 165, 233, 0.14) 100%)`,
      borderColor: colors.border
    },
    {
      title: 'Make Reservation',
      description: 'Book a table for your visit',
      icon: <Calendar className="h-6 w-6" style={{ color: colors.accentAlt }} />,
      link: ROUTES.CUSTOMER_RESERVATIONS,
      bgGradient: `linear-gradient(135deg, rgba(14, 165, 233, 0.18) 0%, rgba(15, 23, 42, 0.6) 100%)`,
      borderColor: colors.border
    },
    {
      title: 'View Orders',
      description: 'Track your order history',
      icon: <Package className="h-6 w-6" style={{ color: colors.text }} />,
      link: ROUTES.CUSTOMER_ORDERS,
      bgGradient: `linear-gradient(135deg, rgba(34, 211, 238, 0.14) 0%, rgba(17, 26, 46, 0.7) 100%)`,
      borderColor: colors.border
    },
    {
      title: 'Events',
      description: 'Discover upcoming events',
      icon: <Users className="h-6 w-6" style={{ color: colors.danger }} />,
      link: ROUTES.CUSTOMER_EVENTS,
      bgGradient: `linear-gradient(135deg, rgba(244, 63, 94, 0.16) 0%, rgba(15, 23, 42, 0.65) 100%)`,
      borderColor: colors.border
    }
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      pending: { bg: 'rgba(99, 102, 241, 0.16)', text: colors.text, border: colors.accent },
      preparing: { bg: 'rgba(14, 165, 233, 0.18)', text: colors.text, border: colors.accentAlt },
      ready: { bg: 'rgba(34, 211, 238, 0.16)', text: colors.text, border: colors.mint },
      completed: { bg: 'rgba(34, 197, 94, 0.16)', text: colors.text, border: colors.mint },
      cancelled: { bg: 'rgba(244, 63, 94, 0.18)', text: colors.text, border: colors.danger }
    };
    const color = statusColors[status] || statusColors.completed;
    return {
      backgroundColor: color.bg,
      color: color.text,
      borderColor: color.border
    };
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.accent }}
            ></div>
            <p className="font-semibold" style={{ color: colors.text }}>Loading dashboard...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div
        className="space-y-8 animate-fade-in"
        style={{
          background: `radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08), transparent 25%), radial-gradient(circle at 80% 10%, rgba(14, 165, 233, 0.08), transparent 25%), ${colors.navy}`,
          minHeight: '100vh',
          padding: '2rem'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up">
          <div>
            <h1
              className="text-4xl font-bold drop-shadow-lg mb-2"
              style={{
                fontFamily: 'Rockybilly, sans-serif',
                letterSpacing: '0.05em',
                color: colors.text
              }}
            >
              Dashboard
            </h1>
            <div
              style={{
                height: '4px',
                background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.accentAlt} 100%)`,
                borderRadius: '2px',
                width: '130px'
              }}
            ></div>
          </div>

          <div
            className="rounded-2xl shadow-xl p-4 border-2"
            style={{
              background: `linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(14, 165, 233, 0.16) 100%)`,
              borderColor: colors.border,
              borderWidth: '2px',
              minWidth: '210px'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full shadow-lg" style={{ backgroundColor: colors.card }}>
                <Clock className="h-5 w-5" style={{ color: colors.text }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: colors.text }}>
                  {formatDate(currentDateTime, 'EEEE, MMM dd, yyyy')}
                </p>
                <p className="text-lg font-bold" style={{ color: colors.text }}>
                  {formatDate(currentDateTime, 'hh:mm:ss a')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards (mirroring admin) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={stat.title}
              className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
              style={{
                animationDelay: `${0.1 + index * 0.1}s`,
                background: stat.bgGradient,
                borderColor: stat.borderColor,
                borderWidth: '2px'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.muted }}>
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold" style={{ color: stat.valueColor }}>
                    {stat.value}
                  </p>
                </div>
                <div className="p-4 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: colors.card }}>
                  <div style={{ color: stat.iconBg }}>{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Quick Actions */}
          <div
            className="rounded-2xl shadow-xl p-8 animate-slide-up border-2"
            style={{
              background: `linear-gradient(145deg, ${colors.panel} 0%, ${colors.card} 100%)`,
              borderColor: colors.border,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                  Quick Actions
                </h2>
                <p className="text-sm" style={{ color: colors.muted }}>
                  Jump back into the things you do most
                </p>
              </div>
              <ArrowRight className="h-6 w-6" style={{ color: colors.muted }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={action.title}
                  to={action.link}
                  className="rounded-2xl shadow-xl hover:shadow-2xl p-5 transition-all duration-300 group hover:scale-105 animate-slide-up border-2"
                  style={{
                    animationDelay: `${0.6 + index * 0.1}s`,
                    background: action.bgGradient,
                    borderColor: colors.border
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold" style={{ color: colors.text }}>
                        {action.title}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: colors.muted }}>
                        {action.description}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="group-hover:rotate-12 transition-transform duration-300">
                        {action.icon}
                      </div>
                      <ArrowRight className="h-4 w-4 ml-2 transition-all duration-300" style={{ color: colors.muted }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div
            className="rounded-2xl shadow-xl p-8 animate-slide-up border-2"
            style={{
              background: `linear-gradient(145deg, ${colors.panel} 0%, ${colors.card} 100%)`,
              borderColor: colors.border,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                Recent Orders
              </h2>
              <Link
                to={ROUTES.CUSTOMER_ORDERS}
                className="px-6 py-2 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                style={{ backgroundColor: colors.accent }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#4f46e5')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = colors.accent)}
              >
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr style={{ backgroundColor: colors.card }}>
                      <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider rounded-l-lg" style={{ color: colors.text }}>
                        Order ID
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider" style={{ color: colors.text }}>
                        Date
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider" style={{ color: colors.text }}>
                        Items
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider" style={{ color: colors.text }}>
                        Total
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider rounded-r-lg" style={{ color: colors.text }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className="transition-colors border-b"
                        style={{
                          borderColor: colors.border,
                          backgroundColor: index % 2 === 0 ? colors.panel : colors.card
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1a243b')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = index % 2 === 0 ? colors.panel : colors.card)}
                      >
                        <td className="py-4 px-6 font-bold" style={{ color: colors.accent }}>
                          #{order.id}
                        </td>
                        <td className="py-4 px-6 font-medium" style={{ color: colors.muted }}>
                          {formatDate(order.createdAt, 'MMM dd, yyyy')}
                        </td>
                        <td className="py-4 px-6 font-medium" style={{ color: colors.text }}>
                          {order.items?.length || 0} items
                        </td>
                        <td className="py-4 px-6 font-bold text-lg" style={{ color: colors.text }}>
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border-2"
                            style={getStatusColor(order.status)}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                className="rounded-2xl shadow-inner border-2 p-8 text-center"
                style={{
                  background: `linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)`,
                  borderColor: colors.border
                }}
              >
                <div className="p-4 rounded-full inline-block mb-4" style={{ backgroundColor: colors.card }}>
                  <ShoppingBag className="h-12 w-12" style={{ color: colors.accent }} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors.text }}>
                  No orders yet
                </h3>
                <p className="mb-4" style={{ color: colors.muted }}>
                  Start exploring our menu and place your first order!
                </p>
                <Link
                  to={ROUTES.CUSTOMER_MENU}
                  className="px-8 py-3 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center"
                  style={{ backgroundColor: colors.accent }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#4f46e5')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = colors.accent)}
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
