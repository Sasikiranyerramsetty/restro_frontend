import React, { useState, useMemo, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  BarChart3,
  Package,
  FileText,
  Calendar,
  MapPin,
  ClipboardList,
  Clock,
  UserCheck,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  ChefHat,
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../UI/ThemeToggle';
import { ROUTES, USER_ROLES } from '../../constants';
import toast from 'react-hot-toast';

const Sidebar = memo(({ isOpen, onToggle, onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, getUserRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCollapseToggle = useCallback(() => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  }, [isCollapsed, onCollapseChange]);

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
    const tagLower = (user?.tag || '').toLowerCase();

    switch (role) {
      case USER_ROLES.ADMIN:
        return [
          { name: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: <BarChart3 className="h-5 w-5" /> },
          { name: 'Menu', path: ROUTES.ADMIN_MENU, icon: <ShoppingBag className="h-5 w-5" /> },
          { name: 'Orders', path: ROUTES.ADMIN_ORDERS, icon: <ShoppingBag className="h-5 w-5" /> },
          { name: 'Employees', path: ROUTES.ADMIN_EMPLOYEES, icon: <Users className="h-5 w-5" /> },
          { name: 'Customers', path: ROUTES.ADMIN_CUSTOMERS, icon: <UserCheck className="h-5 w-5" /> },
          { name: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: <FileText className="h-5 w-5" /> },
          { name: 'Tables', path: ROUTES.ADMIN_TABLES, icon: <MapPin className="h-5 w-5" /> },
          { name: 'Events', path: ROUTES.ADMIN_EVENTS, icon: <Calendar className="h-5 w-5" /> }
        ];
      case USER_ROLES.EMPLOYEE: {
        const stationPath = tagLower ? `/employee/${tagLower}` : ROUTES.EMPLOYEE_DASHBOARD;
        const stationIcon = tagLower === 'chef'
          ? <ChefHat className="h-5 w-5" />
          : tagLower === 'delivery'
            ? <Truck className="h-5 w-5" />
            : <Home className="h-5 w-5" />;

        const items = [
          { name: 'My Station', path: stationPath, icon: stationIcon },
          { name: 'Dashboard', path: ROUTES.EMPLOYEE_DASHBOARD, icon: <BarChart3 className="h-5 w-5" /> },
        ];

        if (tagLower === 'waiter') {
          items.push(
            { name: 'Order Taking', path: ROUTES.EMPLOYEE_ORDER_TAKING, icon: <ShoppingBag className="h-5 w-5" /> },
            { name: 'Tables', path: ROUTES.EMPLOYEE_TABLES, icon: <MapPin className="h-5 w-5" /> },
            { name: 'Orders', path: ROUTES.EMPLOYEE_ORDERS, icon: <Package className="h-5 w-5" /> }
          );
        } else if (tagLower === 'chef') {
          items.push(
            { name: 'Kitchen Queue', path: ROUTES.EMPLOYEE_CHEF, icon: <ChefHat className="h-5 w-5" /> },
            { name: 'Orders', path: ROUTES.EMPLOYEE_ORDERS, icon: <Package className="h-5 w-5" /> }
          );
        } else if (tagLower === 'delivery') {
          items.push(
            { name: 'Active Deliveries', path: ROUTES.EMPLOYEE_DELIVERY, icon: <Truck className="h-5 w-5" /> },
            { name: 'Orders', path: ROUTES.EMPLOYEE_ORDERS, icon: <Package className="h-5 w-5" /> }
          );
        } else {
          items.push(
            { name: 'Orders', path: ROUTES.EMPLOYEE_ORDERS, icon: <Package className="h-5 w-5" /> },
            { name: 'Tables', path: ROUTES.EMPLOYEE_TABLES, icon: <MapPin className="h-5 w-5" /> }
          );
        }

        items.push(
          { name: 'Shifts', path: ROUTES.EMPLOYEE_SHIFTS, icon: <Clock className="h-5 w-5" /> },
          { name: 'Profile', path: ROUTES.EMPLOYEE_PROFILE, icon: <User className="h-5 w-5" /> }
        );
        return items;
      }
      case USER_ROLES.CUSTOMER:
        return [
          { name: 'Dashboard', path: ROUTES.CUSTOMER_DASHBOARD, icon: <BarChart3 className="h-5 w-5" /> },
          { name: 'Menu', path: ROUTES.CUSTOMER_MENU, icon: <ShoppingBag className="h-5 w-5" /> },
          { name: 'Orders', path: ROUTES.CUSTOMER_ORDERS, icon: <ShoppingBag className="h-5 w-5" /> },
          { name: 'Reservations', path: ROUTES.CUSTOMER_RESERVATIONS, icon: <Calendar className="h-5 w-5" /> },
          { name: 'Events', path: ROUTES.CUSTOMER_EVENTS, icon: <Calendar className="h-5 w-5" /> },
          { name: 'Profile', path: ROUTES.CUSTOMER_PROFILE, icon: <User className="h-5 w-5" /> }
        ];
      default:
        return [];
    }
  }, [getUserRole, user]);

  const isActive = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full 
        bg-gray-900 dark:bg-gray-900 
        shadow-2xl border-r border-gray-700 dark:border-gray-700 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-16' : 'w-80'}
        lg:translate-x-0
        transition-all duration-300
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-gray-700 dark:border-gray-700">
          <ThemeToggle className="mr-2" />
          {!isCollapsed && (
            <Link 
              to={user ? (getUserRole() === USER_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : 
                getUserRole() === USER_ROLES.EMPLOYEE ? ROUTES.EMPLOYEE_DASHBOARD : ROUTES.CUSTOMER_DASHBOARD) : ROUTES.CUSTOMER_HOME}
              className="flex items-center space-x-3 mt-2"
            >
              <img 
                src={require('../../assets/images/restrologo.png')} 
                alt="Restro Logo" 
                className="w-12 h-12 object-contain"
              />
              <span className="text-xl font-bold text-white" style={{ fontFamily: "'BBH Sans Bartle', sans-serif", letterSpacing: '0.1em' }}>Restro</span>
            </Link>
          )}
          {!isCollapsed && user && getUserRole() === USER_ROLES.EMPLOYEE && (
            <span className="text-[10px] font-semibold text-white/90 bg-white/10 px-2 py-1 rounded-full">
              {user?.name || 'Employee'}{user?.tag ? ` • ${String(user.tag).toUpperCase()}` : ''}
            </span>
          )}
          
          {isCollapsed && (
            <div className="mx-auto">
              <img 
                src={require('../../assets/images/restrologo.png')} 
                alt="Restro Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
          )}

          {/* Toggle Button - Desktop Only */}
          <button
            onClick={handleCollapseToggle}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-blue/20 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-brand-teal" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-brand-teal" />
            )}
          </button>

          {/* Close Button - Mobile Only */}
          <button
            onClick={onToggle}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-blue/20 transition-colors"
          >
            <X className="h-4 w-4 text-brand-teal" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 flex flex-col overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  // Close mobile sidebar when navigating
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold 
                  transition-all duration-200
                  ${isActive(item.path) 
                    ? 'bg-[#E63946] text-white shadow-lg' 
                    : 'text-gray-300 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            ))}
          </div>

          {/* Profile Summary */}
          {user && (
            <div className={`mt-6 mb-4 px-3 py-4 rounded-lg border border-gray-700/60 ${isCollapsed ? 'text-center' : ''}`}>
              <div className={`flex ${isCollapsed ? 'flex-col items-center space-y-2' : 'items-center space-x-3'}`}>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <User className="h-6 w-6" />
                </div>
                {!isCollapsed && (
                  <div className="text-white/90">
                    <p className="text-sm font-semibold">{user?.name || 'Employee'}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email || 'No email'}</p>
                    <p className="text-[11px] uppercase tracking-wide text-gray-300 mt-1">
                      {getUserRole() || 'Role'}{user?.tag ? ` • ${String(user.tag).toUpperCase()}` : ''}
                    </p>
                  </div>
                )}
              </div>
              {isCollapsed && (
                <p className="text-[10px] text-gray-300 mt-2 uppercase tracking-wide">
                  {user?.tag ? String(user.tag).toUpperCase() : getUserRole()}
                </p>
              )}
            </div>
          )}

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-gray-700 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold 
                transition-all duration-200
                text-gray-300 dark:text-gray-400 hover:bg-[#E63946] hover:text-white
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <span className="flex-shrink-0"><LogOut className="h-5 w-5" /></span>
              {!isCollapsed && <span className="truncate">Logout</span>}
            </button>
          </div>
        </nav>

      </div>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
