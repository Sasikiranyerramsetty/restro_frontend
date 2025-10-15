import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Mail,
  Phone,
  Calendar,
  Clock,
  User,
  Shield,
  X,
  Save,
  DollarSign,
  MapPin,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { formatDate } from '../../utils';
import toast from 'react-hot-toast';
import employeeService from '../../services/employeeService';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    status: 'active',
    shift: '',
    salary: '',
    address: '',
    tag: ''
  });

  // Mock employee data
  const mockEmployees = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@restaurant.com',
      phone: '1234567890',
      role: 'waiter',
      tag: 'waiter',
      status: 'active',
      hireDate: '2023-01-15',
      shift: 'morning',
      salary: 25000,
      address: '123 Main St, City'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@restaurant.com',
      phone: '1234567891',
      role: 'chef',
      tag: 'chef',
      status: 'active',
      hireDate: '2022-08-20',
      shift: 'evening',
      salary: 35000,
      address: '456 Oak Ave, City'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@restaurant.com',
      phone: '1234567892',
      role: 'delivery',
      tag: 'delivery',
      status: 'active',
      hireDate: '2023-03-10',
      shift: 'afternoon',
      salary: 22000,
      address: '789 Pine St, City'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@restaurant.com',
      phone: '1234567893',
      role: 'manager',
      tag: 'chef',
      status: 'active',
      hireDate: '2021-11-05',
      shift: 'morning',
      salary: 45000,
      address: '321 Elm St, City'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@restaurant.com',
      phone: '1234567894',
      role: 'waiter',
      tag: 'waiter',
      status: 'inactive',
      hireDate: '2023-06-15',
      shift: 'evening',
      salary: 25000,
      address: '654 Maple Ave, City'
    }
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const result = await employeeService.getEmployees();
        setEmployees(result);
      } catch (error) {
        // Error fetching employees
        toast.error('Failed to fetch employees');
        // Fallback to mock data
        setEmployees(mockEmployees);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form handling functions
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      status: 'active',
      shift: '',
      salary: '',
      address: '',
      tag: ''
    });
    setEditingEmployee(null);
    setShowPassword(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEmployee = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      password: '', // Don't populate password for security
      status: employee.status,
      shift: employee.shift,
      salary: employee.salary.toString(),
      address: employee.address || '',
      tag: employee.tag || ''
    });
    setEditingEmployee(employee);
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const employeeData = {
        ...formData,
        salary: parseInt(formData.salary)
      };

      // For editing, only include password if it's provided
      if (editingEmployee && !formData.password) {
        delete employeeData.password;
      }

      let result;
      if (editingEmployee) {
        result = await employeeService.updateEmployee(editingEmployee.id, employeeData);
      } else {
        result = await employeeService.addEmployee(employeeData);
      }

      if (result.success) {
        // Refresh the employee list
        const updatedEmployees = await employeeService.getEmployees();
        setEmployees(updatedEmployees);
        
        setShowAddModal(false);
        resetForm();
        toast.success(editingEmployee ? 'Employee updated successfully!' : 'Employee added successfully!');
      } else {
        toast.error(result.error || 'Failed to save employee');
      }
    } catch (error) {
      // Error saving employee
      toast.error('Failed to save employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const result = await employeeService.deleteEmployee(employeeId);
        if (result.success) {
          const updatedEmployees = await employeeService.getEmployees();
          setEmployees(updatedEmployees);
          toast.success('Employee deleted successfully!');
        } else {
          toast.error(result.error || 'Failed to delete employee');
        }
      } catch (error) {
        // Error deleting employee
        toast.error('Failed to delete employee');
      }
    }
  };


  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };


  const handleToggleStatus = (employeeId) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
        : emp
    ));
    toast.success('Employee status updated');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
          <div>
            <h1 className="text-4xl font-bold gradient-text restro-brand">Employee Management</h1>
          </div>
          <button 
            onClick={handleAddEmployee}
            className="btn-primary flex items-center mt-4 sm:mt-0 hover:scale-105 transition-transform duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Employee
          </button>
        </div>

        {/* Search and Filter */}
        <div className="card animate-slide-up animate-delay-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <button className="btn-outline flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Managers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.role === 'manager').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Shift</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Employee</th>
                  <th className="table-header">Tag</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Shift</th>
                  <th className="table-header">Hire Date</th>
                  <th className="table-header">Salary</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {employee.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {employee.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {employee.tag || 'N/A'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${getStatusColor(employee.status)}`}>
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900 capitalize">
                        {employee.shift}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(employee.hireDate)}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm font-medium text-gray-900">
                        ₹{employee.salary.toLocaleString()}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(employee.id)}
                          className={`text-sm px-2 py-1 rounded ${
                            employee.status === 'active'
                              ? 'text-red-600 hover:text-red-700'
                              : 'text-green-600 hover:text-green-700'
                          } transition-colors duration-200`}
                        >
                          {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-red-600 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Form Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password {!editingEmployee ? '*' : ''}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required={!editingEmployee}
                          minLength="6"
                          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder={editingEmployee ? "Leave blank to keep current password" : "Enter password"}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {editingEmployee && (
                        <p className="mt-1 text-sm text-gray-500">
                          Leave blank to keep the current password
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Job Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tag *
                      </label>
                      <select
                        name="tag"
                        value={formData.tag}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select Tag</option>
                        <option value="delivery">Delivery</option>
                        <option value="chef">Chef</option>
                        <option value="waiter">Waiter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shift *
                      </label>
                      <select
                        name="shift"
                        value={formData.shift}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select Shift</option>
                        <option value="morning">Morning (6 AM - 2 PM)</option>
                        <option value="evening">Evening (2 PM - 10 PM)</option>
                        <option value="night">Night (10 PM - 6 AM)</option>
                        <option value="full-time">Full Time (8 AM - 8 PM)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary (₹) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
                          required
                          min="0"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter salary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on-leave">On Leave</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter address"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {editingEmployee ? 'Update Employee' : 'Add Employee'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEmployees;
