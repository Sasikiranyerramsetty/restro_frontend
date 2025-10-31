import api from './api';
import { STORAGE_KEYS } from '../constants';
import { setToStorage, getFromStorage, removeFromStorage } from '../utils';

class AuthService {
  // Login - Integrated with Backend (UNIFIED SOLUTION)
  async login(credentials) {
    try {
      // Backend endpoint: POST /users/login
      const response = await api.post('/users/login', {
        phone_number_or_email: credentials.phone || credentials.email,
        password: credentials.password
      });

      if (response.data.success) {
        // Backend now returns: {name, role, user_id, message, success}
        // Role is automatically determined by which collection user is in!
        // NO MORE HARDCODING - Fully dynamic and scalable! 🎉
        
        const userData = {
          id: response.data.user_id,  // Unique user ID from database
          name: response.data.name,
          phone: credentials.phone,
          email: credentials.email,
          role: response.data.role  // 'admin', 'employee', or 'customer' from backend
        };
        
        const token = 'restro-token-' + Date.now();
        
        setToStorage(STORAGE_KEYS.AUTH_TOKEN, token);
        setToStorage(STORAGE_KEYS.USER_DATA, userData);
        
        console.log('✅ Login successful - User role:', userData.role);
        
        return { 
          success: true, 
          data: { token, user: userData },
          message: response.data.message 
        };
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please try again.' 
      };
    }
  }

  // Register - Integrated with Backend
  async register(userData) {
    try {
      // Prepare request data
      const requestData = {
        name: userData.name,
        phone_number: userData.phone,
        email: userData.email || '',
        password: userData.password,
        confirm_password: userData.confirmPassword
      };

      console.log('📤 Sending registration data to backend:', {
        ...requestData,
        password: '***',
        confirm_password: '***'
      });

      // Backend endpoint: POST /users/signup
      const response = await api.post('/users/signup', requestData);

      console.log('✅ Backend response:', response.data);

      if (response.data.success) {
        console.log('🎉 Registration successful!');
        return { 
          success: true, 
          data: { 
            message: response.data.message,
            user: { name: response.data.name }
          } 
        };
      } else {
        console.error('❌ Backend returned error:', response.data.message);
        return { 
          success: false, 
          error: response.data.message || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle validation errors from backend
      let errorMessage;
      if (error.response?.data?.detail) {
        // If it's an array (validation errors)
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail[0]?.msg || 'Validation failed';
        } else {
          // If it's a string
          errorMessage = error.response.data.detail;
        }
      } else {
        errorMessage = error.message || 'Registration failed. Please try again.';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }

  // Logout
  async logout() {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
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

  // Update profile (not implemented in backend yet)
  async updateProfile(profileData) {
    try {
      // You'll need to implement this endpoint in backend
      const response = await api.put('/users/profile', profileData);
      const { user } = response.data;
      setToStorage(STORAGE_KEYS.USER_DATA, user);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    }
  }
}

const authService = new AuthService();
export default authService;