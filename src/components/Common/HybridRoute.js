import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES, ROUTES } from '../../constants';

const HybridRoute = ({ children, redirectHomepageOnly = false }) => {
  const { isAuthenticated, getUserRole } = useAuth();

  // If user is authenticated and this is homepage, redirect to dashboard
  if (isAuthenticated && redirectHomepageOnly) {
    const userRole = getUserRole();
    
    switch (userRole) {
      case USER_ROLES.ADMIN:
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
      case USER_ROLES.EMPLOYEE:
        return <Navigate to={ROUTES.EMPLOYEE_DASHBOARD} replace />;
      case USER_ROLES.CUSTOMER:
      default:
        return <Navigate to={ROUTES.CUSTOMER_DASHBOARD} replace />;
    }
  }

  // For all other cases, show the page (both authenticated and unauthenticated users can access)
  return children;
};

export default HybridRoute;
