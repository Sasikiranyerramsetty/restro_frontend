import { logWebVitals } from './hooks/usePerformanceMonitor';

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  } else {
    // Default to logging web vitals if no callback provided
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(logWebVitals);
      getFID(logWebVitals);
      getFCP(logWebVitals);
      getLCP(logWebVitals);
      getTTFB(logWebVitals);
    });
  }
};

export default reportWebVitals;
