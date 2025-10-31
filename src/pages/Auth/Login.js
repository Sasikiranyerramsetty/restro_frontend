import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Phone, Lock, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, getUserRole, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const userRole = getUserRole();
      const from = location.state?.from?.pathname;
      
      if (from) {
        navigate(from, { replace: true });
      } else {
        switch (userRole) {
          case 'admin':
            navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
            break;
          case 'employee':
            navigate(ROUTES.EMPLOYEE_DASHBOARD, { replace: true });
            break;
          case 'customer':
            navigate(ROUTES.CUSTOMER_DASHBOARD, { replace: true });
            break;
          default:
            navigate(ROUTES.CUSTOMER_DASHBOARD, { replace: true });
        }
      }
    }
  }, [isAuthenticated, getUserRole, navigate, location]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await login(data);
      
      if (result.success) {
        toast.success('Login successful!');
        const userRole = getUserRole();
        
        switch (userRole) {
          case 'admin':
            navigate(ROUTES.ADMIN_DASHBOARD);
            break;
          case 'employee':
            navigate(ROUTES.EMPLOYEE_DASHBOARD);
            break;
          case 'customer':
            navigate(ROUTES.CUSTOMER_DASHBOARD);
            break;
          default:
            navigate(ROUTES.CUSTOMER_DASHBOARD);
        }
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${require('../../assets/images/login-bg.jpg.jpg')})`,
        }}
      >
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-brand-navy/80"></div>
      </div>

      {/* Back to Home Button */}
      <Link 
        to={ROUTES.CUSTOMER_HOME}
        className="absolute top-6 left-6 flex items-center space-x-2 text-white hover:text-brand-teal transition-colors z-20"
      >
        <Home className="w-5 h-5" />
        <span className="font-semibold">Back to Home</span>
      </Link>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Login Form */}
            <div className="p-12 bg-brand-cream">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                      <img 
                        src={require('../../assets/images/restrologo.png')} 
                        alt="Restro Logo" 
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-brand-red mb-2 text-center" style={{ fontFamily: 'Rockybilly, sans-serif' }}>
                      Welcome Back!
                    </h2>
                    <p className="text-brand-navy mb-8 text-center">
                      Please login to your account
                    </p>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                      {/* Phone Field */}
                      <div>
                        <label className="block text-sm font-semibold text-brand-navy mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-brand-blue" />
                          </div>
                          <input
                            {...register('phone', {
                              required: 'Phone number is required',
                              pattern: {
                                value: /^[+]?[1-9][\d]{0,15}$/,
                                message: 'Invalid phone number format'
                              }
                            })}
                            type="tel"
                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-brand-teal/40 focus:border-brand-red focus:outline-none rounded-lg text-brand-navy placeholder-brand-blue/50 transition-all"
                            placeholder="Enter phone number"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-brand-red font-medium">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div>
                        <label className="block text-sm font-semibold text-brand-navy mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-brand-blue" />
                          </div>
                          <input
                            {...register('password', {
                              required: 'Password is required',
                              minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                              }
                            })}
                            type={showPassword ? 'text' : 'password'}
                            className="w-full pl-12 pr-12 py-3 bg-white border-2 border-brand-teal/40 focus:border-brand-red focus:outline-none rounded-lg text-brand-navy placeholder-brand-blue/50 transition-all"
                            placeholder="Enter password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-brand-blue hover:text-brand-red transition-colors" />
                            ) : (
                              <Eye className="h-5 w-5 text-brand-blue hover:text-brand-red transition-colors" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-sm text-brand-red font-medium">{errors.password.message}</p>
                        )}
                      </div>

                      {/* Remember & Forgot */}
                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-brand-red border-brand-teal rounded focus:ring-brand-red"
                          />
                          <span className="ml-2 text-brand-navy font-medium">Remember me</span>
                        </label>
                        <Link
                          to={ROUTES.FORGOT_PASSWORD}
                          className="font-semibold text-brand-red hover:text-brand-navy transition-colors"
                        >
                          Forgot Password?
                        </Link>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="bg-brand-red/10 border-l-4 border-brand-red rounded-lg p-3">
                          <p className="text-sm text-brand-red font-semibold">{error}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand-red hover:bg-brand-navy text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Signing in...
                          </div>
                        ) : (
                          'Sign In'
                        )}
                      </button>

                      {/* Register Link */}
                      <p className="text-center text-brand-blue">
                        Don't have an account?{' '}
                        <Link
                          to={ROUTES.REGISTER}
                          className="font-bold text-brand-red hover:text-brand-navy transition-colors"
                        >
                          Create Account
                        </Link>
                      </p>
                    </form>

                    {/* Demo Accounts */}
                    <div className="mt-8 p-4 bg-white rounded-xl border-2 border-brand-teal/20">
                      <p className="text-xs font-bold text-brand-navy mb-3 text-center">Quick Demo Login</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-brand-cream rounded">
                          <p className="font-bold text-brand-red">Admin</p>
                          <p className="text-brand-navy mt-1">1234567890</p>
                        </div>
                        <div className="text-center p-2 bg-brand-cream rounded">
                          <p className="font-bold text-brand-red">Employee</p>
                          <p className="text-brand-navy mt-1">1234567891</p>
                        </div>
                        <div className="text-center p-2 bg-brand-cream rounded">
                          <p className="font-bold text-brand-red">Customer</p>
                          <p className="text-brand-navy mt-1">1234567892</p>
                        </div>
                      </div>
                      <p className="text-xs text-center text-brand-blue mt-2">Password: admin123 / employee123 / customer123</p>
                    </div>
                  </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
