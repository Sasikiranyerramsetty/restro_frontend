import api from './api';

class CustomerService {
  async getCustomers() {
    try {
      const response = await api.get('/users/customers');
      // Expect an array of customers
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch customers');
    }
  }

  async getCustomerStats() {
    try {
      const response = await api.get('/users/customers');
      const customers = Array.isArray(response.data) ? response.data : [];
      const total = customers.length;
      const active = customers.filter(c => c.status === 'active').length;
      const totalOrders = customers.reduce((s, c) => s + (c.totalOrders || 0), 0);
      const totalRevenue = customers.reduce((s, c) => s + (c.totalSpent || 0), 0);
      const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
      return { total, active, inactive: total - active, totalOrders, totalRevenue, averageOrderValue };
    } catch (error) {
      return { total: 0, active: 0, inactive: 0, totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
    }
  }

  async getCustomerById(id) {
    const response = await api.get(`/users/customers/${id}`);
    return response.data;
  }

  async updateCustomerStatus(id, status) {
    try {
      const response = await api.patch(`/users/customers/${id}/status`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Failed to update customer' };
    }
  }
}

const customerService = new CustomerService();
export default customerService;
