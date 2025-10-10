import api from './api';

class MenuService {
  // Get all menu categories
  async getCategories() {
    try {
      // Mock categories data
      const mockCategories = [
        { id: 'starters', name: 'Starters' },
        { id: 'curries', name: 'Curries' },
        { id: 'biryanis', name: 'Biryanis' },
        { id: 'family_pack_biryanis', name: 'Family Pack Biryanis' },
        { id: 'meals', name: 'Meals' },
        { id: 'beverages', name: 'Beverages' },
        { id: 'ice_creams', name: 'Ice Creams' },
        { id: 'restro_specials', name: 'RESTRO Specials' }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, data: mockCategories };
    } catch (error) {
      return { success: false, error: 'Failed to fetch categories' };
    }
  }

  // Get menu items by category
  async getMenuItems(categoryId = null, params = {}) {
    try {
      // Mock menu items data
      const mockMenuItems = [
        {
          id: 1,
          name: 'Chicken Biryani',
          description: 'Fragrant basmati rice cooked with tender chicken pieces and aromatic spices',
          price: 250,
          category: 'biryanis',
          image: null,
          available: true,
          rating: 4.8,
          preparationTime: 25
        },
        {
          id: 2,
          name: 'Mutton Curry',
          description: 'Rich and flavorful mutton curry cooked with traditional spices',
          price: 320,
          category: 'curries',
          image: null,
          available: true,
          rating: 4.6,
          preparationTime: 30
        },
        {
          id: 3,
          name: 'Chicken Tikka',
          description: 'Tender chicken pieces marinated in yogurt and spices, grilled to perfection',
          price: 180,
          category: 'starters',
          image: null,
          available: true,
          rating: 4.7,
          preparationTime: 20
        },
        {
          id: 4,
          name: 'Family Pack Biryani',
          description: 'Large portion of biryani perfect for 4-6 people',
          price: 800,
          category: 'family_pack_biryanis',
          image: null,
          available: true,
          rating: 4.9,
          preparationTime: 35
        },
        {
          id: 5,
          name: 'Thali Meal',
          description: 'Complete meal with rice, dal, vegetables, roti, and dessert',
          price: 150,
          category: 'meals',
          image: null,
          available: true,
          rating: 4.5,
          preparationTime: 15
        },
        {
          id: 6,
          name: 'Mango Lassi',
          description: 'Refreshing yogurt drink with fresh mango pulp',
          price: 80,
          category: 'beverages',
          image: null,
          available: true,
          rating: 4.4,
          preparationTime: 5
        },
        {
          id: 7,
          name: 'Kulfi',
          description: 'Traditional Indian ice cream with cardamom and pistachios',
          price: 60,
          category: 'ice_creams',
          image: null,
          available: true,
          rating: 4.6,
          preparationTime: 2
        },
        {
          id: 8,
          name: 'RESTRO Special Thali',
          description: 'Our signature thali with chef\'s special dishes',
          price: 280,
          category: 'restro_specials',
          image: null,
          available: true,
          rating: 4.8,
          preparationTime: 25
        }
      ];

      // Filter by category if specified
      let filteredItems = mockMenuItems;
      if (categoryId) {
        filteredItems = mockMenuItems.filter(item => item.category === categoryId);
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, data: filteredItems };
    } catch (error) {
      return { success: false, error: 'Failed to fetch menu items' };
    }
  }

  // Get single menu item
  async getMenuItem(itemId) {
    try {
      const response = await api.get(`/menu/items/${itemId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch menu item' };
    }
  }

  // Create menu category (Admin only)
  async createCategory(categoryData) {
    try {
      const response = await api.post('/menu/categories', categoryData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create category' };
    }
  }

  // Update menu category (Admin only)
  async updateCategory(categoryId, categoryData) {
    try {
      const response = await api.put(`/menu/categories/${categoryId}`, categoryData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update category' };
    }
  }

  // Delete menu category (Admin only)
  async deleteCategory(categoryId) {
    try {
      const response = await api.delete(`/menu/categories/${categoryId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete category' };
    }
  }

  // Create menu item (Admin only)
  async createMenuItem(itemData) {
    try {
      const response = await api.post('/menu/items', itemData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create menu item' };
    }
  }

  // Update menu item (Admin only)
  async updateMenuItem(itemId, itemData) {
    try {
      const response = await api.put(`/menu/items/${itemId}`, itemData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update menu item' };
    }
  }

  // Delete menu item (Admin only)
  async deleteMenuItem(itemId) {
    try {
      const response = await api.delete(`/menu/items/${itemId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete menu item' };
    }
  }

  // Upload menu item image (Admin only)
  async uploadMenuItemImage(itemId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post(`/menu/items/${itemId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to upload image' };
    }
  }

  // Toggle menu item availability (Admin only)
  async toggleMenuItemAvailability(itemId) {
    try {
      const response = await api.patch(`/menu/items/${itemId}/toggle-availability`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to toggle availability' };
    }
  }

  // Search menu items
  async searchMenuItems(query, filters = {}) {
    try {
      const params = { q: query, ...filters };
      const queryString = new URLSearchParams(params).toString();
      
      const response = await api.get(`/menu/search?${queryString}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Search failed' };
    }
  }

  // Get popular menu items
  async getPopularItems(limit = 10) {
    try {
      // Mock popular items data
      const mockPopularItems = [
        {
          id: 1,
          name: 'Chicken Biryani',
          description: 'Fragrant basmati rice cooked with tender chicken pieces and aromatic spices',
          price: 250,
          category: 'biryanis',
          image: null,
          available: true,
          rating: 4.8,
          preparationTime: 25,
          orders: 150,
          revenue: 37500
        },
        {
          id: 2,
          name: 'Mutton Curry',
          description: 'Rich and flavorful mutton curry cooked with traditional spices',
          price: 320,
          category: 'curries',
          image: null,
          available: true,
          rating: 4.6,
          preparationTime: 30,
          orders: 120,
          revenue: 38400
        },
        {
          id: 3,
          name: 'Chicken Tikka',
          description: 'Tender chicken pieces marinated in yogurt and spices, grilled to perfection',
          price: 180,
          category: 'starters',
          image: null,
          available: true,
          rating: 4.7,
          preparationTime: 20,
          orders: 200,
          revenue: 36000
        },
        {
          id: 4,
          name: 'Family Pack Biryani',
          description: 'Large portion of biryani perfect for 4-6 people',
          price: 800,
          category: 'family_pack_biryanis',
          image: null,
          available: true,
          rating: 4.9,
          preparationTime: 35,
          orders: 80,
          revenue: 64000
        },
        {
          id: 5,
          name: 'Thali Meal',
          description: 'Complete meal with rice, dal, vegetables, roti, and dessert',
          price: 150,
          category: 'meals',
          image: null,
          available: true,
          rating: 4.5,
          preparationTime: 15,
          orders: 300,
          revenue: 45000
        },
        {
          id: 6,
          name: 'Mango Lassi',
          description: 'Refreshing yogurt drink with fresh mango pulp',
          price: 80,
          category: 'beverages',
          image: null,
          available: true,
          rating: 4.4,
          preparationTime: 5,
          orders: 250,
          revenue: 20000
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, data: mockPopularItems.slice(0, limit) };
    } catch (error) {
      return { success: false, error: 'Failed to fetch popular items' };
    }
  }

  // Get menu statistics (Admin only)
  async getMenuStatistics() {
    try {
      const response = await api.get('/menu/statistics');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch menu statistics' };
    }
  }
}

export default new MenuService();
