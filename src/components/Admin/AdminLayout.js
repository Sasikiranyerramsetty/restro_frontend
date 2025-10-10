import React from 'react';
import DashboardLayout from '../Common/DashboardLayout';

const AdminLayout = ({ children }) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default AdminLayout;
