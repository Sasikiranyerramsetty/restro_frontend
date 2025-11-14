import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Search, Users, DollarSign, Clock, 
  CheckCircle, X, AlertCircle, Edit, Trash2, Eye, 
  User, Phone, Mail, MapPin, Star
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';

const AdminEvents = () => {
  // Custom color palette
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    time: '',
    guests: '',
    customer: '',
    contact: '',
    specialRequests: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsData, statsData] = await Promise.all([
        eventService.getEvents(),
        eventService.getEventStats()
      ]);
      if (eventsData.success) {
        setEvents(eventsData.data);
      }
      if (statsData.success) {
        setStats(statsData);
      }
    } catch (error) {
      toast.error('Failed to fetch events data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: '',
      date: '',
      time: '',
      guests: '',
      customer: '',
      contact: '',
      package: '',
      cost: '',
      specialRequests: ''
    });
    setEditingEvent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEvent = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditEvent = (event) => {
    setFormData({
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      guests: event.guests.toString(),
      customer: event.customer,
      contact: event.contact,
      package: event.package,
      cost: event.cost.toString(),
      specialRequests: event.specialRequests
    });
    setEditingEvent(event);
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const eventData = {
        ...formData,
        guests: parseInt(formData.guests),
        cost: parseFloat(formData.cost),
        status: 'pending'
      };

      if (editingEvent) {
        const response = await eventService.updateEvent(editingEvent.id, eventData);
        if (response.success) {
          toast.success('Event updated successfully');
        }
      } else {
        const response = await eventService.addEvent(eventData);
        if (response.success) {
          toast.success('Event added successfully');
        }
      }

      setShowAddModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await eventService.deleteEvent(eventId);
        if (response.success) {
          toast.success('Event deleted successfully');
          fetchData();
        }
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleStatusUpdate = async (eventId, newStatus) => {
    try {
      const response = await eventService.updateEventStatus(eventId, newStatus);
      if (response.success) {
        toast.success('Event status updated');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update event status');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { 
        bg: colors.lightBlue, 
        text: colors.darkNavy, 
        border: colors.mediumBlue, 
        icon: <CheckCircle className="h-3 w-3" /> 
      },
      pending: { 
        bg: colors.mediumBlue, 
        text: colors.cream, 
        border: colors.mediumBlue, 
        icon: <Clock className="h-3 w-3" /> 
      },
      cancelled: { 
        bg: colors.red, 
        text: colors.cream, 
        border: colors.red, 
        icon: <X className="h-3 w-3" /> 
      }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return {
      ...config,
      style: {
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
        borderWidth: '2px'
      }
    };
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      Birthday: { bg: colors.lightBlue, text: colors.darkNavy, border: colors.mediumBlue },
      Corporate: { bg: colors.mediumBlue, text: colors.cream, border: colors.mediumBlue },
      Anniversary: { bg: colors.lightBlue, text: colors.darkNavy, border: colors.mediumBlue },
      Wedding: { bg: colors.red, text: colors.cream, border: colors.red },
      Conference: { bg: colors.cream, text: colors.darkNavy, border: colors.lightBlue },
      Catering: { bg: colors.red, text: colors.cream, border: colors.red }
    };
    const config = typeConfig[type] || { bg: colors.cream, text: colors.darkNavy, border: colors.lightBlue };
    return {
      backgroundColor: config.bg,
      color: config.text,
      borderColor: config.border,
      borderWidth: '2px'
    };
  };


  const getStats = () => {
    const total = events.length;
    const confirmed = events.filter(e => e.status === 'confirmed').length;
    const pending = events.filter(e => e.status === 'pending').length;
    const cancelled = events.filter(e => e.status === 'cancelled').length;
    const totalRevenue = events.reduce((sum, e) => sum + e.cost, 0);
    
    return { total, confirmed, pending, cancelled, totalRevenue };
  };

  const eventStats = getStats();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.red }}
            ></div>
            <p className="font-semibold" style={{ color: colors.darkNavy }}>Loading events...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', padding: '2rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-4xl font-bold drop-shadow-lg mb-2" 
              style={{ 
                fontFamily: 'Rockybilly, sans-serif', 
                letterSpacing: '0.05em',
                color: colors.darkNavy 
              }}
            >
              Event Management
            </h1>
            <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '200px' }}></div>
          </div>
          <button 
            onClick={handleAddEvent}
            className="px-8 py-3 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
            style={{ backgroundColor: colors.red }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f3e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.red}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Event
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Events</p>
                <p className="text-3xl font-bold" style={{ color: colors.mediumBlue }}>{eventStats.total}</p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Calendar className="h-8 w-8" style={{ color: colors.mediumBlue }} />
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
                <p className="text-sm font-semibold mb-2" style={{ color: colors.cream }}>Confirmed</p>
                <p className="text-3xl font-bold" style={{ color: colors.cream }}>{eventStats.confirmed}</p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <CheckCircle className="h-8 w-8" style={{ color: colors.mediumBlue }} />
              </div>
            </div>
          </div>

          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
            style={{ 
              animationDelay: '0.3s',
              background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
              borderColor: colors.darkNavy,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Pending</p>
                <p className="text-3xl font-bold" style={{ color: colors.darkNavy }}>{eventStats.pending}</p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Clock className="h-8 w-8" style={{ color: colors.darkNavy }} />
              </div>
            </div>
          </div>

          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
            style={{ 
              animationDelay: '0.4s',
              background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
              borderColor: colors.red,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Revenue</p>
                <p className="text-3xl font-bold" style={{ color: colors.red }}>₹{eventStats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <DollarSign className="h-8 w-8" style={{ color: colors.red }} />
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
                  placeholder="Search events by title, customer, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl font-medium transition-all"
                style={{ 
                  borderColor: colors.lightBlue,
                  backgroundColor: 'white',
                  color: colors.darkNavy
                }}
                onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div 
          className="rounded-2xl shadow-xl overflow-hidden border-2"
          style={{ 
            backgroundColor: colors.cream,
            borderColor: colors.mediumBlue,
            borderWidth: '2px'
          }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ backgroundColor: colors.lightBlue }}>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider rounded-l-lg" style={{ color: colors.darkNavy }}>
                    Event Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                    Guests
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: colors.darkNavy }}>
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider rounded-r-lg" style={{ color: colors.darkNavy }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => {
                  const statusConfig = getStatusBadge(event.status);
                  const typeStyle = getTypeBadge(event.type);
                  return (
                    <tr 
                      key={event.id} 
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
                          <div className="text-sm font-bold" style={{ color: colors.darkNavy }}>{event.title}</div>
                          <div className="text-sm mt-1">
                            <span 
                              className="inline-flex px-3 py-1 text-xs font-bold rounded-full border-2"
                              style={typeStyle}
                            >
                              {event.type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold" style={{ color: colors.darkNavy }}>{event.customer}</div>
                          <div className="text-sm flex items-center" style={{ color: colors.mediumBlue }}>
                            <Phone className="h-3 w-3 mr-1" />
                            {event.contact}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold" style={{ color: colors.darkNavy }}>{event.date}</div>
                          <div className="text-sm" style={{ color: colors.mediumBlue }}>{event.time}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold" style={{ color: colors.darkNavy }}>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" style={{ color: colors.mediumBlue }} />
                          {event.guests}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-full uppercase tracking-wide border-2"
                          style={statusConfig.style}
                        >
                          {statusConfig.icon}
                          <span className="ml-1">{event.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="transition-colors duration-200 hover:scale-110 transform"
                            style={{ color: colors.mediumBlue }}
                            onMouseEnter={(e) => e.target.style.color = colors.darkNavy}
                            onMouseLeave={(e) => e.target.style.color = colors.mediumBlue}
                            title="Edit Event"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="transition-colors duration-200 hover:scale-110 transform"
                            style={{ color: colors.red }}
                            onMouseEnter={(e) => e.target.style.color = '#d32f3e'}
                            onMouseLeave={(e) => e.target.style.color = colors.red}
                            title="Delete Event"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <select
                            value={event.status}
                            onChange={(e) => handleStatusUpdate(event.id, e.target.value)}
                            className="text-xs border-2 rounded-lg px-3 py-2 font-bold transition-all"
                            style={{ 
                              borderColor: colors.lightBlue,
                              backgroundColor: 'white',
                              color: colors.darkNavy
                            }}
                            onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                            onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
              className="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2"
              style={{ 
                backgroundColor: colors.cream,
                borderColor: colors.mediumBlue,
                borderWidth: '2px'
              }}
            >
              <div 
                className="flex items-center justify-between p-6 border-b-2"
                style={{ borderColor: colors.mediumBlue }}
              >
                <h3 className="text-lg font-bold" style={{ color: colors.darkNavy }}>
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="transition-colors duration-200"
                  style={{ color: colors.red }}
                  onMouseEnter={(e) => e.target.style.color = '#d32f3e'}
                  onMouseLeave={(e) => e.target.style.color = colors.red}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1" style={{ color: colors.darkNavy }}>
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 rounded-lg transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                      onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1" style={{ color: colors.darkNavy }}>
                      Event Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 rounded-lg transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: 'white',
                        color: colors.darkNavy
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                      onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    >
                      <option value="">Select Type</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Conference">Conference</option>
                      <option value="Catering">Catering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1" style={{ color: colors.darkNavy }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 rounded-lg transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                      onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1" style={{ color: colors.darkNavy }}>
                      Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 rounded-lg transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                      onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1" style={{ color: colors.darkNavy }}>
                      Number of Guests *
                    </label>
                    <input
                      type="number"
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border-2 rounded-lg transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                      onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    />
                  </div>


                  <div>
                    <label className="block text-sm font-bold mb-1" style={{ color: colors.darkNavy }}>
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      name="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border-2 rounded-lg transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                      onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1" style={{ color: colors.darkNavy }}>
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.mediumBlue }} />
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 py-2 border-2 rounded-lg transition-all"
                        style={{ 
                          borderColor: colors.lightBlue,
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                        onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                </div>

                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: colors.darkNavy }}>
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border-2 rounded-lg transition-all"
                    style={{ 
                      borderColor: colors.lightBlue,
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                    onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    placeholder="Any special requirements or requests..."
                  />
                </div>

                <div 
                  className="flex items-center justify-end space-x-3 pt-4 border-t-2"
                  style={{ borderColor: colors.mediumBlue }}
                >
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 text-sm font-bold rounded-lg border-2 transition-all"
                    style={{ 
                      color: colors.darkNavy,
                      backgroundColor: colors.lightBlue,
                      borderColor: colors.mediumBlue
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = colors.mediumBlue;
                      e.target.style.color = colors.cream;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = colors.lightBlue;
                      e.target.style.color = colors.darkNavy;
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 text-sm font-bold text-white rounded-lg transition-all flex items-center shadow-lg"
                    style={{ backgroundColor: colors.red }}
                    onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = '#d32f3e')}
                    onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = colors.red)}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        {editingEvent ? 'Update Event' : 'Add Event'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
