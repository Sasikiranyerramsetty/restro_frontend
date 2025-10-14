import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
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
  UserCheck,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, USER_ROLES } from '../../constants';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onToggle, onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, getUserRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

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
          { name: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: <BarChart3 className="h-5 w-5" /> },
          { name: 'Menu', path: ROUTES.ADMIN_MENU, icon: <ChefHat className="h-5 w-5" /> },
          { name: 'Orders', path: ROUTES.ADMIN_ORDERS, icon: <ShoppingBag className="h-5 w-5" /> },
          { name: 'Employees', path: ROUTES.ADMIN_EMPLOYEES, icon: <Users className="h-5 w-5" /> },
          { name: 'Customers', path: ROUTES.ADMIN_CUSTOMERS, icon: <UserCheck className="h-5 w-5" /> },
          { name: 'Reports', path: ROUTES.ADMIN_REPORTS, icon: <FileText className="h-5 w-5" /> },
          { name: 'Tables', path: ROUTES.ADMIN_TABLES, icon: <MapPin className="h-5 w-5" /> },
          { name: 'Events', path: ROUTES.ADMIN_EVENTS, icon: <Calendar className="h-5 w-5" /> }
        ];
      case USER_ROLES.EMPLOYEE:
        return [
          { name: 'Dashboard', path: ROUTES.EMPLOYEE_DASHBOARD, icon: <BarChart3 className="h-5 w-5" /> },
          { name: 'Order Taking', path: ROUTES.EMPLOYEE_ORDER_TAKING, icon: <ShoppingBag className="h-5 w-5" /> },
          { name: 'Orders', path: ROUTES.EMPLOYEE_ORDERS, icon: <Package className="h-5 w-5" /> },
          { name: 'Tables', path: ROUTES.EMPLOYEE_TABLES, icon: <MapPin className="h-5 w-5" /> },
          { name: 'Tasks', path: ROUTES.EMPLOYEE_TASKS, icon: <ClipboardList className="h-5 w-5" /> },
          { name: 'Shifts', path: ROUTES.EMPLOYEE_SHIFTS, icon: <Clock className="h-5 w-5" /> }
        ];
      case USER_ROLES.CUSTOMER:
        return [
          { name: 'Dashboard', path: ROUTES.CUSTOMER_DASHBOARD, icon: <BarChart3 className="h-5 w-5" /> },
          { name: 'Home', path: ROUTES.CUSTOMER_HOME, icon: <Home className="h-5 w-5" /> },
          { name: 'Menu', path: ROUTES.CUSTOMER_MENU, icon: <ChefHat className="h-5 w-5" /> },
          { name: 'Orders', path: ROUTES.CUSTOMER_ORDERS, icon: <ShoppingBag className="h-5 w-5" /> },
          { name: 'Reservations', path: ROUTES.CUSTOMER_RESERVATIONS, icon: <Calendar className="h-5 w-5" /> },
          { name: 'Events', path: ROUTES.CUSTOMER_EVENTS, icon: <Calendar className="h-5 w-5" /> },
          { name: 'Profile', path: ROUTES.CUSTOMER_PROFILE, icon: <User className="h-5 w-5" /> }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

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
        fixed top-0 left-0 h-full backdrop-blur-lg shadow-2xl border-r border-gray-800 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        lg:translate-x-0
      `}
      style={{ background: '#000000' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isCollapsed && (
            <Link 
              to={user ? (getUserRole() === USER_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : 
                getUserRole() === USER_ROLES.EMPLOYEE ? ROUTES.EMPLOYEE_DASHBOARD : ROUTES.CUSTOMER_DASHBOARD) : ROUTES.CUSTOMER_HOME}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 bg-[#FD4400] rounded-lg flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white restro-brand">RESTRO</span>
            </Link>
          )}
          
          {isCollapsed && (
            <div className="h-8 w-8 bg-[#FD4400] rounded-lg flex items-center justify-center mx-auto">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
          )}

          {/* Toggle Button - Desktop Only */}
          <button
            onClick={handleCollapseToggle}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-white" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-white" />
            )}
          </button>

          {/* Close Button - Mobile Only */}
          <button
            onClick={onToggle}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 flex flex-col">
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
                  flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
                  ${isActive(item.path) 
                    ? 'bg-[#FD4400] text-white border-r-2 border-[#FD4400]' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
                text-gray-400 hover:bg-red-600 hover:text-white
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
};

export default Sidebar;
