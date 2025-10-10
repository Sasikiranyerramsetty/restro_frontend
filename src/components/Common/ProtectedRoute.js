import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, getUserRole } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const userRole = getUserRole();
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on user role
    switch (userRole) {
      case 'admin':
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
      case 'employee':
        return <Navigate to={ROUTES.EMPLOYEE_DASHBOARD} replace />;
      case 'customer':
        return <Navigate to={ROUTES.CUSTOMER_HOME} replace />;
      default:
        return <Navigate to={ROUTES.LOGIN} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
