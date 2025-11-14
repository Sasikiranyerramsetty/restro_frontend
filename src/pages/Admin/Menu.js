import React, { useState, useEffect } from 'react';
import { 
  ChefHat, Plus, Search, Filter, Edit, Trash2, Eye, 
  Star, Clock, Users, TrendingUp, Package,
  X, Save, AlertCircle, CheckCircle, Image as ImageIcon,
  Utensils, Calendar, BarChart3
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import menuManagementService from '../../services/menuManagementService';
import toast from 'react-hot-toast';

const AdminMenu = () => {
  // Custom color palette
  const colors = {
    red: '#E63946',
    cream: '#F1FAEE',
    lightBlue: '#A8DADC',
    mediumBlue: '#457B9D',
    darkNavy: '#1D3557'
  };

  const [menuItems, setMenuItems] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingItemId, setTogglingItemId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    subcategory: '',
    available: true,
    preparationTime: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [items, cats, menuStats] = await Promise.all([
        menuManagementService.getMenuItems(),
        menuManagementService.getCategories(),
        menuManagementService.getMenuStats()
      ]);
      setMenuItems(items);
      setSubcategories(cats);
      setStats(menuStats);
    } catch (error) {
      toast.error('Failed to fetch menu data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      subcategory: '',
      available: true,
      preparationTime: ''
    });
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddItem = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditItem = (item) => {
    // Use values as-is now (no swapping)
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category || '',
      subcategory: item.subcategory || '',
      available: item.available,
      preparationTime: (item.preparationTime ?? 0).toString()
    });
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save as provided
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: parseInt(formData.preparationTime || '0')
      };

      if (editingItem) {
        await menuManagementService.updateMenuItem(editingItem.id, itemData);
        toast.success('Menu item updated successfully');
      } else {
        await menuManagementService.addMenuItem(itemData);
        toast.success('Menu item added successfully');
      }

      setShowAddModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Failed to save menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await menuManagementService.deleteMenuItem(itemId);
        toast.success('Menu item deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete menu item');
      }
    }
  };

  const handleToggleAvailability = async (itemId) => {
    // Prevent multiple toggles on the same item
    if (togglingItemId === itemId) {
      return;
    }
    
    try {
      setTogglingItemId(itemId);
      const result = await menuManagementService.toggleAvailability(itemId);
      
      if (result.success !== false) {
        toast.success('Availability updated');
        // Refresh data to get updated state
        await fetchData();
      } else {
        toast.error(result.error || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Toggle availability error:', error);
      toast.error('Failed to update availability');
    } finally {
      setTogglingItemId(null);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by subcategory only (use subcategory if exists, otherwise use category as fallback)
    let matchesSubcategory = true;
    
    if (selectedSubcategory !== 'all') {
      const itemSubcategory = (item.subcategory || item.category || '').toLowerCase();
      const selected = selectedSubcategory.toLowerCase();
      matchesSubcategory = itemSubcategory === selected;
    }
    
    return matchesSearch && matchesSubcategory;
  });

  const getStatusBadge = (available) => {
    if (available) {
      return {
        backgroundColor: colors.lightBlue,
        color: colors.darkNavy,
        borderColor: colors.mediumBlue,
        borderWidth: '2px'
      };
    } else {
      return {
        backgroundColor: colors.red,
        color: colors.cream,
        borderColor: colors.red,
        borderWidth: '2px'
      };
    }
  };

  const getCategoryBadge = (category) => {
    if (!category) {
      return {
        backgroundColor: colors.cream,
        color: colors.darkNavy,
        borderColor: colors.lightBlue,
        borderWidth: '2px'
      };
    }
    
    const normalized = category.toLowerCase();
    const categoryColors = {
      starters: { bg: colors.red, text: colors.cream, border: colors.red },
      rotis: { bg: colors.lightBlue, text: colors.darkNavy, border: colors.mediumBlue },
      curries: { bg: colors.mediumBlue, text: colors.cream, border: colors.mediumBlue },
      biryani: { bg: colors.darkNavy, text: colors.cream, border: colors.darkNavy },
      biryanis: { bg: colors.darkNavy, text: colors.cream, border: colors.darkNavy },
      'restro-specials': { bg: colors.red, text: colors.cream, border: colors.red },
      'dharani-s-specials': { bg: colors.red, text: colors.cream, border: colors.red },
      meals: { bg: colors.lightBlue, text: colors.darkNavy, border: colors.darkNavy },
      beverages: { bg: colors.mediumBlue, text: colors.cream, border: colors.mediumBlue },
      'ice-creams': { bg: colors.lightBlue, text: colors.darkNavy, border: colors.lightBlue },
      icecreams: { bg: colors.lightBlue, text: colors.darkNavy, border: colors.lightBlue },
      'family-pack-biryanis': { bg: colors.red, text: colors.cream, border: colors.red }
    };
    const color = categoryColors[normalized] || { bg: colors.cream, text: colors.darkNavy, border: colors.lightBlue };
    return {
      backgroundColor: color.bg,
      color: color.text,
      borderColor: color.border,
      borderWidth: '2px'
    };
  };

  const getCategoryDisplayName = (category) => {
    if (!category) return 'Uncategorized';
    
    // Handle normalized IDs (lowercase with hyphens)
    const normalized = category.toLowerCase();
    const displayNames = {
      starters: 'Starters',
      rotis: 'Rotis',
      curries: 'Curries',
      biryani: 'Biryani',
      biryanis: 'Biryanis',
      'restro-specials': 'Restro Specials',
      'dharani-s-specials': "Dharani's Specials",
      meals: 'Meals',
      beverages: 'Beverages',
      'ice-creams': 'Ice Creams',
      icecreams: 'Ice Creams',
      'family-pack-biryanis': 'Family Pack Biryanis'
    };
    
    // Check normalized first, then return formatted name if not found
    return displayNames[normalized] || category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.red }}
            ></div>
            <p className="font-semibold" style={{ color: colors.darkNavy }}>Loading menu...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in" style={{ backgroundColor: colors.cream, minHeight: '100vh', padding: '2rem' }}>
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up">
          <div>
            <h1 
              className="text-4xl font-bold drop-shadow-lg mb-2" 
              style={{ 
                fontFamily: 'Rockybilly, sans-serif', 
                letterSpacing: '0.05em',
                color: colors.darkNavy 
              }}
            >
              Menu Management
            </h1>
            <div style={{ height: '4px', background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.mediumBlue} 100%)`, borderRadius: '2px', width: '150px' }}></div>
          </div>
          <button 
            onClick={handleAddItem}
            className="px-8 py-3 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
            style={{ backgroundColor: colors.red }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f3e'}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.red}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Menu Item
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
            style={{ 
              animationDelay: '0.1s',
              background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.lightBlue} 100%)`,
              borderColor: colors.red,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: colors.darkNavy, opacity: 0.8 }}>Total Items</p>
                <p className="text-3xl font-bold" style={{ color: colors.red }}>{stats.totalItems}</p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <Package className="h-8 w-8" style={{ color: colors.red }} />
              </div>
            </div>
          </div>

          <div 
            className="rounded-2xl shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:scale-105 animate-slide-up border-2"
            style={{ 
              animationDelay: '0.2s',
              background: `linear-gradient(135deg, ${colors.lightBlue} 0%, ${colors.mediumBlue} 100%)`,
              borderColor: colors.mediumBlue,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold mb-2" style={{ color: colors.cream }}>Available</p>
                <p className="text-3xl font-bold" style={{ color: colors.cream }}>{stats.availableItems}</p>
              </div>
              <div className="p-4 rounded-full shadow-lg" style={{ backgroundColor: colors.cream }}>
                <CheckCircle className="h-8 w-8" style={{ color: colors.mediumBlue }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
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
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="sm:w-56">
              <select
                aria-label="Subcategory"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl font-medium transition-all"
                style={{ 
                  borderColor: colors.lightBlue,
                  backgroundColor: 'white',
                  color: colors.darkNavy
                }}
                onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
              >
                <option value="all">All Subcategories</option>
                {subcategories.map((subcat) => (
                  <option key={subcat.id} value={subcat.id}>
                    {subcat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Menu Items Table */}
        <div 
          className="rounded-2xl shadow-xl overflow-hidden border-2"
          style={{ 
            backgroundColor: colors.cream,
            borderColor: colors.mediumBlue,
            borderWidth: '2px'
          }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ backgroundColor: colors.lightBlue }}>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider rounded-l-lg"
                    style={{ color: colors.darkNavy }}
                  >
                    Item
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors.darkNavy }}
                  >
                    Subcategory
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors.darkNavy }}
                  >
                    Price
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors.darkNavy }}
                  >
                    Status
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: colors.darkNavy }}
                  >
                    Popularity
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider rounded-r-lg"
                    style={{ color: colors.darkNavy }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className="transition-colors border-b"
                    style={{ 
                      borderColor: colors.lightBlue,
                      backgroundColor: index % 2 === 0 ? colors.cream : 'rgba(168, 218, 220, 0.2)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.lightBlue}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? colors.cream : 'rgba(168, 218, 220, 0.2)'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="h-12 w-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: colors.lightBlue }}
                        >
                          <Utensils className="h-6 w-6" style={{ color: colors.darkNavy }} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold" style={{ color: colors.darkNavy }}>{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="inline-flex px-3 py-1 text-xs font-bold rounded-full border-2"
                        style={getCategoryBadge(item.subcategory || item.category)}
                      >
                        {getCategoryDisplayName(item.subcategory || item.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold" style={{ color: colors.darkNavy }}>
                      ₹{item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        disabled={togglingItemId === item.id}
                        className="inline-flex px-3 py-1 text-xs font-bold rounded-full transition-colors border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={getStatusBadge(item.available)}
                      >
                        {togglingItemId === item.id ? 'Updating...' : (item.available ? 'Available' : 'Unavailable')}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" style={{ color: '#F59E0B' }} />
                        <span className="text-sm font-semibold" style={{ color: colors.darkNavy }}>{item.popularity}</span>
                        <span className="text-sm ml-1" style={{ color: colors.mediumBlue }}>({item.totalOrders} orders)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="transition-colors duration-200 hover:scale-110 transform"
                          style={{ color: colors.mediumBlue }}
                          onMouseEnter={(e) => e.target.style.color = colors.darkNavy}
                          onMouseLeave={(e) => e.target.style.color = colors.mediumBlue}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="transition-colors duration-200 hover:scale-110 transform"
                          style={{ color: colors.red }}
                          onMouseEnter={(e) => e.target.style.color = '#d32f3e'}
                          onMouseLeave={(e) => e.target.style.color = colors.red}
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

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div 
              className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border-2"
              style={{ 
                backgroundColor: colors.cream,
                borderColor: colors.mediumBlue,
                borderWidth: '2px'
              }}
            >
              <div 
                className="flex items-center justify-between p-8 border-b-2"
                style={{ borderColor: colors.mediumBlue }}
              >
                <h3 
                  className="text-xl font-bold" 
                  style={{ 
                    fontFamily: 'Rockybilly, sans-serif',
                    color: colors.darkNavy 
                  }}
                >
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="transition-colors duration-200 hover:scale-110"
                  style={{ color: colors.red }}
                  onMouseEnter={(e) => e.target.style.color = '#d32f3e'}
                  onMouseLeave={(e) => e.target.style.color = colors.red}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                      Item Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 rounded-xl transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                      onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 rounded-xl transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                      onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                      Subcategory *
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 rounded-xl font-medium transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: 'white',
                        color: colors.darkNavy
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                      onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories.map((subcat) => (
                        <option key={subcat.id} value={subcat.id}>
                          {subcat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: colors.darkNavy }}>
                      Preparation Time (minutes)
                    </label>
                    <input
                      type="number"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border-2 rounded-xl transition-all"
                      style={{ 
                        borderColor: colors.lightBlue,
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mediumBlue}
                      onBlur={(e) => e.target.style.borderColor = colors.lightBlue}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded"
                      style={{ accentColor: colors.mediumBlue }}
                    />
                    <label className="ml-3 block text-sm font-bold" style={{ color: colors.darkNavy }}>
                      Available
                    </label>
                  </div>
                </div>


                <div 
                  className="flex items-center justify-end space-x-3 pt-4 border-t-2 mt-6"
                  style={{ borderColor: colors.mediumBlue }}
                >
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 text-sm font-bold rounded-xl transition-all duration-200 border-2"
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
                    className="px-6 py-3 text-white rounded-xl font-bold transition-all duration-300 shadow-lg flex items-center"
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
                        {editingItem ? 'Update Item' : 'Add Item'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMenu;
