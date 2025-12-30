import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Filter, Search, Clock, CheckCircle, 
  AlertCircle, X, Eye, User, Phone, Mail, MapPin,
  CreditCard, DollarSign, Calendar, Package, Users,
  Monitor, Utensils, RefreshCw
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import orderManagementService from '../../services/orderManagementService';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  // Custom color palette
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'online', 'table'
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 30 seconds
    refreshIntervalRef.current = setInterval(() => {
      fetchData(true); // Silent refresh
    }, 30000);

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      const [ordersData, statsData] = await Promise.all([
        orderManagementService.getOrders(),
        orderManagementService.getOrderStats()
      ]);
      
      // Ensure ordersData is an array
      const ordersArray = Array.isArray(ordersData) ? ordersData : [];
      setOrders(ordersArray);
      setStats(statsData || {});
      
      if (!silent) {
        toast.success('Orders refreshed successfully');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (!silent) {
        toast.error('Failed to fetch orders data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchData(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const result = await orderManagementService.updateOrderStatus(orderId, newStatus);
      if (result && result.success) {
        toast.success('Order status updated successfully');
        // Refresh data silently
        await fetchData(true);
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Filter by order type based on active tab
    let matchesTab = true;
    if (activeTab === 'online') {
      matchesTab = order.orderType === 'delivery' || order.orderType === 'takeaway';
    } else if (activeTab === 'table') {
      matchesTab = order.orderType === 'dine-in';
    }
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Separate orders by type for stats
  const onlineOrders = orders.filter(order => order.orderType === 'delivery' || order.orderType === 'takeaway');
  const tableOrders = orders.filter(order => order.orderType === 'dine-in');

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        classes: 'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
        icon: <Clock className="h-3 w-3" /> 
      },
      confirmed: { 
        classes: 'border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
        icon: <CheckCircle className="h-3 w-3" /> 
      },
      preparing: { 
        classes: 'border-indigo-200 bg-indigo-100 text-indigo-800 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
        icon: <Package className="h-3 w-3" /> 
      },
      ready: { 
        classes: 'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        icon: <CheckCircle className="h-3 w-3" /> 
      },
      completed: { 
        classes: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        icon: <CheckCircle className="h-3 w-3" /> 
      },
      cancelled: { 
        classes: 'border-rose-200 bg-rose-100 text-rose-800 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
        icon: <X className="h-3 w-3" /> 
      }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const getPaymentStatusBadge = (status) => {
    if (status === 'paid') {
      return 'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
    } else if (status === 'pending') {
      return 'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
    } else {
      return 'border-rose-200 bg-rose-100 text-rose-800 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-300';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.red }}
            ></div>
            <p className="font-semibold" style={{ color: colors.darkNavy }}>Loading orders...</p>
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
              Order Management
            </h1>
            <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '180px' }}></div>
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={loading || refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.mediumBlue,
              color: colors.cream
            }}
            onMouseEnter={(e) => {
              if (!loading && !refreshing) {
                e.target.style.backgroundColor = colors.darkNavy;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && !refreshing) {
                e.target.style.backgroundColor = colors.mediumBlue;
              }
            }}
            title="Refresh orders"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
            style={{ 
              animationDelay: '0.1s',
              background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
              borderColor: colors.red,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl shadow-lg" style={{ backgroundColor: colors.cream }}>
                <ShoppingBag className="h-7 w-7" style={{ color: colors.red }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold mb-1" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Orders</p>
                <p className="text-xl font-bold" style={{ color: colors.red }}>{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
            style={{ 
              animationDelay: '0.2s',
              background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`,
              borderColor: colors.mediumBlue,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Clock className="h-7 w-7" style={{ color: colors.mediumBlue }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold mb-1" style={{ color: colors.cream }}>Active Orders</p>
                <p className="text-xl font-bold" style={{ color: colors.cream }}>
                  {stats.pendingOrders + stats.preparingOrders + stats.readyOrders}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
            style={{ 
              animationDelay: '0.3s',
              background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
              borderColor: colors.mediumBlue,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Monitor className="h-7 w-7" style={{ color: colors.mediumBlue }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold mb-1" style={{ color: colors.darkNavy, opacity: 0.8 }}>Online Orders</p>
                <p className="text-xl font-bold" style={{ color: colors.mediumBlue }}>{onlineOrders.length}</p>
              </div>
            </div>
          </div>

          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
            style={{ 
              animationDelay: '0.4s',
              background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`,
              borderColor: colors.darkNavy,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Utensils className="h-7 w-7" style={{ color: colors.darkNavy }} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold mb-1" style={{ color: colors.cream }}>Table Orders</p>
                <p className="text-xl font-bold" style={{ color: colors.cream }}>{tableOrders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div 
          className="rounded-2xl shadow-lg p-6 animate-slide-up animate-delay-200 border-2"
          style={{ 
            backgroundColor: colors.cream,
            borderColor: colors.mediumBlue,
            borderWidth: '2px'
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                <input
                  type="text"
                  placeholder="Search orders by number, customer name, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all"
                  style={{ 
                    borderColor: colors.lightBlue,
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                  onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl font-medium transition-all"
                style={{ 
                  borderColor: colors.lightBlue,
                  backgroundColor: 'white',
                  color: colors.darkNavy
                }}
                onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Order Type Tabs */}
        <div 
          className="rounded-lg shadow-sm border-2"
          style={{ 
            backgroundColor: colors.cream,
            borderColor: colors.mediumBlue,
            borderWidth: '2px'
          }}
        >
          <div style={{ borderBottomColor: colors.lightBlue, borderBottomWidth: '2px' }}>
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('all')}
                className="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                style={activeTab === 'all' ? {
                  borderColor: colors.red,
                  color: colors.red
                } : {
                  borderColor: 'transparent',
                  color: colors.mediumBlue
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'all') {
                    e.target.style.color = colors.darkNavy;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'all') {
                    e.target.style.color = colors.mediumBlue;
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>All Orders ({orders.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('online')}
                className="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                style={activeTab === 'online' ? {
                  borderColor: colors.red,
                  color: colors.red
                } : {
                  borderColor: 'transparent',
                  color: colors.mediumBlue
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'online') {
                    e.target.style.color = colors.darkNavy;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'online') {
                    e.target.style.color = colors.mediumBlue;
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4" />
                  <span>Online Orders ({onlineOrders.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                style={activeTab === 'table' ? {
                  borderColor: colors.red,
                  color: colors.red
                } : {
                  borderColor: 'transparent',
                  color: colors.mediumBlue
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'table') {
                    e.target.style.color = colors.darkNavy;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'table') {
                    e.target.style.color = colors.mediumBlue;
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <Utensils className="h-4 w-4" />
                  <span>Table Orders ({tableOrders.length})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl shadow-xl overflow-hidden animate-slide-up animate-delay-300 border-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    {activeTab === 'table' ? 'Table' : activeTab === 'online' ? 'Order Type' : 'Table/Type'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Total
                  </th>
                  {activeTab !== 'table' && (
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === 'table' ? 6 : 7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      No orders found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => {
                    const statusConfig = getStatusBadge(order.status);
                    return (
                      <tr 
                        key={order.id} 
                        className={`transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                          index % 2 === 0 
                            ? 'bg-white dark:bg-slate-800' 
                            : 'bg-slate-50 dark:bg-slate-800/50'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{order.orderNumber}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{order.orderDate} at {order.orderTime}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{order.items.length} items</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{order.customerName}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{order.customerPhone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            {activeTab === 'table' ? (
                              <>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                  Table {order.tableNumber}
                                </div>
                                {order.assignedWaiter && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400">Waiter: {order.assignedWaiter}</div>
                                )}
                              </>
                            ) : activeTab === 'online' ? (
                              <>
                                <div className="text-sm font-medium capitalize text-slate-900 dark:text-white">
                                  {order.orderType}
                                </div>
                                {order.orderType === 'delivery' && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400">Delivery Address</div>
                                )}
                                {order.orderType === 'takeaway' && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400">Pickup Order</div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                  {order.tableNumber ? `Table ${order.tableNumber}` : order.orderType}
                                </div>
                                {order.assignedWaiter && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400">Waiter: {order.assignedWaiter}</div>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span 
                              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${statusConfig.classes}`}
                            >
                              {statusConfig.icon}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <span 
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPaymentStatusBadge(order.paymentStatus)}`}
                            >
                              {order.paymentStatus}
                            </span>
                            <div className="text-xs mt-1 capitalize text-slate-500 dark:text-slate-400">{order.paymentMethod}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
                          ₹{order.total}
                        </td>
                        {activeTab !== 'table' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/30"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {order.status !== 'completed' && order.status !== 'cancelled' && (
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                  className="text-xs border-2 rounded px-2 py-1 border-slate-200 bg-white text-slate-900 outline-none transition focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-500"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="preparing">Preparing</option>
                                  <option value="ready">Ready</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
              className="rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2"
              style={{ 
                backgroundColor: colors.cream,
                borderColor: colors.mediumBlue,
                borderWidth: '2px'
              }}
            >
              <div 
                className="flex items-center justify-between p-6 border-b-2"
                style={{ borderColor: colors.mediumBlue }}
              >
                <h3 className="text-lg font-semibold" style={{ color: colors.darkNavy }}>Order Details - {selectedOrder.orderNumber}</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="transition-colors duration-200"
                  style={{ color: colors.red }}
                  onMouseEnter={(e) => e.target.style.color = '#d32f3e'}
                  onMouseLeave={(e) => e.target.style.color = colors.red}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3" style={{ color: colors.darkNavy }}>Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span style={{ color: colors.mediumBlue }}>Order Number:</span>
                        <span className="font-medium" style={{ color: colors.darkNavy }}>{selectedOrder.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.mediumBlue }}>Date & Time:</span>
                        <span className="font-medium" style={{ color: colors.darkNavy }}>{selectedOrder.orderDate} at {selectedOrder.orderTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.mediumBlue }}>Order Type:</span>
                        <span className="font-medium capitalize" style={{ color: colors.darkNavy }}>{selectedOrder.orderType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.mediumBlue }}>Status:</span>
                        <span 
                          className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border-2"
                          style={{
                            backgroundColor: getStatusBadge(selectedOrder.status).bg,
                            color: getStatusBadge(selectedOrder.status).text,
                            borderColor: getStatusBadge(selectedOrder.status).border
                          }}
                        >
                          {getStatusBadge(selectedOrder.status).icon}
                          <span className="ml-1 capitalize">{selectedOrder.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3" style={{ color: colors.darkNavy }}>Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span style={{ color: colors.mediumBlue }}>Name:</span>
                        <span className="font-medium" style={{ color: colors.darkNavy }}>{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.mediumBlue }}>Phone:</span>
                        <span className="font-medium" style={{ color: colors.darkNavy }}>{selectedOrder.customerPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: colors.mediumBlue }}>Email:</span>
                        <span className="font-medium" style={{ color: colors.darkNavy }}>{selectedOrder.customerEmail}</span>
                      </div>
                      {selectedOrder.tableNumber && (
                        <div className="flex justify-between">
                          <span style={{ color: colors.mediumBlue }}>Table:</span>
                          <span className="font-medium" style={{ color: colors.darkNavy }}>{selectedOrder.tableNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-medium mb-3" style={{ color: colors.darkNavy }}>Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="flex justify-between items-center p-3 rounded-lg border-2"
                        style={{ 
                          backgroundColor: index % 2 === 0 ? colors.cream : colors.lightBlue,
                          borderColor: colors.lightBlue
                        }}
                      >
                        <div>
                          <div className="font-medium" style={{ color: colors.darkNavy }}>{item.name}</div>
                          <div className="text-sm" style={{ color: colors.mediumBlue }}>Quantity: {item.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium" style={{ color: colors.darkNavy }}>₹{item.total}</div>
                          <div className="text-sm" style={{ color: colors.mediumBlue }}>₹{item.price} each</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div 
                  className="p-4 rounded-lg border-2"
                  style={{ 
                    backgroundColor: colors.lightBlue,
                    borderColor: colors.mediumBlue
                  }}
                >
                  <h4 className="text-sm font-medium mb-3" style={{ color: colors.darkNavy }}>Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: colors.mediumBlue }}>Subtotal:</span>
                      <span className="font-medium" style={{ color: colors.darkNavy }}>₹{selectedOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.mediumBlue }}>Tax:</span>
                      <span className="font-medium" style={{ color: colors.darkNavy }}>₹{selectedOrder.tax}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between">
                        <span style={{ color: colors.mediumBlue }}>Discount:</span>
                        <span className="font-medium" style={{ color: colors.red }}>-₹{selectedOrder.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t-2 pt-2" style={{ borderColor: colors.mediumBlue }}>
                      <span className="font-medium" style={{ color: colors.darkNavy }}>Total:</span>
                      <span className="font-bold text-lg" style={{ color: colors.red }}>₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: colors.darkNavy }}>Special Notes</h4>
                    <p 
                      className="text-sm p-3 rounded-lg border-2"
                      style={{ 
                        color: colors.darkNavy,
                        backgroundColor: colors.lightBlue,
                        borderColor: colors.mediumBlue
                      }}
                    >
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
