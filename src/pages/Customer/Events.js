import React, { useState } from 'react';
import { 
  Gift, 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  X, 
  Plus,
  Search,
  Star,
  Phone,
  Mail
} from 'lucide-react';
import DashboardLayout from '../../components/Common/DashboardLayout';
import { formatCurrency } from '../../utils';

const CustomerEvents = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Static event data
  const events = [
    {
      id: 'EVT-001',
      name: 'Wedding Reception',
      date: '2024-02-15',
      time: '18:00',
      status: 'confirmed',
      type: 'wedding',
      guestCount: 150,
      location: 'Grand Ballroom, Hotel Plaza',
      duration: 300,
      budget: 75000,
      contactPerson: 'Sarah Johnson',
      contactPhone: '+91 98765 43210',
      contactEmail: 'sarah.johnson@email.com',
      specialRequests: 'Vegetarian menu, live music setup, photo booth area',
      notes: 'Outdoor ceremony, indoor reception',
      createdAt: '2024-01-10T14:30:00Z'
    },
    {
      id: 'EVT-002',
      name: 'Corporate Annual Dinner',
      date: '2024-02-10',
      time: '19:30',
      status: 'confirmed',
      type: 'corporate',
      guestCount: 80,
      location: 'Conference Center, Business District',
      duration: 240,
      budget: 45000,
      contactPerson: 'Michael Chen',
      contactPhone: '+91 98765 43211',
      contactEmail: 'michael.chen@company.com',
      specialRequests: 'Formal dining setup, presentation area, networking space',
      notes: 'Award ceremony included',
      createdAt: '2024-01-08T10:15:00Z'
    },
    {
      id: 'EVT-003',
      name: 'Birthday Party',
      date: '2024-02-05',
      time: '16:00',
      status: 'completed',
      type: 'birthday',
      guestCount: 25,
      location: 'Private Residence, Suburb',
      duration: 180,
      budget: 15000,
      contactPerson: 'Emily Rodriguez',
      contactPhone: '+91 98765 43212',
      contactEmail: 'emily.rodriguez@email.com',
      specialRequests: 'Kids menu, birthday cake, decorations',
      notes: 'Successfully completed - excellent service',
      createdAt: '2024-01-05T16:45:00Z'
    },
    {
      id: 'EVT-004',
      name: 'Anniversary Celebration',
      date: '2024-01-28',
      time: '19:00',
      status: 'completed',
      type: 'anniversary',
      guestCount: 40,
      location: 'Garden Venue, City Park',
      duration: 210,
      budget: 25000,
      contactPerson: 'David Kumar',
      contactPhone: '+91 98765 43213',
      contactEmail: 'david.kumar@email.com',
      specialRequests: 'Romantic setup, candlelight dinner, photo session',
      notes: '25th wedding anniversary - beautiful event',
      createdAt: '2024-01-03T12:20:00Z'
    },
    {
      id: 'EVT-005',
      name: 'Graduation Party',
      date: '2024-02-20',
      time: '17:30',
      status: 'pending',
      type: 'graduation',
      guestCount: 60,
      location: 'Community Hall, University Area',
      duration: 270,
      budget: 30000,
      contactPerson: 'Lisa Thompson',
      contactPhone: '+91 98765 43214',
      contactEmail: 'lisa.thompson@email.com',
      specialRequests: 'Buffet style, graduation theme decorations, music setup',
      notes: 'Waiting for final guest count confirmation',
      createdAt: '2024-01-12T09:30:00Z'
    },
    {
      id: 'EVT-006',
      name: 'Baby Shower',
      date: '2024-01-30',
      time: '14:00',
      status: 'cancelled',
      type: 'baby-shower',
      guestCount: 20,
      location: 'Private Residence, Downtown',
      duration: 150,
      budget: 12000,
      contactPerson: 'Jennifer Lee',
      contactPhone: '+91 98765 43215',
      contactEmail: 'jennifer.lee@email.com',
      specialRequests: 'Light snacks, baby theme decorations, games area',
      notes: 'Cancelled due to health reasons',
      createdAt: '2024-01-15T11:00:00Z'
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'wedding':
        return 'bg-pink-100 text-pink-800';
      case 'corporate':
        return 'bg-blue-100 text-blue-800';
      case 'birthday':
        return 'bg-purple-100 text-purple-800';
      case 'anniversary':
        return 'bg-red-100 text-red-800';
      case 'graduation':
        return 'bg-green-100 text-green-800';
      case 'baby-shower':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesSearch = event.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Booking</h1>
            <p className="text-gray-600 mt-1">Manage your event catering and special occasions</p>
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Book New Event</span>
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
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{events.filter(e => e.status === 'confirmed').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Guests</p>
                <p className="text-2xl font-bold text-gray-900">{events.reduce((sum, e) => sum + e.guestCount, 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Gift className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{events.reduce((sum, e) => sum + e.budget, 0).toLocaleString()}
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
                  placeholder="Search events by name, type, or contact person..."
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
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                    {getStatusIcon(event.status)}
                    <span className="ml-1 capitalize">{event.status}</span>
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(event.type)}`}>
                    {event.type.replace('-', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(event.budget)}
                  </p>
                  <p className="text-xs text-gray-500">{event.date} at {event.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Event Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Guests: {event.guestCount} people</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Duration: {event.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{event.contactPerson}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{event.contactPhone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{event.contactEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {event.specialRequests && (
                <div className="mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Special Requests:</span> {event.specialRequests}
                  </p>
                </div>
              )}

              {event.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded border-l-4 border-gray-400">
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">Notes:</span> {event.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Booked on {new Date(event.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  {event.status === 'confirmed' && (
                    <>
                      <button className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                        Modify
                      </button>
                      <button className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors">
                        Cancel
                      </button>
                    </>
                  )}
                  {event.status === 'completed' && (
                    <button className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded hover:bg-green-200 transition-colors">
                      Rate Event
                    </button>
                  )}
                  <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerEvents;
