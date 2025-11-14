import api from './api';

class ReservationService {
  async getReservations(date = null, status = null) {
    try {
      const params = {};
      if (date) params.date = date;
      if (status) params.status = status;
      
      const response = await api.get('/table-reservations', { params });
      const reservations = Array.isArray(response.data) ? response.data : [];
      return { success: true, data: reservations };
    } catch (error) {
      console.error('Error fetching reservations:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to fetch reservations';
      return { success: false, error: errorMessage };
    }
  }

  async getReservationById(reservationId) {
    try {
      const response = await api.get(`/table-reservations/${reservationId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching reservation:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to fetch reservation';
      return { success: false, error: errorMessage };
    }
  }

  async getReservationsByDate(date) {
    try {
      const response = await api.get(`/table-reservations/by-date/${date}`);
      const reservations = Array.isArray(response.data) ? response.data : [];
      return { success: true, data: reservations };
    } catch (error) {
      console.error('Error fetching reservations by date:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to fetch reservations';
      return { success: false, error: errorMessage };
    }
  }

  async createReservation(reservationData) {
    try {
      const response = await api.post('/table-reservations', reservationData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating reservation:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to create reservation';
      return { success: false, error: errorMessage };
    }
  }

  async updateReservation(reservationId, reservationData) {
    try {
      const response = await api.put(`/table-reservations/${reservationId}`, reservationData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating reservation:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to update reservation';
      return { success: false, error: errorMessage };
    }
  }

  async deleteReservation(reservationId) {
    try {
      const response = await api.delete(`/table-reservations/${reservationId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error deleting reservation:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to delete reservation';
      return { success: false, error: errorMessage };
    }
  }

  async checkAvailability(date, time, partySize, tableNumber = null) {
    try {
      const params = { date, time, party_size: partySize };
      if (tableNumber) params.table_number = tableNumber;
      
      const response = await api.get('/table-reservations/availability/check', { params });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error checking availability:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to check availability';
      return { success: false, error: errorMessage };
    }
  }

  async deleteReservationsByCustomerNames(customerNames) {
    try {
      // Get all reservations
      const allReservations = await this.getReservations();
      if (!allReservations.success) {
        return { success: false, error: 'Failed to fetch reservations' };
      }

      // Normalize customer names for comparison (case-insensitive)
      const normalizedNames = customerNames.map(name => name.toLowerCase().trim());
      
      // Filter reservations to delete
      const reservationsToDelete = allReservations.data.filter(reservation => {
        const customerName = (reservation.customer_name || '').toLowerCase().trim();
        return normalizedNames.includes(customerName);
      });

      // Delete all matching reservations
      const deletePromises = reservationsToDelete.map(reservation => {
        const reservationId = reservation.id || reservation._id;
        return this.deleteReservation(reservationId);
      });

      const results = await Promise.all(deletePromises);
      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;

      return {
        success: true,
        deleted: successCount,
        failed: failCount,
        total: reservationsToDelete.length
      };
    } catch (error) {
      console.error('Error deleting reservations by customer names:', error);
      return { success: false, error: error.message || 'Failed to delete reservations' };
    }
  }
}

export default new ReservationService();
