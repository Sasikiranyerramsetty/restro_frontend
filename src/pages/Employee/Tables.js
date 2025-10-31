import React, { useState, useEffect } from 'react';
import { 
  Table, MapPin, Users, Clock, CheckCircle, AlertCircle, 
  X, Search, Filter, Eye, Edit, User, Phone, Calendar
} from 'lucide-react';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import { formatDate } from '../../utils';

const EmployeeTables = () => {
  const [tables, setTables] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    // Static mock data removed. Integrate with real table service here when available.
    setTables([]);
    setStats({});
  }, []);

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (table.customer && table.customer.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || table.location === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
      occupied: { color: 'bg-red-100 text-red-800', icon: <Users className="h-3 w-3" /> },
      reserved: { color: 'bg-yellow-100 text-yellow-800', icon: <Calendar className="h-3 w-3" /> },
      cleaning: { color: 'bg-blue-100 text-blue-800', icon: <AlertCircle className="h-3 w-3" /> },
      maintenance: { color: 'bg-gray-100 text-gray-800', icon: <X className="h-3 w-3" /> }
    };
    return statusConfig[status] || statusConfig.available;
  };

  const getTypeColor = (type) => {
    const typeColors = {
      'Standard': 'bg-blue-100 text-blue-800',
      'Booth': 'bg-purple-100 text-purple-800',
      'Private': 'bg-indigo-100 text-indigo-800',
      'Outdoor': 'bg-green-100 text-green-800'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text restro-brand">Table Management</h1>
            <p className="text-gray-600 mt-2 text-lg">Manage table status and assignments</p>
          </div>
          <button className="btn-outline flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            View Layout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Table className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tables</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTables}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableTables}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-gray-900">{stats.occupiedTables}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reserved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.reservedTables}</p>
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
                  placeholder="Search tables by number or customer name..."
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
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                <option value="Main Dining">Main Dining</option>
                <option value="Private Room">Private Room</option>
                <option value="Patio">Patio</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTables.map((table) => {
            const statusConfig = getStatusBadge(table.status);
            return (
              <div key={table.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Table className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">{table.number}</h3>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                    {statusConfig.icon}
                    <span className="ml-1 capitalize">{table.status}</span>
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Capacity:</span>
                    <span className="text-sm font-medium text-gray-900">{table.capacity} people</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(table.type)}`}>
                      {table.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm font-medium text-gray-900">{table.location}</span>
                  </div>

                  {table.customer && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{table.customer}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{table.customerPhone}</span>
                      </div>
                      {table.assignedWaiter && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Waiter: {table.assignedWaiter}</span>
                        </div>
                      )}
                      {table.seatedAt && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Seated: {formatDate(table.seatedAt, 'HH:mm')}
                          </span>
                        </div>
                      )}
                      {table.estimatedDuration && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Est: {table.estimatedDuration}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {table.notes && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">{table.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  {table.status === 'available' && (
                    <button className="flex-1 text-xs bg-green-100 text-green-600 px-3 py-1 rounded hover:bg-green-200 transition-colors">
                      Seat Customer
                    </button>
                  )}
                  {table.status === 'occupied' && (
                    <button className="flex-1 text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                      Check Order
                    </button>
                  )}
                  {table.status === 'reserved' && (
                    <button className="flex-1 text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded hover:bg-yellow-200 transition-colors">
                      Confirm Arrival
                    </button>
                  )}
                  {table.status === 'cleaning' && (
                    <button className="flex-1 text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                      Mark Clean
                    </button>
                  )}
                  <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                    <Eye className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTables;
