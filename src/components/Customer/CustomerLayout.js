import React from 'react';
import CustomerNavbar from './CustomerNavbar';

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
