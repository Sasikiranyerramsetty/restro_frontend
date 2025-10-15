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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text restro-brand">Reports & Analytics</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="btn-outline flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={loading}
              className="btn-primary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Period Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Time Period:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-white bg-primary-600 p-1 rounded" />
                  <span className="text-sm font-medium text-gray-700">Select Date Range:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">From:</label>
                  <div className="relative">
                    <input
                      type="date"
                      id="from-date"
                      value={customDateRange.from}
                      onChange={(e) => handleCustomDateChange('from', e.target.value)}
                      className="px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <Calendar 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white bg-primary-600 p-0.5 rounded cursor-pointer hover:bg-primary-700" 
                      onClick={() => document.getElementById('from-date').showPicker()}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">To:</label>
                  <div className="relative">
                    <input
                      type="date"
                      id="to-date"
                      value={customDateRange.to}
                      onChange={(e) => handleCustomDateChange('to', e.target.value)}
                      className="px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <Calendar 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white bg-primary-600 p-0.5 rounded cursor-pointer hover:bg-primary-700" 
                      onClick={() => document.getElementById('to-date').showPicker()}
                    />
                  </div>
                </div>
                <button
                  onClick={applyCustomDateRange}
                  disabled={!customDateRange.from || !customDateRange.to}
                  className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
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
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{summaryStats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{summaryStats.revenueGrowth}%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalOrders}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{summaryStats.ordersGrowth}%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalCustomers}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{summaryStats.customersGrowth}%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Items</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{item.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.growth > 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">+{item.growth}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-sm text-red-600">{item.growth}%</span>
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
