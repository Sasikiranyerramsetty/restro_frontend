import React from 'react';
import DashboardLayout from '../Common/DashboardLayout';

const CustomerLayout = ({ children }) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default CustomerLayout;
