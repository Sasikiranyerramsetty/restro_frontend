// Mock data for table management
const mockTables = [
  {
    id: 1,
    number: 'T1',
    capacity: 4,
    status: 'occupied',
    currentOrder: 'ORD-001',
    customer: 'John Doe',
    location: 'Main Dining',
    type: 'Standard'
  },
  {
    id: 2,
    number: 'T2',
    capacity: 2,
    status: 'available',
    currentOrder: null,
    customer: null,
    location: 'Main Dining',
    type: 'Standard'
  },
  {
    id: 3,
    number: 'T3',
    capacity: 6,
    status: 'reserved',
    currentOrder: null,
    customer: 'Jane Smith',
    location: 'Main Dining',
    type: 'Booth'
  },
  {
    id: 4,
    number: 'T4',
    capacity: 4,
    status: 'cleaning',
    currentOrder: null,
    customer: null,
    location: 'Patio',
    type: 'Outdoor'
  },
  {
    id: 5,
    number: 'T5',
    capacity: 8,
    status: 'available',
    currentOrder: null,
    customer: null,
    location: 'Private Room',
    type: 'Private'
  }
];

const mockTableStats = {
  total: 6,
  available: 2,
  occupied: 2,
  reserved: 1,
  cleaning: 1,
  occupancyRate: 66.7,
  averageTurnover: 2.5,
  byLocation: {
    'Main Hall': 4,
    'VIP Section': 2
  },
  byType: {
    'Standard': 3,
    'Family': 1,
    'VIP': 2
  }
};

let currentTables = [...mockTables];

class TableService {
  async getTables() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data: currentTables };
  }

  async getTableById(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const table = currentTables.find(tbl => tbl.id === id);
    return { success: true, data: table };
  }

  async getTableStats() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, total: currentTables.length };
  }

  async addTable(tableData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTable = { ...tableData, id: Date.now() };
    currentTables.push(newTable);
    return { success: true, data: newTable };
  }

  async updateTable(id, updatedData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = currentTables.findIndex(tbl => tbl.id === id);
    if (index !== -1) {
      currentTables[index] = { ...currentTables[index], ...updatedData };
      return { success: true, data: currentTables[index] };
    }
    return { success: false, error: 'Table not found' };
  }

  async deleteTable(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const initialLength = currentTables.length;
    currentTables = currentTables.filter(tbl => tbl.id !== id);
    if (currentTables.length < initialLength) {
      return { success: true, message: 'Table deleted' };
    }
    return { success: false, error: 'Table not found' };
  }

  async updateTableStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const table = currentTables.find(tbl => tbl.id === id);
    if (table) {
      table.status = status;
      if (status === 'available') {
        table.currentOrder = null;
        table.customer = null;
      }
      return { success: true, data: table };
    }
    return { success: false, error: 'Table not found' };
  }
}

export default new TableService();
