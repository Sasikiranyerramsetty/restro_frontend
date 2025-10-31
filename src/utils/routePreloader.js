/**
 * Route Preloader Utility
 * Preloads lazy-loaded route components for faster navigation
 */

// Cache to track preloaded routes
const preloadedRoutes = new Set();

/**
 * Preload a lazy-loaded component
 * @param {Function} lazyComponent - React.lazy() component
 * @param {string} routeName - Name of the route (for caching)
 */
export const preloadRoute = (lazyComponent, routeName) => {
  // Check if already preloaded
  if (preloadedRoutes.has(routeName)) {
    return Promise.resolve();
  }

  // Preload the component
  const componentPromise = lazyComponent._result || lazyComponent._payload;
  
  if (componentPromise) {
    return componentPromise.then(() => {
      preloadedRoutes.add(routeName);
    });
  }

  return Promise.resolve();
};

/**
 * Create a preload handler for mouse hover events
 * @param {Function} lazyComponent - React.lazy() component
 * @param {string} routeName - Name of the route
 */
export const createPreloadHandler = (lazyComponent, routeName) => {
  return () => {
    preloadRoute(lazyComponent, routeName);
  };
};

/**
 * Preload multiple routes at once
 * @param {Array} routes - Array of {component, name} objects
 */
export const preloadRoutes = (routes) => {
  return Promise.all(
    routes.map(({ component, name }) => preloadRoute(component, name))
  );
};

/**
 * Clear preload cache (useful for memory management)
 */
export const clearPreloadCache = () => {
  preloadedRoutes.clear();
};

export default {
  preloadRoute,
  createPreloadHandler,
  preloadRoutes,
  clearPreloadCache,
};

