import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  DollarSign,
  Edit,
  Eye,
  MapPin,
  Search,
  Timer,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import { formatDate } from '../../utils';
import { GlassCard, MetricTile, SectionHeading, StatChip, EmptyState } from '../../components/Employee/EmployeeUI';

const statusMeta = {
  scheduled: { tone: 'sky', label: 'Scheduled', icon: Calendar },
  active: { tone: 'amber', label: 'Active', icon: Clock },
  completed: { tone: 'emerald', label: 'Completed', icon: CheckCircle },
  cancelled: { tone: 'rose', label: 'Cancelled', icon: AlertCircle }
};

const typeMeta = {
  full_day: { tone: 'sky', label: 'Full day' },
  morning: { tone: 'amber', label: 'Morning' },
  evening: { tone: 'rose', label: 'Evening' },
  night: { tone: 'indigo', label: 'Night' }
};

const EmployeeShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [stats, setStats] = useState({
    totalShifts: 0,
    completedShifts: 0,
    activeShifts: 0,
    totalHours: 0,
    totalEarnings: 0,
    thisWeekHours: 0,
    thisWeekEarnings: 0
  });
  const [currentShift, setCurrentShift] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    // Replace this placeholder once a shifts service exists.
    setShifts([]);
    setCurrentShift(null);
    setStats({
      totalShifts: 0,
      completedShifts: 0,
      activeShifts: 0,
      totalHours: 0,
      totalEarnings: 0,
      thisWeekHours: 0,
      thisWeekEarnings: 0
    });
  }, []);

  const filteredShifts = useMemo(() => {
    if (!shifts.length) return [];
    return shifts.filter((shift) => {
      const haystack = `${shift.date || ''} ${shift.type || ''} ${shift.status || ''}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || shift.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [shifts, searchTerm, statusFilter]);

  const handleCheckIn = async () => {
    if (!currentShift) return;
    setIsActionLoading(true);
    try {
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedShift = {
        ...currentShift,
        status: 'active',
        checkInTime: currentTime,
        actualStartTime: currentTime
      };

      setCurrentShift(updatedShift);
      setShifts((prev) => prev.map((shift) => (shift.id === updatedShift.id ? updatedShift : shift)));
      toast.success(`Checked in at ${currentTime}`);
    } catch (error) {
      toast.error('Check-in failed. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!currentShift) return;
    setIsActionLoading(true);
    try {
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const checkIn = currentShift.checkInTime;
      const checkInDate = checkIn ? new Date(`2000-01-01 ${checkIn}`) : null;
      const checkOutDate = new Date(`2000-01-01 ${currentTime}`);
      const hoursWorked =
        checkInDate && checkOutDate ? Math.max((checkOutDate - checkInDate) / (1000 * 60 * 60), 0) : 0;

      const completedShift = {
        ...currentShift,
        status: 'completed',
        checkOutTime: currentTime,
        actualEndTime: currentTime,
        hoursWorked: Math.round(hoursWorked * 100) / 100,
        totalEarnings: Math.round(hoursWorked * (currentShift.hourlyRate || 0) * 100) / 100
      };

      setCurrentShift(null);
      setShifts((prev) => prev.map((shift) => (shift.id === completedShift.id ? completedShift : shift)));
      setStats((prev) => ({
        ...prev,
        completedShifts: prev.completedShifts + 1,
        activeShifts: Math.max(prev.activeShifts - 1, 0),
        totalHours: prev.totalHours + hoursWorked,
        totalEarnings: prev.totalEarnings + (completedShift.totalEarnings || 0)
      }));
      toast.success(`Checked out at ${currentTime}`);
    } catch (error) {
      toast.error('Check-out failed. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const renderCurrentShift = () => {
    if (!currentShift || (currentShift.status !== 'active' && currentShift.status !== 'scheduled')) {
      return null;
    }

    const statusDefinition = statusMeta[currentShift.status] || statusMeta.scheduled;
    const StatusIcon = statusDefinition.icon;

    return (
      <GlassCard className="p-0">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 opacity-90" />
          <div className="relative p-6 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/80">Current shift</p>
                <h3 className="text-2xl font-semibold">{currentShift.position || 'Assigned role'}</h3>
                <p className="text-sm text-white/80">{formatDate(currentShift.date, 'MMM dd, yyyy')}</p>
              </div>
              <StatChip tone={statusDefinition.tone}>
                <StatusIcon className="mr-1 h-3.5 w-3.5" />
                {statusDefinition.label}
              </StatChip>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-xs uppercase tracking-wide text-white/70">Shift window</p>
                <p className="text-lg font-semibold">
                  {currentShift.startTime} – {currentShift.endTime}
                </p>
                <p className="text-xs text-white/60">
                  {currentShift.checkInTime ? `Checked in at ${currentShift.checkInTime}` : 'Not checked in yet'}
                </p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-xs uppercase tracking-wide text-white/70">Location</p>
                <p className="text-lg font-semibold">{currentShift.location || '—'}</p>
                <p className="text-xs text-white/60 capitalize">{currentShift.type?.replace('_', ' ')}</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4">
                <p className="text-xs uppercase tracking-wide text-white/70">Hourly rate</p>
                <p className="text-lg font-semibold">₹{currentShift.hourlyRate || 0}/hr</p>
                <p className="text-xs text-white/60">Tap check-in to begin tracking</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    );
  };

  return (
    <EmployeeLayout>
      <div className="space-y-8 pb-16 text-slate-900">
        <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 opacity-95" />
          <div className="relative grid gap-8 p-8 text-white lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Shift operations</p>
              <h1 className="text-3xl font-semibold">Scheduling & live coverage</h1>
              <p className="text-sm text-white/70">
                View scheduled duties, log hours, and keep payouts aligned with your shift activity.
              </p>
              <div className="flex flex-wrap gap-3">
                {currentShift && currentShift.status === 'active' ? (
                  <button
                    type="button"
                    onClick={handleCheckOut}
                    disabled={isActionLoading}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Clock className="h-4 w-4" />
                    {isActionLoading ? 'Completing…' : 'Check out'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCheckIn}
                    disabled={isActionLoading || !currentShift}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Clock className="h-4 w-4" />
                    {isActionLoading ? 'Starting…' : 'Check in'}
                  </button>
                )}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white hover:text-white"
                >
                  <Calendar className="h-4 w-4" />
                  View roster
                </button>
              </div>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/60">Shift health</p>
                  <p className="text-3xl font-semibold">{stats.activeShifts || 0}</p>
                  <p className="text-sm text-white/60">active right now</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-white/60">This week</p>
                  <p className="text-lg font-semibold">{(stats.thisWeekHours || 0).toFixed(1)} hrs</p>
                  <p className="text-sm text-white/60">₹{(stats.thisWeekEarnings || 0).toLocaleString()} earned</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {renderCurrentShift()}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="Total shifts" value={stats.totalShifts || 0} tone="sky" icon={Calendar} delta="All-time" />
          <MetricTile
            label="Completed"
            value={stats.completedShifts || 0}
            tone="emerald"
            icon={CheckCircle}
            delta="Verified"
          />
          <MetricTile
            label="Total hours"
            value={`${(stats.totalHours || 0).toFixed(1)}h`}
            tone="amber"
            icon={Clock}
            delta="Tracked"
          />
          <MetricTile
            label="Gross earnings"
            value={`₹${(stats.totalEarnings || 0).toLocaleString()}`}
            tone="rose"
            icon={DollarSign}
            delta="Before tips"
          />
        </section>

        <GlassCard>
          <SectionHeading title="Filters" description="Search by date, type, or status" />
          <div className="mt-6 flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search shifts..."
                  className="w-full rounded-2xl border border-slate-200 bg-white/60 py-3 pl-10 pr-4 text-sm text-slate-700 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>
            <div className="lg:w-56">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/60 px-3 py-3 text-sm text-slate-700 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="all">All statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {filteredShifts.length === 0 ? (
          <EmptyState
            title="No shifts to show"
            description={shifts.length === 0 ? 'Shifts will appear once scheduling is available.' : 'Try adjusting your filter.'}
          />
        ) : (
          <div className="space-y-4">
            {filteredShifts.map((shift) => {
              const statusDefinition = statusMeta[shift.status] || statusMeta.scheduled;
              const StatusIcon = statusDefinition.icon;
              const typeDefinition = typeMeta[shift.type] || { tone: 'indigo', label: shift.type?.replace('_', ' ') || 'Shift' };

              return (
                <GlassCard key={shift.id} className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{formatDate(shift.date, 'MMM dd, yyyy')}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{shift.position}</h3>
                      <p className="text-sm text-slate-500">{shift.startTime} – {shift.endTime}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatChip tone={statusDefinition.tone}>
                        <StatusIcon className="mr-1 h-3.5 w-3.5" />
                        {statusDefinition.label}
                      </StatChip>
                      <StatChip tone={typeDefinition.tone}>{typeDefinition.label}</StatChip>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-4">
                    <div className="space-y-1 text-sm text-slate-600">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Location</p>
                      <p className="text-slate-900">{shift.location}</p>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Hours logged</p>
                      <p className="text-slate-900">{(shift.totalHours || 0).toFixed(1)}h</p>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Earnings</p>
                      <p className="text-slate-900">₹{(shift.totalEarnings || 0).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Hourly rate</p>
                      <p className="text-slate-900">₹{shift.hourlyRate}/hr</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500">
                    <span>Check-in: {shift.checkInTime || '—'} | Check-out: {shift.checkOutTime || '—'}</span>
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300">
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        View details
                      </button>
                      {shift.status === 'completed' && (
                        <button className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300">
                          <Edit className="mr-1 h-3.5 w-3.5" />
                          Adjust
                        </button>
                      )}
                    </div>
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

export default EmployeeShifts;

