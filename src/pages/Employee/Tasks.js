import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Search, Clock, AlertCircle, 
  CheckCircle, X, User, Calendar, MapPin, Package, 
  Utensils, Trash2, Edit, Eye
} from 'lucide-react';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import AddTaskModal from '../../components/Employee/AddTaskModal';
import taskService from '../../services/taskService';
import { formatDate } from '../../utils';
import toast from 'react-hot-toast';

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
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
      const [tasksResult, statsResult] = await Promise.all([
        taskService.getTasks(),
        taskService.getTaskStats()
      ]);

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
    setTasks(prev => [newTask, ...prev]);
    // Update stats
    setStats(prev => ({
      ...prev,
      totalTasks: prev.totalTasks + 1,
      pendingTasks: prev.pendingTasks + 1
    }));
  };

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      const result = await taskService.updateTaskStatus(taskId, newStatus);
      if (result.success) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : task.completedAt } : task
        ));
        
        // Update stats
        setStats(prev => {
          const newStats = { ...prev };
          if (newStatus === 'completed') {
            newStats.completedTasks += 1;
            if (prev.pendingTasks > 0) newStats.pendingTasks -= 1;
            if (prev.inProgressTasks > 0) newStats.inProgressTasks -= 1;
          } else if (newStatus === 'in_progress') {
            newStats.inProgressTasks += 1;
            if (prev.pendingTasks > 0) newStats.pendingTasks -= 1;
          }
          return newStats;
        });
        
        toast.success(`Task marked as ${newStatus.replace('_', ' ')}`);
      } else {
        toast.error(result.error || 'Failed to update task status');
      }
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: <AlertCircle className="h-3 w-3" /> },
      completed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-red-100 text-red-800' },
      medium: { color: 'bg-yellow-100 text-yellow-800' },
      low: { color: 'bg-green-100 text-green-800' }
    };
    return priorityConfig[priority] || priorityConfig.medium;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'cleaning': return <Trash2 className="h-4 w-4" />;
      case 'inventory': return <Package className="h-4 w-4" />;
      case 'order_preparation': return <Utensils className="h-4 w-4" />;
      case 'restocking': return <Package className="h-4 w-4" />;
      case 'customer_service': return <User className="h-4 w-4" />;
      case 'maintenance': return <Edit className="h-4 w-4" />;
      case 'special_events': return <Calendar className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600 mt-1">View and manage your assigned tasks</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center hover:scale-105 transition-transform duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Task
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgressTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks by title, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const statusConfig = getStatusBadge(task.status);
            const priorityConfig = getPriorityBadge(task.priority);
            return (
              <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(task.category)}
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                        {statusConfig.icon}
                        <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityConfig.color}`}>
                        {task.priority} priority
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Due: {task.dueTime}</p>
                    <p className="text-xs text-gray-400">{task.estimatedDuration}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{task.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Assigned by: {task.assignedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Location: {task.location}</span>
                    </div>
                    {task.tableNumber && (
                      <div className="flex items-center space-x-2">
                        <Utensils className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Table: {task.tableNumber}</span>
                      </div>
                    )}
                    {task.orderNumber && (
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Order: {task.orderNumber}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Assigned: {formatDate(task.assignedAt, 'MMM dd, HH:mm')}
                      </span>
                    </div>
                    {task.completedAt && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">
                          Completed: {formatDate(task.completedAt, 'MMM dd, HH:mm')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {task.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Notes:</span> {task.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">
                    Category: {task.category.replace('_', ' ')}
                  </span>
                  <div className="flex space-x-2">
                    {task.status === 'pending' && (
                      <button 
                        onClick={() => handleTaskStatusUpdate(task.id, 'in_progress')}
                        className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        Start Task
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <button 
                        onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                        className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded hover:bg-green-200 transition-colors"
                      >
                        Complete Task
                      </button>
                    )}
                    <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onTaskAdded={handleTaskAdded}
        />
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTasks;
