// Mock data for tasks
const mockTasks = [
  {
    id: 1,
    title: 'Clean Table 5',
    description: 'Clean and set up table 5 for next customers. Ensure all cutlery and napkins are properly arranged.',
    priority: 'high',
    status: 'pending',
    category: 'cleaning',
    assignedBy: 'Manager John',
    assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    dueTime: '14:30',
    estimatedDuration: '15 mins',
    location: 'Main Dining Area',
    tableNumber: 'T5',
    notes: 'Customer complained about cleanliness'
  },
  {
    id: 2,
    title: 'Check Inventory - Popular Items',
    description: 'Check stock levels for popular items: Chicken Biryani, Mutton Curry, Paneer Tikka, and Dal Makhani.',
    priority: 'medium',
    status: 'completed',
    category: 'inventory',
    assignedBy: 'Chef Sarah',
    assignedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    dueTime: '12:00',
    estimatedDuration: '20 mins',
    location: 'Kitchen',
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    notes: 'All items well stocked'
  },
  {
    id: 3,
    title: 'Prepare Order ORD-003',
    description: 'Prepare takeaway order for customer Mike Wilson. Items: Chicken Biryani (1), Butter Chicken (1).',
    priority: 'high',
    status: 'in_progress',
    category: 'order_preparation',
    assignedBy: 'Kitchen Manager',
    assignedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    dueTime: '15:00',
    estimatedDuration: '25 mins',
    location: 'Kitchen',
    orderNumber: 'ORD-003',
    notes: 'Customer pickup at 8:30 PM'
  },
  {
    id: 4,
    title: 'Restock Napkins - Section A',
    description: 'Restock napkins in Section A (Tables 1-8). Check all tables and ensure adequate supply.',
    priority: 'low',
    status: 'pending',
    category: 'restocking',
    assignedBy: 'Supervisor Mike',
    assignedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    dueTime: '16:00',
    estimatedDuration: '10 mins',
    location: 'Section A',
    notes: 'Low stock reported'
  },
  {
    id: 5,
    title: 'Customer Service - Table 7',
    description: 'Check on customers at Table 7. They seem to be waiting for their order for a while.',
    priority: 'high',
    status: 'completed',
    category: 'customer_service',
    assignedBy: 'Manager John',
    assignedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    dueTime: '13:45',
    estimatedDuration: '5 mins',
    location: 'Table 7',
    completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    notes: 'Order was delayed, offered complimentary dessert'
  }
];

const mockTaskStats = {
  totalTasks: 5,
  pendingTasks: 2,
  inProgressTasks: 1,
  completedTasks: 2,
  highPriorityTasks: 3,
  overdueTasks: 0
};

class TaskService {
  async getTasks() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data: mockTasks };
  }

  async getTaskStats() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, data: mockTaskStats };
  }

  async getTaskById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const task = mockTasks.find(task => task.id === id);
    return { success: true, data: task };
  }

  async addTask(taskData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newTask = {
      id: Date.now(),
      ...taskData,
      status: 'pending',
      assignedAt: new Date().toISOString(),
      assignedBy: 'Self Assigned'
    };
    mockTasks.push(newTask);
    return { success: true, data: newTask };
  }

  async updateTask(id, taskData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockTasks.findIndex(task => task.id === id);
    if (index !== -1) {
      mockTasks[index] = { ...mockTasks[index], ...taskData };
      return { success: true, data: mockTasks[index] };
    }
    return { success: false, error: 'Task not found' };
  }

  async deleteTask(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockTasks.findIndex(task => task.id === id);
    if (index !== -1) {
      mockTasks.splice(index, 1);
      return { success: true };
    }
    return { success: false, error: 'Task not found' };
  }

  async updateTaskStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const task = mockTasks.find(task => task.id === id);
    if (task) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date().toISOString();
      }
      return { success: true, data: task };
    }
    return { success: false, error: 'Task not found' };
  }
}

const taskService = new TaskService();
export default taskService;

