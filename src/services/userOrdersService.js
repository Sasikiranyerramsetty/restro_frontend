import api from './api';

class UserOrdersService {
  /**
   * Fetch menu data from menu_management collection
   * @returns {Promise<Object>} Menu data with categories and items
   */
  async getMenu() {
    try {
      const response = await api.get('/api/user-orders/menu');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch menu' 
      };
    }
  }

  /**
   * Add item to cart
   * @param {string} userId - User ID or session ID
   * @param {Object} itemData - Item data (item_id, quantity, category, diet_type)
   * @returns {Promise<Object>} Success response
   */
  async addToCart(userId, itemData) {
    try {
      const response = await api.post('/api/user-orders/cart/add', {
        user_id: userId,
        item_id: itemData.item_id,
        quantity: itemData.quantity || 1,
        category: itemData.category,
        diet_type: itemData.diet_type
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to add item to cart' 
      };
    }
  }

  /**
   * Get current cart with totals
   * @param {string} userId - User ID or session ID
   * @returns {Promise<Object>} Cart data with items and totals
   */
  async getCart(userId) {
    try {
      const response = await api.get(`/api/user-orders/cart/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch cart',
        data: { items: [], subtotal: 0, tax: 0, total: 0, item_count: 0 }
      };
    }
  }

  /**
   * Update item quantity in cart
   * @param {string} userId - User ID or session ID
   * @param {string} itemId - Item ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Success response
   */
  async updateQuantity(userId, itemId, quantity) {
    try {
      const response = await api.post('/api/user-orders/cart/update-quantity', {
        user_id: userId,
        item_id: itemId,
        new_quantity: quantity
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to update quantity:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to update quantity' 
      };
    }
  }

  /**
   * Remove item from cart
   * @param {string} userId - User ID or session ID
   * @param {string} itemId - Item ID
   * @returns {Promise<Object>} Success response
   */
  async removeFromCart(userId, itemId) {
    try {
      const response = await api.post('/api/user-orders/cart/remove', {
        user_id: userId,
        item_id: itemId
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to remove item from cart' 
      };
    }
  }

  /**
   * Checkout and place order
   * @param {string} userId - User ID or session ID
   * @param {Object} checkoutData - Checkout data (order_type, payment_method, etc.)
   * @returns {Promise<Object>} Order confirmation
   */
  async checkout(userId, checkoutData) {
    try {
      const response = await api.post('/api/user-orders/checkout', {
        user_id: userId,
        order_type: checkoutData.order_type,
        payment_method: checkoutData.payment_method,
        delivery_address: checkoutData.delivery_address || null,
        special_instructions: checkoutData.special_instructions || null
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Failed to checkout:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to place order' 
      };
    }
  }

  /**
   * Get all completed orders for a user
   * Only returns orders that have been successfully placed and paid
   * @param {string} userId - User ID or session ID
   * @returns {Promise<Object>} List of orders
   */
  async getUserOrders(userId) {
    try {
      const response = await api.get(`/api/user-orders/orders/${userId}`);
      return { success: true, data: response.data.data || [] };
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to fetch orders',
        data: []
      };
    }
  }
}

export default new UserOrdersService();

