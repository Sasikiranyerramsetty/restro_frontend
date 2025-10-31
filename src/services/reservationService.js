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
}

export default new ReservationService();
