import api from './api';
import { STORAGE_KEYS } from '../constants';
import { setToStorage, getFromStorage, removeFromStorage } from '../utils';

class AuthService {
  // Login
  async login(credentials) {
    try {
      // Mock authentication for demo purposes
      const mockUsers = {
        'admin@restaurant.com': {
          id: 1,
          name: 'Admin User',
          email: 'admin@restaurant.com',
          role: 'admin',
          phone: '1234567890'
        },
        'employee@restaurant.com': {
          id: 2,
          name: 'Employee User',
          email: 'employee@restaurant.com',
          role: 'employee',
          phone: '1234567891'
        },
        'customer@restaurant.com': {
          id: 3,
          name: 'Customer User',
          email: 'customer@restaurant.com',
          role: 'customer',
          phone: '1234567892'
        }
      };

      const mockPasswords = {
        'admin@restaurant.com': 'admin123',
        'employee@restaurant.com': 'employee123',
        'customer@restaurant.com': 'customer123'
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = mockUsers[credentials.email];
      const correctPassword = mockPasswords[credentials.email];

      if (user && credentials.password === correctPassword) {
        const token = 'mock-jwt-token-' + Date.now();
        const userData = { token, user };
        
        // Store token and user data
        setToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
        setToStorage(STORAGE_KEYS.USER_DATA, user);
        
        return { success: true, data: userData };
      } else {
        return { success: false, error: 'Invalid email or password' };
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
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
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

export default new AuthService();
