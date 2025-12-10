import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Filter,
  Search,
  Clock,
  CheckCircle2,
  X,
  User,
  Phone,
  MapPin,
  Package,
  Utensils,
  Truck,
  Wallet,
  Receipt,
  Sparkles
} from 'lucide-react';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import { formatCurrency } from '../../utils';
import { GlassCard, MetricTile, SectionHeading, StatChip, toneTokens, EmptyState } from '../../components/Employee/EmployeeUI';

const statusVisuals = {
  pending: { tone: 'amber', icon: Clock, label: 'Pending' },
  preparing: { tone: 'sky', icon: Package, label: 'Preparing' },
  ready: { tone: 'emerald', icon: CheckCircle2, label: 'Ready' },
  completed: { tone: 'indigo', icon: CheckCircle2, label: 'Completed' },
  cancelled: { tone: 'rose', icon: X, label: 'Cancelled' }
};

const orderTypeIcons = {
  'dine-in': Utensils,
  takeaway: ShoppingBag,
  delivery: Truck
};

const EmployeeOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    // TODO: replace with live orders service when backend is ready
    setOrders([]);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const target = `${order.orderNumber} ${order.customerName} ${order.customerPhone}`.toLowerCase();
    const matchesSearch = target.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.orderType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <EmployeeLayout>
      <div className="space-y-8 pb-16 text-slate-900">
        <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white px-6 py-8 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-slate-50 to-white opacity-80" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Live orders</p>
              <h1 className="text-3xl font-semibold text-slate-900">Service queue & fulfilment</h1>
              <p className="text-sm text-slate-600">Monitor every ticket and keep fulfillment times tight.</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  Dining hall command
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  Updated just now
                </span>
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Active filters</p>
                <p className="text-lg font-semibold text-slate-900">
                  {statusFilter === 'all' ? 'All statuses' : statusVisuals[statusFilter]?.label}
                </p>
                <p className="text-sm text-slate-500">{typeFilter === 'all' ? 'All types' : typeFilter}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Search</p>
                <p className="text-lg font-semibold text-slate-900">{searchTerm ? searchTerm : 'No keyword'}</p>
                <p className="text-sm text-slate-500">Use filters below to refine</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="Total orders" value={stats.totalOrders} tone="sky" icon={Receipt} delta="+0 vs yesterday" />
          <MetricTile label="Pending" value={stats.pendingOrders} tone="amber" icon={Clock} delta="Awaiting prep" />
          <MetricTile label="Preparing" value={stats.preparingOrders} tone="rose" icon={Package} delta="Kitchen load" />
          <MetricTile
            label="Ready / Completed"
            value={`${stats.readyOrders}/${stats.completedOrders}`}
            tone="emerald"
            icon={CheckCircle2}
            delta={`${formatCurrency(stats.totalRevenue || 0)} today`}
          />
        </section>

        <GlassCard>
          <SectionHeading title="Filters" description="Target orders by status or fulfillment path" />
          <div className="mt-6 flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by order #, guest, or phone"
                  className="w-full rounded-2xl border border-slate-200 bg-white/60 py-3 pl-11 pr-4 text-sm text-slate-700 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:w-96">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/60 px-3 py-3 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="all">All status</option>
                {Object.keys(statusVisuals).map((status) => (
                  <option key={status} value={status}>
                    {statusVisuals[status].label}
                  </option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/60 px-3 py-3 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="all">All types</option>
                <option value="dine-in">Dine-in</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <EmptyState
              title="No orders match the current filters"
              description="Orders will appear in real time once assigned to your station."
            />
          ) : (
            filteredOrders.map((order) => {
              const statusMeta = statusVisuals[order.status] || statusVisuals.pending;
              const tone = toneTokens[statusMeta.tone] || toneTokens.sky;
              const TypeIcon = orderTypeIcons[order.orderType] || ShoppingBag;
              return (
                <GlassCard key={order.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                        <TypeIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-400">Order #{order.orderNumber}</p>
                        <p className="text-lg font-semibold text-slate-900">{order.customerName}</p>
                        <p className="text-xs text-slate-500">{order.customerPhone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatChip tone={statusMeta.tone}>
                        <statusMeta.icon className="mr-1 h-3.5 w-3.5" />
                        {statusMeta.label}
                      </StatChip>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-slate-500">{order.orderTime}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 text-sm text-slate-600">
                      {order.tableNumber && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          Table {order.tableNumber}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        {order.paymentStatus} • {order.paymentMethod}
                      </div>
                      {order.specialNotes && (
                        <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
                          <p className="text-xs font-semibold uppercase tracking-wide">Notes</p>
                          <p className="text-sm">{order.specialNotes}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Items</p>
                      <div className="mt-2 space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-xs text-slate-500">
                            <span>
                              {item.quantity}× {item.name}
                            </span>
                            <span>{formatCurrency(item.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <StatChip tone="sky">{order.estimatedTime}</StatChip>
                      <span>Created via {order.orderType}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300">
                        View details
                      </button>
                      {order.status === 'pending' && (
                        <button className="rounded-2xl border border-slate-200 bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800">
                          Send to kitchen
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">
                          Mark ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300">
                          Complete order
                        </button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeOrders;
