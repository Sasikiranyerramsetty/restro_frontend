import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, USER_ROLES } from '../../constants';
import EmployeeLayout from '../Employee/EmployeeLayout';

const EmployeeExcludeTagsRoute = ({ tags = [], children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const isEmployee = user?.role === USER_ROLES.EMPLOYEE;
  const userTag = user?.tag?.toLowerCase?.() || '';
  const blocked = (tags || []).map((t) => t?.toLowerCase?.()).includes(userTag);

  if (isEmployee && blocked) {
    return (
      <EmployeeLayout>
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access restricted</h2>
              <p className="text-gray-600">
                This function is not available for your station.
              </p>
            </div>
            <button
              onClick={() => window.history.length > 2 ? window.history.back() : window.location.assign(ROUTES.EMPLOYEE_DASHBOARD)}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              ← Back
            </button>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return children;
};

export default EmployeeExcludeTagsRoute;


