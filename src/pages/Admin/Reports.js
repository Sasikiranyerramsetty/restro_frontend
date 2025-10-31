import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Download, TrendingUp, TrendingDown, DollarSign, 
  Users, ShoppingBag, Calendar, Filter, RefreshCw, CalendarDays
} from 'lucide-react';
import { 
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import AdminLayout from '../../components/Admin/AdminLayout';

const AdminReports = () => {
  // Custom color palette
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    from: '',
    to: ''
  });

  // Mock data for charts
  const salesData = [
    { date: '2024-01-14', revenue: 12000, orders: 45, customers: 38 },
    { date: '2024-01-15', revenue: 15000, orders: 52, customers: 44 },
    { date: '2024-01-16', revenue: 18000, orders: 61, customers: 52 },
    { date: '2024-01-17', revenue: 14000, orders: 48, customers: 41 },
    { date: '2024-01-18', revenue: 22000, orders: 78, customers: 65 },
    { date: '2024-01-19', revenue: 19000, orders: 68, customers: 58 },
    { date: '2024-01-20', revenue: 25000, orders: 85, customers: 72 }
  ];


  const paymentMethodData = [
    { name: 'Card', value: 45, color: '#0088FE' },
    { name: 'UPI', value: 35, color: '#00C49F' },
    { name: 'Cash', value: 20, color: '#FFBB28' }
  ];

  const topItems = [
    { name: 'Chicken Biryani', orders: 45, revenue: 12600, growth: 12 },
    { name: 'RESTRO Special Thali', orders: 38, revenue: 13300, growth: 8 },
    { name: 'Mutton Curry', orders: 32, revenue: 10240, growth: 15 },
    { name: 'Dal Makhani', orders: 28, revenue: 5040, growth: -5 },
    { name: 'Paneer Tikka', orders: 25, revenue: 5500, growth: 20 }
  ];

  const summaryStats = {
    totalRevenue: 133000,
    totalOrders: 425,
    totalCustomers: 365,
    revenueGrowth: 15.2,
    ordersGrowth: 8.5,
    customersGrowth: 12.3
  };

  const handleExport = () => {
    setLoading(true);
    // Simulate export process
    setTimeout(() => {
      setLoading(false);
      alert('Report exported successfully!');
    }, 2000);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period === 'custom') {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
    }
  };

  const handleCustomDateChange = (field, value) => {
    setCustomDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyCustomDateRange = () => {
    if (customDateRange.from && customDateRange.to) {
      // Here you would typically fetch data for the custom date range
      console.log('Custom date range:', customDateRange);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', padding: '2rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-4xl font-bold drop-shadow-lg mb-2" 
              style={{ 
                fontFamily: 'Rockybilly, sans-serif', 
                letterSpacing: '0.05em',
                color: colors.darkNavy 
              }}
            >
              Reports & Analytics
            </h1>
            <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '250px' }}></div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-3 border-2 rounded-xl font-bold transition-all flex items-center"
              style={{ 
                borderColor: colors.mediumBlue,
                color: colors.darkNavy,
                backgroundColor: colors.lightBlue
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = colors.mediumBlue;
                  e.target.style.color = colors.cream;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = colors.lightBlue;
                  e.target.style.color = colors.darkNavy;
                }
              }}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={loading}
              className="px-6 py-3 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
              style={{ backgroundColor: colors.red }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#d32f3e')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = colors.red)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Period Filter */}
        <div 
          className="p-6 rounded-lg shadow-sm border-2"
          style={{ 
            backgroundColor: colors.cream,
            borderColor: colors.mediumBlue,
            borderWidth: '2px'
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5" style={{ color: colors.mediumBlue }} />
              <span className="text-sm font-bold" style={{ color: colors.darkNavy }}>Time Period:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="px-3 py-2 border-2 rounded-md text-sm transition-all"
                style={{ 
                  borderColor: colors.lightBlue,
                  backgroundColor: 'white',
                  color: colors.darkNavy
                }}
                onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="6m">Last 6 Months</option>
                <option value="this-year">This Year</option>
                <option value="1y">Last Year</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>
            
            {showCustomDateRange && (
              <div 
                className="flex items-center space-x-4 p-4 rounded-lg border-2"
                style={{ 
                  backgroundColor: colors.lightBlue,
                  borderColor: colors.mediumBlue,
                  borderWidth: '2px'
                }}
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-white p-1 rounded" style={{ backgroundColor: colors.mediumBlue }} />
                  <span className="text-sm font-bold" style={{ color: colors.darkNavy }}>Select Date Range:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-bold" style={{ color: colors.darkNavy }}>From:</label>
                  <div className="relative">
                    <input
                      type="date"
                      id="from-date"
                      value={customDateRange.from}
                      onChange={(e) => handleCustomDateChange('from', e.target.value)}
                      className="px-3 py-2 pr-10 border-2 rounded-md text-sm transition-all"
                      style={{ 
                        borderColor: colors.mediumBlue,
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.red}
                      onBlur={(e) => e.target.style.borderColor = colors.mediumBlue}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-bold" style={{ color: colors.darkNavy }}>To:</label>
                  <div className="relative">
                    <input
                      type="date"
                      id="to-date"
                      value={customDateRange.to}
                      onChange={(e) => handleCustomDateChange('to', e.target.value)}
                      className="px-3 py-2 pr-10 border-2 rounded-md text-sm transition-all"
                      style={{ 
                        borderColor: colors.mediumBlue,
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.red}
                      onBlur={(e) => e.target.style.borderColor = colors.mediumBlue}
                    />
                  </div>
                </div>
                <button
                  onClick={applyCustomDateRange}
                  disabled={!customDateRange.from || !customDateRange.to}
                  className="px-4 py-2 text-white text-sm rounded-md transition-all flex items-center space-x-1 shadow-lg font-bold"
                  style={{ backgroundColor: colors.red }}
                  onMouseEnter={(e) => {
                    if (customDateRange.from && customDateRange.to) {
                      e.target.style.backgroundColor = '#d32f3e';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (customDateRange.from && customDateRange.to) {
                      e.target.style.backgroundColor = colors.red;
                    }
                  }}
                >
                  <Calendar className="h-4 w-4 text-white" />
                  <span>Apply</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="p-6 rounded-lg shadow-xl border-2 transition-all duration-300 hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
              borderColor: colors.mediumBlue,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Revenue</p>
                <p className="text-xl font-bold" style={{ color: colors.mediumBlue }}>₹{summaryStats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" style={{ color: colors.mediumBlue }} />
                  <span className="text-sm font-bold" style={{ color: colors.mediumBlue }}>+{summaryStats.revenueGrowth}%</span>
                </div>
              </div>
              <div className="p-3 rounded-lg shadow-lg" style={{ backgroundColor: colors.cream }}>
                <DollarSign className="h-6 w-6" style={{ color: colors.mediumBlue }} />
              </div>
            </div>
          </div>

          <div 
            className="p-6 rounded-lg shadow-xl border-2 transition-all duration-300 hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`,
              borderColor: colors.mediumBlue,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold" style={{ color: colors.cream }}>Total Orders</p>
                <p className="text-xl font-bold" style={{ color: colors.cream }}>{summaryStats.totalOrders}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" style={{ color: colors.cream }} />
                  <span className="text-sm font-bold" style={{ color: colors.cream }}>+{summaryStats.ordersGrowth}%</span>
                </div>
              </div>
              <div className="p-3 rounded-lg shadow-lg" style={{ backgroundColor: colors.cream }}>
                <ShoppingBag className="h-6 w-6" style={{ color: colors.mediumBlue }} />
              </div>
            </div>
          </div>

          <div 
            className="p-6 rounded-lg shadow-xl border-2 transition-all duration-300 hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
              borderColor: colors.red,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Customers</p>
                <p className="text-xl font-bold" style={{ color: colors.red }}>{summaryStats.totalCustomers}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" style={{ color: colors.red }} />
                  <span className="text-sm font-bold" style={{ color: colors.red }}>+{summaryStats.customersGrowth}%</span>
                </div>
              </div>
              <div className="p-3 rounded-lg shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Users className="h-6 w-6" style={{ color: colors.red }} />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Trend */}
        <div 
          className="p-6 rounded-lg shadow-xl border-2"
          style={{ 
            backgroundColor: colors.cream,
            borderColor: colors.mediumBlue,
            borderWidth: '2px'
          }}
        >
          <h3 className="text-base font-bold mb-4" style={{ color: colors.darkNavy }}>Orders Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.lightBlue} />
              <XAxis dataKey="date" stroke={colors.darkNavy} />
              <YAxis stroke={colors.darkNavy} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke={colors.mediumBlue} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div 
          className="p-6 rounded-lg shadow-xl border-2"
          style={{ 
            backgroundColor: colors.cream,
            borderColor: colors.mediumBlue,
            borderWidth: '2px'
          }}
        >
          <h3 className="text-base font-bold mb-4" style={{ color: colors.darkNavy }}>Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill={colors.mediumBlue}
                dataKey="value"
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>


        {/* Top Performing Items */}
        <div 
          className="rounded-lg shadow-xl border-2 overflow-hidden"
          style={{ 
            backgroundColor: colors.cream,
            borderColor: colors.mediumBlue,
            borderWidth: '2px'
          }}
        >
          <div 
            className="p-6 border-b-2"
            style={{ borderColor: colors.mediumBlue }}
          >
            <h3 className="text-xl font-bold" style={{ color: colors.darkNavy }}>Top Performing Items</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead style={{ backgroundColor: colors.lightBlue }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item, index) => (
                  <tr 
                    key={index} 
                    className="transition-colors border-b"
                    style={{ 
                      borderColor: colors.lightBlue,
                      backgroundColor: index % 2 === 0 ? colors.cream : 'rgba(168, 218, 220, 0.2)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.lightBlue}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? colors.cream : 'rgba(168, 218, 220, 0.2)'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold" style={{ color: colors.darkNavy }}>{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold" style={{ color: colors.darkNavy }}>
                      {item.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold" style={{ color: colors.darkNavy }}>
                      ₹{item.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.growth > 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 mr-1" style={{ color: colors.mediumBlue }} />
                            <span className="text-sm font-bold" style={{ color: colors.mediumBlue }}>+{item.growth}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 mr-1" style={{ color: colors.red }} />
                            <span className="text-sm font-bold" style={{ color: colors.red }}>{item.growth}%</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
