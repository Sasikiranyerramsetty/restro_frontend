import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { USER_ROLES, ROUTES } from './constants';

// Common components (loaded eagerly as they're used everywhere)
import LoadingSpinner from './components/Common/LoadingSpinner';
import ProtectedRoute from './components/Common/ProtectedRoute';
import HybridRoute from './components/Common/HybridRoute';

// Lazy load Auth pages (only when needed)
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));

// Lazy load Admin pages (only for admin users)
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminMenu = lazy(() => import('./pages/Admin/Menu'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders'));
const AdminEmployees = lazy(() => import('./pages/Admin/Employees'));
const AdminCustomers = lazy(() => import('./pages/Admin/Customers'));
const AdminReports = lazy(() => import('./pages/Admin/Reports'));
const AdminTables = lazy(() => import('./pages/Admin/Tables'));
const AdminEvents = lazy(() => import('./pages/Admin/Events'));

// Lazy load Customer pages (only for customer users)
const CustomerHome = lazy(() => import('./pages/Customer/Home'));
const CustomerDashboard = lazy(() => import('./pages/Customer/Dashboard'));
const CustomerMenu = lazy(() => import('./pages/Customer/Menu'));
const CustomerCart = lazy(() => import('./pages/Customer/Cart'));
const CustomerCheckout = lazy(() => import('./pages/Customer/Checkout'));
const CustomerOrders = lazy(() => import('./pages/Customer/Orders'));
const CustomerReservations = lazy(() => import('./pages/Customer/Reservations'));
const CustomerEvents = lazy(() => import('./pages/Customer/Events'));
const CustomerProfile = lazy(() => import('./pages/Customer/Profile'));

// Lazy load Employee pages (only for employee users)
const EmployeeDashboard = lazy(() => import('./pages/Employee/Dashboard'));
const EmployeeOrders = lazy(() => import('./pages/Employee/Orders'));
const EmployeeOrderTaking = lazy(() => import('./pages/Employee/OrderTaking'));
const EmployeeTables = lazy(() => import('./pages/Employee/Tables'));
const EmployeeTasks = lazy(() => import('./pages/Employee/Tasks'));
const EmployeeShifts = lazy(() => import('./pages/Employee/Shifts'));

// Main App component
function AppContent() {
  const { isAuthenticated, isLoading, getUserRole } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.LOGIN} element={
              isAuthenticated ? <Navigate to={getUserRole() === USER_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : 
                getUserRole() === USER_ROLES.EMPLOYEE ? ROUTES.EMPLOYEE_DASHBOARD : ROUTES.CUSTOMER_HOME} /> : 
                <Login />
            } />
            <Route path={ROUTES.REGISTER} element={
              isAuthenticated ? <Navigate to={getUserRole() === USER_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : 
                getUserRole() === USER_ROLES.EMPLOYEE ? ROUTES.EMPLOYEE_DASHBOARD : ROUTES.CUSTOMER_HOME} /> : 
                <Register />
            } />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

          {/* Admin routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="menu" element={<AdminMenu />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="employees" element={<AdminEmployees />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="tables" element={<AdminTables />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="*" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Employee routes */}
          <Route path="/employee/*" element={
            <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}>
              <Routes>
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="order-taking" element={<EmployeeOrderTaking />} />
                <Route path="orders" element={<EmployeeOrders />} />
                <Route path="tables" element={<EmployeeTables />} />
                <Route path="tasks" element={<EmployeeTasks />} />
                <Route path="shifts" element={<EmployeeShifts />} />
                <Route path="*" element={<Navigate to={ROUTES.EMPLOYEE_DASHBOARD} />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Customer routes */}
          <Route path="/*" element={
            <Routes>
              <Route path="" element={
                <HybridRoute redirectHomepageOnly={true}>
                  <CustomerHome />
                </HybridRoute>
              } />
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="menu" element={<CustomerMenu />} />
              <Route path="cart" element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
                  <CustomerCart />
                </ProtectedRoute>
              } />
              <Route path="checkout" element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
                  <CustomerCheckout />
                </ProtectedRoute>
              } />
              <Route path="orders" element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
                  <CustomerOrders />
                </ProtectedRoute>
              } />
              <Route path="reservations" element={<CustomerReservations />} />
              <Route path="events" element={<CustomerEvents />} />
              <Route path="profile" element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
                  <CustomerProfile />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          } />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

// Root App component with providers
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
