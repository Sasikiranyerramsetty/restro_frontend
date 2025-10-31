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
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Custom color palette
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

  const statCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.todaysRevenue),
      icon: <DollarSign className="h-8 w-8" />,
      valueColor: colors.red,
      iconBg: colors.red,
      bgGradient: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
      borderColor: colors.lightBlue
    },
    {
      title: "Today's Orders",
      value: stats.todaysOrders,
      icon: <ShoppingBag className="h-8 w-8" />,
      valueColor: colors.mediumBlue,
      iconBg: colors.mediumBlue,
      bgGradient: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
      borderColor: colors.mediumBlue
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: <Clock className="h-8 w-8" />,
      valueColor: colors.darkNavy,
      iconBg: colors.darkNavy,
      bgGradient: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`,
      borderColor: colors.mediumBlue
    },
    {
      title: "Today's Events",
      value: stats.todaysEvents,
      icon: <Calendar className="h-8 w-8" />,
      valueColor: colors.red,
      iconBg: colors.red,
      bgGradient: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
      borderColor: colors.lightBlue
    },
    {
      title: 'Active Employees',
      value: stats.activeEmployees,
      icon: <UserCheck className="h-8 w-8" />,
      valueColor: colors.mediumBlue,
      iconBg: colors.mediumBlue,
      bgGradient: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.cream} 100%)`,
      borderColor: colors.mediumBlue
    },
    {
      title: 'Tables Available',
      value: stats.availableTables || 0,
      icon: <MapPin className="h-8 w-8" />,
      valueColor: colors.darkNavy,
      iconBg: colors.darkNavy,
      bgGradient: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
      borderColor: colors.darkNavy
    },
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: <Calendar className="h-8 w-8" />,
      valueColor: colors.mediumBlue,
      iconBg: colors.mediumBlue,
      bgGradient: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`,
      borderColor: colors.mediumBlue
    }
  ];


  const getStatusColor = (status) => {
    const statusColors = {
      pending: { bg: colors.lightBlue, text: colors.darkNavy, border: colors.mediumBlue },
      preparing: { bg: colors.mediumBlue, text: colors.cream, border: colors.mediumBlue },
      ready: { bg: colors.lightBlue, text: colors.darkNavy, border: colors.darkNavy },
      completed: { bg: colors.cream, text: colors.darkNavy, border: colors.lightBlue },
      cancelled: { bg: colors.red, text: colors.cream, border: colors.red }
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
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.red }}
            ></div>
            <p className="font-semibold" style={{ color: colors.darkNavy }}>Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', padding: '2rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up">
          <div>
            <h1 
              className="text-4xl font-bold drop-shadow-lg mb-2" 
              style={{ 
                fontFamily: 'Rockybilly, sans-serif', 
                letterSpacing: '0.05em',
                color: colors.darkNavy 
              }}
            >
              Dashboard
            </h1>
            <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '120px' }}></div>
          </div>
          
          {/* Date and Time Display */}
          <div 
            className="rounded-2xl shadow-xl p-4 border-2"
            style={{ 
              background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`,
              borderColor: colors.mediumBlue,
              borderWidth: '2px',
              minWidth: '200px'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Clock className="h-5 w-5" style={{ color: colors.darkNavy }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: colors.cream }}>
                  {formatDate(currentDateTime, 'EEEE, MMM dd, yyyy')}
                </p>
                <p className="text-lg font-bold" style={{ color: colors.cream }}>
                  {formatDate(currentDateTime, 'hh:mm:ss a')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div 
              key={index} 
              className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                background: stat.bgGradient,
                borderColor: stat.borderColor,
                borderWidth: '2px'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p 
                    className="text-sm font-semibold mb-2"
                    style={{ color: colors.darkNavy, opacity: 0.8 }}
                  >
                    {stat.title}
                  </p>
                  <p 
                    className="text-2xl font-bold"
                    style={{ color: stat.valueColor }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div 
                  className="p-4 rounded-full shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.cream }}
                >
                  <div style={{ color: stat.iconBg }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        <div className="grid grid-cols-1 gap-8">
          {/* Recent Orders */}
          <div 
            className="rounded-2xl shadow-xl p-8 animate-slide-up animate-delay-300 border-2"
            style={{ 
              backgroundColor: colors.cream,
              borderColor: colors.mediumBlue,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 
                className="text-2xl font-bold"
                style={{ color: colors.darkNavy }}
              >
                Recent Orders
              </h3>
              <button 
                className="px-8 py-3 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                style={{ 
                  backgroundColor: colors.red,
                  border: 'none'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f3e'}
                onMouseLeave={(e) => e.target.style.backgroundColor = colors.red}
              >
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.lightBlue }}>
                    <th 
                      className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider rounded-l-lg"
                      style={{ color: colors.darkNavy }}
                    >
                      Order ID
                    </th>
                    <th 
                      className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider"
                      style={{ color: colors.darkNavy }}
                    >
                      Customer
                    </th>
                    <th 
                      className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider"
                      style={{ color: colors.darkNavy }}
                    >
                      Status
                    </th>
                    <th 
                      className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider"
                      style={{ color: colors.darkNavy }}
                    >
                      Total
                    </th>
                    <th 
                      className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider rounded-r-lg"
                      style={{ color: colors.darkNavy }}
                    >
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order, index) => (
                      <tr 
                        key={order.id} 
                        className="transition-colors border-b"
                        style={{ 
                          borderColor: colors.lightBlue,
                          backgroundColor: index % 2 === 0 ? colors.cream : 'rgba(168, 218, 220, 0.2)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.lightBlue}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? colors.cream : 'rgba(168, 218, 220, 0.2)'}
                      >
                        <td className="py-4 px-6 font-bold" style={{ color: colors.red }}>
                          #{order.orderNumber}
                        </td>
                        <td className="py-4 px-6 font-medium" style={{ color: colors.darkNavy }}>
                          {order.customer?.name || 'Walk-in Customer'}
                        </td>
                        <td className="py-4 px-6">
                          <span 
                            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border-2"
                            style={getStatusColor(order.status)}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-lg" style={{ color: colors.darkNavy }}>
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-4 px-6 font-medium" style={{ color: colors.mediumBlue }}>
                          {formatDate(order.createdAt, 'HH:mm')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td 
                        colSpan="5" 
                        className="py-8 text-center font-medium"
                        style={{ color: colors.mediumBlue }}
                      >
                        No recent orders
                      </td>
                    </tr>
                  )}
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
