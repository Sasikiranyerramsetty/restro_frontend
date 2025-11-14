import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle, 
  X, 
  Plus,
  Search,
  Loader2,
  ChevronDown
} from 'lucide-react';
import CustomerLayout from '../../components/Customer/CustomerLayout';
import reservationService from '../../services/reservationService';
import toast from 'react-hot-toast';

const CustomerReservations = () => {
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
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [tableSelectionMode, setTableSelectionMode] = useState('auto'); // 'auto' or 'manual'
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    partySize: '',
    tableNumber: '',
    specialRequests: '',
    contactPhone: '',
    customerName: ''
  });
  const [timePeriod, setTimePeriod] = useState('PM'); // 'AM' or 'PM'

  // Fetch reservations on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Check availability when date, time, or party size changes
  useEffect(() => {
    if (formData.date && formData.time && formData.partySize) {
      checkAvailability();
    } else {
      setAvailableTables([]);
    }
  }, [formData.date, formData.time, formData.partySize]);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await reservationService.getReservations();
      if (response.success) {
        setReservations(response.data || []);
      } else {
        toast.error(response.error || 'Failed to fetch reservations');
        setReservations([]);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Failed to fetch reservations');
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!formData.date || !formData.time || !formData.partySize) {
      return;
    }

    setIsCheckingAvailability(true);
    try {
      const response = await reservationService.checkAvailability(
        formData.date,
        formData.time,
        parseInt(formData.partySize)
      );

      if (response.success) {
        setAvailableTables(response.data.available_tables || []);
        if (tableSelectionMode === 'auto' && response.data.available_tables?.length > 0) {
          // Auto-select the best table
          setFormData(prev => ({
            ...prev,
            tableNumber: response.data.available_tables[0].number
          }));
        }
      } else {
        setAvailableTables([]);
        if (tableSelectionMode === 'manual') {
          toast.error(response.error || 'No tables available');
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailableTables([]);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Calculate min and max dates (today to 7 days from today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 6);
    return maxDate.toISOString().split('T')[0];
  };

  // Get min time based on selected date
  const getMinTime = () => {
    if (!formData.date) return '11:00';
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const isToday = formData.date === todayStr;
    
    if (isToday) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const minAllowedTimeInMinutes = 11 * 60; // 11:00
      const maxAllowedTimeInMinutes = 22 * 60;
      
      if (currentTimeInMinutes < minAllowedTimeInMinutes) {
        return '11:00';
      }
      
      if (currentTimeInMinutes >= maxAllowedTimeInMinutes) {
        return '22:00';
      }
      
      // Round up to next hour
      const minTime = new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour
      const minHours = minTime.getHours();
      
      if (minHours >= 22) {
        return '22:00';
      }
      
      return `${String(minHours).padStart(2, '0')}:00`;
    }
    
    return '11:00';
  };

  const getMaxTime = () => {
    return '22:00';
  };

  // Generate time slots organized by hour groups (1-hour intervals)
  const generateTimeSlots = () => {
    const minTime = getMinTime(); // Get minimum allowed time
    const maxTime = getMaxTime(); // Get maximum allowed time (22:00)
    
    // Parse min time
    const [minHour, minMinute] = minTime.split(':').map(Number);
    const minTimeInMinutes = minHour * 60 + minMinute;
    
    // Parse max time
    const [maxHour, maxMinute] = maxTime.split(':').map(Number);
    const maxTimeInMinutes = maxHour * 60 + maxMinute;
    
    const groups = {};
    
    // Generate slots from 11:00 to 22:00 (1-hour intervals only)
    for (let hour = 11; hour <= 22; hour++) {
      const minute = 0; // Only :00 minutes, no :30
      
      const timeInMinutes = hour * 60 + minute;
      
      // Only include times within allowed range
      if (timeInMinutes >= minTimeInMinutes && timeInMinutes <= maxTimeInMinutes) {
        const time24 = `${String(hour).padStart(2, '0')}:00`;
        
        // Convert to 12-hour format
        let hour12 = hour;
        let ampm = 'AM';
        if (hour === 0) {
          hour12 = 12;
        } else if (hour === 12) {
          ampm = 'PM';
        } else if (hour > 12) {
          hour12 = hour - 12;
          ampm = 'PM';
        }
        
        const slot = {
          value: time24,
          label: `${hour12}:00 ${ampm}`
        };
        
        // Group by hour (e.g., "11 AM", "12 PM", "1 PM", "2 PM")
        const groupKey = `${hour12} ${ampm}`;
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(slot);
      }
    }
    
    return groups;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' };
      case 'completed':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: colors.mediumBlue };
      case 'cancelled':
        return { bg: 'rgba(230, 57, 70, 0.1)', text: colors.red };
      case 'pending':
        return { bg: 'rgba(234, 179, 8, 0.1)', text: '#ca8a04' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' };
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate date is within 7 days
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 6);
    
    if (selectedDate < today || selectedDate > maxDate) {
      toast.error('Please select a date within the next 7 days.');
      return;
    }
    
    // Validate time
    const [hours, minutes] = formData.time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const minTimeInMinutes = 11 * 60; // 11:00
    const maxTimeInMinutes = 22 * 60;
    
    if (timeInMinutes < minTimeInMinutes) {
      toast.error('Reservations are only available from 11:00 AM onwards.');
      return;
    }
    if (timeInMinutes > maxTimeInMinutes) {
      toast.error('Reservations are only available until 10:00 PM.');
      return;
    }
    
    if (formData.date === today.toISOString().split('T')[0]) {
      const now = new Date();
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(hours, minutes, 0, 0);
      
      if (selectedDateTime <= now) {
        toast.error('Please select a future time.');
        return;
      }
    }

    // If manual mode and no table selected, show error
    if (tableSelectionMode === 'manual' && !formData.tableNumber) {
      toast.error('Please select a table or switch to automatic assignment.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const reservationData = {
        date: formData.date,
        time: formData.time,
        party_size: parseInt(formData.partySize),
        contact_phone: formData.contactPhone,
        customer_name: formData.customerName || '',
        special_requests: formData.specialRequests || '',
        status: 'pending'
      };

      // Only include table_number if manually selected
      if (tableSelectionMode === 'manual' && formData.tableNumber) {
        reservationData.table_number = formData.tableNumber;
      }
      
      const response = await reservationService.createReservation(reservationData);
      
      if (response.success) {
        toast.success(`Reservation created successfully! ${response.data.table_number ? `Table ${response.data.table_number} has been assigned.` : ''}`);
        setShowNewReservationModal(false);
        setFormData({
          date: '',
          time: '',
          partySize: '',
          tableNumber: '',
          specialRequests: '',
          contactPhone: '',
          customerName: ''
        });
        setTableSelectionMode('auto');
        setAvailableTables([]);
        // Refresh reservations list
        await fetchReservations();
      } else {
        toast.error(response.error || 'Failed to submit reservation');
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast.error('Failed to submit reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      const response = await reservationService.deleteReservation(reservationId);
      if (response.success) {
        toast.success('Reservation cancelled successfully');
        await fetchReservations();
      } else {
        toast.error(response.error || 'Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Failed to cancel reservation');
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (reservation.id && reservation.id.toLowerCase().includes(searchLower)) ||
      (reservation.table_number && reservation.table_number.toLowerCase().includes(searchLower)) ||
      (reservation.customer_name && reservation.customer_name.toLowerCase().includes(searchLower)) ||
      (reservation.contact_phone && reservation.contact_phone.includes(searchTerm));
    return matchesStatus && matchesSearch;
  });

  return (
    <CustomerLayout>
      <div className="space-y-6 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', width: '100%', padding: '1.5rem 2rem', overflowX: 'hidden' }}>
        <div className="w-full max-w-full">
          {/* Header */}
          <div className="mb-6 animate-slide-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 
                  className="text-3xl font-bold drop-shadow-lg mb-2" 
                  style={{ 
                    fontFamily: "'BBH Sans Bartle', sans-serif", 
                    letterSpacing: '0.05em',
                    color: colors.darkNavy,
                    fontFeatureSettings: '"liga" off',
                    fontVariantLigatures: 'none',
                    textRendering: 'geometricPrecision',
                    fontKerning: 'none'
                  }}
                >
                  Table Reservations
                </h1>
                <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '250px' }}></div>
              </div>
              <button 
                onClick={() => {
                  setShowNewReservationModal(true);
                  setFormData({
                    date: '',
                    time: '',
                    partySize: '',
                    tableNumber: '',
                    specialRequests: '',
                    contactPhone: '',
                    customerName: ''
                  });
                  setTableSelectionMode('auto');
                  setAvailableTables([]);
                }}
                className="px-8 py-3 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
                style={{ backgroundColor: colors.red }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f3e'}
                onMouseLeave={(e) => e.target.style.backgroundColor = colors.red}
              >
                <Plus className="h-5 w-5 mr-2" />
                New Reservation
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div 
              className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
              style={{ 
                animationDelay: '0.1s',
                background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
                borderColor: colors.mediumBlue
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Reservations</p>
                  <p className="text-3xl font-bold" style={{ color: colors.mediumBlue }}>{reservations.length}</p>
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
                borderColor: colors.red
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Confirmed</p>
                  <p className="text-3xl font-bold" style={{ color: colors.red }}>
                    {reservations.filter(r => r.status === 'confirmed').length}
                  </p>
                </div>
                <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                  <CheckCircle className="h-8 w-8" style={{ color: colors.red }} />
                </div>
              </div>
            </div>

            <div 
              className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
              style={{ 
                animationDelay: '0.3s',
                background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
                borderColor: colors.mediumBlue
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Pending</p>
                  <p className="text-3xl font-bold" style={{ color: colors.darkNavy }}>
                    {reservations.filter(r => r.status === 'pending').length}
                  </p>
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
                background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.cream} 100%)`,
                borderColor: colors.red
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Avg Party Size</p>
                  <p className="text-3xl font-bold" style={{ color: colors.red }}>
                    {reservations.length > 0 
                      ? (reservations.reduce((sum, r) => sum + (r.party_size || 0), 0) / reservations.length).toFixed(1)
                      : '0'
                    }
                  </p>
                </div>
                <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                  <Users className="h-8 w-8" style={{ color: colors.red }} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div 
            className="rounded-2xl shadow-xl border-2 p-6 mt-8"
            style={{ 
              background: `linear-gradient(135deg, #FFFFFF 0%, ${colors.cream} 100%)`,
              borderColor: colors.lightBlue
            }}
          >
            <div className="flex flex-col sm:flex-row gap-4 min-w-0">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                  <input
                    type="text"
                    placeholder="Search reservations by ID, table, name, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      borderColor: colors.lightBlue,
                      color: colors.darkNavy
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.red;
                      e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
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
                  className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderColor: colors.lightBlue,
                    color: colors.darkNavy,
                    backgroundColor: '#FFFFFF'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.red;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.lightBlue;
                  }}
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
          {isLoading ? (
            <div className="text-center py-12 mt-8">
              <div 
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                style={{ borderColor: colors.red }}
              ></div>
              <p className="font-semibold" style={{ color: colors.darkNavy }}>Loading reservations...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mt-6 min-w-0">
                {filteredReservations.map((reservation) => {
                  const statusColors = getStatusColor(reservation.status);
                  return (
                    <div 
                      key={reservation.id} 
                      className="rounded-2xl shadow-xl border-2 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] min-w-0 overflow-hidden"
                      style={{ 
                        background: `linear-gradient(135deg, #FFFFFF 0%, ${colors.cream} 100%)`,
                        borderColor: colors.lightBlue
                      }}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <Calendar className="h-5 w-5" style={{ color: colors.mediumBlue }} />
                            <h3 className="text-lg font-semibold" style={{ color: colors.darkNavy }}>
                              {reservation.id || `RES-${reservation._id?.slice(-6) || 'N/A'}`}
                            </h3>
                          </div>
                          <span 
                            className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0"
                            style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
                          >
                            {getStatusIcon(reservation.status)}
                            <span className="ml-1 capitalize">{reservation.status}</span>
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold" style={{ color: colors.darkNavy }}>
                            {reservation.date} at {reservation.time}
                          </p>
                          {reservation.table_number && (
                            <p className="text-xs" style={{ color: colors.mediumBlue }}>Table {reservation.table_number}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2" style={{ color: colors.darkNavy }}>Reservation Details</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" style={{ color: colors.mediumBlue }} />
                              <span style={{ color: colors.mediumBlue }}>Party Size: {reservation.party_size} people</span>
                            </div>
                            {reservation.table_number && (
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" style={{ color: colors.mediumBlue }} />
                                <span style={{ color: colors.mediumBlue }}>Table: {reservation.table_number}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2" style={{ color: colors.darkNavy }}>Contact Information</h4>
                          <div className="space-y-1 text-sm">
                            {reservation.customer_name && (
                              <div style={{ color: colors.mediumBlue }}>
                                <span className="font-medium">Name:</span> {reservation.customer_name}
                              </div>
                            )}
                            <div style={{ color: colors.mediumBlue }}>
                              <span className="font-medium">Phone:</span> {reservation.contact_phone}
                            </div>
                          </div>
                        </div>
                      </div>

                      {reservation.special_requests && (
                        <div 
                          className="mb-4 p-3 rounded border-l-4"
                          style={{ 
                            backgroundColor: 'rgba(168, 218, 220, 0.2)',
                            borderColor: colors.mediumBlue
                          }}
                        >
                          <p className="text-sm" style={{ color: colors.darkNavy }}>
                            <span className="font-medium">Special Requests:</span> {reservation.special_requests}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        {reservation.created_at && (
                          <span className="text-xs" style={{ color: colors.mediumBlue }}>
                            Booked on {new Date(reservation.created_at).toLocaleDateString()}
                          </span>
                        )}
                        <div className="flex space-x-2">
                          {(reservation.status === 'confirmed' || reservation.status === 'pending') && (
                            <button 
                              onClick={() => handleDeleteReservation(reservation.id)}
                              className="text-xs px-3 py-1 rounded transition-all duration-200 hover:scale-105"
                              style={{ 
                                backgroundColor: 'rgba(230, 57, 70, 0.1)',
                                color: colors.red
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(230, 57, 70, 0.2)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'rgba(230, 57, 70, 0.1)';
                              }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredReservations.length === 0 && (
                <div 
                  className="text-center py-12 rounded-2xl shadow-xl border-2 mt-8"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
                    borderColor: colors.lightBlue
                  }}
                >
                  <div className="p-4 rounded-full inline-block mb-4" style={{ backgroundColor: colors.lightBlue }}>
                    <Calendar className="h-16 w-16" style={{ color: colors.mediumBlue }} />
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: colors.darkNavy }}>No reservations found</h3>
                  <p style={{ color: colors.mediumBlue }}>
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.' 
                      : 'Create your first reservation to get started.'}
                  </p>
                </div>
              )}
            </>
          )}

          {/* New Reservation Modal */}
          {showNewReservationModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div 
                className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2"
                style={{ 
                  background: `linear-gradient(135deg, #FFFFFF 0%, ${colors.cream} 100%)`,
                  borderColor: colors.lightBlue
                }}
              >
                <div className="flex items-center justify-between p-6 border-b-2" style={{ borderColor: colors.lightBlue }}>
                  <h3 className="text-xl font-semibold" style={{ color: colors.darkNavy }}>New Table Reservation</h3>
                  <button
                    onClick={() => setShowNewReservationModal(false)}
                    className="transition-colors duration-200 hover:scale-110"
                    style={{ color: colors.mediumBlue }}
                    onMouseEnter={(e) => e.target.style.color = colors.red}
                    onMouseLeave={(e) => e.target.style.color = colors.mediumBlue}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.darkNavy }}>
                      Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={(e) => {
                          const newDate = e.target.value;
                          if (formData.time && newDate) {
                            const minTime = getMinTime();
                            if (formData.time < minTime) {
                              setFormData(prev => ({ ...prev, date: newDate, time: '' }));
                            } else {
                              setFormData(prev => ({ ...prev, date: newDate }));
                            }
                          } else {
                            handleInputChange(e);
                          }
                        }}
                        required
                        min={getMinDate()}
                        max={getMaxDate()}
                        className="w-full pl-10 pr-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                        style={{ 
                          borderColor: colors.lightBlue,
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = colors.red;
                          e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: colors.mediumBlue }}>
                      Select a date within the next 7 days
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.darkNavy }}>
                      Time *
                    </label>
                    
                    {/* AM/PM Tabs */}
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setTimePeriod('AM');
                          setFormData(prev => ({ ...prev, time: '' }));
                        }}
                        className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                        style={timePeriod === 'AM'
                          ? { backgroundColor: colors.red, color: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
                          : { backgroundColor: colors.darkNavy, color: colors.lightBlue }
                        }
                        onMouseEnter={(e) => {
                          if (timePeriod !== 'AM') e.target.style.backgroundColor = colors.mediumBlue;
                        }}
                        onMouseLeave={(e) => {
                          if (timePeriod !== 'AM') e.target.style.backgroundColor = colors.darkNavy;
                        }}
                      >
                        AM
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTimePeriod('PM');
                          setFormData(prev => ({ ...prev, time: '' }));
                        }}
                        className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                        style={timePeriod === 'PM'
                          ? { backgroundColor: colors.red, color: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
                          : { backgroundColor: colors.darkNavy, color: colors.lightBlue }
                        }
                        onMouseEnter={(e) => {
                          if (timePeriod !== 'PM') e.target.style.backgroundColor = colors.mediumBlue;
                        }}
                        onMouseLeave={(e) => {
                          if (timePeriod !== 'PM') e.target.style.backgroundColor = colors.darkNavy;
                        }}
                      >
                        PM
                      </button>
                    </div>
                    
                    <div 
                      className="rounded-lg p-3 max-h-64 overflow-y-auto border-2"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: colors.cream
                      }}
                    >
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {(() => {
                          const minTime = getMinTime();
                          const maxTime = getMaxTime();
                          const [minHour, minMinute] = minTime.split(':').map(Number);
                          const [maxHour, maxMinute] = maxTime.split(':').map(Number);
                          const minTimeInMinutes = minHour * 60 + minMinute;
                          const maxTimeInMinutes = maxHour * 60 + maxMinute;
                          
                          const allSlots = [];
                          
                          // Generate slots directly in chronological order (1-hour intervals only)
                          for (let hour = 11; hour <= 22; hour++) {
                            const minute = 0; // Only :00 minutes, no :30
                            
                            const timeInMinutes = hour * 60 + minute;
                            if (timeInMinutes >= minTimeInMinutes && timeInMinutes <= maxTimeInMinutes) {
                              const time24 = `${String(hour).padStart(2, '0')}:00`;
                              
                              let hour12 = hour;
                              let ampm = 'AM';
                              if (hour === 0) {
                                hour12 = 12;
                              } else if (hour === 12) {
                                ampm = 'PM';
                              } else if (hour > 12) {
                                hour12 = hour - 12;
                                ampm = 'PM';
                              }
                              
                              allSlots.push({
                                value: time24,
                                label: `${hour12}:00`,
                                period: ampm
                              });
                            }
                          }
                          
                          // Filter slots by selected period
                          const filteredSlots = allSlots.filter(slot => slot.period === timePeriod);
                          
                          return filteredSlots.map((slot) => (
                            <button
                              key={slot.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, time: slot.value }))}
                              className="px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 text-center whitespace-nowrap flex items-center justify-center border-2"
                              style={formData.time === slot.value
                                ? { 
                                    backgroundColor: colors.red, 
                                    color: '#FFFFFF', 
                                    borderColor: colors.red,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                  }
                                : { 
                                    backgroundColor: '#FFFFFF', 
                                    color: colors.darkNavy, 
                                    borderColor: colors.lightBlue
                                  }
                              }
                              onMouseEnter={(e) => {
                                if (formData.time !== slot.value) {
                                  e.target.style.backgroundColor = colors.lightBlue;
                                  e.target.style.borderColor = colors.mediumBlue;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (formData.time !== slot.value) {
                                  e.target.style.backgroundColor = '#FFFFFF';
                                  e.target.style.borderColor = colors.lightBlue;
                                }
                              }}
                            >
                              {slot.label}
                            </button>
                          ));
                        })()}
                      </div>
                    </div>
                    {!formData.time && (
                      <p className="text-xs mt-1" style={{ color: colors.red }}>Please select a time</p>
                    )}
                    <p className="text-xs mt-1" style={{ color: colors.mediumBlue }}>
                      Available: 11:00 AM - 10:00 PM (1-hour intervals)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.darkNavy }}>
                      Party Size *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <input
                        type="number"
                        name="partySize"
                        value={formData.partySize}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="20"
                        placeholder="Number of guests"
                        className="w-full pl-10 pr-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                        style={{ 
                          borderColor: colors.lightBlue,
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = colors.red;
                          e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.darkNavy }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        color: colors.darkNavy
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.red;
                        e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.lightBlue;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.darkNavy }}>
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        color: colors.darkNavy
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.red;
                        e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.lightBlue;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Table Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.darkNavy }}>
                    Table Selection
                  </label>
                  <div className="flex items-center space-x-4 mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="tableMode"
                        value="auto"
                        checked={tableSelectionMode === 'auto'}
                        onChange={(e) => {
                          setTableSelectionMode(e.target.value);
                          setFormData(prev => ({ ...prev, tableNumber: '' }));
                        }}
                        className="mr-2"
                        style={{ accentColor: colors.red }}
                      />
                      <span className="text-sm" style={{ color: colors.darkNavy }}>Automatic Assignment</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="tableMode"
                        value="manual"
                        checked={tableSelectionMode === 'manual'}
                        onChange={(e) => {
                          setTableSelectionMode(e.target.value);
                          setFormData(prev => ({ ...prev, tableNumber: '' }));
                        }}
                        className="mr-2"
                        style={{ accentColor: colors.red }}
                      />
                      <span className="text-sm" style={{ color: colors.darkNavy }}>Choose Table</span>
                    </label>
                  </div>

                  {tableSelectionMode === 'manual' && (
                    <div>
                      {isCheckingAvailability ? (
                        <div className="flex items-center space-x-2 text-sm" style={{ color: colors.mediumBlue }}>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Checking availability...</span>
                        </div>
                      ) : availableTables.length > 0 ? (
                        <div>
                          <select
                            name="tableNumber"
                            value={formData.tableNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                            style={{ 
                              borderColor: colors.lightBlue,
                              color: colors.darkNavy,
                              backgroundColor: '#FFFFFF'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = colors.red;
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = colors.lightBlue;
                            }}
                          >
                            <option value="">Select a table...</option>
                            {availableTables.map((table) => (
                              <option key={table.number} value={table.number}>
                                {table.number} - {table.capacity} seats ({table.location}, {table.type})
                              </option>
                            ))}
                          </select>
                          <p className="text-xs mt-1" style={{ color: colors.mediumBlue }}>
                            {availableTables.length} table(s) available
                          </p>
                        </div>
                      ) : formData.date && formData.time && formData.partySize ? (
                        <div 
                          className="p-3 rounded border-2"
                          style={{ 
                            backgroundColor: 'rgba(230, 57, 70, 0.1)',
                            borderColor: colors.red
                          }}
                        >
                          <p className="text-sm" style={{ color: colors.red }}>
                            No tables available for {formData.partySize} guests at {formData.date} {formData.time}
                          </p>
                        </div>
                      ) : (
                        <div 
                          className="p-3 rounded border-2"
                          style={{ 
                            backgroundColor: colors.cream,
                            borderColor: colors.lightBlue
                          }}
                        >
                          <p className="text-sm" style={{ color: colors.mediumBlue }}>
                            Please select date, time, and party size to see available tables
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {tableSelectionMode === 'auto' && formData.date && formData.time && formData.partySize && (
                    <div>
                      {isCheckingAvailability ? (
                        <div className="flex items-center space-x-2 text-sm" style={{ color: colors.mediumBlue }}>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Finding best table...</span>
                        </div>
                      ) : availableTables.length > 0 ? (
                        <div 
                          className="p-3 rounded border-2"
                          style={{ 
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            borderColor: '#16a34a'
                          }}
                        >
                          <p className="text-sm" style={{ color: '#16a34a' }}>
                            ✓ Best available table: <strong>{formData.tableNumber || availableTables[0]?.number}</strong> 
                            {' '}({availableTables[0]?.capacity} seats)
                          </p>
                        </div>
                      ) : (
                        <div 
                          className="p-3 rounded border-2"
                          style={{ 
                            backgroundColor: 'rgba(230, 57, 70, 0.1)',
                            borderColor: colors.red
                          }}
                        >
                          <p className="text-sm" style={{ color: colors.red }}>
                            No tables available. Please try a different date or time.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.darkNavy }}>
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any special requests or dietary requirements..."
                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                    style={{ 
                      borderColor: colors.lightBlue,
                      color: colors.darkNavy
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.red;
                      e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.lightBlue;
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewReservationModal(false)}
                    className="px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                    style={{ 
                      backgroundColor: colors.cream,
                      color: colors.darkNavy,
                      border: `2px solid ${colors.lightBlue}`
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = colors.lightBlue;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = colors.cream;
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (tableSelectionMode === 'manual' && !formData.tableNumber)}
                    className="px-6 py-2 text-sm font-bold text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: colors.red }}
                    onMouseEnter={(e) => {
                      if (!e.target.disabled) e.target.style.backgroundColor = '#d32f3e';
                    }}
                    onMouseLeave={(e) => {
                      if (!e.target.disabled) e.target.style.backgroundColor = colors.red;
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Reservation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerReservations;
