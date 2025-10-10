// Mock data for inventory management
const mockInventoryItems = [
  {
    id: 1,
    name: 'Basmati Rice',
    category: 'Grains',
    currentStock: 50,
    minStock: 10,
    maxStock: 100,
    unit: 'kg',
    price: 120,
    supplier: 'Grain Suppliers Ltd',
    lastRestocked: '2024-01-10',
    expiryDate: '2024-12-31',
    status: 'in_stock'
  },
  {
    id: 2,
    name: 'Chicken Breast',
    category: 'Meat',
    currentStock: 25,
    minStock: 5,
    maxStock: 50,
    unit: 'kg',
    price: 300,
    supplier: 'Fresh Meat Co',
    lastRestocked: '2024-01-12',
    expiryDate: '2024-01-20',
    status: 'in_stock'
  },
  {
    id: 3,
    name: 'Onions',
    category: 'Vegetables',
    currentStock: 3,
    minStock: 10,
    maxStock: 50,
    unit: 'kg',
    price: 40,
    supplier: 'Vegetable Market',
    lastRestocked: '2024-01-08',
    expiryDate: '2024-01-25',
    status: 'low_stock'
  },
  {
    id: 4,
    name: 'Tomatoes',
    category: 'Vegetables',
    currentStock: 0,
    minStock: 5,
    maxStock: 30,
    unit: 'kg',
    price: 60,
    supplier: 'Vegetable Market',
    lastRestocked: '2024-01-05',
    expiryDate: '2024-01-18',
    status: 'out_of_stock'
  },
  {
    id: 5,
    name: 'Cooking Oil',
    category: 'Cooking Essentials',
    currentStock: 15,
    minStock: 5,
    maxStock: 25,
    unit: 'liters',
    price: 180,
    supplier: 'Oil Distributors',
    lastRestocked: '2024-01-11',
    expiryDate: '2025-01-11',
    status: 'in_stock'
  }
];

const mockInventoryStats = {
  totalItems: 5,
  inStock: 3,
  lowStock: 1,
  outOfStock: 1,
  totalValue: 15750,
  categories: {
    'Grains': 1,
    'Meat': 1,
    'Vegetables': 2,
    'Cooking Essentials': 1
  },
  lowStockItems: [
    { name: 'Onions', currentStock: 3, minStock: 10 },
    { name: 'Tomatoes', currentStock: 0, minStock: 5 }
  ]
};

class InventoryService {
  async getInventoryItems() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockInventoryItems;
  }

  async getInventoryStats() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInventoryStats;
  }

  async addInventoryItem(itemData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newItem = {
      id: Date.now(),
      ...itemData,
      status: itemData.currentStock > itemData.minStock ? 'in_stock' : 
              itemData.currentStock === 0 ? 'out_of_stock' : 'low_stock'
    };
    mockInventoryItems.push(newItem);
    return { success: true, data: newItem };
  }

  async updateInventoryItem(id, itemData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockInventoryItems.findIndex(item => item.id === id);
    if (index !== -1) {
      mockInventoryItems[index] = { ...mockInventoryItems[index], ...itemData };
      return { success: true, data: mockInventoryItems[index] };
    }
    return { success: false, error: 'Item not found' };
  }

  async restockItem(id, quantity) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const item = mockInventoryItems.find(item => item.id === id);
    if (item) {
      item.currentStock += quantity;
      item.lastRestocked = new Date().toISOString().split('T')[0];
      item.status = item.currentStock > item.minStock ? 'in_stock' : 
                   item.currentStock === 0 ? 'out_of_stock' : 'low_stock';
      return { success: true, data: item };
    }
    return { success: false, error: 'Item not found' };
  }
}

export default new InventoryService();
