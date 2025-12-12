import React, { useState, useMemo, useCallback, memo, useEffect, useRef } from 'react';
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
import ThemeToggle from '../UI/ThemeToggle';
import RestroLogo from '../UI/RestroLogo';
import { ROUTES, USER_ROLES } from '../../constants';
import toast from 'react-hot-toast';

const Sidebar = memo(({ isOpen, onToggle, onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logoSpin, setLogoSpin] = useState(false);
  const prevCollapsedRef = useRef(isCollapsed);
  const prevOpenRef = useRef(isOpen);
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

  useEffect(() => {
    const wasCollapsed = prevCollapsedRef.current;
    const wasOpen = prevOpenRef.current;
    const shouldSpin = (!isCollapsed && wasCollapsed) || (isOpen && !wasOpen);
    prevCollapsedRef.current = isCollapsed;
    prevOpenRef.current = isOpen;

    if (shouldSpin) {
      setLogoSpin(true);
      const timer = setTimeout(() => setLogoSpin(false), 700);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isCollapsed, isOpen]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Logout failed');
    }
  }, [logout, navigate]);

  const role = getUserRole();
  const homePath = user
    ? (role === USER_ROLES.ADMIN
      ? ROUTES.ADMIN_DASHBOARD
      : role === USER_ROLES.EMPLOYEE
        ? ROUTES.EMPLOYEE_DASHBOARD
        : ROUTES.CUSTOMER_DASHBOARD)
    : ROUTES.CUSTOMER_HOME;

  const navigationItems = useMemo(() => {
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
  }, [getUserRole, role, user]);

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
        fixed top-0 left-0 z-50 h-full
        bg-white/95 dark:bg-slate-950
        text-slate-900 dark:text-slate-100
        border-r border-slate-200 dark:border-slate-800
        shadow-2xl backdrop-blur-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-64'}
        lg:translate-x-0
        transition-all duration-300
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 px-5 pt-6 pb-4">
            <div className="flex items-center justify-between gap-3">
              <div className={`flex items-center ${isCollapsed ? 'w-full justify-center' : 'gap-3'}`}>
                {!isCollapsed && (
                  <Link
                    to={homePath}
                    className="flex items-center gap-3"
                  >
                    <RestroLogo className="h-11 w-11" />
                    <div>
                      <p className="text-lg font-semibold tracking-[0.2em] text-slate-900 dark:text-white">RESTRO</p>
                    </div>
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCollapseToggle}
                  className="hidden lg:flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </button>

                <button
                  onClick={onToggle}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={`
                    group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-semibold transition-all
                    ${isActive(item.path)
                      ? 'border-slate-900 bg-slate-900 text-white shadow-lg dark:border-slate-700 dark:bg-slate-700'
                      : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800'}
                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200 ${isActive(item.path) ? 'bg-white/10 text-white dark:bg-white/10' : ''}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </Link>
              ))}
            </div>

            {/* Profile Summary */}
            {user && (
              <div className={`rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/40 ${isCollapsed ? 'text-center' : 'flex items-center gap-3'}`}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                  <User className="h-6 w-6" />
                </div>
                {!isCollapsed && (
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    <p className="font-semibold text-slate-900 dark:text-white">{user?.name || 'Employee'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'No email'}</p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-400 mt-1">
                      {getUserRole() || 'Role'}{user?.tag ? ` • ${String(user.tag).toUpperCase()}` : ''}
                    </p>
                  </div>
                )}
                {isCollapsed && (
                  <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {user?.tag ? String(user.tag).toUpperCase() : getUserRole()}
                  </p>
                )}
              </div>
            )}

            {/* Support Card */}
            <div className={`rounded-2xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-300 ${isCollapsed ? 'hidden lg:block' : ''}`}>
              <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Need backup?</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-white">Ops lead: Ravi · Ext 202</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ping #floor-support or call if service spikes.</p>
            </div>

            {/* Logout Button */}
            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className={`
                  w-full flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all
                  text-slate-500 hover:bg-slate-900 hover:text-white dark:text-slate-300 dark:hover:bg-slate-800
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <span className="flex-shrink-0"><LogOut className="h-5 w-5" /></span>
                {!isCollapsed && <span className="truncate">Logout</span>}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
