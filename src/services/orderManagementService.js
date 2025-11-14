import api from './api';

// Mock data for order management (fallback)
const mockOrders = [
  {
    id: 1,
    orderNumber: 'ORD-001',
    customerName: 'John Doe',
    customerPhone: '9876543210',
    customerEmail: 'john.doe@example.com',
    tableNumber: 'T1',
    status: 'completed', // pending, confirmed, preparing, ready, completed, cancelled
    orderType: 'dine-in', // dine-in, takeaway, delivery
    items: [
      { id: 1, name: 'Chicken Biryani', quantity: 2, price: 280, total: 560 },
      { id: 2, name: 'Dal Makhani', quantity: 1, price: 180, total: 180 }
    ],
    subtotal: 740,
    tax: 111,
    discount: 0,
    total: 851,
    paymentMethod: 'card', // cash, card, upi
    paymentStatus: 'paid', // paid, pending, failed
    orderDate: '2024-01-20',
    orderTime: '19:30',
    completedTime: '20:15',
    notes: 'Extra spicy',
    assignedWaiter: 'John Smith',
    kitchenNotes: 'No onions in biryani'
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    customerName: 'Jane Smith',
    customerPhone: '9876543211',
    customerEmail: 'jane.smith@example.com',
    tableNumber: 'T3',
    status: 'preparing',
    orderType: 'dine-in',
    items: [
      { id: 3, name: 'RESTRO Special Thali', quantity: 1, price: 350, total: 350 },
      { id: 4, name: 'Paneer Tikka', quantity: 1, price: 220, total: 220 }
    ],
    subtotal: 570,
    tax: 85.5,
    discount: 50,
    total: 605.5,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderDate: '2024-01-20',
    orderTime: '20:00',
    assignedWaiter: 'Sarah Johnson',
    notes: 'Birthday celebration'
  },
  {
    id: 3,
    orderNumber: 'ORD-003',
    customerName: 'Mike Wilson',
    customerPhone: '9876543212',
    customerEmail: 'mike.wilson@example.com',
    tableNumber: null,
    status: 'pending',
    orderType: 'takeaway',
    items: [
      { id: 1, name: 'Chicken Biryani', quantity: 1, price: 280, total: 280 },
      { id: 5, name: 'Butter Chicken', quantity: 1, price: 290, total: 290 }
    ],
    subtotal: 570,
    tax: 85.5,
    discount: 0,
    total: 655.5,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    orderDate: '2024-01-20',
    orderTime: '20:15',
    notes: 'Pickup at 8:30 PM',
    assignedWaiter: null
  },
  {
    id: 4,
    orderNumber: 'ORD-004',
    customerName: 'Emily Davis',
    customerPhone: '9876543213',
    customerEmail: 'emily.davis@example.com',
    tableNumber: 'T5',
    status: 'ready',
    orderType: 'dine-in',
    items: [
      { id: 2, name: 'Mutton Curry', quantity: 1, price: 320, total: 320 },
      { id: 3, name: 'RESTRO Special Thali', quantity: 1, price: 350, total: 350 }
    ],
    subtotal: 670,
    tax: 100.5,
    discount: 0,
    total: 770.5,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderDate: '2024-01-20',
    orderTime: '19:45',
    assignedWaiter: 'David Brown',
    notes: 'Anniversary dinner'
  },
  {
    id: 5,
    orderNumber: 'ORD-005',
    customerName: 'Alice Wonderland',
    customerPhone: '9876543214',
    customerEmail: 'alice@example.com',
    tableNumber: 'T2',
    status: 'confirmed',
    orderType: 'dine-in',
    items: [
      { id: 6, name: 'Paneer Tikka', quantity: 2, price: 220, total: 440 },
      { id: 1, name: 'Chicken Biryani', quantity: 1, price: 280, total: 280 }
    ],
    subtotal: 720,
    tax: 108,
    discount: 0,
    total: 828,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderDate: '2024-01-20',
    orderTime: '20:30',
    assignedWaiter: 'John Smith',
    notes: 'Vegetarian options preferred'
  },
  {
    id: 6,
    orderNumber: 'ORD-006',
    customerName: 'Bob The Builder',
    customerPhone: '9876543215',
    customerEmail: 'bob@example.com',
    tableNumber: null,
    status: 'preparing',
    orderType: 'delivery',
    items: [
      { id: 1, name: 'Chicken Biryani', quantity: 2, price: 280, total: 560 },
      { id: 2, name: 'Dal Makhani', quantity: 1, price: 180, total: 180 },
      { id: 3, name: 'RESTRO Special Thali', quantity: 1, price: 350, total: 350 }
    ],
    subtotal: 1090,
    tax: 163.5,
    discount: 50,
    total: 1203.5,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderDate: '2024-01-20',
    orderTime: '21:00',
    assignedWaiter: null,
    notes: 'Deliver to apartment 4B, ring doorbell twice'
  },
  {
    id: 7,
    orderNumber: 'ORD-007',
    customerName: 'Charlie Chaplin',
    customerPhone: '9876543216',
    customerEmail: 'charlie@example.com',
    tableNumber: null,
    status: 'ready',
    orderType: 'takeaway',
    items: [
      { id: 4, name: 'Paneer Tikka', quantity: 1, price: 220, total: 220 },
      { id: 5, name: 'Butter Chicken', quantity: 1, price: 290, total: 290 }
    ],
    subtotal: 510,
    tax: 76.5,
    discount: 0,
    total: 586.5,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    orderDate: '2024-01-20',
    orderTime: '21:15',
    assignedWaiter: null,
    notes: 'Pickup at 9:30 PM'
  },
  {
    id: 8,
    orderNumber: 'ORD-008',
    customerName: 'Diana Prince',
    customerPhone: '9876543217',
    customerEmail: 'diana@example.com',
    tableNumber: 'T4',
    status: 'pending',
    orderType: 'dine-in',
    items: [
      { id: 1, name: 'Chicken Biryani', quantity: 1, price: 280, total: 280 },
      { id: 2, name: 'Mutton Curry', quantity: 1, price: 320, total: 320 }
    ],
    subtotal: 600,
    tax: 90,
    discount: 0,
    total: 690,
    paymentMethod: 'upi',
    paymentStatus: 'pending',
    orderDate: '2024-01-20',
    orderTime: '21:30',
    assignedWaiter: 'Sarah Johnson',
    notes: 'Window seat preferred'
  }
];

const mockOrderStats = {
  totalOrders: 8,
  pendingOrders: 2,
  preparingOrders: 2,
  readyOrders: 2,
  completedOrders: 1,
  cancelledOrders: 1,
  totalRevenue: 5985.5,
  averageOrderValue: 748.2,
  todayRevenue: 5985.5,
  popularItems: [
    { name: 'Chicken Biryani', orders: 3, revenue: 1120 },
    { name: 'RESTRO Special Thali', orders: 2, revenue: 700 },
    { name: 'Paneer Tikka', orders: 2, revenue: 440 }
  ],
  orderTypes: {
    'dine-in': 4,
    'takeaway': 1,
    'delivery': 0
  },
  paymentMethods: {
    'card': 2,
    'upi': 2,
    'cash': 1
  }
};

class OrderManagementService {
  async getOrders() {
    try {
      const response = await api.get('/api/user-orders/admin/orders');
      if (response.data.success) {
        return response.data.data || [];
      }
      // Fallback to mock data if API fails
      return mockOrders;
    } catch (error) {
      console.error('Failed to fetch orders from API, using mock data:', error);
      return mockOrders;
    }
  }

  async getOrderStats() {
    try {
      // Fetch orders to calculate stats
      const orders = await this.getOrders();
      
      // Calculate stats from orders
      const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        preparingOrders: orders.filter(o => o.status === 'preparing').length,
        readyOrders: orders.filter(o => o.status === 'ready').length,
        completedOrders: orders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length : 0,
        todayRevenue: orders
          .filter(o => {
            const today = new Date().toISOString().split('T')[0];
            return o.orderDate === today;
          })
          .reduce((sum, o) => sum + (o.total || 0), 0),
        popularItems: this._calculatePopularItems(orders),
        orderTypes: {
          'dine-in': orders.filter(o => o.orderType === 'dine-in').length,
          'takeaway': orders.filter(o => o.orderType === 'takeaway').length,
          'delivery': orders.filter(o => o.orderType === 'delivery').length
        },
        paymentMethods: {
          'card': orders.filter(o => o.paymentMethod === 'card').length,
          'upi': orders.filter(o => o.paymentMethod === 'upi').length,
          'cash': orders.filter(o => o.paymentMethod === 'cash').length,
          'wallet': orders.filter(o => o.paymentMethod === 'wallet').length
        }
      };
      
      return stats;
    } catch (error) {
      console.error('Failed to calculate order stats, using mock data:', error);
      return mockOrderStats;
    }
  }

  _calculatePopularItems(orders) {
    const itemCounts = {};
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        const itemName = item.name || 'Unknown';
        if (!itemCounts[itemName]) {
          itemCounts[itemName] = { orders: 0, revenue: 0 };
        }
        itemCounts[itemName].orders += 1;
        itemCounts[itemName].revenue += (item.total || item.price * item.quantity || 0);
      });
    });
    
    return Object.entries(itemCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);
  }

  async getOrderById(id) {
    try {
      const orders = await this.getOrders();
      return orders.find(order => order.orderNumber === id || order.id === id) || null;
    } catch (error) {
      console.error('Failed to fetch order by ID:', error);
      return null;
    }
  }

  async updateOrderStatus(id, status) {
    try {
      // Find order by orderNumber (which is the order_id from backend)
      const orders = await this.getOrders();
      const order = orders.find(o => o.orderNumber === id || o.id === id);
      
      if (order) {
        // Update status in backend
        // For now, we'll update locally and sync later
        // TODO: Create backend endpoint to update order status
        order.status = status;
        if (status === 'completed') {
          order.completedTime = new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
        }
        return { success: true, data: order };
      }
      return { success: false, error: 'Order not found' };
    } catch (error) {
      console.error('Failed to update order status:', error);
      return { success: false, error: 'Failed to update order status' };
    }
  }

  async assignWaiter(orderId, waiterName) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const order = mockOrders.find(order => order.id === orderId);
    if (order) {
      order.assignedWaiter = waiterName;
      return { success: true, data: order };
    }
    return { success: false, error: 'Order not found' };
  }

  async getOrdersByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockOrders.filter(order => order.status === status);
  }

  async getOrdersByDate(date) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockOrders.filter(order => order.orderDate === date);
  }
}

export default new OrderManagementService();
