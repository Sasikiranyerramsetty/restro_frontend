import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
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
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../UI/ThemeToggle';
import { ROUTES, USER_ROLES } from '../../constants';
import toast from 'react-hot-toast';

const Navbar = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, getUserRole } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Logout failed');
    }
  }, [logout, navigate]);

  const navigationItems = useMemo(() => {
    const role = getUserRole();
    
    switch (role) {
      case USER_ROLES.ADMIN:
        return [
          { name: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: <BarChart3 className="h-4 w-4" /> },
          { name: 'Menu', path: ROUTES.ADMIN_MENU, icon: <ChefHat className="h-4 w-4" /> },
          { name: 'Orders', path: ROUTES.ADMIN_ORDERS, icon: <ShoppingBag className="h-4 w-4" /> },
          { name: 'Employees', path: ROUTES.ADMIN_EMPLOYEES, icon: <Users className="h-4 w-4" /> },
          { name: 'Customers', path: ROUTES.ADMIN_CUSTOMERS, icon: <UserCheck className="h-4 w-4" /> },
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
          { name: 'Dashboard', path: ROUTES.CUSTOMER_DASHBOARD, icon: <BarChart3 className="h-4 w-4" /> },
          { name: 'Menu', path: ROUTES.CUSTOMER_MENU, icon: <ChefHat className="h-4 w-4" /> },
          { name: 'Orders', path: ROUTES.CUSTOMER_ORDERS, icon: <ShoppingBag className="h-4 w-4" /> },
          { name: 'Reservations', path: ROUTES.CUSTOMER_RESERVATIONS, icon: <Calendar className="h-4 w-4" /> },
          { name: 'Events', path: ROUTES.CUSTOMER_EVENTS, icon: <Calendar className="h-4 w-4" /> },
          { name: 'Profile', path: ROUTES.CUSTOMER_PROFILE, icon: <User className="h-4 w-4" /> }
        ];
      default:
        return [];
    }
  }, [getUserRole]);

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50
      ${isScrolled 
        ? 'glass backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-lg' 
        : 'bg-gradient-to-r from-blue-600 via-blue-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
      }
      transition-all duration-300
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo */}
          <div className="flex items-center mr-8 pt-4 pb-2">
            <Link to={user ? (getUserRole() === USER_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : 
              getUserRole() === USER_ROLES.EMPLOYEE ? ROUTES.EMPLOYEE_DASHBOARD : ROUTES.CUSTOMER_HOME) : ROUTES.CUSTOMER_HOME} 
              className="flex items-center space-x-3"
            >
              <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center">
                <ChefHat className="h-7 w-7 text-blue-600" />
              </div>
              <span className="font-bold text-white restro-brand" style={{ fontSize: '1.875rem' }}>RESTRO</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 flex-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold
                  transition-all duration-200
                  ${isScrolled
                    ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white hover:bg-white/10'
                  }
                  hover:scale-105 active:scale-95
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Who am I (Employee identity) */}
          {getUserRole() === USER_ROLES.EMPLOYEE && (
            <div className="hidden md:flex items-center ml-4 mr-2">
              <span className="text-xs font-semibold text-white/90 bg-white/10 px-3 py-1 rounded-full">
                Logged in as: {user?.name || 'Employee'} {user?.tag ? `• ${String(user.tag).toUpperCase()}` : ''}
              </span>
            </div>
          )}

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg
                  transition-all duration-200
                  ${isScrolled
                    ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white hover:bg-white/10'
                  }
                `}
              >
                <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold">{user?.name}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-slide-down">
                  <div className="py-1">
                    <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{user?.email}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 capitalize mt-1 font-medium">
                      {user?.role}{user?.tag ? ` • ${user.tag}` : ''}
                    </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
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
          <div className="md:hidden ml-auto flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${isScrolled
                  ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white hover:bg-white/10'
                }
              `}
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
          <div className="md:hidden animate-slide-down">
            <div className={`px-2 pt-2 pb-3 space-y-1 border-t ${isScrolled ? 'border-gray-200 dark:border-gray-700' : 'border-white/10'}`}>
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-semibold
                    transition-all duration-200
                    ${isScrolled
                      ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-white hover:bg-white/10'
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile User Info */}
              <div className={`px-3 py-2 border-t ${isScrolled ? 'border-gray-200 dark:border-gray-700' : 'border-white/10'} mt-2`}>
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>{user?.name}</p>
                    <p className={`text-xs ${isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-white/70'}`}>{user?.email}</p>
                    {getUserRole() === USER_ROLES.EMPLOYEE && (
                      <p className={`text-[11px] mt-0.5 ${isScrolled ? 'text-gray-600 dark:text-gray-400' : 'text-white/80'}`}>
                        {user?.tag ? `Station: ${String(user.tag).toUpperCase()}` : 'Employee'}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`
                    flex items-center w-full mt-3 px-3 py-2 text-sm rounded-lg
                    transition-all duration-200
                    ${isScrolled
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-white hover:bg-white/10'
                    }
                  `}
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
});

Navbar.displayName = 'Navbar';

export default Navbar;
