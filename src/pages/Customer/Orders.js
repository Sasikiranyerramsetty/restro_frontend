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
  Search,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import CustomerLayout from '../../components/Customer/CustomerLayout';
import { formatCurrency } from '../../utils';
import userOrdersService from '../../services/userOrdersService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { GlassCard, SectionHeading, MetricTile } from '../../components/Employee/EmployeeUI';

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

  // Calculate stats
  const orderStats = useMemo(() => {
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const avgRating = orders.length > 0 
      ? (orders.reduce((sum, order) => sum + (order.rating || 0), 0) / orders.length).toFixed(1)
      : '0.0';
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    return {
      totalOrders,
      deliveredOrders,
      avgRating,
      totalSpent
    };
  }, [orders]);

  const statCards = useMemo(
    () => [
      {
        label: 'Total orders',
        value: orderStats.totalOrders,
        delta: `${orderStats.deliveredOrders} delivered`,
        icon: ShoppingBag,
        tone: 'sky'
      },
      {
        label: 'Delivered',
        value: orderStats.deliveredOrders,
        delta: 'Completed orders',
        icon: CheckCircle,
        tone: 'emerald'
      },
      {
        label: 'Avg rating',
        value: orderStats.avgRating,
        delta: 'Your feedback',
        icon: Star,
        tone: 'amber'
      },
      {
        label: 'Total spent',
        value: formatCurrency(orderStats.totalSpent),
        delta: 'All time',
        icon: TrendingUp,
        tone: 'indigo'
      }
    ],
    [orderStats]
  );

  // Background style - solid dark navy blue
  const backgroundStyle = useMemo(() => ({
    backgroundColor: '#0a1628'
  }), []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return { bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-700' };
      case 'preparing':
        return { bg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-700' };
      case 'out-for-delivery':
        return { bg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-700' };
      case 'cancelled':
        return { bg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-700' };
      default:
        return { bg: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-600' };
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
      <CustomerLayout backgroundStyle={backgroundStyle} backgroundClassName="bg-slate-950 text-slate-100">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-200">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-indigo-400" />
            <p className="text-sm text-slate-400">Loading orders...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout backgroundStyle={backgroundStyle} backgroundClassName="bg-slate-950 text-slate-100">
      <div className="space-y-6 px-4 py-6">
        {/* Hero Section - Matching Admin Dashboard */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 shadow-xl text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-slate-900 to-slate-950 opacity-95" />
          <div
            className="absolute inset-0 blur-3xl opacity-40"
            style={{ background: 'radial-gradient(circle at 15% 15%, rgba(16,185,129,0.35), transparent 55%)' }}
          />
          <div className="relative flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100 ring-1 ring-white/10">
                <ShoppingBag className="h-4 w-4 text-indigo-200" />
                <span>Customer · Orders</span>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold text-white">My Orders</h1>
                <p className="text-sm text-white/80">
                  Track and manage all your orders in one place
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Real-time updates
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  Order history
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <MetricTile key={card.label} {...card} />
          ))}
        </div>

        {/* Search and Filters - Matching Admin Dashboard */}
        <GlassCard className="bg-white/90 border-slate-100 text-slate-900 dark:bg-slate-900/70 dark:border-slate-800">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID or items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-10 py-3 text-sm text-slate-900 placeholder-slate-500 outline-none transition focus:border-indigo-400 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-indigo-400"
                />
              </div>
              <div className="sm:w-64">
                <select
                  aria-label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:border-indigo-400"
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
        </GlassCard>

        {/* Orders List - Matching Admin Dashboard Style */}
        <GlassCard className="overflow-hidden bg-white/95 border-slate-100 text-slate-900 shadow-md dark:bg-slate-900/80 dark:border-slate-800">
          <SectionHeading
            title="Order history"
            description="View and track all your orders."
          />
          <div className="space-y-4 p-6">
            {filteredOrders.map((order) => {
              const statusColors = getStatusColor(order.status);
              return (
                <div 
                  key={order.id} 
                  className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-all duration-300 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{order.id}</h3>
                      </div>
                      <span 
                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border flex-shrink-0 ${statusColors.bg} ${statusColors.border}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status.replace('-', ' ')}</span>
                      </span>
                      <span 
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                          order.type === 'delivery' 
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        }`}
                      >
                        {order.type}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatCurrency(order.total)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{order.date} at {order.time}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-slate-900 dark:text-white">Order Items</h4>
                      <div className="space-y-1">
                        {(order.items || []).map((item, index) => {
                          const itemName = item.name || item.item_name || 'Unknown Item';
                          const quantity = item.quantity || 1;
                          const price = item.price || item.item_total || 0;
                          const total = price * quantity;
                          return (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-300">{quantity}x {itemName}</span>
                              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(total)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2 text-slate-900 dark:text-white">Order Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-slate-600 dark:text-slate-300">Payment: {order.paymentMethod}</span>
                        </div>
                        {order.deliveryAddress && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-slate-600 dark:text-slate-300">{order.deliveryAddress}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 fill-current text-amber-400" />
                          <span className="text-slate-600 dark:text-slate-300">Rating: {order.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mb-4 p-3 rounded-lg border-l-4 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700">
                      <p className="text-sm text-slate-900 dark:text-white">
                        <span className="font-medium">Notes:</span> {order.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Order placed on {order.date} at {order.time}
                    </span>
                    <div className="flex space-x-2">
                      <button className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50">
                        Reorder
                      </button>
                      <button className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
              <Package className="h-16 w-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-lg font-semibold text-slate-900 dark:text-white">No orders found.</p>
              <p className="text-sm mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </CustomerLayout>
  );
};

export default CustomerOrders;
