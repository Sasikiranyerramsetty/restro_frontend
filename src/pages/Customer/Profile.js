import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Star,
  Clock,
  ShoppingBag,
  Heart,
  Bell,
  Shield,
  CreditCard,
  Gift
} from 'lucide-react';
import DashboardLayout from '../../components/Common/DashboardLayout';
import { formatCurrency } from '../../utils';

const CustomerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Static customer data
  const customerData = {
    personal: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-05-15',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      joinDate: '2023-01-15',
      profileImage: null
    },
    preferences: {
      favoriteCuisine: ['Italian', 'Indian', 'Mexican'],
      dietaryRestrictions: ['Vegetarian'],
      spiceLevel: 'Medium',
      notifications: {
        email: true,
        sms: true,
        push: false,
        promotions: true,
        orderUpdates: true,
        events: true
      },
      language: 'English',
      timezone: 'EST'
    },
    loyalty: {
      points: 1250,
      tier: 'Gold',
      nextTier: 'Platinum',
      pointsToNext: 750,
      totalOrders: 45,
      totalSpent: 1250.75,
      memberSince: '2023-01-15'
    }
  };

  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      items: ['Chicken Biryani', 'Naan Bread', 'Mango Lassi'],
      total: 28.50,
      status: 'completed',
      rating: 5
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      items: ['Butter Chicken', 'Rice', 'Gulab Jamun'],
      total: 24.75,
      status: 'completed',
      rating: 4
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      items: ['Lamb Curry', 'Garlic Naan', 'Kheer'],
      total: 32.00,
      status: 'completed',
      rating: 5
    }
  ];

  const favoriteItems = [
    { name: 'Chicken Biryani', category: 'Biryani', price: 18.99, orderCount: 12 },
    { name: 'Butter Chicken', category: 'Curry', price: 16.99, orderCount: 8 },
    { name: 'Garlic Naan', category: 'Bread', price: 4.99, orderCount: 15 },
    { name: 'Mango Lassi', category: 'Beverage', price: 5.99, orderCount: 10 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier) => {
    switch (tier.toLowerCase()) {
      case 'gold':
        return 'text-yellow-600 bg-yellow-100';
      case 'platinum':
        return 'text-gray-600 bg-gray-100';
      case 'silver':
        return 'text-gray-500 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: <User className="h-4 w-4" /> },
    { id: 'preferences', name: 'Preferences', icon: <Heart className="h-4 w-4" /> },
    { id: 'orders', name: 'Order History', icon: <ShoppingBag className="h-4 w-4" /> },
    { id: 'loyalty', name: 'Loyalty Program', icon: <Gift className="h-4 w-4" /> },
    { id: 'settings', name: 'Account Settings', icon: <Shield className="h-4 w-4" /> }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 restro-brand">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-outline flex items-center"
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Profile Overview Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-6">
            <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-primary-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{customerData.personal.name}</h2>
              <p className="text-gray-600">{customerData.personal.email}</p>
              <div className="flex items-center mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(customerData.loyalty.tier)}`}>
                  {customerData.loyalty.tier} Member
                </span>
                <span className="ml-3 text-sm text-gray-500">
                  {customerData.loyalty.points} points
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Member since</p>
              <p className="font-semibold text-gray-900">
                {new Date(customerData.personal.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={customerData.personal.name}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={customerData.personal.email}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={customerData.personal.phone}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        value={customerData.personal.dateOfBirth}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={customerData.personal.address.street}
                        disabled={!isEditing}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={customerData.personal.address.city}
                        disabled={!isEditing}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={customerData.personal.address.state}
                        disabled={!isEditing}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={customerData.personal.address.zipCode}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Cuisines</label>
                    <div className="flex flex-wrap gap-2">
                      {customerData.preferences.favoriteCuisine.map((cuisine, index) => (
                        <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                    <div className="flex flex-wrap gap-2">
                      {customerData.preferences.dietaryRestrictions.map((restriction, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        {customerData.preferences.spiceLevel}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {customerData.preferences.language}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Notification Preferences</h4>
                  <div className="space-y-3">
                    {Object.entries(customerData.preferences.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-gray-400" />
                          <span className={`px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                            {value ? 'On' : 'Off'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Order History Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-gray-900">#{order.id}</span>
                          <span className="text-sm text-gray-500">{order.date}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{formatCurrency(order.total)}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < order.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Items:</span> {order.items.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Favorite Items</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteItems.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                            <p className="text-sm text-gray-500">Ordered {item.orderCount} times</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loyalty Program Tab */}
            {activeTab === 'loyalty' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Loyalty Program</h3>
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold">{customerData.loyalty.tier} Member</h4>
                      <p className="text-primary-100">You're doing great!</p>
                    </div>
                    <Gift className="h-12 w-12 text-primary-200" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{customerData.loyalty.points}</p>
                      <p className="text-sm text-primary-100">Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{customerData.loyalty.totalOrders}</p>
                      <p className="text-sm text-primary-100">Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{formatCurrency(customerData.loyalty.totalSpent)}</p>
                      <p className="text-sm text-primary-100">Total Spent</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress to {customerData.loyalty.nextTier}</span>
                    <span className="text-sm text-gray-500">{customerData.loyalty.pointsToNext} points to go</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${(customerData.loyalty.points / (customerData.loyalty.points + customerData.loyalty.pointsToNext)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">Change Password</h4>
                        <p className="text-sm text-gray-500">Update your account password</p>
                      </div>
                    </div>
                    <button className="btn-outline">Change</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">Payment Methods</h4>
                        <p className="text-sm text-gray-500">Manage your saved payment methods</p>
                      </div>
                    </div>
                    <button className="btn-outline">Manage</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">Notification Settings</h4>
                        <p className="text-sm text-gray-500">Configure your notification preferences</p>
                      </div>
                    </div>
                    <button className="btn-outline">Configure</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">Delete Account</h4>
                        <p className="text-sm text-gray-500">Permanently delete your account</p>
                      </div>
                    </div>
                    <button className="btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white">Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end">
            <button className="btn-primary flex items-center">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerProfile;
