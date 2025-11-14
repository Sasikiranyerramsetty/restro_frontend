import React, { useState, useEffect } from 'react';
import { 
  Table as TableIcon, Plus, Search, MapPin, Users, Clock, 
  CheckCircle, X, AlertCircle, Edit, Trash2, Eye, Calendar,
  User, Phone, Mail, DollarSign, CalendarDays, RefreshCw
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import tableService from '../../services/tableService';
import reservationService from '../../services/reservationService';
import toast from 'react-hot-toast';

const AdminTables = () => {
  // Custom color palette
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDayReservations, setSelectedDayReservations] = useState([]);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    capacity: ''
  });

  useEffect(() => {
    fetchData();
    fetchReservations();
    
    // Auto-refresh every 30 seconds to show latest reservations
    const interval = setInterval(() => {
      fetchData();
      fetchReservations();
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch reservations when selected date changes
    fetchReservationsForDate(selectedDate);
  }, [selectedDate]);

  // Refresh when tables or reservations change
  useEffect(() => {
    if (tables.length > 0 && reservations.length > 0) {
      // Tables are already updated by backend when reservations are created
      // Just ensure we have the latest data
    }
  }, [reservations]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await tableService.getTables();
      console.log('Tables response:', response);
      if (response.success) {
        const tablesData = response.data || [];
        console.log('Tables data:', tablesData);
        setTables(tablesData);
      } else {
        console.error('Tables fetch error:', response.error);
        toast.error(response.error || 'Failed to fetch tables data');
        setTables([]);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error('Failed to fetch tables data');
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await reservationService.getReservations();
      if (response.success) {
        setReservations(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchReservationsForDate = async (date) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await reservationService.getReservationsByDate(dateStr);
      if (response.success) {
        setSelectedDayReservations(response.data || []);
        // Update table statuses based on reservations
        updateTableStatuses(response.data || [], dateStr);
      }
    } catch (error) {
      console.error('Error fetching reservations for date:', error);
      setSelectedDayReservations([]);
    }
  };

  // Calculate if a table should be reserved 30 minutes before reservation time
  const updateTableStatuses = (reservations, dateStr) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const isToday = dateStr === todayStr;

    reservations.forEach(reservation => {
      if (reservation.status !== 'cancelled' && reservation.status !== 'completed') {
        const [hours, minutes] = reservation.time.split(':').map(Number);
        const reservationDateTime = new Date(`${reservation.date}T${reservation.time}:00`);
        const thirtyMinutesBefore = new Date(reservationDateTime.getTime() - 30 * 60 * 1000);

        // If it's today and current time is 30 minutes before reservation, mark table as reserved
        if (isToday && now >= thirtyMinutesBefore && now < reservationDateTime) {
          // Update table status to reserved
          if (reservation.table_number) {
            const table = tables.find(t => (t.number || t.tableNumber) === reservation.table_number);
            if (table) {
              tableService.updateTableStatus(table._id || table.id, 'reserved').catch(err => {
                console.error('Error updating table status:', err);
              });
            }
          }
        }
      }
    });
  };

  // Get reservations for a specific date
  const getReservationsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return reservations.filter(r => r.date === dateStr && r.status !== 'cancelled');
  };

  // Get active reservation for a specific table
  const getReservationForTable = (tableNumber) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    // Find active reservations (pending or confirmed) for this table
    const activeReservations = reservations.filter(r => 
      r.table_number === tableNumber &&
      (r.status === 'pending' || r.status === 'confirmed') &&
      r.status !== 'cancelled' &&
      r.status !== 'completed'
    );
    
    // Sort by date and time, get the next upcoming reservation
    activeReservations.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
    
    // Return the first upcoming reservation (today or future)
    for (const res of activeReservations) {
      const resDate = new Date(`${res.date}T${res.time}:00`);
      if (resDate >= now) {
        return res;
      }
    }
    
    // If no upcoming reservation, return the most recent one for today
    const todayReservations = activeReservations.filter(r => r.date === today);
    if (todayReservations.length > 0) {
      return todayReservations[0];
    }
    
    return null;
  };

  const resetForm = () => {
    setFormData({
      number: '',
      capacity: ''
    });
    setEditingTable(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTable = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditTable = (table) => {
    setFormData({
      number: table.number || table.tableNumber || '',
      capacity: table.capacity ? table.capacity.toString() : ''
    });
    setEditingTable(table);
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tableData = {
        number: formData.number,
        capacity: parseInt(formData.capacity),
        status: 'available'
      };

      if (editingTable) {
        // Update existing table
        const tableId = editingTable._id || editingTable.id;
        const response = await tableService.updateTable(tableId, tableData);
        if (response.success) {
          // Optimistic update
          setTables(prevTables => 
            prevTables.map(t => 
              (t._id || t.id) === tableId 
                ? { ...t, ...tableData, number: tableData.number, capacity: tableData.capacity }
                : t
            )
          );
          toast.success('Table updated successfully');
          // Refresh in background
          fetchData().catch(err => console.error('Error refreshing tables:', err));
        } else {
          toast.error(response.error || 'Failed to update table');
        }
      } else {
        // Add new table
        const response = await tableService.addTable(tableData);
        if (response.success) {
          // Optimistic update - add new table to list
          const newTable = { ...tableData, id: response.data?.id || response.data?._id || Date.now(), ...response.data };
          setTables(prevTables => [...prevTables, newTable]);
          toast.success('Table added successfully');
          // Refresh in background
          fetchData().catch(err => console.error('Error refreshing tables:', err));
        } else {
          toast.error(response.error || 'Failed to add table');
        }
      }

      setShowAddModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save table');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTable = async (table) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      const tableId = table._id || table.id;
      
      // Optimistic update - remove from UI immediately
      setTables(prevTables => prevTables.filter(t => (t._id || t.id) !== tableId));
      
      try {
        const response = await tableService.deleteTable(tableId);
        if (response.success) {
          toast.success('Table deleted successfully');
          // Refresh in background
          fetchData().catch(err => console.error('Error refreshing tables:', err));
          fetchReservations().catch(err => console.error('Error refreshing reservations:', err));
        } else {
          // Revert on error
          setTables(prevTables => [...prevTables, table]);
          toast.error(response.error || 'Failed to delete table');
        }
      } catch (error) {
        // Revert on error
        setTables(prevTables => [...prevTables, table]);
        console.error('Error deleting table:', error);
        toast.error('Failed to delete table');
      }
    }
  };

  const handleStatusChange = async (table, newStatus) => {
    // Optimistic update - update UI immediately
    setTables(prevTables => 
      prevTables.map(t => 
        (t._id || t.id) === (table._id || table.id) 
          ? { ...t, status: newStatus }
          : t
      )
    );
    
    try {
      const tableId = table._id || table.id;
      const response = await tableService.updateTableStatus(tableId, newStatus);
      if (response.success) {
        toast.success('Table status updated');
        // Refresh data in background to ensure consistency
        fetchData().catch(err => console.error('Error refreshing tables:', err));
        fetchReservations().catch(err => console.error('Error refreshing reservations:', err));
      } else {
        // Revert on error
        setTables(prevTables => 
          prevTables.map(t => 
            (t._id || t.id) === (table._id || table.id) 
              ? { ...t, status: table.status }
              : t
          )
        );
        toast.error(response.error || 'Failed to update table status');
      }
    } catch (error) {
      // Revert on error
      setTables(prevTables => 
        prevTables.map(t => 
          (t._id || t.id) === (table._id || table.id) 
            ? { ...t, status: table.status }
            : t
        )
      );
      console.error('Error updating table status:', error);
      toast.error('Failed to update table status');
    }
  };

  const handleRefresh = async () => {
    await fetchData();
    await fetchReservations();
    toast.success('Tables and reservations refreshed');
  };

  const handleRemoveCustomersFromTables = async () => {
    const customerNames = ['Emma Wilson', 'Michael Johnson', 'Sophia Williams'];
    const confirmed = window.confirm(
      `Are you sure you want to remove reservations and clear table assignments for:\n${customerNames.join(', ')}?\n\nThis will delete all their reservations.`
    );
    
    if (!confirmed) {
      return;
    }

    try {
      toast.loading('Removing customers from tables...', { id: 'remove-customers' });
      
      // Delete reservations for these customers
      const reservationResult = await reservationService.deleteReservationsByCustomerNames(customerNames);
      
      // Clear table customer assignments
      const tablesToUpdate = tables.filter(table => {
        const customer = (table.customer || '').trim();
        return customerNames.some(name => 
          customer.toLowerCase() === name.toLowerCase()
        );
      });

      const tableUpdatePromises = tablesToUpdate.map(table => {
        const tableId = table._id || table.id;
        return tableService.updateTable(tableId, {
          number: table.number || table.tableNumber,
          capacity: table.capacity,
          status: 'available',
          customer: null,
          currentOrder: null
        });
      });

      const tableResults = await Promise.all(tableUpdatePromises);
      const tableSuccessCount = tableResults.filter(r => r.success).length;

      if (reservationResult.success) {
        toast.success(
          `Removed ${reservationResult.deleted} reservations and cleared ${tableSuccessCount} table assignments.`,
          { id: 'remove-customers' }
        );
        await fetchReservations();
        await fetchData();
      } else {
        toast.error(reservationResult.error || 'Failed to remove customers', { id: 'remove-customers' });
      }
    } catch (error) {
      console.error('Error removing customers:', error);
      toast.error('An error occurred while removing customers', { id: 'remove-customers' });
    }
  };

  const filteredTables = tables.filter(table => {
    const tableNumber = (table.number || table.tableNumber || '').toLowerCase();
    const customer = (table.customer || '').toLowerCase();
    const matchesSearch = tableNumber.includes(searchTerm.toLowerCase()) ||
                         customer.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { 
        bg: colors.lightBlue, 
        text: colors.darkNavy, 
        border: colors.mediumBlue, 
        icon: <CheckCircle className="h-3 w-3" /> 
      },
      occupied: { 
        bg: colors.red, 
        text: colors.cream, 
        border: colors.red, 
        icon: <Users className="h-3 w-3" /> 
      },
      reserved: { 
        bg: colors.mediumBlue, 
        text: colors.cream, 
        border: colors.mediumBlue, 
        icon: <Calendar className="h-3 w-3" /> 
      },
      cleaning: { 
        bg: colors.cream, 
        text: colors.darkNavy, 
        border: colors.lightBlue, 
        icon: <AlertCircle className="h-3 w-3" /> 
      }
    };
    const config = statusConfig[status] || statusConfig.available;
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


  const getStats = () => {
    const total = tables.length;
    const available = tables.filter(t => t.status === 'available').length;
    const occupied = tables.filter(t => t.status === 'occupied').length;
    const reserved = tables.filter(t => t.status === 'reserved').length;
    return { total, available, occupied, reserved };
  };

  const stats = getStats();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.red }}
            ></div>
            <p className="font-semibold" style={{ color: colors.darkNavy }}>Loading tables...</p>
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
              Table Management
            </h1>
            <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '200px' }}></div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleRemoveCustomersFromTables}
              className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
              style={{ backgroundColor: '#FF6B35', color: colors.cream }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#FF4500'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FF6B35'}
              title="Remove Emma Wilson, Michael Johnson, Sophia Williams from tables"
            >
              <X className="h-5 w-5 mr-2" />
              Remove Customers
            </button>
            <button 
              onClick={handleRefresh}
              className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
              style={{ backgroundColor: colors.mediumBlue, color: colors.cream }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#3a6a8a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = colors.mediumBlue}
              title="Refresh tables and reservations"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh
            </button>
            <button 
              onClick={handleAddTable}
              className="px-8 py-3 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
              style={{ backgroundColor: colors.red }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f3e'}
              onMouseLeave={(e) => e.target.style.backgroundColor = colors.red}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Table
            </button>
          </div>
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
                <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Tables</p>
                <p className="text-3xl font-bold" style={{ color: colors.mediumBlue }}>{stats.total}</p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <TableIcon className="h-8 w-8" style={{ color: colors.mediumBlue }} />
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
                <p className="text-sm font-semibold mb-2" style={{ color: colors.cream }}>Available</p>
                <p className="text-3xl font-bold" style={{ color: colors.cream }}>{stats.available}</p>
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
              borderColor: colors.red,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Occupied</p>
                <p className="text-3xl font-bold" style={{ color: colors.red }}>{stats.occupied}</p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Users className="h-8 w-8" style={{ color: colors.red }} />
              </div>
            </div>
          </div>

          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
            style={{ 
              animationDelay: '0.4s',
              background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`,
              borderColor: colors.darkNavy,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: colors.cream }}>Reserved</p>
                <p className="text-3xl font-bold" style={{ color: colors.cream }}>{stats.reserved}</p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Calendar className="h-8 w-8" style={{ color: colors.darkNavy }} />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div 
            className="rounded-2xl shadow-lg p-6 animate-slide-up animate-delay-200 border-2"
            style={{ 
              backgroundColor: colors.cream,
              borderColor: colors.mediumBlue,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 
                className="text-lg font-bold"
                style={{ color: colors.darkNavy }}
              >
                Calendar
              </h3>
              <CalendarDays className="h-5 w-5" style={{ color: colors.mediumBlue }} />
            </div>
            <div className="flex justify-center">
              <div className="w-full">
                {/* Custom 7-Day Calendar View */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {Array.from({ length: 7 }).map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() + index);
                    const isToday = index === 0;
                    const isSelected = selectedDate.toDateString() === date.toDateString();
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNumber = date.getDate();
                    const dayReservations = getReservationsForDate(date);
                    const reservationCount = dayReservations.length;
                    
                    return (
                      <div key={index} className="relative">
                        <button
                          onClick={() => setSelectedDate(new Date(date))}
                          onMouseEnter={() => setHoveredDay(index)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className="w-full p-3 rounded-lg transition-all duration-300 hover:scale-105 border-2 font-semibold relative"
                          style={{
                            backgroundColor: isSelected 
                              ? colors.mediumBlue 
                              : isToday 
                              ? colors.red 
                              : colors.lightBlue,
                            borderColor: isSelected 
                              ? colors.darkNavy 
                              : isToday 
                              ? colors.red 
                              : colors.mediumBlue,
                            color: (isSelected || isToday) ? colors.cream : colors.darkNavy,
                            borderWidth: '2px'
                          }}
                        >
                          <div className="text-xs font-bold mb-1">{dayName}</div>
                          <div className="text-lg font-bold">{dayNumber}</div>
                          <div className="text-xs mt-1 opacity-75">
                            {date.toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          {reservationCount > 0 && (
                            <div 
                              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: colors.red, color: colors.cream }}
                            >
                              {reservationCount}
                            </div>
                          )}
                        </button>
                        {hoveredDay === index && dayReservations.length > 0 && (
                          <div 
                            className="absolute z-50 mt-2 w-64 p-4 rounded-lg shadow-2xl border-2"
                            style={{
                              backgroundColor: colors.cream,
                              borderColor: colors.mediumBlue,
                              borderWidth: '2px',
                              left: index >= 5 ? 'auto' : '0',
                              right: index >= 5 ? '0' : 'auto'
                            }}
                          >
                            <h4 className="font-bold mb-2" style={{ color: colors.darkNavy }}>
                              Reservations ({dayReservations.length})
                            </h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {dayReservations.map((reservation) => {
                                // Check if 30 minutes before reservation time
                                const now = new Date();
                                const todayStr = now.toISOString().split('T')[0];
                                const isToday = reservation.date === todayStr;
                                const [hours, minutes] = reservation.time.split(':').map(Number);
                                const reservationDateTime = new Date(`${reservation.date}T${reservation.time}:00`);
                                const thirtyMinutesBefore = new Date(reservationDateTime.getTime() - 30 * 60 * 1000);
                                const shouldShowReserved = isToday && now >= thirtyMinutesBefore && now < reservationDateTime;

                                return (
                                  <div 
                                    key={reservation.id || reservation._id}
                                    className="p-2 rounded border"
                                    style={{
                                      backgroundColor: shouldShowReserved ? colors.red : colors.lightBlue,
                                      borderColor: colors.mediumBlue,
                                      borderWidth: '1px'
                                    }}
                                  >
                                    <div className="text-sm font-semibold" style={{ color: colors.darkNavy }}>
                                      {reservation.time} - {reservation.party_size} guests
                                    </div>
                                    {reservation.table_number && (
                                      <div className="text-xs" style={{ color: colors.mediumBlue }}>
                                        Table: {reservation.table_number}
                                      </div>
                                    )}
                                    {reservation.customer_name && (
                                      <div className="text-xs" style={{ color: colors.mediumBlue }}>
                                        {reservation.customer_name}
                                      </div>
                                    )}
                                    {reservation.contact_phone && (
                                      <div className="text-xs" style={{ color: colors.mediumBlue }}>
                                        {reservation.contact_phone}
                                      </div>
                                    )}
                                    {shouldShowReserved && (
                                      <div className="text-xs font-bold mt-1" style={{ color: colors.red }}>
                                        ⚠ Table Reserved (30 min before)
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div 
              className="mt-4 p-3 rounded-lg border-2"
              style={{ 
                backgroundColor: colors.lightBlue,
                borderColor: colors.mediumBlue,
                borderWidth: '2px'
              }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: colors.darkNavy }}>
                Selected Date:
              </p>
              <p className="text-base font-bold" style={{ color: colors.mediumBlue }}>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Filters Section */}
          <div 
            className="lg:col-span-2 rounded-2xl shadow-lg p-6 animate-slide-up animate-delay-200 border-2"
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
                  placeholder="Search tables by number or customer..."
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
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        {filteredTables.length === 0 && !loading ? (
          <div 
            className="rounded-2xl shadow-xl p-12 text-center border-2"
            style={{ 
              backgroundColor: colors.cream,
              borderColor: colors.mediumBlue,
              borderWidth: '2px'
            }}
          >
            <TableIcon className="h-16 w-16 mx-auto mb-4" style={{ color: colors.mediumBlue }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.darkNavy }}>No Tables Found</h3>
            <p className="text-sm mb-4" style={{ color: colors.mediumBlue }}>
              {tables.length === 0 
                ? "No tables in database. Click 'Add Table' to create your first table."
                : "No tables match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTables.map((table) => {
              const statusConfig = getStatusBadge(table.status);
              const tableId = table._id || table.id;
              const tableNumber = table.number || table.tableNumber;
              const reservation = getReservationForTable(tableNumber);
              
              return (
                <div 
                  key={tableId} 
                className="rounded-lg shadow-xl border-2 overflow-hidden transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: colors.cream,
                  borderColor: colors.mediumBlue,
                  borderWidth: '2px'
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div 
                        className="h-12 w-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: colors.lightBlue }}
                      >
                        <TableIcon className="h-6 w-6" style={{ color: colors.darkNavy }} />
                      </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-bold" style={{ color: colors.darkNavy }}>{tableNumber || 'N/A'}</h3>
                          <p className="text-sm font-semibold" style={{ color: colors.mediumBlue }}>{table.capacity || 0} seats</p>
                        </div>
                    </div>
                    <span 
                      className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-full uppercase tracking-wide border-2"
                      style={statusConfig.style}
                    >
                      {statusConfig.icon}
                      <span className="ml-1">{table.status}</span>
                    </span>
                  </div>

                  {/* Show reservation info if table is reserved */}
                  {(table.status === 'reserved' && reservation) && (
                    <div 
                      className="p-3 rounded-lg mb-4 border-2"
                      style={{ 
                        backgroundColor: colors.lightBlue,
                        borderColor: colors.mediumBlue,
                        borderWidth: '2px'
                      }}
                    >
                      <div className="flex items-center text-sm font-bold mb-1" style={{ color: colors.darkNavy }}>
                        <User className="h-4 w-4 mr-2" />
                        <span>{reservation.customer_name || 'Guest'}</span>
                      </div>
                      <div className="text-xs font-semibold mb-1" style={{ color: colors.mediumBlue }}>
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {reservation.date} at {reservation.time}
                      </div>
                      {reservation.party_size && (
                        <div className="text-xs font-semibold" style={{ color: colors.mediumBlue }}>
                          <Users className="h-3 w-3 inline mr-1" />
                          {reservation.party_size} guests
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show customer info if table is occupied */}
                  {table.customer && table.status === 'occupied' && (
                    <div 
                      className="p-3 rounded-lg mb-4 border-2"
                      style={{ 
                        backgroundColor: colors.lightBlue,
                        borderColor: colors.mediumBlue,
                        borderWidth: '2px'
                      }}
                    >
                      <div className="flex items-center text-sm font-bold mb-1" style={{ color: colors.darkNavy }}>
                        <User className="h-4 w-4 mr-2" />
                        <span>{table.customer}</span>
                      </div>
                      {table.currentOrder && (
                        <div className="text-xs font-semibold" style={{ color: colors.mediumBlue }}>
                          Order: {table.currentOrder}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTable(table)}
                        className="transition-colors duration-200 hover:scale-110 transform"
                        style={{ color: colors.mediumBlue }}
                        onMouseEnter={(e) => e.target.style.color = colors.darkNavy}
                        onMouseLeave={(e) => e.target.style.color = colors.mediumBlue}
                        title="Edit Table"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTable(table)}
                        className="transition-colors duration-200 hover:scale-110 transform"
                        style={{ color: colors.red }}
                        onMouseEnter={(e) => e.target.style.color = '#d32f3e'}
                        onMouseLeave={(e) => e.target.style.color = colors.red}
                        title="Delete Table"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <select
                      value={table.status || 'available'}
                      onChange={(e) => handleStatusChange(table, e.target.value)}
                      className="text-xs border-2 rounded px-2 py-1 font-bold transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: 'white',
                        color: colors.darkNavy
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                      onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
              className="rounded-lg shadow-xl max-w-md w-full border-2"
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
                  {editingTable ? 'Edit Table' : 'Add New Table'}
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
                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: colors.darkNavy }}>
                    Table Number *
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border-2 rounded-lg transition-all"
                    style={{ 
                      borderColor: colors.lightBlue,
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                    onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    placeholder="e.g., T1, T2, T3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1" style={{ color: colors.darkNavy }}>
                    Capacity *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 border-2 rounded-lg transition-all"
                    style={{ 
                      borderColor: colors.lightBlue,
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                    onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    placeholder="Number of seats"
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
                        {editingTable ? 'Update Table' : 'Add Table'}
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

export default AdminTables;
