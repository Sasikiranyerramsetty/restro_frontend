import api from './api';
import { STORAGE_KEYS } from '../constants';
import { setToStorage, getFromStorage, removeFromStorage } from '../utils';

class AuthService {
  // Login
  async login(credentials) {
    try {
      // Mock authentication for demo purposes
      const mockUsers = {
        '1234567890': {
          id: 1,
          name: 'Admin User',
          email: 'admin@restaurant.com',
          role: 'admin',
          phone: '1234567890'
        },
        '1234567891': {
          id: 2,
          name: 'Employee User',
          email: 'employee@restaurant.com',
          role: 'employee',
          phone: '1234567891'
        },
        '1234567892': {
          id: 3,
          name: 'Customer User',
          email: 'customer@restaurant.com',
          role: 'customer',
          phone: '1234567892'
        },
        '9876543210': {
          id: 4,
          name: 'Test Admin',
          email: 'test@restaurant.com',
          role: 'admin',
          phone: '9876543210'
        },
        '5551234567': {
          id: 5,
          name: 'Test Customer',
          email: 'testcustomer@restaurant.com',
          role: 'customer',
          phone: '5551234567'
        }
      };

      const mockPasswords = {
        '1234567890': 'admin123',
        '1234567891': 'employee123',
        '1234567892': 'customer123',
        '9876543210': 'admin123',
        '5551234567': 'customer123'
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = mockUsers[credentials.phone];
      const correctPassword = mockPasswords[credentials.phone];

      if (user && credentials.password === correctPassword) {
        const token = 'mock-jwt-token-' + Date.now();
        const userData = { token, user };
        
        // Store token and user data
        setToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
        setToStorage(STORAGE_KEYS.USER_DATA, user);
        
        return { success: true, data: userData };
      } else {
        return { success: false, error: 'Invalid phone number or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Register
  async register(userData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration - just return success
      return { 
        success: true, 
        data: { 
          message: 'Registration successful! Please login to continue.',
          user: {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            role: userData.role || 'customer', // Default to customer if no role specified
            phone: userData.phone
          }
        } 
      };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }

  // Logout
  async logout() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API response
      removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
      removeFromStorage(STORAGE_KEYS.USER_DATA);
    }
  }

  // Get current user
  getCurrentUser() {
    return getFromStorage(STORAGE_KEYS.USER_DATA);
  }

  // Get token
  getToken() {
    return getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      setToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
      return { success: true, token };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Token refresh failed' };
    }
  }

  // Forgot password
  async forgotPassword(phone) {
    try {
      const response = await api.post('/auth/forgot-password', { phone });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Password reset failed' };
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', { token, password: newPassword });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Password reset failed' };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Password change failed' };
    }
  }

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      const { user } = response.data;
      setToStorage(STORAGE_KEYS.USER_DATA, user);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Profile update failed' };
    }
  }
}

const authService = new AuthService();
export default authService;
