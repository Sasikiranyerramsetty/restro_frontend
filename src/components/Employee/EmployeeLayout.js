import React from 'react';
import DashboardLayout from '../Common/DashboardLayout';

const EmployeeLayout = ({ children }) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default EmployeeLayout;
