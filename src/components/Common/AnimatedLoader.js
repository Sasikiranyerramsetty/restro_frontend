import React from 'react';

const AnimatedLoader = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
      {/* Spinning loader */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-primary-300 rounded-full animate-pulse`}></div>
      </div>
      
      {/* Loading text */}
      {text && (
        <div className="text-center">
          <p className="text-sm text-gray-600 animate-pulse-slow">{text}</p>
          <div className="flex space-x-1 mt-2 justify-center">
            <div className="h-1 w-1 bg-primary-500 rounded-full animate-bounce"></div>
            <div className="h-1 w-1 bg-primary-500 rounded-full animate-bounce animate-delay-100"></div>
            <div className="h-1 w-1 bg-primary-500 rounded-full animate-bounce animate-delay-200"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedLoader;
