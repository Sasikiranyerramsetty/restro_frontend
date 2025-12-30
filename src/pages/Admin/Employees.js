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
  // Custom color palette
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

  const darkTable = {
    surface: 'rgba(15, 23, 42, 0.85)',
    header: 'rgba(17, 24, 39, 0.95)',
    headerBorder: 'rgba(148, 163, 184, 0.25)',
    rowEven: 'rgba(255, 255, 255, 0.03)',
    rowOdd: 'rgba(255, 255, 255, 0.06)',
    rowHover: 'rgba(148, 163, 184, 0.12)',
    text: '#e2e8f0',
    muted: '#cbd5e1',
    border: 'rgba(148, 163, 184, 0.18)',
    chipBg: 'rgba(31, 41, 55, 0.9)',
    chipBorder: 'rgba(148, 163, 184, 0.35)'
  };

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

  // Removed static mock data. We will rely solely on backend response.

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const result = await employeeService.getEmployees();
        if (result.success && result.data) {
          setEmployees(result.data);
        } else {
          setEmployees([]);
          if (result.error) toast.error(result.error);
        }
      } catch (error) {
        // Error fetching employees
        toast.error('Failed to fetch employees');
        setEmployees([]);
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
        const updatedResult = await employeeService.getEmployees();
        if (updatedResult.success && updatedResult.data) {
          setEmployees(updatedResult.data);
        } else if (Array.isArray(updatedResult)) {
          setEmployees(updatedResult);
        }
        
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
          const updatedResult = await employeeService.getEmployees();
          if (updatedResult.success && updatedResult.data) {
            setEmployees(updatedResult.data);
          } else if (Array.isArray(updatedResult)) {
            setEmployees(updatedResult);
          }
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
    const statusColors = {
      active: { bg: 'rgba(34, 197, 94, 0.15)', text: '#bbf7d0', border: 'rgba(34, 197, 94, 0.45)' },
      inactive: { bg: 'rgba(248, 113, 113, 0.18)', text: '#fecdd3', border: 'rgba(248, 113, 113, 0.5)' },
      'on-leave': { bg: 'rgba(56, 189, 248, 0.18)', text: '#bae6fd', border: 'rgba(56, 189, 248, 0.45)' }
    };
    const color = statusColors[status] || { bg: darkTable.rowOdd, text: darkTable.text, border: darkTable.border };
    return {
      backgroundColor: color.bg,
      color: color.text,
      borderColor: color.border,
      borderWidth: '2px'
    };
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
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.red }}
            ></div>
            <p className="font-semibold" style={{ color: colors.darkNavy }}>Loading employees...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', padding: '2rem' }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
          <div>
            <h1 
              className="text-4xl font-bold drop-shadow-lg mb-2" 
              style={{ 
                fontFamily: 'Rockybilly, sans-serif', 
                letterSpacing: '0.05em',
                color: colors.darkNavy 
              }}
            >
              Employee Management
            </h1>
            <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '200px' }}></div>
          </div>
          <button 
            onClick={handleAddEmployee}
            className="px-8 py-3 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg flex items-center mt-4 sm:mt-0"
            style={{ backgroundColor: colors.red }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f3e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.red}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Employee
          </button>
        </div>

        {/* Search and Filter */}
        <div 
          className="rounded-2xl shadow-lg p-6 animate-slide-up animate-delay-200 border-2"
          style={{ 
            backgroundColor: colors.cream,
            borderColor: colors.mediumBlue,
            borderWidth: '2px'
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: colors.mediumBlue }} />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all"
                  style={{ 
                    borderColor: colors.lightBlue,
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                  onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                />
              </div>
            </div>
            <button 
              className="px-4 py-3 border-2 rounded-xl font-bold transition-all flex items-center"
              style={{ 
                borderColor: colors.mediumBlue,
                color: colors.darkNavy,
                backgroundColor: colors.lightBlue
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.mediumBlue;
                e.target.style.color = colors.cream;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.lightBlue;
                e.target.style.color = colors.darkNavy;
              }}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up"
            style={{ 
              animationDelay: '0.1s',
              background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Employees</p>
                <p className="text-3xl font-bold" style={{ color: colors.mediumBlue }}>{employees.length}</p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Users className="h-8 w-8" style={{ color: colors.mediumBlue }} />
              </div>
            </div>
          </div>
          
          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up"
            style={{ 
              animationDelay: '0.2s',
              background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: colors.cream }}>Active</p>
                <p className="text-3xl font-bold" style={{ color: colors.cream }}>
                  {employees.filter(emp => emp.status === 'active').length}
                </p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <User className="h-8 w-8" style={{ color: colors.mediumBlue }} />
              </div>
            </div>
          </div>
          
          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up"
            style={{ 
              animationDelay: '0.3s',
              background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Managers</p>
                <p className="text-3xl font-bold" style={{ color: colors.red }}>
                  {employees.filter(emp => emp.role === 'manager').length}
                </p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Shield className="h-8 w-8" style={{ color: colors.red }} />
              </div>
            </div>
          </div>
          
          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up"
            style={{ 
              animationDelay: '0.4s',
              background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: colors.cream }}>On Shift</p>
                <p className="text-3xl font-bold" style={{ color: colors.cream }}>
                  {employees.filter(emp => emp.status === 'active').length}
                </p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Clock className="h-8 w-8" style={{ color: colors.darkNavy }} />
              </div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div 
          className="rounded-2xl shadow-xl overflow-hidden border-2"
          style={{ 
            backgroundColor: darkTable.surface,
            borderColor: darkTable.border,
            borderWidth: '2px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ 
                  background: 'linear-gradient(90deg, rgba(59,130,246,0.2) 0%, rgba(17,24,39,0.95) 55%, rgba(236,72,153,0.2) 100%)',
                  borderBottom: `1px solid ${darkTable.headerBorder}`
                }}>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider rounded-l-lg" style={{ color: darkTable.text }}>Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: darkTable.text }}>Tag</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: darkTable.text }}>Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: darkTable.text }}>Shift</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: darkTable.text }}>Hire Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: darkTable.text }}>Salary</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider rounded-r-lg" style={{ color: darkTable.text }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, index) => (
                  <tr 
                    key={employee.id} 
                    className="transition-colors border-b"
                    style={{ 
                      borderColor: darkTable.border,
                      backgroundColor: index % 2 === 0 ? darkTable.rowEven : darkTable.rowOdd
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkTable.rowHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? darkTable.rowEven : darkTable.rowOdd}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                        >
                          <User className="h-5 w-5" style={{ color: darkTable.text }} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold" style={{ color: darkTable.text }}>
                            {employee.name}
                          </div>
                          <div className="text-sm flex items-center" style={{ color: darkTable.muted }}>
                            <Mail className="h-3 w-3 mr-1" />
                            {employee.email}
                          </div>
                          <div className="text-sm flex items-center" style={{ color: darkTable.muted }}>
                            <Phone className="h-3 w-3 mr-1" />
                            {employee.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border-2 capitalize"
                        style={{
                          backgroundColor: darkTable.chipBg,
                          color: darkTable.text,
                          borderColor: darkTable.chipBorder
                        }}
                      >
                        {employee.tag || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border-2"
                        style={getStatusColor(employee.status)}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold capitalize" style={{ color: darkTable.text }}>
                        {employee.shift}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold flex items-center" style={{ color: darkTable.text }}>
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(employee.hireDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold" style={{ color: darkTable.text }}>
                        ₹{employee.salary.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="transition-colors duration-200 hover:scale-110 transform"
                          style={{ color: darkTable.muted }}
                          onMouseEnter={(e) => e.target.style.color = darkTable.text}
                          onMouseLeave={(e) => e.target.style.color = darkTable.muted}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(employee.id)}
                          className="text-sm px-3 py-1 rounded-lg font-bold border-2 transition-all duration-200"
                          style={employee.status === 'active' ? {
                            color: '#fecdd3',
                            borderColor: 'rgba(248, 113, 113, 0.5)',
                            backgroundColor: 'rgba(248, 113, 113, 0.12)'
                          } : {
                            color: '#bae6fd',
                            borderColor: 'rgba(56, 189, 248, 0.5)',
                            backgroundColor: 'rgba(56, 189, 248, 0.12)'
                          }}
                          onMouseEnter={(e) => {
                            if (employee.status === 'active') {
                              e.target.style.backgroundColor = 'rgba(248, 113, 113, 0.25)';
                              e.target.style.color = '#ffe4e6';
                            } else {
                              e.target.style.backgroundColor = 'rgba(56, 189, 248, 0.25)';
                              e.target.style.color = '#e0f2fe';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (employee.status === 'active') {
                              e.target.style.backgroundColor = 'rgba(248, 113, 113, 0.12)';
                              e.target.style.color = '#fecdd3';
                            } else {
                              e.target.style.backgroundColor = 'rgba(56, 189, 248, 0.12)';
                              e.target.style.color = '#bae6fd';
                            }
                          }}
                        >
                          {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="transition-colors duration-200 hover:scale-110 transform"
                          style={{ color: '#fca5a5' }}
                          onMouseEnter={(e) => e.target.style.color = '#fecdd3'}
                          onMouseLeave={(e) => e.target.style.color = '#fca5a5'}
                        >
                          <Trash2 className="h-5 w-5" />
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
            <div 
              className="rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2"
              style={{ 
                backgroundColor: colors.cream,
                borderColor: colors.mediumBlue,
                borderWidth: '2px'
              }}
            >
              <div className="p-6">
                <div 
                  className="flex items-center justify-between mb-6 border-b-2 pb-4"
                  style={{ borderColor: colors.mediumBlue }}
                >
                  <h3 className="text-xl font-semibold" style={{ color: colors.darkNavy }}>
                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="transition-colors duration-200"
                    style={{ color: colors.red }}
                    onMouseEnter={(e) => e.target.style.color = '#d32f3e'}
                    onMouseLeave={(e) => e.target.style.color = colors.red}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.mediumBlue }} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-3 py-2 border-2 rounded-lg transition-all"
                          style={{ 
                            borderColor: colors.lightBlue,
                            backgroundColor: 'white'
                          }}
                          onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                          onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                          placeholder="Enter full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.mediumBlue }} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-3 py-2 border-2 rounded-lg transition-all"
                          style={{ 
                            borderColor: colors.lightBlue,
                            backgroundColor: 'white'
                          }}
                          onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                          onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.mediumBlue }} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-3 py-2 border-2 rounded-lg transition-all"
                          style={{ 
                            borderColor: colors.lightBlue,
                            backgroundColor: 'white'
                          }}
                          onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                          onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                        Password {!editingEmployee ? '*' : ''}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.mediumBlue }} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required={!editingEmployee}
                          minLength="6"
                          className="w-full pl-10 pr-10 py-2 border-2 rounded-lg transition-all"
                          style={{ 
                            borderColor: colors.lightBlue,
                            backgroundColor: 'white'
                          }}
                          onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                          onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                          placeholder={editingEmployee ? "Leave blank to keep current password" : "Enter password"}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ color: colors.mediumBlue }}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {editingEmployee && (
                        <p className="mt-1 text-sm" style={{ color: colors.mediumBlue }}>
                          Leave blank to keep the current password
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Job Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                        Tag *
                      </label>
                      <select
                        name="tag"
                        value={formData.tag}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border-2 rounded-lg transition-all"
                        style={{ 
                          borderColor: colors.lightBlue,
                          backgroundColor: 'white',
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                        onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                      >
                        <option value="">Select Tag</option>
                        <option value="chef">Chef</option>
                        <option value="waiter">Waiter</option>
                        <option value="cleaner">Cleaner</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                        Shift *
                      </label>
                      <select
                        name="shift"
                        value={formData.shift}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border-2 rounded-lg transition-all"
                        style={{ 
                          borderColor: colors.lightBlue,
                          backgroundColor: 'white',
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                        onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                      >
                        <option value="">Select Shift</option>
                        <option value="morning">Morning (6 AM - 2 PM)</option>
                        <option value="evening">Evening (2 PM - 10 PM)</option>
                        <option value="night">Night (10 PM - 6 AM)</option>
                        <option value="full-time">Full Time (8 AM - 8 PM)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                        Salary (₹) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.mediumBlue }} />
                        <input
                          type="number"
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
                          required
                          min="0"
                          className="w-full pl-10 pr-3 py-2 border-2 rounded-lg transition-all"
                          style={{ 
                            borderColor: colors.lightBlue,
                            backgroundColor: 'white'
                          }}
                          onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                          onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                          placeholder="Enter salary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                        Status *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border-2 rounded-lg transition-all"
                        style={{ 
                          borderColor: colors.lightBlue,
                          backgroundColor: 'white',
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                        onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on-leave">On Leave</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4" style={{ color: colors.mediumBlue }} />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full pl-10 pr-3 py-2 border-2 rounded-lg transition-all"
                        style={{ 
                          borderColor: colors.lightBlue,
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                        onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                        placeholder="Enter address"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div 
                    className="flex justify-end space-x-3 pt-6 border-t-2"
                    style={{ borderColor: colors.mediumBlue }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="px-6 py-2 text-sm font-bold rounded-lg border-2 transition-all"
                      style={{ 
                        color: colors.darkNavy,
                        backgroundColor: colors.lightBlue,
                        borderColor: colors.mediumBlue
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = colors.mediumBlue;
                        e.target.style.color = colors.cream;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = colors.lightBlue;
                        e.target.style.color = colors.darkNavy;
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 text-sm font-bold text-white rounded-lg transition-all flex items-center shadow-lg"
                      style={{ backgroundColor: colors.red }}
                      onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = '#d32f3e')}
                      onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = colors.red)}
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
