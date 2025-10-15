// Mock data for employee management
const mockEmployees = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@restro.com',
    phone: '+91 98765 43210',
    role: 'manager',
    status: 'active',
    shift: 'morning',
    salary: 45000,
    joinDate: '2023-01-15',
    department: 'Operations'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@restro.com',
    phone: '+91 98765 43211',
    role: 'chef',
    status: 'active',
    shift: 'evening',
    salary: 38000,
    joinDate: '2023-03-20',
    department: 'Kitchen'
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike.wilson@restro.com',
    phone: '+91 98765 43212',
    role: 'waiter',
    status: 'active',
    shift: 'night',
    salary: 25000,
    joinDate: '2023-05-10',
    department: 'Service'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@restro.com',
    phone: '+91 98765 43213',
    role: 'cashier',
    status: 'inactive',
    shift: 'morning',
    salary: 22000,
    joinDate: '2023-02-28',
    department: 'Front Office'
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@restro.com',
    phone: '+91 98765 43214',
    role: 'chef',
    status: 'active',
    shift: 'evening',
    salary: 40000,
    joinDate: '2022-11-15',
    department: 'Kitchen'
  }
];

const mockEmployeeStats = {
  total: 5,
  active: 4,
  inactive: 1,
  byRole: {
    manager: 1,
    chef: 2,
    waiter: 1,
    cashier: 1
  },
  byShift: {
    morning: 2,
    evening: 2,
    night: 1
  }
};

class EmployeeService {
  async getEmployees() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEmployees;
  }

  async getEmployeeStats() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockEmployeeStats;
  }

  async getActiveEmployees() {
    await new Promise(resolve => setTimeout(resolve, 400));
    const activeEmployees = mockEmployees.filter(employee => employee.status === 'active');
    return { success: true, data: activeEmployees };
  }

  async addEmployee(employeeData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newEmployee = {
      id: Date.now(),
      ...employeeData,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    mockEmployees.push(newEmployee);
    return { success: true, data: newEmployee };
  }

  async updateEmployee(id, employeeData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      mockEmployees[index] = { ...mockEmployees[index], ...employeeData };
      return { success: true, data: mockEmployees[index] };
    }
    return { success: false, error: 'Employee not found' };
  }

  async deleteEmployee(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      mockEmployees.splice(index, 1);
      return { success: true };
    }
    return { success: false, error: 'Employee not found' };
  }
}

const employeeService = new EmployeeService();
export default employeeService;
