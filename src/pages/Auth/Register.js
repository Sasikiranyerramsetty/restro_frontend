import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Phone, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const result = await registerUser(data);
      
      if (result.success) {
        toast.success('Registration successful! Please login to continue.');
        navigate(ROUTES.LOGIN);
      } else {
        toast.error(result.error || 'Registration failed');
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
            {/* Registration Form */}
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
                  Create Account
                </h2>
                <p className="text-brand-navy mb-8 text-center">
                  Join our restaurant community
                </p>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-brand-blue" />
                      </div>
                      <input
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
                          }
                        })}
                        type="text"
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-brand-teal/40 focus:border-brand-red focus:outline-none rounded-lg text-brand-navy placeholder-brand-blue/50 transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-brand-red font-medium">{errors.name.message}</p>
                    )}
                  </div>

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

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-brand-blue" />
                      </div>
                      <input
                        {...register('email', {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        type="email"
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-brand-teal/40 focus:border-brand-red focus:outline-none rounded-lg text-brand-navy placeholder-brand-blue/50 transition-all"
                        placeholder="Enter your email (optional)"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-brand-red font-medium">{errors.email.message}</p>
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
                        placeholder="Create a password"
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

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-brand-blue" />
                      </div>
                      <input
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="w-full pl-12 pr-12 py-3 bg-white border-2 border-brand-teal/40 focus:border-brand-red focus:outline-none rounded-lg text-brand-navy placeholder-brand-blue/50 transition-all"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-brand-blue hover:text-brand-red transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-brand-blue hover:text-brand-red transition-colors" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-brand-red font-medium">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="w-4 h-4 text-brand-red border-brand-teal rounded focus:ring-brand-red"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-brand-navy">
                      I agree to the{' '}
                      <button type="button" className="font-semibold text-brand-red hover:text-brand-navy transition-colors">
                        Terms and Conditions
                      </button>{' '}
                      and{' '}
                      <button type="button" className="font-semibold text-brand-red hover:text-brand-navy transition-colors">
                        Privacy Policy
                      </button>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-red hover:bg-brand-navy text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  {/* Login Link */}
                  <p className="text-center text-brand-blue">
                    Already have an account?{' '}
                    <Link
                      to={ROUTES.LOGIN}
                      className="font-bold text-brand-red hover:text-brand-navy transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
