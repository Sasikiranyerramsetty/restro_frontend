import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  Edit,
  Eye,
  MapPin,
  Package,
  Plus,
  Search,
  Trash2,
  User,
  Utensils
} from 'lucide-react';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import AddTaskModal from '../../components/Employee/AddTaskModal';
import taskService from '../../services/taskService';
import { formatDate } from '../../utils';
import toast from 'react-hot-toast';
import { GlassCard, MetricTile, SectionHeading, StatChip, EmptyState } from '../../components/Employee/EmployeeUI';
import { useNavigate } from 'react-router-dom';

const statusMeta = {
  pending: { tone: 'amber', icon: Clock, label: 'Pending' },
  in_progress: { tone: 'sky', icon: AlertCircle, label: 'In progress' },
  completed: { tone: 'emerald', icon: CheckCircle, label: 'Completed' }
};

const priorityMeta = {
  high: { tone: 'rose', label: 'High priority' },
  medium: { tone: 'amber', label: 'Medium priority' },
  low: { tone: 'emerald', label: 'Low priority' }
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'cleaning':
      return <Trash2 className="h-4 w-4" />;
    case 'inventory':
    case 'restocking':
      return <Package className="h-4 w-4" />;
    case 'order_preparation':
      return <Utensils className="h-4 w-4" />;
    case 'customer_service':
      return <User className="h-4 w-4" />;
    case 'maintenance':
      return <Edit className="h-4 w-4" />;
    case 'special_events':
      return <Calendar className="h-4 w-4" />;
    default:
      return <CheckSquare className="h-4 w-4" />;
  }
};

const EmployeeTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const [tasksResult, statsResult] = await Promise.all([taskService.getTasks(), taskService.getTaskStats()]);

      if (tasksResult.success) {
        setTasks(tasksResult.data);
      }
      if (statsResult.success) {
        setStats(statsResult.data);
      }
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalTasks: (prev.totalTasks || 0) + 1,
      pendingTasks: (prev.pendingTasks || 0) + 1
    }));
  };

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      const result = await taskService.updateTaskStatus(taskId, newStatus);
      if (result.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: newStatus,
                  completedAt: newStatus === 'completed' ? new Date().toISOString() : task.completedAt
                }
              : task
          )
        );

        setStats((prev) => {
          const next = { ...prev };
          if (newStatus === 'completed') {
            next.completedTasks = (next.completedTasks || 0) + 1;
            if (next.pendingTasks > 0) next.pendingTasks -= 1;
            if (next.inProgressTasks > 0) next.inProgressTasks -= 1;
          } else if (newStatus === 'in_progress') {
            next.inProgressTasks = (next.inProgressTasks || 0) + 1;
            if (next.pendingTasks > 0) next.pendingTasks -= 1;
          }
          return next;
        });

        toast.success(`Task marked as ${newStatus.replace('_', ' ')}`);
      } else {
        toast.error(result.error || 'Failed to update task status');
      }
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const haystack = `${task.title} ${task.description} ${task.category}`.toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="spinner h-12 w-12" />
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-8 pb-16 text-slate-900">
        <div className="flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white/90"
          >
            ← Back
          </button>
        </div>
        <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-slate-50 to-white opacity-80" />
          <div className="relative flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Task board</p>
              <h1 className="text-3xl font-semibold text-slate-900">Service tasks & follow-ups</h1>
              <p className="text-sm text-slate-600">Focus on priority items and keep the floor moving smoothly.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
              >
                ← Back
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            label="Total tasks"
            value={stats.totalTasks || 0}
            tone="sky"
            icon={CheckSquare}
            delta={`${stats.completedTasks || 0} completed`}
          />
          <MetricTile label="Pending" value={stats.pendingTasks || 0} tone="amber" icon={Clock} delta="Awaiting pickup" />
          <MetricTile label="In progress" value={stats.inProgressTasks || 0} tone="rose" icon={AlertCircle} delta="Live work" />
          <MetricTile label="Completed" value={stats.completedTasks || 0} tone="emerald" icon={CheckCircle} delta="Shift total" />
        </section>

        <GlassCard>
          <SectionHeading title="Filters" description="Search by context or state" />
          <div className="mt-6 flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks by title, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/60 px-3 py-3 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="all">All priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {filteredTasks.length === 0 ? (
          <EmptyState title="No tasks match the current filters" description="Adjust search or wait for new assignments." />
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const status = statusMeta[task.status] || statusMeta.pending;
              const priority = priorityMeta[task.priority] || priorityMeta.medium;
              return (
                <GlassCard key={task.id} className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                          {getCategoryIcon(task.category)}
                        </span>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500">{task.category.replace('_', ' ')}</p>
                          <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{task.description}</p>
                    </div>
                    <div className="flex flex-shrink-0 flex-col items-end gap-2">
                      <StatChip tone={status.tone}>
                        <status.icon className="mr-1 h-3.5 w-3.5" />
                        {status.label}
                      </StatChip>
                      <StatChip tone={priority.tone}>{priority.label}</StatChip>
                      <p className="text-xs text-slate-500">Due {task.dueTime}</p>
                      <p className="text-xs text-slate-400">{task.estimatedDuration}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        Assigned by {task.assignedBy}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {task.location}
                      </div>
                      {task.tableNumber && (
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-slate-400" />
                          Table {task.tableNumber}
                        </div>
                      )}
                      {task.orderNumber && (
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-slate-400" />
                          Order {task.orderNumber}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        Assigned {formatDate(task.assignedAt, 'MMM dd, HH:mm')}
                      </div>
                      {task.completedAt && (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle className="h-4 w-4" />
                          Completed {formatDate(task.completedAt, 'MMM dd, HH:mm')}
                        </div>
                      )}
                      {task.notes && (
                        <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">Notes:</span> {task.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <span className="text-xs text-slate-500 capitalize">Category: {task.category.replace('_', ' ')}</span>
                    <div className="flex flex-wrap gap-2">
                      {task.status === 'pending' && (
                        <button
                          onClick={() => handleTaskStatusUpdate(task.id, 'in_progress')}
                          className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300"
                        >
                          Start task
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <button
                          onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          Complete
                        </button>
                      )}
                      <button className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300">
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        View details
                      </button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onTaskAdded={handleTaskAdded} />
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTasks;

