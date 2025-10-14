import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES, ROUTES } from '../../constants';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, getUserRole } = useAuth();

  // If user is authenticated, redirect to their dashboard
  if (isAuthenticated) {
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

  // If not authenticated, show the public page
  return children;
};

export default PublicRoute;

