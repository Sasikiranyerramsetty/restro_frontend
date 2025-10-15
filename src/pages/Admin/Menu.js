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
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setCategories(cats);
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
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      subcategory: item.subcategory,
      available: item.available,
      preparationTime: item.preparationTime.toString()
    });
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: parseInt(formData.preparationTime)
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
    try {
      await menuManagementService.toggleAvailability(itemId);
      toast.success('Availability updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (available) => {
    return available 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getCategoryBadge = (category) => {
    const colors = {
      starters: 'bg-orange-100 text-orange-800',
      rotis: 'bg-amber-100 text-amber-800',
      curries: 'bg-green-100 text-green-800',
      biryanis: 'bg-blue-100 text-blue-800',
      'restro-specials': 'bg-purple-100 text-purple-800',
      meals: 'bg-indigo-100 text-indigo-800',
      beverages: 'bg-cyan-100 text-cyan-800',
      icecreams: 'bg-pink-100 text-pink-800',
      'family-pack-biryanis': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryDisplayName = (category) => {
    const displayNames = {
      starters: 'Starters',
      rotis: 'Rotis',
      curries: 'Curries',
      biryanis: 'Biryanis',
      'restro-specials': 'Restro Specials',
      meals: 'Meals',
      beverages: 'Beverages',
      icecreams: 'Ice Creams',
      'family-pack-biryanis': 'Family Pack Biryanis'
    };
    return displayNames[category] || category;
  };

  if (loading) {
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
        <div className="flex items-center justify-between animate-slide-up">
          <div>
            <h1 className="text-4xl font-bold gradient-text restro-brand">Menu Management</h1>
          </div>
          <button 
            onClick={handleAddItem}
            className="btn-primary flex items-center hover:scale-105 transition-transform duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Menu Item
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card animate-slide-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl animate-float">
                <Package className="h-7 w-7 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
            </div>
          </div>

          <div className="card animate-slide-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl animate-float" style={{ animationDelay: '0.7s' }}>
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card animate-slide-up animate-delay-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="starters">Starters</option>
                <option value="rotis">Rotis</option>
                <option value="curries">Curries</option>
                <option value="biryanis">Biryanis</option>
                <option value="restro-specials">Restro Specials</option>
                <option value="meals">Meals</option>
                <option value="beverages">Beverages</option>
                <option value="icecreams">Ice Creams</option>
                <option value="family-pack-biryanis">Family Pack Biryanis</option>
              </select>
            </div>
          </div>
        </div>

        {/* Menu Items Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popularity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Utensils className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(item.category)}`}>
                        {getCategoryDisplayName(item.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(item.available)}`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-900">{item.popularity}</span>
                        <span className="text-sm text-gray-500 ml-1">({item.totalOrders} orders)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-primary-600 hover:text-primary-900 transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
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

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="starters">Starters</option>
                      <option value="rotis">Rotis</option>
                      <option value="curries">Curries</option>
                      <option value="biryanis">Biryanis</option>
                      <option value="restro-specials">Restro Specials</option>
                      <option value="meals">Meals</option>
                      <option value="beverages">Beverages</option>
                      <option value="icecreams">Ice Creams</option>
                      <option value="family-pack-biryanis">Family Pack Biryanis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Subcategory</option>
                      {formData.category === 'rotis' || formData.category === 'beverages' || formData.category === 'icecreams' ? (
                        <option value="veg">Veg</option>
                      ) : (
                        <>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="non-vegetarian">Non-Vegetarian</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preparation Time (minutes)
                    </label>
                    <input
                      type="number"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Available
                    </label>
                  </div>
                </div>


                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center"
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
