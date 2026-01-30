import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Phone, Home, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../services/api';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formData, setFormData] = useState(null);
  const [timer, setTimer] = useState(0);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  // Timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const sendOtp = async (phone) => {
    setIsLoading(true);
    try {
      // Call backend API to send OTP
      const response = await api.post('/users/send-otp', {
        phone_number: phone,
        purpose: 'signup'
      });
      
      if (response.data.success) {
        toast.success('OTP sent to your phone! Check your messages.');
        setIsOtpSent(true);
        setTimer(60); // 60 seconds timer
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API to verify OTP
      const response = await api.post('/users/verify-otp', {
        phone_number: phoneNumber,
        otp: otpValue,
        purpose: 'signup'
      });
      
      if (response.data.success) {
        toast.success('OTP verified successfully!');
        setIsOtpVerified(true);
        // Now complete the registration
        await completeRegistration();
      } else {
        toast.error(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Invalid OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) {
      toast.error(`Please wait ${timer} seconds before resending`);
      return;
    }
    
    setIsLoading(true);
    try {
      await sendOtp(phoneNumber);
    } finally {
      setIsLoading(false);
    }
  };

  const completeRegistration = async () => {
    if (!formData) return;
    
    setIsLoading(true);
    try {
      const result = await registerUser(formData);
      
      if (result.success) {
        toast.success('Registration successful! Please login to continue.');
        navigate(ROUTES.LOGIN);
      } else {
        toast.error(result.error || 'Registration failed');
        // Reset to form if registration fails
        setIsOtpSent(false);
        setIsOtpVerified(false);
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setIsOtpSent(false);
      setIsOtpVerified(false);
      setOtp(['', '', '', '', '', '']);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    // Store form data for later use
    setFormData(data);
    setPhoneNumber(data.phone);
    
    // Send OTP first
    await sendOtp(data.phone);
  };

  // OTP Verification Screen
  if (isOtpSent && !isOtpVerified) {
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
              <div className="p-12 bg-brand-cream">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {/* Logo */}
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-teal to-brand-blue rounded-full flex items-center justify-center">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-brand-red mb-2 text-center" style={{ fontFamily: 'Rockybilly, sans-serif', letterSpacing: '0.05em' }}>
                    Verify OTP
                  </h2>
                  <p className="text-brand-navy mb-8 text-center text-sm">
                    We've sent a 6-digit code to<br /><span className="font-semibold">{phoneNumber}</span>
                  </p>

                  {/* OTP Input Fields */}
                  <div className="flex justify-center space-x-3 mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-2xl font-bold bg-white border-2 border-brand-teal focus:border-brand-red focus:outline-none rounded-lg transition-all text-brand-navy"
                      />
                    ))}
                  </div>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.some(d => !d)}
                    className="w-full bg-brand-red hover:bg-brand-navy text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>

                  {/* Resend OTP */}
                  <div className="text-center mb-4">
                    <p className="text-sm text-brand-blue">
                      Didn't receive the code?{' '}
                      <button
                        onClick={handleResendOtp}
                        disabled={isLoading || timer > 0}
                        className="text-brand-red hover:text-brand-navy font-semibold disabled:opacity-50 transition-colors"
                      >
                        {timer > 0 ? `Resend OTP (${timer}s)` : 'Resend OTP'}
                      </button>
                    </p>
                  </div>

                  {/* Back Link */}
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setIsOtpSent(false);
                        setOtp(['', '', '', '', '', '']);
                        setTimer(0);
                      }}
                      className="inline-flex items-center text-sm text-brand-blue hover:text-brand-red font-semibold transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Change Phone Number
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
                
                <h2 className="text-3xl font-bold text-brand-red mb-8 text-center" style={{ fontFamily: 'Rockybilly, sans-serif' }}>
                  Create Account
                </h2>

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
                        Sending OTP...
                      </div>
                    ) : (
                      'Send OTP'
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
