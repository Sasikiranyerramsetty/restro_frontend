import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCard from './AnimatedCard';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral',
  className = '',
  delay = 0 
}) => {
  const changeColors = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <AnimatedCard 
      hover={true} 
      className={`p-6 ${className}`}
      delay={delay}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <motion.p
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2, duration: 0.3 }}
          >
            {value}
          </motion.p>
          {change && (
            <p className={`text-sm mt-2 ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <motion.div
            className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.3, type: "spring" }}
          >
            <div className="text-primary-600 dark:text-primary-400">
              {icon}
            </div>
          </motion.div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default StatCard;
