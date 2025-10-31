import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye,
  UserCheck,
  UserX,
  Phone,
  DollarSign,
  Star
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { formatCurrency, formatDate } from '../../utils';
import customerService from '../../services/customerService';
import toast from 'react-hot-toast';

const AdminCustomers = () => {
  // Custom color palette
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [customersResult, statsResult] = await Promise.all([
          customerService.getCustomers(),
          customerService.getCustomerStats()
        ]);
        setCustomers(customersResult);
        setStats(statsResult);
      } catch (error) {
        // Error fetching customers
        toast.error('Failed to fetch customers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (customerId, newStatus) => {
    try {
      const result = await customerService.updateCustomerStatus(customerId, newStatus);
      if (result.success) {
        setCustomers(customers.map(customer => 
          customer.id === customerId ? result.data : customer
        ));
        toast.success(`Customer status updated to ${newStatus}`);
      }
    } catch (error) {
      // Error updating customer status
      toast.error('Failed to update customer status');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'active') {
      return {
        backgroundColor: colors.lightBlue,
        color: colors.darkNavy,
        borderColor: colors.mediumBlue,
        borderWidth: '2px'
      };
    } else {
      return {
        backgroundColor: colors.red,
        color: colors.cream,
        borderColor: colors.red,
        borderWidth: '2px'
      };
    }
  };

  const getLoyaltyLevel = (points) => {
    if (points >= 1000) return { level: 'Gold', color: 'text-yellow-600' };
    if (points >= 500) return { level: 'Silver', color: 'text-gray-600' };
    return { level: 'Bronze', color: 'text-orange-600' };
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.red }}
            ></div>
            <p className="font-semibold" style={{ color: colors.darkNavy }}>Loading customers...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', padding: '2rem' }}>
        {/* Header */}
        <div className="animate-slide-up">
          <h1 
            className="text-4xl font-bold drop-shadow-lg mb-2" 
            style={{ 
              fontFamily: 'Rockybilly, sans-serif', 
              letterSpacing: '0.05em',
              color: colors.darkNavy 
            }}
          >
            Customer Management
          </h1>
          <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '220px' }}></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
            style={{ 
              animationDelay: '0.1s',
              background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
              borderColor: colors.mediumBlue,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Customers</p>
                <p className="text-3xl font-bold" style={{ color: colors.mediumBlue }}>{stats.total}</p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Users className="h-8 w-8" style={{ color: colors.mediumBlue }} />
              </div>
            </div>
          </div>

          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
            style={{ 
              animationDelay: '0.2s',
              background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`,
              borderColor: colors.mediumBlue,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: colors.cream }}>Active Customers</p>
                <p className="text-3xl font-bold" style={{ color: colors.cream }}>{stats.active}</p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <UserCheck className="h-8 w-8" style={{ color: colors.mediumBlue }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div 
          className="rounded-2xl shadow-lg p-6 animate-slide-up animate-delay-200 border-2"
          style={{ 
            backgroundColor: colors.cream,
            borderColor: colors.mediumBlue,
            borderWidth: '2px'
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all"
                  style={{ 
                    borderColor: colors.lightBlue,
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                  onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" style={{ color: colors.mediumBlue }} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border-2 rounded-xl font-medium transition-all"
                style={{ 
                  borderColor: colors.lightBlue,
                  backgroundColor: 'white',
                  color: colors.darkNavy
                }}
                onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div 
          className="rounded-2xl shadow-xl overflow-hidden border-2"
          style={{ 
            backgroundColor: colors.cream,
            borderColor: colors.mediumBlue,
            borderWidth: '2px'
          }}
        >
          <div 
            className="px-6 py-4 border-b-2"
            style={{ borderColor: colors.mediumBlue }}
          >
            <h3 className="text-xl font-bold" style={{ color: colors.darkNavy }}>Customer List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ backgroundColor: colors.lightBlue }}>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider rounded-l-lg"
                    style={{ color: colors.darkNavy }}
                  >
                    Customer
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors.darkNavy }}
                  >
                    Contact
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors.darkNavy }}
                  >
                    Orders
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors.darkNavy }}
                  >
                    Total Spent
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors.darkNavy }}
                  >
                    Status
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider rounded-r-lg"
                    style={{ color: colors.darkNavy }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => {
                  const loyalty = getLoyaltyLevel(customer.loyaltyPoints);
                  return (
                    <tr 
                      key={customer.id} 
                      className="transition-colors border-b"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: index % 2 === 0 ? colors.cream : 'rgba(168, 218, 220, 0.2)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.lightBlue}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? colors.cream : 'rgba(168, 218, 220, 0.2)'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold" style={{ color: colors.darkNavy }}>{customer.name}</div>
                          <div className="text-sm" style={{ color: colors.mediumBlue }}>ID: #{customer.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm" style={{ color: colors.darkNavy }}>{customer.email}</div>
                        <div className="text-sm flex items-center" style={{ color: colors.mediumBlue }}>
                          <Phone className="h-3 w-3 mr-1" />
                          {customer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold" style={{ color: colors.darkNavy }}>{customer.totalOrders}</div>
                        <div className="text-sm" style={{ color: colors.mediumBlue }}>
                          Last: {formatDate(customer.lastOrder, 'MMM dd')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold" style={{ color: colors.darkNavy }}>
                          {formatCurrency(customer.totalSpent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold" style={{ color: colors.darkNavy }}>{customer.loyaltyPoints} pts</div>
                        <div className="text-sm" style={{ color: loyalty.level === 'Gold' ? '#F59E0B' : loyalty.level === 'Silver' ? colors.mediumBlue : '#F97316' }}>{loyalty.level}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border-2"
                          style={getStatusColor(customer.status)}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button 
                            className="transition-colors duration-200 hover:scale-110 transform"
                            style={{ color: colors.mediumBlue }}
                            onMouseEnter={(e) => e.target.style.color = colors.darkNavy}
                            onMouseLeave={(e) => e.target.style.color = colors.mediumBlue}
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(customer.id, customer.status === 'active' ? 'inactive' : 'active')}
                            className="transition-colors duration-200 hover:scale-110 transform"
                            style={{ color: customer.status === 'active' ? colors.red : colors.mediumBlue }}
                            onMouseEnter={(e) => e.target.style.color = customer.status === 'active' ? '#d32f3e' : colors.darkNavy}
                            onMouseLeave={(e) => e.target.style.color = customer.status === 'active' ? colors.red : colors.mediumBlue}
                          >
                            {customer.status === 'active' ? <UserX className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;