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
    totalTips: 0,
    thisWeekHours: 0,
    thisWeekEarnings: 0,
    thisWeekTips: 0
  });
  const [currentShift, setCurrentShift] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Mock data for employee shifts
    const mockShifts = [
      {
        id: 1,
        date: '2024-01-20',
        startTime: '09:00',
        endTime: '17:00',
        status: 'completed',
        type: 'full_day',
        location: 'Main Restaurant',
        position: 'Waiter',
        checkInTime: '08:55',
        checkOutTime: '17:05',
        totalHours: 8.17,
        breakTime: 60,
        overtime: 0,
        hourlyRate: 250,
        totalEarnings: 2042.5,
        tips: 450,
        notes: 'Busy day, handled 15 tables'
      },
      {
        id: 2,
        date: '2024-01-19',
        startTime: '18:00',
        endTime: '23:00',
        status: 'completed',
        type: 'evening',
        location: 'Main Restaurant',
        position: 'Waiter',
        checkInTime: '17:58',
        checkOutTime: '23:02',
        totalHours: 5.07,
        breakTime: 30,
        overtime: 0,
        hourlyRate: 250,
        totalEarnings: 1267.5,
        tips: 320,
        notes: 'Evening rush, good tips'
      },
      {
        id: 3,
        date: '2024-01-18',
        startTime: '10:00',
        endTime: '18:00',
        status: 'completed',
        type: 'full_day',
        location: 'Main Restaurant',
        position: 'Waiter',
        checkInTime: '09:58',
        checkOutTime: '18:05',
        totalHours: 8.12,
        breakTime: 60,
        overtime: 0,
        hourlyRate: 250,
        totalEarnings: 2030,
        tips: 380,
        notes: 'Regular day'
      },
      {
        id: 4,
        date: '2024-01-17',
        startTime: '18:00',
        endTime: '23:00',
        status: 'completed',
        type: 'evening',
        location: 'Main Restaurant',
        position: 'Waiter',
        checkInTime: '17:55',
        checkOutTime: '23:10',
        totalHours: 5.25,
        breakTime: 30,
        overtime: 0.25,
        hourlyRate: 250,
        totalEarnings: 1312.5,
        tips: 280,
        notes: 'Overtime due to late customers'
      },
      {
        id: 5,
        date: '2024-01-16',
        startTime: '09:00',
        endTime: '17:00',
        status: 'completed',
        type: 'full_day',
        location: 'Main Restaurant',
        position: 'Waiter',
        checkInTime: '08:57',
        checkOutTime: '17:03',
        totalHours: 8.1,
        breakTime: 60,
        overtime: 0,
        hourlyRate: 250,
        totalEarnings: 2025,
        tips: 420,
        notes: 'Good day, many regular customers'
      },
      {
        id: 6,
        date: '2024-01-15',
        startTime: '18:00',
        endTime: '23:00',
        status: 'completed',
        type: 'evening',
        location: 'Main Restaurant',
        position: 'Waiter',
        checkInTime: '17:59',
        checkOutTime: '22:58',
        totalHours: 4.98,
        breakTime: 30,
        overtime: 0,
        hourlyRate: 250,
        totalEarnings: 1245,
        tips: 350,
        notes: 'Early finish'
      },
      {
        id: 7,
        date: '2024-01-14',
        startTime: '09:00',
        endTime: '17:00',
        status: 'completed',
        type: 'full_day',
        location: 'Main Restaurant',
        position: 'Waiter',
        checkInTime: '08:56',
        checkOutTime: '17:08',
        totalHours: 8.2,
        breakTime: 60,
        overtime: 0.2,
        hourlyRate: 250,
        totalEarnings: 2050,
        tips: 480,
        notes: 'Busy Sunday, family day'
      },
      {
        id: 8,
        date: '2024-01-13',
        startTime: '18:00',
        endTime: '23:00',
        status: 'completed',
        type: 'evening',
        location: 'Main Restaurant',
        position: 'Waiter',
        checkInTime: '17:57',
        checkOutTime: '23:05',
        totalHours: 5.13,
        breakTime: 30,
        overtime: 0.13,
        hourlyRate: 250,
        totalEarnings: 1282.5,
        tips: 290,
        notes: 'Saturday night rush'
      },
      {
        id: 9,
        date: '2024-01-12',
        startTime: '09:00',
        endTime: '17:00',
        status: 'completed',
        type: 'full_day',
        location: 'Main Restaurant',
        position: 'Waiter',
        checkInTime: '08:54',
        checkOutTime: '17:06',
        totalHours: 8.2,
        breakTime: 60,
        overtime: 0.2,
        hourlyRate: 250,
        totalEarnings: 2050,
        tips: 410,
        notes: 'Regular Friday'
      },
      {
        id: 10,
        date: '2024-01-11',
        startTime: '18:00',
        endTime: '23:00',
        status: 'completed',
        type: 'evening',
        location: 'Main Restaurant',
        position: 'Waiter',
        checkInTime: '17:58',
        checkOutTime: '23:03',
        totalHours: 5.08,
        breakTime: 30,
        overtime: 0.08,
        hourlyRate: 250,
        totalEarnings: 1270,
        tips: 330,
        notes: 'Good tips from corporate group'
      }
    ];

    const mockCurrentShift = {
      id: 11,
      date: '2024-01-21',
      startTime: '09:00',
      endTime: '17:00',
      status: 'active',
      type: 'full_day',
      location: 'Main Restaurant',
      position: 'Waiter',
      checkInTime: '08:58',
      checkOutTime: null,
      totalHours: 0,
      breakTime: 0,
      overtime: 0,
      hourlyRate: 250,
      totalEarnings: 0,
      tips: 0,
      notes: 'Current shift in progress'
    };

    const mockStats = {
      totalShifts: 10,
      completedShifts: 10,
      activeShifts: 1,
      totalHours: 68.18,
      totalEarnings: 17045,
      totalTips: 3630,
      averageHoursPerShift: 6.82,
      averageEarningsPerShift: 1704.5,
      thisWeekHours: 40.5,
      thisWeekEarnings: 10125,
      thisWeekTips: 2150
    };

    setShifts(mockShifts);
    setCurrentShift(mockCurrentShift);
    setStats(mockStats);
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
      active: { color: 'bg-green-100 text-green-800', icon: <Clock className="h-3 w-3" /> },
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

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shift Management</h1>
            <p className="text-gray-600 mt-1">View your shifts and check-in/out</p>
          </div>
          {currentShift && currentShift.status === 'active' ? (
            <button className="btn-secondary flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Check Out
            </button>
          ) : (
            <button className="btn-primary flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Check In
            </button>
          )}
        </div>

        {/* Current Shift Card */}
        {currentShift && currentShift.status === 'active' && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Current Shift</h3>
                  <p className="text-sm text-gray-600">{formatDate(currentShift.date, 'MMMM dd, yyyy')}</p>
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
                <p className="text-xs text-gray-500">Checked in at {currentShift.checkInTime}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tips</p>
                <p className="text-2xl font-bold text-gray-900">₹{(stats.totalTips || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{(stats.thisWeekHours || 0).toFixed(1)}h</div>
              <div className="text-sm text-gray-600">Hours Worked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{(stats.thisWeekEarnings || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹{(stats.thisWeekTips || 0).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Tips</div>
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

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Tips</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">₹{(shift.tips || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
