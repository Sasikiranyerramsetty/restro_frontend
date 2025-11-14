import api from './api';

class TableService {
  async getTables() {
    try {
      console.log('Fetching tables from:', `${api.defaults.baseURL}/tables`);
      const response = await api.get('/tables');
      console.log('Tables API response:', response);
      console.log('Response data type:', typeof response.data, Array.isArray(response.data));
      console.log('Response data:', response.data);
      
      // Backend returns array directly
      if (Array.isArray(response.data)) {
        console.log(`Successfully fetched ${response.data.length} tables`);
        return { success: true, data: response.data };
      }
      
      // If response.data is not an array, check if it's the old "to be implemented" message
      if (response.data && response.data.message) {
        console.error('Server returned old endpoint message:', response.data.message);
        return { 
          success: false, 
          error: 'Server is running old code. Please restart the FastAPI server.',
          data: [] 
        };
      }
      console.warn('Response data is not an array:', response.data);
      return { success: true, data: [] };
    } catch (error) {
      console.error('Failed to fetch tables from backend:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      // Don't use fallback - return error so user knows
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Failed to fetch tables',
        data: [] 
      };
    }
  }

  async getTableById(id) {
    try {
      const response = await api.get(`/tables/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch table:', error);
      return { success: false, error: error.response?.data?.detail || 'Failed to fetch table' };
    }
  }

  async getTableStats() {
    try {
      const response = await this.getTables();
      if (response.success && response.data) {
        const tables = response.data;
        const stats = {
          total: tables.length,
          available: tables.filter(t => t.status === 'available').length,
          occupied: tables.filter(t => t.status === 'occupied').length,
          reserved: tables.filter(t => t.status === 'reserved').length,
          cleaning: tables.filter(t => t.status === 'cleaning').length,
          maintenance: tables.filter(t => t.status === 'maintenance').length
        };
        return { success: true, ...stats };
      }
      return { success: true, total: 0 };
    } catch (error) {
      console.error('Failed to get table stats:', error);
      return { success: true, total: 0 };
    }
  }

  async addTable(tableData) {
    try {
      const payload = {
        number: tableData.number,
        capacity: tableData.capacity,
        status: tableData.status || 'available'
      };
      
      // Only include location and type if they are provided
      if (tableData.location) {
        payload.location = tableData.location;
      }
      if (tableData.type) {
        payload.type = tableData.type;
      }
      
      const response = await api.post('/tables', payload);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to add table:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to add table' 
      };
    }
  }

  async updateTable(id, updatedData) {
    try {
      const payload = {
        number: updatedData.number,
        capacity: updatedData.capacity,
        status: updatedData.status
      };
      
      // Only include fields if they are provided
      if (updatedData.location !== undefined) {
        payload.location = updatedData.location;
      }
      if (updatedData.type !== undefined) {
        payload.type = updatedData.type;
      }
      if (updatedData.currentOrder !== undefined) {
        payload.currentOrderId = updatedData.currentOrder;
      }
      if (updatedData.customer !== undefined) {
        payload.currentCustomer = updatedData.customer ? { name: updatedData.customer } : null;
      }
      
      const response = await api.put(`/tables/${id}`, payload);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to update table:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to update table' 
      };
    }
  }

  async deleteTable(id) {
    try {
      const response = await api.delete(`/tables/${id}`);
      return { 
        success: true, 
        message: response.data?.message || 'Table deleted successfully' 
      };
    } catch (error) {
      console.error('Failed to delete table:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to delete table' 
      };
    }
  }

  async updateTableStatus(id, status) {
    try {
      const response = await api.patch(`/tables/${id}/status`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to update table status:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to update table status' 
      };
    }
  }
}

export default new TableService();
