import { buildMenuFromSections } from '../data/restaurantData';

// Build once at module load
const built = buildMenuFromSections();

class MenuManagementService {
  async getMenuItems() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return built.menuItems;
  }

  async getCategories() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return built.categories;
  }

  async getMenuStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return built.menuStats;
  }

  async getMenuItemById(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return built.menuItems.find(item => item.id === id);
  }

  async addMenuItem(itemData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const now = new Date().toISOString().split('T')[0];
    const newItem = {
      id: Math.max(0, ...built.menuItems.map(i => i.id)) + 1,
      popularity: 0,
      totalOrders: 0,
      revenue: 0,
      createdAt: now,
      updatedAt: now,
      available: true,
      preparationTime: 0,
      ...itemData
    };
    built.menuItems.push(newItem);
    built.menuStats.totalItems = built.menuItems.length;
    built.menuStats.availableItems = built.menuItems.filter(i => i.available).length;
    return { success: true, data: newItem };
  }

  async updateMenuItem(id, itemData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const idx = built.menuItems.findIndex(i => i.id === id);
    if (idx === -1) return { success: false, error: 'Menu item not found' };
    built.menuItems[idx] = { ...built.menuItems[idx], ...itemData, updatedAt: new Date().toISOString().split('T')[0] };
    return { success: true, data: built.menuItems[idx] };
  }

  async deleteMenuItem(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const idx = built.menuItems.findIndex(i => i.id === id);
    if (idx === -1) return { success: false, error: 'Menu item not found' };
    built.menuItems.splice(idx, 1);
    built.menuStats.totalItems = built.menuItems.length;
    built.menuStats.availableItems = built.menuItems.filter(i => i.available).length;
    return { success: true };
  }

  async toggleAvailability(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const item = built.menuItems.find(i => i.id === id);
    if (!item) return { success: false, error: 'Menu item not found' };
    item.available = !item.available;
    item.updatedAt = new Date().toISOString().split('T')[0];
    built.menuStats.availableItems = built.menuItems.filter(i => i.available).length;
    return { success: true, data: item };
  }
}

export default new MenuManagementService();
