import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Phone, Lock, ChefHat } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';
import toast from 'react-hot-toast';

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
  }, [clearError]);

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center animate-slide-up">
          <div className="mx-auto h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center animate-bounce-in animate-float">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
            <h2 className="mt-6 text-4xl font-bold gradient-text restro-brand animate-slide-up animate-delay-200">
              Welcome Back
            </h2>
          <p className="mt-2 text-sm text-gray-600 animate-slide-up animate-delay-300">
            Sign in to your restaurant account
          </p>
        </div>

        {/* Login Form */}
        <div className="modal-content rounded-2xl p-8 animate-slide-up animate-delay-400 hover:shadow-2xl transition-all duration-500">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
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
                  className="input-field pl-10"
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
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
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Demo Accounts</h3>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-sm text-gray-700">
                <span className="font-semibold text-primary-600">Admin:</span>
                <div className="mt-1 text-gray-600">
                  <div>Phone: 1234567890</div>
                  <div>Password: admin123</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-sm text-gray-700">
                <span className="font-semibold text-primary-600">Employee:</span>
                <div className="mt-1 text-gray-600">
                  <div>Phone: 1234567891</div>
                  <div>Password: employee123</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-sm text-gray-700">
                <span className="font-semibold text-primary-600">Customer:</span>
                <div className="mt-1 text-gray-600">
                  <div>Phone: 1234567892</div>
                  <div>Password: customer123</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-sm text-gray-700">
                <span className="font-semibold text-primary-600">Alternative:</span>
                <div className="mt-1 text-gray-600">
                  <div>Phone: 5551234567</div>
                  <div>Password: customer123</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
