import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  Star, 
  MapPin, 
  Calendar,
  CreditCard,
  Filter,
  Search
} from 'lucide-react';
import CustomerLayout from '../../components/Customer/CustomerLayout';
import { formatCurrency } from '../../utils';
import userOrdersService from '../../services/userOrdersService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const getUserId = (user) => {
  if (user?.id) return user.id;
  if (user?.user_id) return user.user_id;
  
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

const CustomerOrders = () => {
  const { user } = useAuth();
  const userId = useMemo(() => getUserId(user), [user]);
  
  // Custom color palette (matching admin)
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const result = await userOrdersService.getUserOrders(userId);
        if (result.success) {
          // Transform the data to match the expected format
          const transformedOrders = result.data.map(order => ({
            id: order.id || order.order_id,
            order_id: order.order_id || order.id,
            date: order.date,
            time: order.time,
            status: order.status || 'pending',
            type: order.type || order.order_type,
            total: order.total,
            items: order.items || [],
            deliveryAddress: order.delivery_address,
            paymentMethod: order.payment_method,
            notes: order.special_instructions,
            rating: order.rating
          }));
          setOrders(transformedOrders);
        } else {
          toast.error(result.error || 'Failed to fetch orders');
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' };
      case 'preparing':
        return { bg: 'rgba(234, 179, 8, 0.1)', text: '#ca8a04' };
      case 'out-for-delivery':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: colors.mediumBlue };
      case 'cancelled':
        return { bg: 'rgba(230, 57, 70, 0.1)', text: colors.red };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'preparing':
        return <Clock className="h-4 w-4" />;
      case 'out-for-delivery':
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const orderId = (order.id || order.order_id || '').toLowerCase();
    const itemNames = (order.items || []).map(item => {
      // Handle both formats: {name, ...} or {item_name, ...}
      return (item.name || item.item_name || '').toLowerCase();
    });
    const matchesSearch = orderId.includes(searchTerm.toLowerCase()) ||
                         itemNames.some(name => name.includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: colors.cream }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 mx-auto mb-4" style={{ borderColor: colors.red }}></div>
            <p style={{ color: colors.darkNavy }}>Loading orders...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-8 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', width: '100%', padding: '1.5rem 2rem', overflowX: 'hidden' }}>
        <div className="w-full max-w-full">
          {/* Header */}
          <div className="mb-8 animate-slide-up">
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
              My Orders
            </h1>
            <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '150px' }}></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <p className="text-3xl font-bold" style={{ color: colors.mediumBlue }}>{orders.length}</p>
                </div>
                <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                  <Package className="h-8 w-8" style={{ color: colors.mediumBlue }} />
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
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Delivered</p>
                  <p className="text-3xl font-bold" style={{ color: colors.red }}>{orders.filter(o => o.status === 'delivered').length}</p>
                </div>
                <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                  <CheckCircle className="h-8 w-8" style={{ color: colors.red }} />
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
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Avg Rating</p>
                  <p className="text-3xl font-bold" style={{ color: colors.darkNavy }}>
                    {(orders.reduce((sum, order) => sum + order.rating, 0) / orders.length).toFixed(1)}
                  </p>
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
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Spent</p>
                  <p className="text-3xl font-bold" style={{ color: colors.red }}>
                    {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                  </p>
                </div>
                <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                  <CreditCard className="h-8 w-8" style={{ color: colors.red }} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div 
            className="rounded-2xl shadow-xl border-2 p-6 mt-8"
            style={{ 
              background: `linear-gradient(135deg, #FFFFFF 0%, ${colors.cream} 100%)`,
              borderColor: colors.lightBlue
            }}
          >
            <div className="flex flex-col sm:flex-row gap-4 min-w-0">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                  <input
                    type="text"
                    placeholder="Search orders by ID or items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      borderColor: colors.lightBlue,
                      color: colors.darkNavy
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.red;
                      e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.lightBlue;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderColor: colors.lightBlue,
                    color: colors.darkNavy,
                    backgroundColor: '#FFFFFF'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.red;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.lightBlue;
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="delivered">Delivered</option>
                  <option value="preparing">Preparing</option>
                  <option value="out-for-delivery">Out for Delivery</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4 mt-8 min-w-0">
            {filteredOrders.map((order) => {
              const statusColors = getStatusColor(order.status);
              return (
                <div 
                  key={order.id} 
                  className="rounded-2xl shadow-xl border-2 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] min-w-0 overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, #FFFFFF 0%, ${colors.cream} 100%)`,
                    borderColor: colors.lightBlue
                  }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Package className="h-5 w-5" style={{ color: colors.mediumBlue }} />
                        <h3 className="text-lg font-semibold" style={{ color: colors.darkNavy }}>{order.id}</h3>
                      </div>
                      <span 
                        className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0"
                        style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status.replace('-', ' ')}</span>
                      </span>
                      <span 
                        className="inline-flex px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: order.type === 'delivery' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                          color: order.type === 'delivery' ? colors.mediumBlue : '#16a34a'
                        }}
                      >
                        {order.type}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{ color: colors.red }}>
                        {formatCurrency(order.total)}
                      </p>
                      <p className="text-xs" style={{ color: colors.mediumBlue }}>{order.date} at {order.time}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: colors.darkNavy }}>Order Items</h4>
                      <div className="space-y-1">
                        {(order.items || []).map((item, index) => {
                          const itemName = item.name || item.item_name || 'Unknown Item';
                          const quantity = item.quantity || 1;
                          const price = item.price || item.item_total || 0;
                          const total = price * quantity;
                          return (
                            <div key={index} className="flex justify-between text-sm">
                              <span style={{ color: colors.mediumBlue }}>{quantity}x {itemName}</span>
                              <span className="font-semibold" style={{ color: colors.darkNavy }}>{formatCurrency(total)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: colors.darkNavy }}>Order Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" style={{ color: colors.mediumBlue }} />
                          <span style={{ color: colors.mediumBlue }}>Payment: {order.paymentMethod}</span>
                        </div>
                        {order.deliveryAddress && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" style={{ color: colors.mediumBlue }} />
                            <span style={{ color: colors.mediumBlue }}>{order.deliveryAddress}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 fill-current" style={{ color: '#FFB800' }} />
                          <span style={{ color: colors.mediumBlue }}>Rating: {order.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div 
                      className="mb-4 p-3 rounded border-l-4"
                      style={{ 
                        backgroundColor: 'rgba(168, 218, 220, 0.2)',
                        borderColor: colors.mediumBlue
                      }}
                    >
                      <p className="text-sm" style={{ color: colors.darkNavy }}>
                        <span className="font-medium">Notes:</span> {order.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: colors.mediumBlue }}>
                      Order placed on {order.date} at {order.time}
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        className="text-xs px-3 py-1 rounded transition-all duration-200 hover:scale-105"
                        style={{ 
                          backgroundColor: 'rgba(69, 123, 157, 0.1)',
                          color: colors.mediumBlue
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(69, 123, 157, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(69, 123, 157, 0.1)';
                        }}
                      >
                        Reorder
                      </button>
                      <button 
                        className="text-xs px-3 py-1 rounded transition-all duration-200 hover:scale-105"
                        style={{ 
                          backgroundColor: colors.cream,
                          color: colors.darkNavy,
                          border: `1px solid ${colors.lightBlue}`
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = colors.lightBlue;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = colors.cream;
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div 
              className="text-center py-12 rounded-2xl shadow-xl border-2 mt-8"
              style={{ 
                background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
                borderColor: colors.lightBlue
              }}
            >
              <div className="p-4 rounded-full inline-block mb-4" style={{ backgroundColor: colors.lightBlue }}>
                <Package className="h-16 w-16" style={{ color: colors.mediumBlue }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: colors.darkNavy }}>No orders found</h3>
              <p style={{ color: colors.mediumBlue }}>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerOrders;
