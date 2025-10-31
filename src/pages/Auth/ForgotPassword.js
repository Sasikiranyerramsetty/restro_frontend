import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Phone, ArrowLeft, Lock, Shield, CheckCircle, Home } from 'lucide-react';
import { ROUTES } from '../../constants';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSmsSent, setIsSmsSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPhoneNumber(data.phone);
      toast.success('OTP sent to your phone! Check your messages.');
      setIsSmsSent(true);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
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
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 6-digit OTP
      toast.success('OTP verified successfully!');
      setIsOtpVerified(true);
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtp(['', '', '', '', '', '']);
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error('Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordReset = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (data.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Verification Screen
  if (isSmsSent && !isOtpVerified) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${require('../../assets/images/forgotpassword-bg.jpg')})`,
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

                  <h2 className="text-xl font-bold text-brand-red mb-6 text-center" style={{ fontFamily: 'Rockybilly, sans-serif', letterSpacing: '0.05em' }}>
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
                        disabled={isLoading}
                        className="text-brand-red hover:text-brand-navy font-semibold disabled:opacity-50 transition-colors"
                      >
                        Resend OTP
                      </button>
                    </p>
                  </div>

                  {/* Back Link */}
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setIsSmsSent(false);
                        setOtp(['', '', '', '', '', '']);
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

  // Reset Password Screen
  if (isOtpVerified) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${require('../../assets/images/forgotpassword-bg.jpg')})`,
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
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-brand-red mb-2 text-center" style={{ fontFamily: 'Rockybilly, sans-serif', letterSpacing: '0.05em' }}>
                    Reset Password
                  </h2>
                  <p className="text-brand-navy mb-8 text-center text-sm">
                    Please enter your new password
                  </p>

                  <form className="space-y-6" onSubmit={handleSubmit(onPasswordReset)}>
                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-brand-navy mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-blue" />
                        <input
                          {...register('newPassword', {
                            required: 'New password is required',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters'
                            }
                          })}
                          type="password"
                          placeholder="Enter new password"
                          className="w-full pl-11 pr-4 py-3 border-2 border-brand-teal/50 rounded-lg focus:border-brand-red focus:outline-none text-brand-navy transition-colors"
                        />
                      </div>
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-brand-red">{errors.newPassword.message}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-brand-navy mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-blue" />
                        <input
                          {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters'
                            }
                          })}
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full pl-11 pr-4 py-3 border-2 border-brand-teal/50 rounded-lg focus:border-brand-red focus:outline-none text-brand-navy transition-colors"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-brand-red">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-brand-red hover:bg-brand-navy text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Resetting Password...
                        </div>
                      ) : (
                        'Reset Password'
                      )}
                    </button>

                    {/* Back to Login */}
                    <div className="text-center">
                      <Link
                        to={ROUTES.LOGIN}
                        className="inline-flex items-center text-sm text-brand-blue hover:text-brand-red font-semibold transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Login
                      </Link>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Forgot Password Screen (Initial)
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${require('../../assets/images/forgotpassword-bg.jpg')})`,
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
                  <img 
                    src={require('../../assets/images/restrologo.png')} 
                    alt="Restro Logo" 
                    className="w-32 h-32 object-contain"
                  />
                </div>

                <h2 className="text-2xl font-bold text-brand-red mb-2 text-center" style={{ fontFamily: 'Rockybilly, sans-serif', letterSpacing: '0.05em' }}>
                  Forgot Password?
                </h2>
                <p className="text-brand-navy mb-8 text-center text-sm">
                  No worries! Enter your phone number and we'll send you a reset SMS.
                </p>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-blue" />
                      <input
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[+]?[1-9][\d]{0,15}$/,
                            message: 'Invalid phone number format'
                          }
                        })}
                        type="tel"
                        placeholder="1234567890"
                        className="w-full pl-11 pr-4 py-3 border-2 border-brand-teal/50 rounded-lg focus:border-brand-red focus:outline-none text-brand-navy transition-colors"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-brand-red">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-red hover:bg-brand-navy text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      'Send Reset SMS'
                    )}
                  </button>

                  {/* Back to Login */}
                  <div className="text-center">
                    <Link
                      to={ROUTES.LOGIN}
                      className="inline-flex items-center text-sm text-brand-blue hover:text-brand-red font-semibold transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
