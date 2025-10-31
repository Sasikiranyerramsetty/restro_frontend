/**
 * Debounce utility function
 * Delays function execution until after a specified time has elapsed since the last call
 * Useful for optimizing expensive operations like API calls, search, and resize handlers
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - If true, trigger the function on the leading edge instead of trailing
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300, immediate = false) => {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

/**
 * Throttle utility function
 * Ensures a function is called at most once in a specified time period
 * @param {Function} func - The function to throttle
 * @param {number} limit - The minimum time between function calls (in milliseconds)
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  let lastFunc;
  let lastRan;

  return function executedFunction(...args) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, Math.max(limit - (Date.now() - lastRan), 0));
    }
  };
};

export default {
  debounce,
  throttle,
};

