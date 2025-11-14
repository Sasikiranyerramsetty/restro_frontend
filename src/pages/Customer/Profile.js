import React, { useState, useEffect } from 'react';
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
  ShoppingBag,
  Heart,
  Bell,
  Shield,
  CreditCard,
  Gift
} from 'lucide-react';
import CustomerLayout from '../../components/Customer/CustomerLayout';
import { formatCurrency } from '../../utils';
import { useAuth } from '../../context/AuthContext';

const CustomerProfile = () => {
  const { user } = useAuth();
  
  // Custom color palette (matching admin)
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [customerData, setCustomerData] = useState({
    personal: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      joinDate: '',
      profileImage: null
    },
    preferences: {
      favoriteCuisine: [],
      dietaryRestrictions: [],
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
      points: 0,
      tier: 'Bronze',
      nextTier: 'Silver',
      pointsToNext: 100,
      totalOrders: 0,
      totalSpent: 0,
      memberSince: ''
    }
  });

  // Update customer data when user changes
  useEffect(() => {
    if (user) {
      setCustomerData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          joinDate: user.created_at || new Date().toISOString().split('T')[0]
        }
      }));
    }
  }, [user]);

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
    { id: 'settings', name: 'Account Settings', icon: <Shield className="h-4 w-4" /> }
  ];

  return (
    <CustomerLayout>
      <div className="space-y-6" style={{ backgroundColor: colors.cream, minHeight: '100vh', padding: '2rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 
              className="text-3xl font-bold restro-brand"
              style={{
                fontFamily: "'BBH Sans Bartle', sans-serif",
                background: `linear-gradient(135deg, ${colors.red} 0%, ${colors.darkNavy} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.5rem',
                fontFeatureSettings: '"liga" off',
                fontVariantLigatures: 'none',
                textRendering: 'geometricPrecision',
                fontKerning: 'none'
              }}
            >
              My Profile
            </h1>
            <div 
              style={{
                height: '3px',
                width: '150px',
                background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.darkNavy} 100%)`,
                borderRadius: '2px'
              }}
            />
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: colors.darkNavy,
              background: colors.cream,
              border: `2px solid ${colors.mediumBlue}`,
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = colors.lightBlue;
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = colors.cream;
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Profile Overview Card */}
        <div 
          style={{
            background: `linear-gradient(135deg, ${colors.cream} 0%, white 100%)`,
            borderRadius: '0.5rem',
            border: `2px solid ${colors.lightBlue}`,
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 53, 87, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 53, 87, 0.1)';
          }}
        >
          <div className="flex items-center space-x-6">
            <div 
              style={{
                height: '5rem',
                width: '5rem',
                background: colors.lightBlue,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${colors.mediumBlue}`
              }}
            >
              <User className="h-10 w-10" style={{ color: colors.darkNavy }} />
            </div>
            <div className="flex-1">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.darkNavy }}>{customerData.personal.name}</h2>
              <p style={{ color: colors.mediumBlue }}>{customerData.personal.email}</p>
              <p style={{ fontSize: '0.875rem', color: colors.mediumBlue, marginTop: '0.5rem' }}>{customerData.personal.phone}</p>
            </div>
            <div className="text-right">
              <p style={{ fontSize: '0.875rem', color: colors.mediumBlue }}>Member since</p>
              <p style={{ fontWeight: '600', color: colors.darkNavy }}>
                {new Date(customerData.personal.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div 
          style={{
            background: `linear-gradient(135deg, ${colors.cream} 0%, white 100%)`,
            borderRadius: '0.5rem',
            border: `2px solid ${colors.lightBlue}`,
            boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)'
          }}
        >
          <div style={{ borderBottom: `2px solid ${colors.lightBlue}` }}>
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    paddingLeft: '0.25rem',
                    paddingRight: '0.25rem',
                    borderBottom: `2px solid ${activeTab === tab.id ? colors.mediumBlue : 'transparent'}`,
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    color: activeTab === tab.id ? colors.darkNavy : colors.mediumBlue,
                    background: 'transparent',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.color = colors.darkNavy;
                      e.target.style.borderBottomColor = colors.lightBlue;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.target.style.color = colors.mediumBlue;
                      e.target.style.borderBottomColor = 'transparent';
                    }
                  }}
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
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: colors.darkNavy }}>Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>Full Name</label>
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <input
                        type="text"
                        value={customerData.personal.name}
                        disabled={!isEditing}
                        onChange={(e) => setCustomerData(prev => ({
                          ...prev,
                          personal: { ...prev.personal, name: e.target.value }
                        }))}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: isEditing ? 'white' : colors.cream,
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => {
                          if (isEditing) {
                            e.target.style.borderColor = colors.mediumBlue;
                            e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <input
                        type="email"
                        value={customerData.personal.email}
                        disabled={!isEditing}
                        onChange={(e) => setCustomerData(prev => ({
                          ...prev,
                          personal: { ...prev.personal, email: e.target.value }
                        }))}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: isEditing ? 'white' : colors.cream,
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => {
                          if (isEditing) {
                            e.target.style.borderColor = colors.mediumBlue;
                            e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>Phone</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <input
                        type="tel"
                        value={customerData.personal.phone}
                        disabled={!isEditing}
                        onChange={(e) => setCustomerData(prev => ({
                          ...prev,
                          personal: { ...prev.personal, phone: e.target.value }
                        }))}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: isEditing ? 'white' : colors.cream,
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => {
                          if (isEditing) {
                            e.target.style.borderColor = colors.mediumBlue;
                            e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>Date of Birth</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <input
                        type="date"
                        value={customerData.personal.dateOfBirth}
                        disabled={!isEditing}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: isEditing ? 'white' : colors.cream,
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => {
                          if (isEditing) {
                            e.target.style.borderColor = colors.mediumBlue;
                            e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>Address</label>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 mt-2" style={{ color: colors.mediumBlue }} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={customerData.personal.address.street}
                        disabled={!isEditing}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: isEditing ? 'white' : colors.cream,
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => {
                          if (isEditing) {
                            e.target.style.borderColor = colors.mediumBlue;
                            e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={customerData.personal.address.city}
                        disabled={!isEditing}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: isEditing ? 'white' : colors.cream,
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => {
                          if (isEditing) {
                            e.target.style.borderColor = colors.mediumBlue;
                            e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={customerData.personal.address.state}
                        disabled={!isEditing}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: isEditing ? 'white' : colors.cream,
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => {
                          if (isEditing) {
                            e.target.style.borderColor = colors.mediumBlue;
                            e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={customerData.personal.address.zipCode}
                        disabled={!isEditing}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: `2px solid ${colors.lightBlue}`,
                          borderRadius: '0.5rem',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: isEditing ? 'white' : colors.cream,
                          color: colors.darkNavy
                        }}
                        onFocus={(e) => {
                          if (isEditing) {
                            e.target.style.borderColor = colors.mediumBlue;
                            e.target.style.boxShadow = `0 0 0 3px rgba(69, 123, 157, 0.1)`;
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = colors.lightBlue;
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: colors.darkNavy }}>Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>Favorite Cuisines</label>
                    <div className="flex flex-wrap gap-2">
                      {customerData.preferences.favoriteCuisine.map((cuisine, index) => (
                        <span 
                          key={index} 
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: colors.lightBlue,
                            color: colors.darkNavy,
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            border: `1px solid ${colors.mediumBlue}`
                          }}
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>Dietary Restrictions</label>
                    <div className="flex flex-wrap gap-2">
                      {customerData.preferences.dietaryRestrictions.map((restriction, index) => (
                        <span 
                          key={index} 
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: colors.cream,
                            color: colors.darkNavy,
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            border: `1px solid ${colors.mediumBlue}`
                          }}
                        >
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>Spice Level</label>
                    <div className="flex items-center space-x-2">
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: '#FEE2E2',
                        color: colors.red,
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        border: `1px solid ${colors.red}`
                      }}>
                        {customerData.preferences.spiceLevel}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '0.5rem' }}>Language</label>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: colors.cream,
                      color: colors.darkNavy,
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      border: `1px solid ${colors.mediumBlue}`
                    }}>
                      {customerData.preferences.language}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '1rem' }}>Notification Preferences</h4>
                  <div className="space-y-3">
                    {Object.entries(customerData.preferences.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between" style={{ padding: '0.75rem', background: colors.cream, borderRadius: '0.5rem', border: `1px solid ${colors.lightBlue}` }}>
                        <span style={{ fontSize: '0.875rem', color: colors.darkNavy, textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4" style={{ color: colors.mediumBlue }} />
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            background: value ? colors.lightBlue : colors.cream,
                            color: value ? colors.darkNavy : colors.mediumBlue,
                            border: `1px solid ${value ? colors.mediumBlue : colors.lightBlue}`
                          }}>
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
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: colors.darkNavy }}>Recent Orders</h3>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div 
                      key={order.id} 
                      style={{
                        background: `linear-gradient(135deg, ${colors.cream} 0%, white 100%)`,
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        border: `2px solid ${colors.lightBlue}`,
                        boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 53, 87, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 53, 87, 0.1)';
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-4">
                          <span style={{ fontWeight: '500', color: colors.darkNavy }}>#{order.id}</span>
                          <span style={{ fontSize: '0.875rem', color: colors.mediumBlue }}>{order.date}</span>
                          <span 
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              backgroundColor: order.status === 'completed' ? colors.lightBlue : colors.cream,
                              color: colors.darkNavy,
                              border: `1px solid ${colors.mediumBlue}`
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span style={{ fontWeight: '600', color: colors.darkNavy }}>{formatCurrency(order.total)}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4"
                                style={{ 
                                  color: i < order.rating ? '#F59E0B' : colors.lightBlue,
                                  fill: i < order.rating ? '#F59E0B' : 'none'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: colors.darkNavy }}>
                        <span style={{ fontWeight: '500' }}>Items:</span> {order.items.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <h4 style={{ fontSize: '1rem', fontWeight: '500', color: colors.darkNavy, marginBottom: '1rem' }}>Favorite Items</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteItems.map((item, index) => (
                      <div 
                        key={index} 
                        style={{
                          background: `linear-gradient(135deg, ${colors.cream} 0%, white 100%)`,
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          border: `2px solid ${colors.lightBlue}`,
                          boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 53, 87, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 53, 87, 0.1)';
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 style={{ fontWeight: '500', color: colors.darkNavy }}>{item.name}</h5>
                            <p style={{ fontSize: '0.875rem', color: colors.mediumBlue }}>{item.category}</p>
                          </div>
                          <div className="text-right">
                            <p style={{ fontWeight: '600', color: colors.darkNavy }}>{formatCurrency(item.price)}</p>
                            <p style={{ fontSize: '0.875rem', color: colors.mediumBlue }}>Ordered {item.orderCount} times</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: colors.darkNavy }}>Account Settings</h3>
                <div className="space-y-4">
                  <div 
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.cream} 0%, white 100%)`,
                      border: `2px solid ${colors.lightBlue}`,
                      boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 53, 87, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 53, 87, 0.1)';
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <div>
                        <h4 style={{ fontWeight: '500', color: colors.darkNavy }}>Change Password</h4>
                        <p style={{ fontSize: '0.875rem', color: colors.mediumBlue }}>Update your account password</p>
                      </div>
                    </div>
                    <button 
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: colors.darkNavy,
                        background: colors.cream,
                        border: `2px solid ${colors.mediumBlue}`,
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = colors.lightBlue;
                        e.target.style.borderColor = colors.darkNavy;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = colors.cream;
                        e.target.style.borderColor = colors.mediumBlue;
                      }}
                    >
                      Change
                    </button>
                  </div>
                  <div 
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.cream} 0%, white 100%)`,
                      border: `2px solid ${colors.lightBlue}`,
                      boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 53, 87, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 53, 87, 0.1)';
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <div>
                        <h4 style={{ fontWeight: '500', color: colors.darkNavy }}>Payment Methods</h4>
                        <p style={{ fontSize: '0.875rem', color: colors.mediumBlue }}>Manage your saved payment methods</p>
                      </div>
                    </div>
                    <button 
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: colors.darkNavy,
                        background: colors.cream,
                        border: `2px solid ${colors.mediumBlue}`,
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = colors.lightBlue;
                        e.target.style.borderColor = colors.darkNavy;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = colors.cream;
                        e.target.style.borderColor = colors.mediumBlue;
                      }}
                    >
                      Manage
                    </button>
                  </div>
                  <div 
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.cream} 0%, white 100%)`,
                      border: `2px solid ${colors.lightBlue}`,
                      boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 53, 87, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 53, 87, 0.1)';
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5" style={{ color: colors.mediumBlue }} />
                      <div>
                        <h4 style={{ fontWeight: '500', color: colors.darkNavy }}>Notification Settings</h4>
                        <p style={{ fontSize: '0.875rem', color: colors.mediumBlue }}>Configure your notification preferences</p>
                      </div>
                    </div>
                    <button 
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: colors.darkNavy,
                        background: colors.cream,
                        border: `2px solid ${colors.mediumBlue}`,
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = colors.lightBlue;
                        e.target.style.borderColor = colors.darkNavy;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = colors.cream;
                        e.target.style.borderColor = colors.mediumBlue;
                      }}
                    >
                      Configure
                    </button>
                  </div>
                  <div 
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.cream} 0%, white 100%)`,
                      border: `2px solid ${colors.red}`,
                      boxShadow: '0 2px 8px rgba(29, 53, 87, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(230, 57, 70, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 53, 87, 0.1)';
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5" style={{ color: colors.red }} />
                      <div>
                        <h4 style={{ fontWeight: '500', color: colors.darkNavy }}>Delete Account</h4>
                        <p style={{ fontSize: '0.875rem', color: colors.mediumBlue }}>Permanently delete your account</p>
                      </div>
                    </div>
                    <button 
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: colors.red,
                        background: '#FEE2E2',
                        border: `2px solid ${colors.red}`,
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = colors.red;
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#FEE2E2';
                        e.target.style.color = colors.red;
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end">
            <button 
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                background: `linear-gradient(135deg, ${colors.red} 0%, ${colors.darkNavy} 100%)`,
                border: 'none',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = `0 4px 12px rgba(29, 53, 87, 0.3)`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerProfile;
