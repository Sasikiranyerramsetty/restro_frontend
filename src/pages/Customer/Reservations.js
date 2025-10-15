import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle, 
  X, 
  Plus,
  Search,
  Filter
} from 'lucide-react';
import DashboardLayout from '../../components/Common/DashboardLayout';

const CustomerReservations = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Static reservation data
  const reservations = [
    {
      id: 'RES-001',
      date: '2024-01-25',
      time: '19:00',
      status: 'confirmed',
      partySize: 4,
      tableNumber: 'T5',
      duration: 120,
      specialRequests: 'Birthday celebration, need high chair',
      contactPhone: '+91 98765 43210',
      notes: 'Anniversary dinner',
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      id: 'RES-002',
      date: '2024-01-23',
      time: '18:30',
      status: 'confirmed',
      partySize: 2,
      tableNumber: 'T2',
      duration: 90,
      specialRequests: 'Window table preferred',
      contactPhone: '+91 98765 43210',
      notes: 'Date night',
      createdAt: '2024-01-19T14:15:00Z'
    },
    {
      id: 'RES-003',
      date: '2024-01-22',
      time: '20:00',
      status: 'completed',
      partySize: 6,
      tableNumber: 'T8',
      duration: 150,
      specialRequests: 'Family gathering, vegetarian options',
      contactPhone: '+91 98765 43210',
      notes: 'Family dinner - completed successfully',
      createdAt: '2024-01-18T16:45:00Z'
    },
    {
      id: 'RES-004',
      date: '2024-01-21',
      time: '12:30',
      status: 'cancelled',
      partySize: 3,
      tableNumber: 'T3',
      duration: 60,
      specialRequests: 'Business lunch',
      contactPhone: '+91 98765 43210',
      notes: 'Cancelled due to meeting conflict',
      createdAt: '2024-01-17T09:20:00Z'
    },
    {
      id: 'RES-005',
      date: '2024-01-20',
      time: '19:30',
      status: 'completed',
      partySize: 8,
      tableNumber: 'T10',
      duration: 180,
      specialRequests: 'Corporate dinner, private area',
      contactPhone: '+91 98765 43210',
      notes: 'Team celebration - excellent service',
      createdAt: '2024-01-16T11:00:00Z'
    },
    {
      id: 'RES-006',
      date: '2024-01-19',
      time: '13:00',
      status: 'completed',
      partySize: 2,
      tableNumber: 'T1',
      duration: 75,
      specialRequests: 'Quiet corner table',
      contactPhone: '+91 98765 43210',
      notes: 'Lunch meeting - good experience',
      createdAt: '2024-01-15T08:30:00Z'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <X className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    const matchesSearch = reservation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.tableNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Table Reservations</h1>
            <p className="text-gray-600 mt-1">Manage your table bookings and reservations</p>
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
            <Plus className="h-5 w-5" />
            <span>New Reservation</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{reservations.filter(r => r.status === 'confirmed').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{reservations.filter(r => r.status === 'completed').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Party Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(reservations.reduce((sum, r) => sum + r.partySize, 0) / reservations.length).toFixed(1)}
                </p>
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
                  placeholder="Search reservations by ID, table, or notes..."
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
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">{reservation.id}</h3>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                    {getStatusIcon(reservation.status)}
                    <span className="ml-1 capitalize">{reservation.status}</span>
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {reservation.date} at {reservation.time}
                  </p>
                  <p className="text-xs text-gray-500">Table {reservation.tableNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Reservation Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Party Size: {reservation.partySize} people</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Duration: {reservation.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Table: {reservation.tableNumber}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Contact & Notes</h4>
                  <div className="space-y-1 text-sm">
                    <div className="text-gray-600">
                      <span className="font-medium">Phone:</span> {reservation.contactPhone}
                    </div>
                    {reservation.notes && (
                      <div className="text-gray-600">
                        <span className="font-medium">Notes:</span> {reservation.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {reservation.specialRequests && (
                <div className="mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Special Requests:</span> {reservation.specialRequests}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Booked on {new Date(reservation.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  {reservation.status === 'confirmed' && (
                    <>
                      <button className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                        Modify
                      </button>
                      <button className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors">
                        Cancel
                      </button>
                    </>
                  )}
                  <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerReservations;
