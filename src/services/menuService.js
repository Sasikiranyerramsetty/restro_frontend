import api from './api';
import { buildMenuFromSections } from '../data/restaurantData';

// Build once from the DB-sourced sections (kept in repo under src/data)
const built = buildMenuFromSections();

class MenuService {
  // Get all menu categories
  async getCategories() {
    try {
      // Use built categories from DB JSON
      const normalized = built.categories.map(c => ({ id: c.id, name: c.name }));
      return { success: true, data: normalized };
    } catch (error) {
      return { success: false, error: 'Failed to fetch categories' };
    }
  }

  // Get menu items by category
  async getMenuItems(categoryId = null, params = {}) {
    try {
      // Filter by category if specified using built menu
      let filteredItems = built.menuItems;
      if (categoryId) {
        filteredItems = built.menuItems.filter(item => item.subcategory === categoryId || item.category === categoryId);
      }
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
      // Derive "popular" by using price as tie-breaker (no real orders data)
      const ranked = [...built.menuItems].slice(0, limit);
      return { success: true, data: ranked };
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

const menuService = new MenuService();
export default menuService;
