import React from 'react';
import { Package, Clock } from 'lucide-react';

const CustomerOrders = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">Track your order history</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders Coming Soon</h2>
          <p className="text-gray-600">
            Order tracking and history features will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrders;
