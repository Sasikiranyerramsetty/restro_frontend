import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, CheckCircle, AlertCircle, X, 
  Search, User, MapPin, Timer, DollarSign,
  TrendingUp, Eye, Edit
} from 'lucide-react';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import { formatDate } from '../../utils';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Static mock data removed. Integrate with real shifts service here when available.
    setShifts([]);
    setCurrentShift(null);
    setStats({ totalShifts: 0, completedShifts: 0, activeShifts: 0, totalHours: 0, totalEarnings: 0, thisWeekHours: 0, thisWeekEarnings: 0 });
  }, []);

  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = shift.date.includes(searchTerm) ||
                         shift.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shift.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-white text-orange-600', icon: <Clock className="h-3 w-3 text-orange-600" /> },
      completed: { color: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="h-3 w-3" /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <X className="h-3 w-3" /> }
    };
    return statusConfig[status] || statusConfig.completed;
  };

  const getTypeColor = (type) => {
    const typeColors = {
      'full_day': 'bg-blue-100 text-blue-800',
      'evening': 'bg-purple-100 text-purple-800',
      'morning': 'bg-yellow-100 text-yellow-800',
      'night': 'bg-indigo-100 text-indigo-800'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  // Check-in function
  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update current shift with check-in time
      const updatedShift = {
        ...currentShift,
        status: 'active',
        checkInTime: currentTime,
        actualStartTime: currentTime
      };
      
      setCurrentShift(updatedShift);
      
      // Update shifts array
      setShifts(prevShifts => 
        prevShifts.map(shift => 
          shift.id === currentShift.id ? updatedShift : shift
        )
      );
      
      // Show success message (you can replace with a toast notification)
      alert(`Checked in successfully at ${currentTime}`);
      
    } catch (error) {
      console.error('Check-in failed:', error);
      alert('Check-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check-out function
  const handleCheckOut = async () => {
    setIsLoading(true);
    try {
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate hours worked
      const checkInTime = currentShift.checkInTime;
      const checkInDate = new Date(`2000-01-01 ${checkInTime}`);
      const checkOutDate = new Date(`2000-01-01 ${currentTime}`);
      const hoursWorked = (checkOutDate - checkInDate) / (1000 * 60 * 60);
      
      // Update current shift with check-out time
      const updatedShift = {
        ...currentShift,
        status: 'completed',
        checkOutTime: currentTime,
        actualEndTime: currentTime,
        hoursWorked: Math.round(hoursWorked * 100) / 100,
        totalEarnings: Math.round(hoursWorked * currentShift.hourlyRate * 100) / 100
      };
      
      setCurrentShift(null); // Clear current shift after check-out
      
      // Update shifts array
      setShifts(prevShifts => 
        prevShifts.map(shift => 
          shift.id === currentShift.id ? updatedShift : shift
        )
      );
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        completedShifts: prevStats.completedShifts + 1,
        activeShifts: 0,
        totalHours: prevStats.totalHours + hoursWorked,
        totalEarnings: prevStats.totalEarnings + updatedShift.totalEarnings
      }));
      
      // Show success message
      alert(`Checked out successfully at ${currentTime}. Hours worked: ${hoursWorked.toFixed(2)}`);
      
    } catch (error) {
      console.error('Check-out failed:', error);
      alert('Check-out failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text restro-brand">Shift Management</h1>
            <p className="text-gray-600 mt-2 text-lg">View your shifts and check-in/out</p>
          </div>
          {currentShift && currentShift.status === 'active' ? (
            <button 
              onClick={handleCheckOut}
              disabled={isLoading}
              className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock className="h-5 w-5 mr-2" />
              {isLoading ? 'Checking Out...' : 'Check Out'}
            </button>
          ) : (
            <button 
              onClick={handleCheckIn}
              disabled={isLoading || !currentShift}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock className="h-5 w-5 mr-2" />
              {isLoading ? 'Checking In...' : 'Check In'}
            </button>
          )}
        </div>

        {/* Current Shift Card */}
        {currentShift && (currentShift.status === 'active' || currentShift.status === 'scheduled') && (
          <div className="bg-orange-500 border border-orange-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Current Shift</h3>
                  <p className="text-sm text-orange-100">{formatDate(currentShift.date, 'MMMM dd, yyyy')}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(currentShift.status).color}`}>
                {getStatusBadge(currentShift.status).icon}
                <span className="ml-1 capitalize">{currentShift.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Timer className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Shift Time</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {currentShift.startTime} - {currentShift.endTime}
                </p>
                <p className="text-xs text-gray-500">
                  {currentShift.checkInTime ? `Checked in at ${currentShift.checkInTime}` : 'Not checked in yet'}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Location</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{currentShift.location}</p>
                <p className="text-xs text-gray-500 capitalize">{currentShift.type.replace('_', ' ')} shift</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Hourly Rate</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">₹{currentShift.hourlyRate}/hr</p>
                <p className="text-xs text-gray-500">{currentShift.position}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Shifts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalShifts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Timer className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.totalHours || 0).toFixed(1)}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{(stats.totalEarnings || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Weekly Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{(stats.thisWeekHours || 0).toFixed(1)}h</div>
              <div className="text-sm text-gray-600">Hours Worked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{(stats.thisWeekEarnings || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Earnings</div>
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
                  placeholder="Search shifts by date, type, or status..."
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
                <option value="completed">Completed</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shifts List */}
        <div className="space-y-4">
          {filteredShifts.map((shift) => {
            const statusConfig = getStatusBadge(shift.status);
            return (
              <div key={shift.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {formatDate(shift.date, 'MMM dd, yyyy')}
                      </h3>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                      {statusConfig.icon}
                      <span className="ml-1 capitalize">{shift.status}</span>
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(shift.type)}`}>
                      {shift.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {shift.startTime} - {shift.endTime}
                    </p>
                    <p className="text-xs text-gray-500">{(shift.totalHours || 0).toFixed(1)}h worked</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Location</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{shift.location}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Position</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{shift.position}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Earnings</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">₹{(shift.totalEarnings || 0).toLocaleString()}</p>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Check In/Out</span>
                    </div>
                    <p className="text-sm text-gray-900">
                      In: {shift.checkInTime} | Out: {shift.checkOutTime || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Timer className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Break Time</span>
                    </div>
                    <p className="text-sm text-gray-900">{shift.breakTime} mins</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Overtime</span>
                    </div>
                    <p className="text-sm text-gray-900">{shift.overtime > 0 ? `${shift.overtime}h` : 'None'}</p>
                  </div>
                </div>

                {shift.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Notes:</span> {shift.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Hourly Rate: ₹{shift.hourlyRate}/hr
                  </span>
                  <div className="flex space-x-2">
                    <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </button>
                    {shift.status === 'completed' && (
                      <button className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeShifts;
