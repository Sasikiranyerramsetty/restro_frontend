// Mock data for menu management
const mockMenuItems = [
  {
    id: 1,
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice cooked with tender chicken pieces and aromatic spices',
    price: 280,
    category: 'biryanis',
    subcategory: 'Non-Vegetarian',
    image: null,
    available: true,
    preparationTime: 25,
    ingredients: ['Basmati Rice', 'Chicken', 'Onions', 'Yogurt', 'Spices'],
    allergens: ['Dairy'],
    nutritionInfo: {
      calories: 450,
      protein: 25,
      carbs: 55,
      fat: 12
    },
    popularity: 4.8,
    totalOrders: 150,
    revenue: 42000,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-10'
  },
  {
    id: 2,
    name: 'Mutton Curry',
    description: 'Tender mutton pieces cooked in rich, spicy curry with traditional Indian spices',
    price: 320,
    category: 'curries',
    subcategory: 'Non-Vegetarian',
    image: null,
    available: true,
    preparationTime: 35,
    ingredients: ['Mutton', 'Onions', 'Tomatoes', 'Ginger', 'Garlic', 'Spices'],
    allergens: [],
    nutritionInfo: {
      calories: 380,
      protein: 30,
      carbs: 8,
      fat: 25
    },
    popularity: 4.6,
    totalOrders: 120,
    revenue: 38400,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-08'
  },
  {
    id: 3,
    name: 'Dal Makhani',
    description: 'Creamy black lentils cooked with butter and cream, a North Indian delicacy',
    price: 180,
    category: 'curries',
    subcategory: 'Vegetarian',
    image: null,
    available: true,
    preparationTime: 20,
    ingredients: ['Black Lentils', 'Kidney Beans', 'Butter', 'Cream', 'Spices'],
    allergens: ['Dairy'],
    nutritionInfo: {
      calories: 320,
      protein: 18,
      carbs: 35,
      fat: 12
    },
    popularity: 4.7,
    totalOrders: 200,
    revenue: 36000,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-12'
  },
  {
    id: 4,
    name: 'RESTRO Special Thali',
    description: 'Our signature thali with chef\'s special dishes including rice, dal, curry, and dessert',
    price: 350,
    category: 'restro_specials',
    subcategory: 'Combo',
    image: null,
    available: true,
    preparationTime: 30,
    ingredients: ['Rice', 'Dal', 'Curry', 'Raita', 'Papad', 'Dessert'],
    allergens: ['Dairy', 'Gluten'],
    nutritionInfo: {
      calories: 650,
      protein: 25,
      carbs: 85,
      fat: 18
    },
    popularity: 4.9,
    totalOrders: 180,
    revenue: 63000,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-14'
  },
  {
    id: 5,
    name: 'Butter Chicken',
    description: 'Tender chicken pieces in rich tomato and cream sauce with aromatic spices',
    price: 290,
    category: 'curries',
    subcategory: 'Non-Vegetarian',
    image: null,
    available: false,
    preparationTime: 25,
    ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Butter', 'Spices'],
    allergens: ['Dairy'],
    nutritionInfo: {
      calories: 420,
      protein: 28,
      carbs: 12,
      fat: 28
    },
    popularity: 4.5,
    totalOrders: 90,
    revenue: 26100,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-05'
  },
  {
    id: 6,
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese cubes marinated in yogurt and spices',
    price: 220,
    category: 'appetizers',
    subcategory: 'Vegetarian',
    image: null,
    available: true,
    preparationTime: 15,
    ingredients: ['Paneer', 'Yogurt', 'Bell Peppers', 'Onions', 'Spices'],
    allergens: ['Dairy'],
    nutritionInfo: {
      calories: 280,
      protein: 20,
      carbs: 8,
      fat: 18
    },
    popularity: 4.4,
    totalOrders: 110,
    revenue: 24200,
    createdAt: '2023-01-15',
    updatedAt: '2024-01-11'
  }
];

const mockCategories = [
  { id: 'biryanis', name: 'Biryanis', itemCount: 1, revenue: 42000 },
  { id: 'curries', name: 'Curries', itemCount: 3, revenue: 100500 },
  { id: 'restro_specials', name: 'RESTRO Specials', itemCount: 1, revenue: 63000 },
  { id: 'appetizers', name: 'Appetizers', itemCount: 1, revenue: 24200 },
  { id: 'beverages', name: 'Beverages', itemCount: 0, revenue: 0 },
  { id: 'desserts', name: 'Desserts', itemCount: 0, revenue: 0 }
];

const mockMenuStats = {
  totalItems: 6,
  availableItems: 5,
  unavailableItems: 1,
  totalRevenue: 229900,
  averagePrice: 255.44,
  mostPopular: 'RESTRO Special Thali',
  topCategory: 'Curries',
  totalOrders: 850,
  averageRating: 4.65
};

class MenuManagementService {
  async getMenuItems() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMenuItems;
  }

  async getCategories() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories;
  }

  async getMenuStats() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMenuStats;
  }

  async getMenuItemById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMenuItems.find(item => item.id === id);
  }

  async addMenuItem(itemData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newItem = {
      id: Date.now(),
      ...itemData,
      popularity: 0,
      totalOrders: 0,
      revenue: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    mockMenuItems.push(newItem);
    return { success: true, data: newItem };
  }

  async updateMenuItem(id, itemData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockMenuItems.findIndex(item => item.id === id);
    if (index !== -1) {
      mockMenuItems[index] = { 
        ...mockMenuItems[index], 
        ...itemData,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return { success: true, data: mockMenuItems[index] };
    }
    return { success: false, error: 'Menu item not found' };
  }

  async deleteMenuItem(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockMenuItems.findIndex(item => item.id === id);
    if (index !== -1) {
      mockMenuItems.splice(index, 1);
      return { success: true };
    }
    return { success: false, error: 'Menu item not found' };
  }

  async toggleAvailability(id) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const item = mockMenuItems.find(item => item.id === id);
    if (item) {
      item.available = !item.available;
      item.updatedAt = new Date().toISOString().split('T')[0];
      return { success: true, data: item };
    }
    return { success: false, error: 'Menu item not found' };
  }
}

export default new MenuManagementService();
