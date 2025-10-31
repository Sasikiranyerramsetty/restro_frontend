/**
 * Performance Monitoring Hook
 * Monitors and logs performance metrics
 */

import { useEffect, useRef } from 'react';

/**
 * Hook to monitor component render performance
 * @param {string} componentName - Name of the component being monitored
 * @param {boolean} enabled - Whether monitoring is enabled (default: only in development)
 */
export const usePerformanceMonitor = (componentName, enabled = process.env.NODE_ENV === 'development') => {
  const renderCount = useRef(0);
  const renderStart = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;
    const renderTime = performance.now() - renderStart.current;

    if (renderTime > 16.67) { // More than one frame (60fps = 16.67ms per frame)
      console.warn(
        `[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
      );
    }

    // Reset for next render
    renderStart.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
  };
};

/**
 * Hook to monitor route changes and time-to-interactive
 * @param {string} routeName - Name of the current route
 */
export const useRoutePerformance = (routeName) => {
  const mountTime = useRef(performance.now());

  useEffect(() => {
    const timeToMount = performance.now() - mountTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Route Performance] ${routeName} mounted in ${timeToMount.toFixed(2)}ms`);
    }

    // Report to analytics if in production
    if (process.env.NODE_ENV === 'production' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: 'route_load',
        value: Math.round(timeToMount),
        event_category: 'Performance',
        event_label: routeName,
      });
    }

    return () => {
      // Cleanup
    };
  }, [routeName]);
};

/**
 * Log Web Vitals for monitoring
 */
export const logWebVitals = (metric) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
};

/**
 * Measure API call performance
 * @param {string} apiName - Name of the API endpoint
 * @param {Function} apiCall - Function that makes the API call
 * @returns {Promise} - Result of the API call with performance metrics
 */
export const measureAPIPerformance = async (apiName, apiCall) => {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Performance] ${apiName} completed in ${duration.toFixed(2)}ms`);
    }

    // Log slow API calls
    if (duration > 1000) {
      console.warn(`[API Performance] Slow API call detected: ${apiName} took ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`[API Performance] ${apiName} failed after ${duration.toFixed(2)}ms`, error);
    throw error;
  }
};

export default {
  usePerformanceMonitor,
  useRoutePerformance,
  logWebVitals,
  measureAPIPerformance,
};

