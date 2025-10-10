import React from 'react';
import { Clock, Calendar } from 'lucide-react';

const EmployeeShifts = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shift Management</h1>
              <p className="text-gray-600 mt-1">View your shifts and check-in/out</p>
            </div>
            <button className="btn-primary flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Check In
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shift Management Coming Soon</h2>
          <p className="text-gray-600">
            Shift scheduling, check-in/out, and time tracking features will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeShifts;
