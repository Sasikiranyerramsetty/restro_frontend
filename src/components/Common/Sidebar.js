import React, { useState, useMemo, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
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
      case USER_ROLES.EMPLOYEE:
        return [
          { name: 'Dashboard', path: ROUTES.EMPLOYEE_DASHBOARD, icon: <BarChart3 className="h-5 w-5" /> },
          { name: 'Order Taking', path: ROUTES.EMPLOYEE_ORDER_TAKING, icon: <ShoppingBag className="h-5 w-5" /> },
          { name: 'Orders', path: ROUTES.EMPLOYEE_ORDERS, icon: <Package className="h-5 w-5" /> },
          { name: 'Tables', path: ROUTES.EMPLOYEE_TABLES, icon: <MapPin className="h-5 w-5" /> },
          { name: 'Shifts', path: ROUTES.EMPLOYEE_SHIFTS, icon: <Clock className="h-5 w-5" /> }
        ];
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
  }, [getUserRole]);

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
        fixed top-0 left-0 h-full bg-brand-navy shadow-2xl border-r border-brand-blue/30 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-16' : 'w-80'}
        lg:translate-x-0
        transition-all duration-300
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-brand-blue/30">
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
                  flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all
                  ${isActive(item.path) 
                    ? 'bg-brand-red text-white shadow-lg' 
                    : 'text-brand-teal hover:bg-brand-blue/20 hover:text-white'
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
          <div className="mt-auto pt-4 border-t border-brand-blue/30">
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all
                text-brand-teal hover:bg-brand-red hover:text-white
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
