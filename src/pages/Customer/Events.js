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
  Mail,
  Utensils,
  Truck
} from 'lucide-react';
import CustomerLayout from '../../components/Customer/CustomerLayout';
import { formatCurrency } from '../../utils';

const CustomerEvents = () => {
  // Custom color palette (matching admin)
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [formData, setFormData] = useState({
    bookingType: '',
    eventName: '',
    eventType: '',
    date: '',
    time: '',
    guestCount: '',
    location: '',
    budget: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    specialRequests: ''
  });

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
        return { bg: colors.lightBlue, text: colors.darkNavy, border: colors.mediumBlue };
      case 'completed':
        return { bg: colors.cream, text: colors.darkNavy, border: colors.mediumBlue };
      case 'cancelled':
        return { bg: '#FEE2E2', text: colors.red, border: colors.red };
      case 'pending':
        return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
      default:
        return { bg: colors.cream, text: colors.darkNavy, border: colors.mediumBlue };
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
        return { bg: '#FCE7F3', text: '#9F1239', border: '#EC4899' };
      case 'corporate':
        return { bg: colors.lightBlue, text: colors.darkNavy, border: colors.mediumBlue };
      case 'birthday':
        return { bg: '#F3E8FF', text: '#6B21A8', border: '#9333EA' };
      case 'anniversary':
        return { bg: '#FEE2E2', text: colors.red, border: colors.red };
      case 'graduation':
        return { bg: colors.cream, text: colors.darkNavy, border: colors.mediumBlue };
      case 'baby-shower':
        return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
      default:
        return { bg: colors.cream, text: colors.darkNavy, border: colors.mediumBlue };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate booking type is selected
    if (!formData.bookingType) {
      alert('Please select a booking type (Dine-In or Catering)');
      return;
    }
    
    // In a real app, this would call an API
    console.log('New event booking:', formData);
    alert(`${formData.bookingType === 'dinein' ? 'Dine-In' : 'Catering'} event booking request submitted! Our event coordinator will contact you shortly.`);
    setShowNewEventModal(false);
    setFormData({
      bookingType: '',
      eventName: '',
      eventType: '',
      date: '',
      time: '',
      guestCount: '',
      location: '',
      budget: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      specialRequests: ''
    });
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
    <CustomerLayout>
      <div className="space-y-6" style={{ backgroundColor: colors.cream, minHeight: '100vh', padding: '2rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 
              className="text-3xl font-bold restro-brand"
              style={{
                fontFamily: "'BBH Sans Bartle', sans-serif",
                background: `linear-gradient(135deg, ${colors.red} 0%, ${colors.darkNavy} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.5rem'
              }}
            >
              Event Booking
            </h1>
            <div 
              style={{
                height: '3px',
                width: '150px',
                background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.darkNavy} 100%)`,
                borderRadius: '2px'
              }}
            />
          </div>
          <button 
            onClick={() => setShowNewEventModal(true)}
            style={{
              background: `linear-gradient(135deg, ${colors.red} 0%, ${colors.darkNavy} 100%)`,
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = `0 4px 12px rgba(29, 53, 87, 0.3)`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Plus className="h-5 w-5" />
            <span>Book New Event</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div 
            style={{
              background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: `2px solid ${colors.mediumBlue}`,
              boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 53, 87, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 53, 87, 0.1)';
            }}
          >
            <div className="flex items-center">
              <div style={{ padding: '0.5rem', background: colors.mediumBlue, borderRadius: '0.5rem' }}>
                <Calendar className="h-6 w-6" style={{ color: 'white' }} />
              </div>
              <div className="ml-4">
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy }}>Total Events</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.darkNavy }}>{events.length}</p>
              </div>
            </div>
          </div>

          <div 
            style={{
              background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`,
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: `2px solid ${colors.darkNavy}`,
              boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 53, 87, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 53, 87, 0.1)';
            }}
          >
            <div className="flex items-center">
              <div style={{ padding: '0.5rem', background: colors.darkNavy, borderRadius: '0.5rem' }}>
                <CheckCircle className="h-6 w-6" style={{ color: 'white' }} />
              </div>
              <div className="ml-4">
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white' }}>Confirmed</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{events.filter(e => e.status === 'confirmed').length}</p>
              </div>
            </div>
          </div>

          <div 
            style={{
              background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: `2px solid ${colors.red}`,
              boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 53, 87, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 53, 87, 0.1)';
            }}
          >
            <div className="flex items-center">
              <div style={{ padding: '0.5rem', background: colors.red, borderRadius: '0.5rem' }}>
                <Users className="h-6 w-6" style={{ color: 'white' }} />
              </div>
              <div className="ml-4">
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy }}>Total Guests</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.darkNavy }}>{events.reduce((sum, e) => sum + e.guestCount, 0)}</p>
              </div>
            </div>
          </div>

          <div 
            style={{
              background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.cream} 100%)`,
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: `2px solid ${colors.mediumBlue}`,
              boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 53, 87, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 53, 87, 0.1)';
            }}
          >
            <div className="flex items-center">
              <div style={{ padding: '0.5rem', background: colors.mediumBlue, borderRadius: '0.5rem' }}>
                <Gift className="h-6 w-6" style={{ color: 'white' }} />
              </div>
              <div className="ml-4">
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy }}>Total Budget</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.darkNavy }}>
                  ₹{events.reduce((sum, e) => sum + e.budget, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div 
          style={{
            background: `linear-gradient(135deg, ${colors.cream} 0%, white 100%)`,
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: `2px solid ${colors.lightBlue}`,
            boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)'
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                <input
                  type="text"
                  placeholder="Search events by name, type, or contact person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                    border: `2px solid ${colors.lightBlue}`,
                    borderRadius: '0.5rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.mediumBlue;
                    e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.lightBlue;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: `2px solid ${colors.lightBlue}`,
                  borderRadius: '0.5rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'white',
                  color: colors.darkNavy
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.mediumBlue;
                  e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.lightBlue;
                  e.target.style.boxShadow = 'none';
                }}
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
          {filteredEvents.map((event) => {
            const statusColors = getStatusColor(event.status);
            const typeColors = getTypeColor(event.type);
            return (
            <div 
              key={event.id} 
              style={{
                background: `linear-gradient(135deg, ${colors.cream} 0%, white 100%)`,
                borderRadius: '0.5rem',
                border: `2px solid ${colors.lightBlue}`,
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 53, 87, 0.2)';
                e.currentTarget.style.borderColor = colors.mediumBlue;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 53, 87, 0.1)';
                e.currentTarget.style.borderColor = colors.lightBlue;
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-wrap">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-5 w-5" style={{ color: colors.mediumBlue }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: colors.darkNavy }}>{event.name}</h3>
                  </div>
                  <span 
                    className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full"
                    style={{
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                      border: `1px solid ${statusColors.border}`
                    }}
                  >
                    {getStatusIcon(event.status)}
                    <span className="ml-1 capitalize">{event.status}</span>
                  </span>
                  <span 
                    className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    style={{
                      backgroundColor: typeColors.bg,
                      color: typeColors.text,
                      border: `1px solid ${typeColors.border}`
                    }}
                  >
                    {event.type.replace('-', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy }}>
                    {formatCurrency(event.budget)}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: colors.mediumBlue }}>{event.date} at {event.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>Event Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" style={{ color: colors.mediumBlue }} />
                      <span style={{ color: colors.darkNavy }}>Guests: {event.guestCount} people</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" style={{ color: colors.mediumBlue }} />
                      <span style={{ color: colors.darkNavy }}>Duration: {event.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" style={{ color: colors.mediumBlue }} />
                      <span style={{ color: colors.darkNavy }}>{event.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" style={{ color: colors.mediumBlue }} />
                      <span style={{ color: colors.darkNavy }}>{event.contactPerson}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" style={{ color: colors.mediumBlue }} />
                      <span style={{ color: colors.darkNavy }}>{event.contactPhone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" style={{ color: colors.mediumBlue }} />
                      <span style={{ color: colors.darkNavy }}>{event.contactEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {event.specialRequests && (
                <div 
                  className="mb-4 p-3 rounded"
                  style={{
                    background: colors.lightBlue,
                    borderLeft: `4px solid ${colors.mediumBlue}`
                  }}
                >
                  <p style={{ fontSize: '0.875rem', color: colors.darkNavy }}>
                    <span style={{ fontWeight: '500' }}>Special Requests:</span> {event.specialRequests}
                  </p>
                </div>
              )}

              {event.notes && (
                <div 
                  className="mb-4 p-3 rounded"
                  style={{
                    background: colors.cream,
                    borderLeft: `4px solid ${colors.mediumBlue}`
                  }}
                >
                  <p style={{ fontSize: '0.875rem', color: colors.darkNavy }}>
                    <span style={{ fontWeight: '500' }}>Notes:</span> {event.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span style={{ fontSize: '0.75rem', color: colors.mediumBlue }}>
                  Booked on {new Date(event.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  {event.status === 'confirmed' && (
                    <>
                      <button 
                        style={{
                          fontSize: '0.75rem',
                          background: colors.lightBlue,
                          color: colors.darkNavy,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          border: `1px solid ${colors.mediumBlue}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = colors.mediumBlue;
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = colors.lightBlue;
                          e.target.style.color = colors.darkNavy;
                        }}
                      >
                        Modify
                      </button>
                      <button 
                        style={{
                          fontSize: '0.75rem',
                          background: '#FEE2E2',
                          color: colors.red,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          border: `1px solid ${colors.red}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = colors.red;
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#FEE2E2';
                          e.target.style.color = colors.red;
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {event.status === 'completed' && (
                    <button 
                      style={{
                        fontSize: '0.75rem',
                        background: colors.cream,
                        color: colors.darkNavy,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.25rem',
                        border: `1px solid ${colors.mediumBlue}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = colors.mediumBlue;
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = colors.cream;
                        e.target.style.color = colors.darkNavy;
                      }}
                    >
                      Rate Event
                    </button>
                  )}
                  <button 
                    style={{
                      fontSize: '0.75rem',
                      background: colors.cream,
                      color: colors.darkNavy,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.25rem',
                      border: `1px solid ${colors.mediumBlue}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = colors.mediumBlue;
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = colors.cream;
                      e.target.style.color = colors.darkNavy;
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 mx-auto mb-4" style={{ color: colors.mediumBlue }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>No events found</h3>
            <p style={{ color: colors.mediumBlue }}>Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* New Event Modal */}
        {showNewEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
              style={{
                background: `linear-gradient(135deg, ${colors.cream} 0%, white 100%)`,
                borderRadius: '0.5rem',
                boxShadow: '0 10px 40px rgba(29, 53, 87, 0.3)',
                maxWidth: '48rem',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: `2px solid ${colors.lightBlue}`
              }}
            >
              <div 
                className="flex items-center justify-between p-6"
                style={{
                  borderBottom: `2px solid ${colors.lightBlue}`
                }}
              >
                <h3 
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: colors.darkNavy,
                    fontFamily: "'Rockybilly', 'Pacifico', 'Dancing Script', cursive, sans-serif"
                  }}
                >
                  Book New Event
                </h3>
                <button
                  onClick={() => setShowNewEventModal(false)}
                  style={{
                    color: colors.mediumBlue,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = colors.red;
                    e.target.style.transform = 'rotate(90deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = colors.mediumBlue;
                    e.target.style.transform = 'rotate(0deg)';
                  }}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>
                      Booking Type *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, bookingType: 'dinein' }))}
                        style={{
                          padding: '1rem',
                          border: `2px solid ${formData.bookingType === 'dinein' ? colors.mediumBlue : colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          textAlign: 'left',
                          transition: 'all 0.3s ease',
                          background: formData.bookingType === 'dinein' ? colors.cream : 'white',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (formData.bookingType !== 'dinein') {
                            e.target.style.borderColor = colors.mediumBlue;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.bookingType !== 'dinein') {
                            e.target.style.borderColor = colors.lightBlue;
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            background: formData.bookingType === 'dinein' ? colors.mediumBlue : colors.lightBlue
                          }}>
                            <Utensils className="h-6 w-6" style={{ color: formData.bookingType === 'dinein' ? 'white' : colors.darkNavy }} />
                          </div>
                          <div>
                            <h4 style={{ fontWeight: '600', color: colors.darkNavy }}>Dine-In Event</h4>
                            <p style={{ fontSize: '0.875rem', color: colors.mediumBlue }}>Host at our restaurant</p>
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, bookingType: 'catering' }))}
                        style={{
                          padding: '1rem',
                          border: `2px solid ${formData.bookingType === 'catering' ? colors.mediumBlue : colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          textAlign: 'left',
                          transition: 'all 0.3s ease',
                          background: formData.bookingType === 'catering' ? colors.cream : 'white',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          if (formData.bookingType !== 'catering') {
                            e.target.style.borderColor = colors.mediumBlue;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.bookingType !== 'catering') {
                            e.target.style.borderColor = colors.lightBlue;
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            background: formData.bookingType === 'catering' ? colors.mediumBlue : colors.lightBlue
                          }}>
                            <Truck className="h-6 w-6" style={{ color: formData.bookingType === 'catering' ? 'white' : colors.darkNavy }} />
                          </div>
                          <div>
                            <h4 style={{ fontWeight: '600', color: colors.darkNavy }}>Catering Service</h4>
                            <p style={{ fontSize: '0.875rem', color: colors.mediumBlue }}>We cater at your location</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                      Event Name *
                    </label>
                    <input
                      type="text"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Wedding Reception, Birthday Party, Corporate Event"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: `2px solid ${colors.lightBlue}`,
                        borderRadius: '0.5rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.mediumBlue;
                        e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.lightBlue;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                      Event Type *
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: `2px solid ${colors.lightBlue}`,
                        borderRadius: '0.5rem',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        backgroundColor: 'white',
                        color: colors.darkNavy
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.mediumBlue;
                        e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.lightBlue;
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Type</option>
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday</option>
                      <option value="corporate">Corporate</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="conference">Conference</option>
                      <option value="party">Party</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                      Number of Guests *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <input
                        type="number"
                        name="guestCount"
                        value={formData.guestCount}
                        onChange={handleInputChange}
                        required
                        min="10"
                        placeholder="Number of guests"
                        style={{
                          width: '100%',
                          paddingLeft: '2.5rem',
                          paddingRight: '0.75rem',
                          paddingTop: '0.5rem',
                          paddingBottom: '0.5rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = colors.mediumBlue;
                          e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                      Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        style={{
                          width: '100%',
                          paddingLeft: '2.5rem',
                          paddingRight: '0.75rem',
                          paddingTop: '0.5rem',
                          paddingBottom: '0.5rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = colors.mediumBlue;
                          e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                      Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          paddingLeft: '2.5rem',
                          paddingRight: '0.75rem',
                          paddingTop: '0.5rem',
                          paddingBottom: '0.5rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = colors.mediumBlue;
                          e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {formData.bookingType === 'dinein' ? (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                        <input
                          type="text"
                          value="RESTRO Restaurant"
                          disabled
                          style={{
                            width: '100%',
                            paddingLeft: '2.5rem',
                            paddingRight: '0.75rem',
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem',
                            border: `2px solid ${colors.lightBlue}`,
                            borderRadius: '0.5rem',
                            background: colors.cream,
                            color: colors.mediumBlue
                          }}
                        />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: colors.mediumBlue, marginTop: '0.25rem' }}>Event will be hosted at our restaurant</p>
                    </div>
                  ) : formData.bookingType === 'catering' ? (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                        Event Location *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your event location address"
                          style={{
                            width: '100%',
                            paddingLeft: '2.5rem',
                            paddingRight: '0.75rem',
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem',
                            border: `2px solid ${colors.lightBlue}`,
                            borderRadius: '0.5rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = colors.mediumBlue;
                            e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = colors.lightBlue;
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: colors.mediumBlue, marginTop: '0.25rem' }}>We will cater at your specified location</p>
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.lightBlue }} />
                        <input
                          type="text"
                          disabled
                          placeholder="Select booking type first"
                          style={{
                            width: '100%',
                            paddingLeft: '2.5rem',
                            paddingRight: '0.75rem',
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem',
                            border: `2px solid ${colors.lightBlue}`,
                            borderRadius: '0.5rem',
                            background: colors.cream,
                            color: colors.lightBlue
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                      Budget (₹)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="Estimated budget"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: `2px solid ${colors.lightBlue}`,
                        borderRadius: '0.5rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.mediumBlue;
                        e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.lightBlue;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                      placeholder="Full name"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: `2px solid ${colors.lightBlue}`,
                        borderRadius: '0.5rem',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.mediumBlue;
                        e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.lightBlue;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                      Contact Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 98765 43210"
                        style={{
                          width: '100%',
                          paddingLeft: '2.5rem',
                          paddingRight: '0.75rem',
                          paddingTop: '0.5rem',
                          paddingBottom: '0.5rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = colors.mediumBlue;
                          e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                      Contact Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        required
                        placeholder="email@example.com"
                        style={{
                          width: '100%',
                          paddingLeft: '2.5rem',
                          paddingRight: '0.75rem',
                          paddingTop: '0.5rem',
                          paddingBottom: '0.5rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = colors.mediumBlue;
                          e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.25rem' }}>
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Any special requirements, dietary restrictions, decoration preferences, etc."
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: `2px solid ${colors.lightBlue}`,
                        borderRadius: '0.5rem',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        resize: 'vertical'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.mediumBlue;
                        e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.lightBlue;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewEventModal(false)}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: colors.darkNavy,
                      background: colors.cream,
                      border: `2px solid ${colors.lightBlue}`,
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = colors.lightBlue;
                      e.target.style.borderColor = colors.mediumBlue;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = colors.cream;
                      e.target.style.borderColor = colors.lightBlue;
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'white',
                      background: `linear-gradient(135deg, ${colors.red} 0%, ${colors.darkNavy} 100%)`,
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = `0 4px 12px rgba(29, 53, 87, 0.3)`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Submit Event Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerEvents;
