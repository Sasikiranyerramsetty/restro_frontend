import api from './api';

class OrderService {
  // Get all orders (Admin/Employee)
  async getOrders(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/orders?${queryString}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch orders' };
    }
  }

  // Get single order
  async getOrder(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch order' };
    }
  }

  // Create new order
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create order' };
    }
  }

  // Update order
  async updateOrder(orderId, orderData) {
    try {
      const response = await api.put(`/orders/${orderId}`, orderData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update order' };
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status, notes });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update order status' };
    }
  }

  // Assign order to employee
  async assignOrder(orderId, employeeId) {
    try {
      const response = await api.patch(`/orders/${orderId}/assign`, { employeeId });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to assign order' };
    }
  }

  // Cancel order
  async cancelOrder(orderId, reason = '') {
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`, { reason });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to cancel order' };
    }
  }

  // Get customer orders
  async getCustomerOrders(customerId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/orders/customer/${customerId}?${queryString}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch customer orders' };
    }
  }

  // Get employee orders
  async getEmployeeOrders(employeeId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/orders/employee/${employeeId}?${queryString}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch employee orders' };
    }
  }

  // Get orders by status
  async getOrdersByStatus(status, params = {}) {
    try {
      const queryString = new URLSearchParams({ status, ...params }).toString();
      const response = await api.get(`/orders/status?${queryString}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch orders by status' };
    }
  }

  // Get order statistics
  async getOrderStatistics(params = {}) {
    try {
      // Mock order statistics data
      const mockStatistics = {
        totalRevenue: 125000,
        totalCustomers: 150,
        salesData: [
          { date: '2024-01-01', sales: 15000 },
          { date: '2024-01-02', sales: 18000 },
          { date: '2024-01-03', sales: 22000 },
          { date: '2024-01-04', sales: 19000 },
          { date: '2024-01-05', sales: 25000 },
          { date: '2024-01-06', sales: 28000 },
          { date: '2024-01-07', sales: 30000 }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, data: mockStatistics };
    } catch (error) {
      return { success: false, error: 'Failed to fetch order statistics' };
    }
  }

  // Get today's orders
  async getTodaysOrders() {
    try {
      // Mock today's orders data
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'ORD-001',
          customer: { name: 'John Doe', email: 'john@example.com' },
          status: 'pending',
          total: 450,
          createdAt: new Date().toISOString(),
          items: [
            { name: 'Chicken Biryani', quantity: 1, price: 250 },
            { name: 'Mutton Curry', quantity: 1, price: 200 }
          ]
        },
        {
          id: 2,
          orderNumber: 'ORD-002',
          customer: { name: 'Jane Smith', email: 'jane@example.com' },
          status: 'preparing',
          total: 320,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          items: [
            { name: 'Mutton Curry', quantity: 1, price: 320 }
          ]
        },
        {
          id: 3,
          orderNumber: 'ORD-003',
          customer: { name: 'Mike Johnson', email: 'mike@example.com' },
          status: 'ready',
          total: 180,
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          items: [
            { name: 'Chicken Tikka', quantity: 1, price: 180 }
          ]
        },
        {
          id: 4,
          orderNumber: 'ORD-004',
          customer: { name: 'Sarah Wilson', email: 'sarah@example.com' },
          status: 'completed',
          total: 800,
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          items: [
            { name: 'Family Pack Biryani', quantity: 1, price: 800 }
          ]
        },
        {
          id: 5,
          orderNumber: 'ORD-005',
          customer: { name: 'David Brown', email: 'david@example.com' },
          status: 'pending',
          total: 150,
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          items: [
            { name: 'Thali Meal', quantity: 1, price: 150 }
          ]
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, data: mockOrders };
    } catch (error) {
      return { success: false, error: 'Failed to fetch today\'s orders' };
    }
  }

  // Get pending orders
  async getPendingOrders() {
    try {
      const response = await api.get('/orders/pending');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch pending orders' };
    }
  }

  // Add item to order
  async addItemToOrder(orderId, itemData) {
    try {
      const response = await api.post(`/orders/${orderId}/items`, itemData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to add item to order' };
    }
  }

  // Update order item
  async updateOrderItem(orderId, itemId, itemData) {
    try {
      const response = await api.put(`/orders/${orderId}/items/${itemId}`, itemData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update order item' };
    }
  }

  // Remove item from order
  async removeItemFromOrder(orderId, itemId) {
    try {
      const response = await api.delete(`/orders/${orderId}/items/${itemId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to remove item from order' };
    }
  }

  // Process payment
  async processPayment(orderId, paymentData) {
    try {
      const response = await api.post(`/orders/${orderId}/payment`, paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Payment processing failed' };
    }
  }

  // Get order analytics
  async getOrderAnalytics(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/orders/analytics?${queryString}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch order analytics' };
    }
  }
}

const orderService = new OrderService();
export default orderService;
