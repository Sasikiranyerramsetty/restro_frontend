import api from './api';
import { buildMenuFromSections } from '../data/restaurantData';

// Build once at module load (fallback)
const built = buildMenuFromSections();

// Helper function to normalize category/subcategory names
const normalize = (label) => (label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

// Helper function to flatten menu structure from backend
function flattenMenuItems(menuDocs) {
  const items = [];
  menuDocs.forEach(doc => {
    if (doc.items && Array.isArray(doc.items)) {
      const mainCategory = doc.category || '';
      const subCategory = doc.subcategory;
      
      doc.items.forEach(item => {
        // Normalize category and subcategory
        const normalizedCategory = normalize(mainCategory);
        const normalizedSubcategory = subCategory ? normalize(subCategory) : null;
        
        // Create unique ID - use category|subcategory|name format, or category||name if no subcategory
        const id = subCategory 
          ? `${normalizedCategory}|${normalizedSubcategory}|${item.name}`
          : `${normalizedCategory}||${item.name}`;
        
        items.push({
          id,
          name: item.name,
          price: item.price,
          category: normalizedCategory,
          subcategory: normalizedSubcategory, // null if no subcategory
          available: item.available !== undefined ? item.available : true,
          preparationTime: item.preparationTime || 0,
          popularity: item.popularity || 0,
          totalOrders: item.totalOrders || 0,
          revenue: item.revenue || 0
        });
      });
    }
  });
  return items;
}

class MenuManagementService {
  async getMenuItems() {
    try {
      const response = await api.get('/menu');
      const flattened = flattenMenuItems(response.data);
      return flattened;
    } catch (error) {
      console.error('Failed to fetch menu from backend, using fallback:', error);
      // Fallback to built data
      return built.menuItems;
    }
  }

  async getCategories() {
    try {
      const response = await api.get('/menu');
      // Extract unique categories and subcategories
      const categoriesMap = new Map();
      response.data.forEach(doc => {
        // Use subcategory if it exists, otherwise use category
        const key = doc.subcategory || doc.category;
        if (key) {
          const normalizedId = key.toLowerCase().replace(/\s+/g, '-');
          if (!categoriesMap.has(normalizedId)) {
            categoriesMap.set(normalizedId, {
              id: normalizedId,
              name: key
            });
          }
        }
      });
      return Array.from(categoriesMap.values());
    } catch (error) {
      console.error('Failed to fetch categories from backend, using fallback:', error);
      return built.categories;
    }
  }

  async getMenuStats() {
    try {
      const items = await this.getMenuItems();
      // Count available items: treat undefined/missing as true (available by default)
      const availableItems = items.filter(i => i.available !== false).length;
      const unavailableItems = items.filter(i => i.available === false).length;
      
      return {
        totalItems: items.length,
        availableItems: availableItems,
        unavailableItems: unavailableItems,
        totalRevenue: items.reduce((sum, i) => sum + (i.revenue || 0), 0),
        averagePrice: items.length > 0 ? items.reduce((sum, i) => sum + i.price, 0) / items.length : 0,
        mostPopular: items[0]?.name || '',
        topCategory: '',
        totalOrders: items.reduce((sum, i) => sum + (i.totalOrders || 0), 0),
        averageRating: 4.6
      };
    } catch (error) {
      console.error('Failed to fetch stats, using fallback:', error);
      return built.menuStats;
    }
  }

  async getMenuItemById(id) {
    try {
      const items = await this.getMenuItems();
      return items.find(item => item.id === id);
    } catch (error) {
      console.error('Failed to fetch menu item:', error);
      return built.menuItems.find(item => item.id === id);
    }
  }

  async addMenuItem(itemData) {
    try {
      const response = await api.post('/menu/items', {
        name: itemData.name,
        price: itemData.price,
        category: itemData.category,
        subcategory: itemData.subcategory,
        available: itemData.available !== undefined ? itemData.available : true,
        preparationTime: itemData.preparationTime || 0
      });
      
      // Return in the format expected by the frontend
      const newItem = {
        id: `${itemData.category}|${itemData.subcategory}|${itemData.name}`,
        name: itemData.name,
        price: itemData.price,
        category: itemData.category,
        subcategory: itemData.subcategory,
        available: itemData.available !== undefined ? itemData.available : true,
        preparationTime: itemData.preparationTime || 0,
        popularity: 0,
        totalOrders: 0,
        revenue: 0
      };
      
      return { success: true, data: newItem };
    } catch (error) {
      console.error('Failed to add menu item:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to add menu item' 
      };
    }
  }

  async updateMenuItem(id, itemData) {
    try {
      // Send the full item_id in the URL (format: category|subcategory|name)
      // The backend will parse it correctly
      await api.put(`/menu/items/${encodeURIComponent(id)}`, {
        name: itemData.name,
        price: itemData.price,
        category: itemData.category,
        subcategory: itemData.subcategory,
        available: itemData.available,
        preparationTime: itemData.preparationTime
      });
      
      return { 
        success: true, 
        data: {
          ...itemData,
          id: id
        }
      };
    } catch (error) {
      console.error('Failed to update menu item:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to update menu item' 
      };
    }
  }

  async deleteMenuItem(id) {
    try {
      // Extract item name from ID (format: category|subcategory|name)
      const parts = id.split('|');
      const itemName = parts[parts.length - 1];
      const category = parts[0];
      const subcategory = parts[1];
      
      await api.delete(`/menu/items/${itemName}`, {
        params: { category, subcategory }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to delete menu item' 
      };
    }
  }

  async toggleAvailability(id) {
    try {
      // Fetch fresh data to get current state
      const items = await this.getMenuItems();
      const item = items.find(item => item.id === id);
      
      if (!item) {
        return { success: false, error: 'Menu item not found' };
      }
      
      // Get current available state (default to true if not set)
      const currentAvailable = item.available !== undefined ? item.available : true;
      const newAvailable = !currentAvailable;
      
      console.log('Toggling availability:', { id, currentAvailable, newAvailable });
      
      // Update with the new availability state
      const updated = await this.updateMenuItem(id, {
        name: item.name,
        price: item.price,
        category: item.category,
        subcategory: item.subcategory,
        available: newAvailable,
        preparationTime: item.preparationTime
      });
      
      return updated;
    } catch (error) {
      console.error('Failed to toggle availability:', error);
      return { success: false, error: 'Failed to toggle availability' };
    }
  }
}

export default new MenuManagementService();
