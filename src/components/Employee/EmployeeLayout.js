import React, { useMemo } from 'react';
import DashboardLayout from '../Common/DashboardLayout';

const EmployeeLayout = ({ children }) => {
  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: '#020617',
      backgroundImage:
        'radial-gradient(circle at top, rgba(59,130,246,0.18), rgba(2,6,23,0) 45%), radial-gradient(circle at 20% 20%, rgba(236,72,153,0.15), rgba(2,6,23,0) 35%), radial-gradient(circle at 80% 0%, rgba(45,212,191,0.12), rgba(2,6,23,0) 30%), linear-gradient(135deg, #020617 0%, #0f172a 60%, #020617 100%)'
    }),
    []
  );

  return (
    <DashboardLayout backgroundStyle={backgroundStyle} backgroundClassName="bg-slate-950">
      {children}
    </DashboardLayout>
  );
};

export default EmployeeLayout;
