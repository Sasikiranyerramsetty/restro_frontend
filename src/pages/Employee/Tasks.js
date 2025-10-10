import React from 'react';
import { CheckSquare, Plus } from 'lucide-react';

const EmployeeTasks = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
              <p className="text-gray-600 mt-1">View and manage your assigned tasks</p>
            </div>
            <button className="btn-primary flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <CheckSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Management Coming Soon</h2>
          <p className="text-gray-600">
            Task assignment, tracking, and completion features will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTasks;
