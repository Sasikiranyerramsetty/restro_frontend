import api from './api';
import { STORAGE_KEYS } from '../constants';
import { getFromStorage } from '../utils';

class EmployeeService {
  // Add Employee (Admin only) - Integrated with Backend
  async addEmployee(employeeData) {
    try {
      // Get admin ID from localStorage using correct key
      const userData = getFromStorage(STORAGE_KEYS.USER_DATA);
      const adminId = userData?.id;

      console.log('👤 Current user data:', userData);
      console.log('🔑 Admin ID:', adminId);

      if (!adminId) {
        console.error('❌ Admin ID not found in localStorage');
        return {
          success: false,
          error: 'Admin ID not found. Please login again.'
        };
      }

      // Map frontend shift values to backend enum values
      let shifts = employeeData.shift;
      if (shifts === 'morning' || shifts === 'evening' || shifts === 'night') {
        shifts = 'part_time';
      } else if (shifts === 'full-time') {
        shifts = 'full_time';
      }

      // Prepare data for backend
      const requestData = {
        name: employeeData.name,
        phone_number: employeeData.phone,
        email: employeeData.email || null,
        password: employeeData.password,
        shifts: shifts, // 'part_time' or 'full_time'
        salary: parseFloat(employeeData.salary),
        address: employeeData.address,
        admin_id: adminId, // Use admin ID from localStorage
        tag: employeeData.tag, // 'chef', 'waiter', 'cleaner', 'delivery'
        status: employeeData.status || 'active' // 'active', 'inactive', 'leave'
      };

      console.log('📤 Sending employee data to backend:', requestData);

      // Backend endpoint: POST /users/addemployee
      const response = await api.post('/users/addemployee', requestData);

      console.log('✅ Backend response:', response.data);

      if (response.data.success) {
        console.log('🎉 Employee added successfully!');
        return {
          success: true,
          data: response.data,
          message: response.data.message
        };
      } else {
        console.error('❌ Backend returned error:', response.data.message);
        return {
          success: false,
          error: response.data.message || 'Failed to add employee'
        };
      }
    } catch (error) {
      console.error('❌ Add employee error:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.detail?.[0]?.msg 
        || error.response?.data?.detail 
        || error.message
        || 'Failed to add employee';
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Get all employees (backend endpoint not implemented yet)
  async getEmployees() {
    try {
      // Backend endpoint: GET /users/employees (NOT IMPLEMENTED YET)
      // For now, this will fail and the component will use mock data
      const response = await api.get('/users/employees');
      
      if (Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data
        };
      } else if (response.data.employees) {
        return {
          success: true,
          data: response.data.employees
        };
      } else {
        return {
          success: true,
          data: response.data
        };
      }
    } catch (error) {
      // Backend endpoint not implemented yet
      // Component will fallback to mock data
      console.warn('Employee fetch endpoint not available, using mock data');
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch employees',
        data: [] // Return empty array so filter() won't fail
      };
    }
  }

  // Update employee (implement when backend endpoint is ready)
  async updateEmployee(employeeId, employeeData) {
    try {
      // You'll need to add this endpoint in backend
      const response = await api.put(`/users/employees/${employeeId}`, employeeData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update employee'
      };
    }
  }

  // Delete employee (implement when backend endpoint is ready)
  async deleteEmployee(employeeId) {
    try {
      // You'll need to add this endpoint in backend
      const response = await api.delete(`/users/employees/${employeeId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete employee'
      };
    }
  }
}

const employeeService = new EmployeeService();
export default employeeService;