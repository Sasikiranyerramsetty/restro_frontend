import React, { useMemo } from 'react';
import DashboardLayout from '../Common/DashboardLayout';

const AdminLayout = ({ children }) => {
  // Dark, subtle gradient background for all admin pages
  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: '#0b1220',
      backgroundImage:
        'radial-gradient(circle at 25% 20%, rgba(59,130,246,0.15), rgba(11,18,32,0) 35%), ' +
        'radial-gradient(circle at 80% 0%, rgba(236,72,153,0.12), rgba(11,18,32,0) 40%), ' +
        'radial-gradient(circle at 40% 80%, rgba(45,212,191,0.12), rgba(11,18,32,0) 45%), ' +
        'linear-gradient(135deg, #0b1220 0%, #0f172a 55%, #0b1220 100%)'
    }),
    []
  );

  return (
    <DashboardLayout backgroundStyle={backgroundStyle} backgroundClassName="bg-slate-950 text-slate-100">
      {children}
    </DashboardLayout>
  );
};

export default AdminLayout;
