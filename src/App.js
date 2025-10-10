import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { USER_ROLES, ROUTES } from './constants';

// Import pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Admin pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminMenu from './pages/Admin/Menu';
import AdminOrders from './pages/Admin/Orders';
import AdminEmployees from './pages/Admin/Employees';
import AdminCustomers from './pages/Admin/Customers';
import AdminInventory from './pages/Admin/Inventory';
import AdminReports from './pages/Admin/Reports';
import AdminTables from './pages/Admin/Tables';
import AdminEvents from './pages/Admin/Events';

// Customer pages
import CustomerHome from './pages/Customer/Home';
import CustomerMenu from './pages/Customer/Menu';
import CustomerCart from './pages/Customer/Cart';
import CustomerCheckout from './pages/Customer/Checkout';
import CustomerOrders from './pages/Customer/Orders';
import CustomerReservations from './pages/Customer/Reservations';
import CustomerEvents from './pages/Customer/Events';
import CustomerProfile from './pages/Customer/Profile';

// Employee pages
import EmployeeDashboard from './pages/Employee/Dashboard';
import EmployeeOrders from './pages/Employee/Orders';
import EmployeeTables from './pages/Employee/Tables';
import EmployeeTasks from './pages/Employee/Tasks';
import EmployeeShifts from './pages/Employee/Shifts';

// Common components
import LoadingSpinner from './components/Common/LoadingSpinner';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Main App component
function AppContent() {
  const { isAuthenticated, isLoading, getUserRole } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App">
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
                <Route path="inventory" element={<AdminInventory />} />
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
              <Route path="" element={<CustomerHome />} />
              <Route path="menu" element={<CustomerMenu />} />
              <Route path="cart" element={<CustomerCart />} />
              <Route path="checkout" element={<CustomerCheckout />} />
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
