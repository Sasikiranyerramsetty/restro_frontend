import React from 'react';
import { Table, MapPin } from 'lucide-react';

const EmployeeTables = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Table Management</h1>
              <p className="text-gray-600 mt-1">Manage table status and assignments</p>
            </div>
            <button className="btn-outline flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              View Layout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Table className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Table Management Coming Soon</h2>
          <p className="text-gray-600">
            Table status management, customer seating, and layout view will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTables;
