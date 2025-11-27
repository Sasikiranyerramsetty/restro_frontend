import React, { useState, useEffect, useMemo } from 'react';
import { User, Phone, Mail, MapPin, Shield, Calendar, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import { useAuth } from '../../context/AuthContext';
import employeeService from '../../services/employeeService';

const EmployeeProfile = () => {
  const { user, updateUser, getUserRole } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', tag: '' });
  const [initialData, setInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const normalizeProfile = (data = {}) => ({
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || data.phone_number || '',
    address: data.address || '',
    tag: data.tag || ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setIsLoadingProfile(false);
        return;
      }
      setIsLoadingProfile(true);
      const result = await employeeService.getProfile(user.id);
      if (result.success) {
        const normalized = normalizeProfile(result.data);
        setFormData(normalized);
        setInitialData(normalized);
        setHasChanges(false);
      } else {
        toast.error(result.error || 'Failed to load profile');
      }
      setIsLoadingProfile(false);
    };

    fetchProfile();
  }, [user?.id]);

  const colors = useMemo(() => ({
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  }), []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!hasChanges) {
      toast('No changes to save');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      };
      const result = await updateUser(payload);
      if (result.success) {
        const updated = normalizeProfile(result.data || payload);
        setFormData(updated);
        setInitialData(updated);
        setHasChanges(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Profile update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disableInputs = isLoadingProfile || isSubmitting;

  return (
    <EmployeeLayout>
      <div className="employee-profile space-y-8 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', padding: '2rem' }}>
        {/* Header */}
        <div className="animate-slide-up">
          <h1
            className="text-4xl font-bold drop-shadow-lg mb-2"
            style={{
              fontFamily: 'Rockybilly, sans-serif',
              letterSpacing: '0.05em',
              color: colors.darkNavy,
              fontSize: '1.6875rem'
            }}
          >
            My Profile
          </h1>
          <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '140px' }}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-transparent" style={{ borderColor: colors.mediumBlue }}>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: colors.mediumBlue }}>
                  {(user?.name || 'E')[0]?.toUpperCase?.() || 'E'}
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: colors.darkNavy }}>{user?.name || 'Employee'}</p>
                  <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: colors.red }}>
                    {getUserRole() || 'Employee'}{user?.tag ? ` • ${String(user.tag).toUpperCase()}` : ''}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{formData.email || 'No email linked'}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{formData.phone || 'No phone linked'}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span>{formData.tag ? `${String(formData.tag).toUpperCase()} Station` : 'No station assigned'}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span>
                </div>
              </div>

              {formData.address && (
                <div className="flex items-start space-x-3 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <span>{formData.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border-2" style={{ borderColor: colors.mediumBlue }}>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Full Name</label>
                  <div className="flex items-center space-x-3 bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
                    <User className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="flex-1 bg-transparent py-3 focus:outline-none text-gray-900"
                      placeholder="Enter your full name"
                      required
                      disabled={disableInputs}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Phone Number</label>
                  <div className="flex items-center space-x-3 bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 bg-transparent py-3 focus:outline-none text-gray-900"
                      placeholder="Enter phone number"
                      required
                      disabled={disableInputs}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Email Address</label>
                  <div className="flex items-center space-x-3 bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="flex-1 bg-transparent py-3 focus:outline-none text-gray-900"
                      placeholder="Enter email address"
                      disabled={disableInputs}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-2 block">Station Tag</label>
                  <div className="flex items-center space-x-3 bg-gray-100 border border-gray-200 rounded-xl px-4 cursor-not-allowed">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.tag ? String(formData.tag).toUpperCase() : 'Not assigned'}
                      disabled
                      className="flex-1 bg-transparent py-3 focus:outline-none text-gray-500 uppercase tracking-wide"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Contact an administrator to change your station/tag.</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">Address</label>
                <div className="flex items-start space-x-3 bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
                  <MapPin className="h-5 w-5 text-gray-400 mt-3" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="flex-1 bg-transparent py-3 focus:outline-none resize-none min-h-[100px] text-gray-900"
                    placeholder="Add your address"
                    disabled={disableInputs}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  disabled={disableInputs || !hasChanges || !initialData}
                  onClick={() => {
                    if (initialData) {
                      setFormData(initialData);
                      setHasChanges(false);
                    }
                  }}
                  className={`px-5 py-3 rounded-xl font-semibold border border-gray-300 transition-all duration-300 ${
                    disableInputs || !hasChanges || !initialData
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={disableInputs || !hasChanges}
                  className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 ${
                    disableInputs || !hasChanges ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'text-white shadow-lg hover:opacity-90'
                  }`}
                  style={{ backgroundColor: colors.red }}
                >
                  <Save className="h-4 w-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeProfile;

