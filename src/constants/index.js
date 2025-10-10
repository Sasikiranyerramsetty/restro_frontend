// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  CUSTOMER: 'customer'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  SERVED: 'served',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Table Status
export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  MAINTENANCE: 'maintenance'
};

// Employee Roles
export const EMPLOYEE_ROLES = {
  WAITER: 'waiter',
  CHEF: 'chef',
  CASHIER: 'cashier',
  MANAGER: 'manager'
};

// Menu Categories
export const MENU_CATEGORIES = {
  STARTERS: 'starters',
  CURRIES: 'curries',
  BIRYANIS: 'biryanis',
  FAMILY_PACK_BIRYANIS: 'family_pack_biryanis',
  MEALS: 'meals',
  BEVERAGES: 'beverages',
  ICE_CREAMS: 'ice_creams',
  RESTRO_SPECIALS: 'restro_specials'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  UPI: 'upi',
  WALLET: 'wallet'
};

// Routes
export const ROUTES = {
  // Auth Routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_MENU: '/admin/menu',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_EMPLOYEES: '/admin/employees',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_INVENTORY: '/admin/inventory',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_TABLES: '/admin/tables',
  ADMIN_EVENTS: '/admin/events',
  
  // Customer Routes
  CUSTOMER_HOME: '/',
  CUSTOMER_MENU: '/menu',
  CUSTOMER_CART: '/cart',
  CUSTOMER_CHECKOUT: '/checkout',
  CUSTOMER_ORDERS: '/orders',
  CUSTOMER_RESERVATIONS: '/reservations',
  CUSTOMER_EVENTS: '/events',
  CUSTOMER_PROFILE: '/profile',
  
  // Employee Routes
  EMPLOYEE_DASHBOARD: '/employee/dashboard',
  EMPLOYEE_ORDERS: '/employee/orders',
  EMPLOYEE_TABLES: '/employee/tables',
  EMPLOYEE_TASKS: '/employee/tasks',
  EMPLOYEE_SHIFTS: '/employee/shifts'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART_ITEMS: 'cart_items',
  THEME: 'theme'
};

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
};

// Socket Events
export const SOCKET_EVENTS = {
  // Order Events
  ORDER_CREATED: 'order_created',
  ORDER_UPDATED: 'order_updated',
  ORDER_STATUS_CHANGED: 'order_status_changed',
  
  // Table Events
  TABLE_STATUS_CHANGED: 'table_status_changed',
  TABLE_RESERVED: 'table_reserved',
  
  // Notification Events
  NOTIFICATION: 'notification',
  
  // Connection Events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect'
};
