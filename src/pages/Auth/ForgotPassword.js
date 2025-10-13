import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Phone, ArrowLeft, ChefHat } from 'lucide-react';
import { ROUTES } from '../../constants';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSmsSent, setIsSmsSent] = useState(false);

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
      
      toast.success('Password reset SMS sent! Check your phone.');
      setIsSmsSent(true);
    } catch (error) {
      toast.error('Failed to send reset SMS. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSmsSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Check Your Phone
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a password reset SMS to your phone number.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Didn't receive the SMS? Check your messages or{' '}
                <button
                  onClick={() => setIsSmsSent(false)}
                  className="text-primary-600 hover:text-primary-500 font-medium"
                >
                  try again
                </button>
              </p>
              
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            No worries! Enter your phone number and we'll send you a reset SMS.
          </p>
        </div>

        {/* Reset Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                    value: /^[\+]?[1-9][\d]{0,15}$/,
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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset SMS'
              )}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
