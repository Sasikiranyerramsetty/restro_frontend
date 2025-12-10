import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Mail, MapPin, Phone, Save, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import { useAuth } from '../../context/AuthContext';
import employeeService from '../../services/employeeService';
import { GlassCard, MetricTile, SectionHeading } from '../../components/Employee/EmployeeUI';

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

  const memberSince = useMemo(
    () => (user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'),
    [user?.createdAt]
  );

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
  const roleLabel = useMemo(() => {
    const base = getUserRole() || 'Employee';
    return formData.tag ? `${base} • ${String(formData.tag).toUpperCase()}` : base;
  }, [formData.tag, getUserRole]);

  return (
    <EmployeeLayout>
      <div className="space-y-8 pb-16 text-slate-900">
        <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-slate-900 to-slate-950 opacity-95" />
          <div className="relative grid gap-8 p-8 text-white lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Profile & identity</p>
              <h1 className="text-3xl font-semibold">Personal settings & credentials</h1>
              <p className="text-sm text-white/70">
                Keep your contact data current so the floor team can coordinate, route alerts, and manage payouts without
                friction.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5">{roleLabel}</span>
                <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5">
                  Member since {memberSince}
                </span>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-white/70">Status</p>
              <p className="mt-2 text-2xl font-semibold">{user?.name || 'Employee'}</p>
              <p className="text-sm text-white/70">{formData.email || 'No email linked'}</p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between text-white/70">
                  <span>Profile sync</span>
                  <span className="font-semibold text-white">{hasChanges ? 'Unsaved' : 'Up to date'}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Phone</span>
                  <span className="font-semibold text-white">{formData.phone || 'Pending'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile label="Member since" value={memberSince} icon={Calendar} tone="sky" delta="Account age" />
          <MetricTile label="Role" value={roleLabel} icon={Shield} tone="indigo" delta="Access level" />
          <MetricTile label="Email" value={formData.email || 'Unavailable'} icon={Mail} tone="amber" delta="Primary" />
          <MetricTile label="Phone" value={formData.phone || 'Unavailable'} icon={Phone} tone="rose" delta="Reachability" />
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <GlassCard>
            <SectionHeading title="Profile summary" description="Core identifiers pulled from auth" />
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-semibold text-white">
                  {(user?.name || 'E')[0]?.toUpperCase?.() || 'E'}
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-900">{user?.name || 'Employee'}</p>
                  <p className="text-sm text-slate-500">{roleLabel}</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{formData.email || 'No email linked'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{formData.phone || 'No phone linked'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span>{formData.tag ? `${String(formData.tag).toUpperCase()} station` : 'No station assigned'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{formData.address || 'No address added'}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-2">
            <SectionHeading title="Edit profile" description="Updates sync to the employee directory" />
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-600">
                  Full name
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                    <User className="h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={disableInputs}
                      className="flex-1 border-0 bg-transparent py-3 text-slate-900 outline-none"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-600">
                  Phone number
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={disableInputs}
                      className="flex-1 border-0 bg-transparent py-3 text-slate-900 outline-none"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-600">
                  Email address
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={disableInputs}
                      className="flex-1 border-0 bg-transparent py-3 text-slate-900 outline-none"
                      placeholder="Enter email address"
                    />
                  </div>
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-600">
                  Station tag
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 text-slate-500">
                    <Shield className="h-4 w-4" />
                    <input
                      type="text"
                      value={formData.tag ? String(formData.tag).toUpperCase() : 'Not assigned'}
                      disabled
                      className="flex-1 border-0 bg-transparent py-3 uppercase tracking-wide outline-none"
                    />
                  </div>
                  <p className="text-xs text-slate-400">Contact an administrator to change your station/tag.</p>
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium text-slate-600">
                Address
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                  <MapPin className="mt-3 h-4 w-4 text-slate-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={disableInputs}
                    className="flex-1 border-0 bg-transparent py-3 text-slate-900 outline-none"
                    placeholder="Add your address"
                    rows={3}
                  />
                </div>
              </label>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={disableInputs || !hasChanges || !initialData}
                  onClick={() => {
                    if (initialData) {
                      setFormData(initialData);
                      setHasChanges(false);
                    }
                  }}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={disableInputs || !hasChanges}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeProfile;

