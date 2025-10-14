// Mock data for customer management
const mockCustomers = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    phone: '+91 98765 43220',
    status: 'active',
    totalOrders: 15,
    totalSpent: 12500,
    lastOrder: '2024-01-15',
    joinDate: '2023-06-10',
    preferences: ['Vegetarian', 'Spicy'],
    loyaltyPoints: 1250
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    phone: '+91 98765 43221',
    status: 'active',
    totalOrders: 8,
    totalSpent: 6800,
    lastOrder: '2024-01-12',
    joinDate: '2023-08-20',
    preferences: ['Non-Vegetarian', 'Mild'],
    loyaltyPoints: 680
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol.davis@email.com',
    phone: '+91 98765 43222',
    status: 'inactive',
    totalOrders: 3,
    totalSpent: 2100,
    lastOrder: '2023-12-05',
    joinDate: '2023-10-15',
    preferences: ['Vegetarian', 'Mild'],
    loyaltyPoints: 210
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+91 98765 43223',
    status: 'active',
    totalOrders: 22,
    totalSpent: 18900,
    lastOrder: '2024-01-14',
    joinDate: '2023-04-05',
    preferences: ['Non-Vegetarian', 'Spicy'],
    loyaltyPoints: 1890
  },
  {
    id: 5,
    name: 'Emma Brown',
    email: 'emma.brown@email.com',
    phone: '+91 98765 43224',
    status: 'active',
    totalOrders: 12,
    totalSpent: 9600,
    lastOrder: '2024-01-13',
    joinDate: '2023-07-12',
    preferences: ['Vegetarian', 'Medium'],
    loyaltyPoints: 960
  }
];

const mockCustomerStats = {
  total: 5,
  active: 4,
  inactive: 1,
  totalOrders: 60,
  totalRevenue: 49900,
  averageOrderValue: 831.67,
  topSpenders: [
    { name: 'David Wilson', amount: 18900 },
    { name: 'Alice Johnson', amount: 12500 },
    { name: 'Emma Brown', amount: 9600 }
  ]
};

class CustomerService {
  async getCustomers() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCustomers;
  }

  async getCustomerStats() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCustomerStats;
  }

  async getCustomerById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCustomers.find(customer => customer.id === id);
  }

  async updateCustomerStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) {
      customer.status = status;
      return { success: true, data: customer };
    }
    return { success: false, error: 'Customer not found' };
  }
}

const customerService = new CustomerService();
export default customerService;
