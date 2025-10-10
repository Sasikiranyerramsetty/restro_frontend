// User Types
export const UserTypes = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  CUSTOMER: 'customer'
};

// Order Types
export const OrderTypes = {
  DINE_IN: 'dine_in',
  TAKEAWAY: 'takeaway',
  DELIVERY: 'delivery'
};

// Payment Status
export const PaymentStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Reservation Status
export const ReservationStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Event Types
export const EventTypes = {
  BIRTHDAY: 'birthday',
  ANNIVERSARY: 'anniversary',
  CORPORATE: 'corporate',
  WEDDING: 'wedding',
  OTHER: 'other'
};

// Inventory Status
export const InventoryStatus = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock'
};

// Shift Types
export const ShiftTypes = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  NIGHT: 'night'
};

// Task Status
export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Report Types
export const ReportTypes = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  CUSTOM: 'custom'
};

// Chart Types
export const ChartTypes = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  DOUGHNUT: 'doughnut',
  AREA: 'area'
};

// Form Validation Types
export const ValidationTypes = {
  REQUIRED: 'required',
  EMAIL: 'email',
  PHONE: 'phone',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  PATTERN: 'pattern',
  CUSTOM: 'custom'
};

// Modal Types
export const ModalTypes = {
  CONFIRM: 'confirm',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
};

// Toast Types
export const ToastTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Loading States
export const LoadingStates = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed'
};

// Filter Types
export const FilterTypes = {
  DATE_RANGE: 'date_range',
  STATUS: 'status',
  CATEGORY: 'category',
  PRICE_RANGE: 'price_range',
  SEARCH: 'search'
};

// Sort Types
export const SortTypes = {
  ASC: 'asc',
  DESC: 'desc'
};

// Sort Fields
export const SortFields = {
  NAME: 'name',
  PRICE: 'price',
  DATE: 'date',
  STATUS: 'status',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at'
};
