import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  Settings, 
  Menu as MenuIcon,
  X,
  ChefHat,
  Home,
  ShoppingBag,
  Users,
  BarChart3,
  Package,
  FileText,
  Calendar,
  MapPin,
  ClipboardList,
  Clock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, USER_ROLES } from '../../constants';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, getUserRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getNavigationItems = () => {
    const role = getUserRole();
    
    switch (role) {
      case USER_ROLES.ADMIN:
        return [
          { name: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: <BarChart3 className="h-4 w-4" /> },
          { name: 'Menu', path: ROUTES.ADMIN_MENU, icon: <ChefHat className="h-4 w-4" /> },
          { name: 'Orders', path: ROUTES.ADMIN_ORDERS, icon: <ShoppingBag className="h-4 w-4" /> },
          { name: 'Employees', path: ROUTES.ADMIN_EMPLOYEES, icon: <Users className="h-4 w-4" /> },
          { name: 'Customers', path: ROUTES.ADMIN_CUSTOMERS, icon: <UserCheck className="h-4 w-4" /> },
          { name: 'Inventory', path: ROUTES.ADMIN_INVENTORY, icon: <Package className="h-4 w-4" /> },
          { name: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: <FileText className="h-4 w-4" /> },
          { name: 'Tables', path: ROUTES.ADMIN_TABLES, icon: <MapPin className="h-4 w-4" /> },
          { name: 'Events', path: ROUTES.ADMIN_EVENTS, icon: <Calendar className="h-4 w-4" /> }
        ];
      case USER_ROLES.EMPLOYEE:
        return [
          { name: 'Dashboard', path: ROUTES.EMPLOYEE_DASHBOARD, icon: <BarChart3 className="h-4 w-4" /> },
          { name: 'Orders', path: ROUTES.EMPLOYEE_ORDERS, icon: <ShoppingBag className="h-4 w-4" /> },
          { name: 'Tables', path: ROUTES.EMPLOYEE_TABLES, icon: <MapPin className="h-4 w-4" /> },
          { name: 'Tasks', path: ROUTES.EMPLOYEE_TASKS, icon: <ClipboardList className="h-4 w-4" /> },
          { name: 'Shifts', path: ROUTES.EMPLOYEE_SHIFTS, icon: <Clock className="h-4 w-4" /> }
        ];
      case USER_ROLES.CUSTOMER:
        return [
          { name: 'Home', path: ROUTES.CUSTOMER_HOME, icon: <Home className="h-4 w-4" /> },
          { name: 'Menu', path: ROUTES.CUSTOMER_MENU, icon: <ChefHat className="h-4 w-4" /> },
          { name: 'Orders', path: ROUTES.CUSTOMER_ORDERS, icon: <ShoppingBag className="h-4 w-4" /> },
          { name: 'Reservations', path: ROUTES.CUSTOMER_RESERVATIONS, icon: <Calendar className="h-4 w-4" /> },
          { name: 'Events', path: ROUTES.CUSTOMER_EVENTS, icon: <Calendar className="h-4 w-4" /> },
          { name: 'Profile', path: ROUTES.CUSTOMER_PROFILE, icon: <User className="h-4 w-4" /> }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo */}
          <div className="flex items-center mr-8">
            <Link to={user ? (getUserRole() === USER_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : 
              getUserRole() === USER_ROLES.EMPLOYEE ? ROUTES.EMPLOYEE_DASHBOARD : ROUTES.CUSTOMER_HOME) : ROUTES.CUSTOMER_HOME} 
              className="flex items-center space-x-2"
            >
              <div className="h-10 w-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 restro-brand">RESTRO</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                <div className="h-9 w-9 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <span className="text-base font-medium">{user?.name}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-base text-gray-700 border-b border-gray-200">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-gray-500">{user?.email}</p>
                      <p className="text-sm text-primary-600 capitalize">{user?.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-base text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <MenuIcon className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile User Info */}
              <div className="px-3 py-2 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full mt-3 px-3 py-2 text-base text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
