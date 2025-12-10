import React, { useState, useEffect } from 'react';
import {
  Table,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Eye,
  User,
  Phone,
  Calendar,
  Sparkles
} from 'lucide-react';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils';
import { GlassCard, MetricTile, SectionHeading, StatChip, toneTokens, EmptyState } from '../../components/Employee/EmployeeUI';

const statusMeta = {
  available: { tone: 'emerald', icon: CheckCircle2, label: 'Available' },
  occupied: { tone: 'rose', icon: Users, label: 'Occupied' },
  reserved: { tone: 'amber', icon: Calendar, label: 'Reserved' },
  cleaning: { tone: 'sky', icon: AlertCircle, label: 'Cleaning' },
  maintenance: { tone: 'indigo', icon: X, label: 'Maintenance' }
};

const typeTone = {
  Standard: 'sky',
  Booth: 'indigo',
  Private: 'rose',
  Outdoor: 'emerald'
};

const EmployeeTables = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fallbackRoute = location.state?.from || '/employee/dashboard';
  const [tables, setTables] = useState([]);
  const [stats, setStats] = useState({
    totalTables: 0,
    availableTables: 0,
    occupiedTables: 0,
    reservedTables: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    // TODO: Integrate with live table service
    setTables([]);
  }, []);

  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (table.customer && table.customer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || table.location === locationFilter;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const uniqueLocations = [...new Set(tables.map((t) => t.location).filter(Boolean))];

  return (
    <EmployeeLayout>
      <div className="space-y-8 pb-16 text-slate-900">
        <div className="flex justify-start">
          <button
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate(fallbackRoute, { replace: true });
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white/90"
          >
            ← Back
          </button>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-8 text-white shadow-xl">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.45),_transparent_45%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">Floor control</p>
              <h1 className="mt-3 text-3xl font-semibold">Table management</h1>
              <p className="text-sm text-indigo-100">Track seating, reservations, and maintenance tasks in one view.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
              <MapPin className="h-4 w-4" />
              View layout
            </button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="Total tables" value={stats.totalTables} tone="sky" icon={Table} delta="Across all sections" />
          <MetricTile label="Available" value={stats.availableTables} tone="emerald" icon={CheckCircle2} delta="Ready to seat" />
          <MetricTile label="Occupied" value={stats.occupiedTables} tone="rose" icon={Users} delta="Live service" />
          <MetricTile label="Reserved" value={stats.reservedTables} tone="amber" icon={Calendar} delta="Upcoming arrivals" />
        </section>

        <GlassCard>
          <SectionHeading title="Filters" description="Surface the right section fast" />
          <div className="mt-6 flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search table number, guest, or waiter"
                  className="w-full rounded-2xl border border-slate-200 bg-white/60 py-3 pl-11 pr-4 text-sm text-slate-700 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:w-[28rem]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/60 px-3 py-3 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="all">All statuses</option>
                {Object.keys(statusMeta).map((status) => (
                  <option key={status} value={status}>
                    {statusMeta[status].label}
                  </option>
                ))}
              </select>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/60 px-3 py-3 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="all">All locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>

        {filteredTables.length === 0 ? (
          <EmptyState title="No tables match the current filters" description="Adjust search or wait for new updates from host stand." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTables.map((table) => {
              const status = statusMeta[table.status] || statusMeta.available;
              const tone = toneTokens[status.tone] || toneTokens.emerald;
              const typeBadge = toneTokens[typeTone[table.type] || 'sky'];
              return (
                <GlassCard key={table.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                        <Table className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs text-slate-500">Table</p>
                        <p className="text-xl font-semibold text-slate-900">{table.number}</p>
                        <p className="text-xs text-slate-500">{table.location}</p>
                      </div>
                    </div>
                    <StatChip tone={status.tone}>
                      <status.icon className="mr-1 h-3.5 w-3.5" />
                      {status.label}
                    </StatChip>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-slate-600">
                      Capacity {table.capacity}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeBadge?.chip || 'bg-slate-100 text-slate-600'}`}>
                      {table.type}
                    </span>
                  </div>

                  {table.customer && (
                    <div className="mt-5 space-y-3 rounded-2xl border border-slate-100 p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <User className="h-4 w-4 text-slate-400" />
                        {table.customer}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {table.customerPhone}
                      </div>
                      {table.assignedWaiter && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          Waiter {table.assignedWaiter}
                        </div>
                      )}
                      {table.seatedAt && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          Seated {formatDate(table.seatedAt, 'HH:mm')}
                        </div>
                      )}
                      {table.estimatedDuration && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          Est. {table.estimatedDuration}
                        </div>
                      )}
                    </div>
                  )}

                  {table.notes && (
                    <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">{table.notes}</p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {table.status === 'available' && (
                      <button className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                        Seat guest
                      </button>
                    )}
                    {table.status === 'occupied' && (
                      <button className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300">
                        Check status
                      </button>
                    )}
                    {table.status === 'reserved' && (
                      <button className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100">
                        Confirm arrival
                      </button>
                    )}
                    {table.status === 'cleaning' && (
                      <button className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100">
                        Mark clean
                      </button>
                    )}
                    <button className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTables;
