/**
 * Image Optimization Utilities
 * Helps optimize image loading for better performance
 */

/**
 * Create a lazy-loading image observer
 * @param {Object} options - IntersectionObserver options
 * @returns {IntersectionObserver} - Observer instance
 */
export const createImageObserver = (options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
  };

  const config = { ...defaultOptions, ...options };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;

        if (src) {
          img.src = src;
        }

        if (srcset) {
          img.srcset = srcset;
        }

        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, config);

  return imageObserver;
};

/**
 * Lazy load an image element
 * @param {HTMLImageElement} img - Image element to lazy load
 */
export const lazyLoadImage = (img) => {
  if ('IntersectionObserver' in window) {
    const observer = createImageObserver();
    observer.observe(img);
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (src) img.src = src;
    if (srcset) img.srcset = srcset;
  }
};

/**
 * Preload an image
 * @param {string} src - Image source URL
 * @returns {Promise} - Resolves when image is loaded
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preload multiple images
 * @param {Array<string>} sources - Array of image URLs
 * @returns {Promise} - Resolves when all images are loaded
 */
export const preloadImages = (sources) => {
  return Promise.all(sources.map(preloadImage));
};

/**
 * Generate responsive image srcset
 * @param {string} baseUrl - Base image URL
 * @param {Array<number>} sizes - Array of image widths
 * @returns {string} - srcset string
 */
export const generateSrcSet = (baseUrl, sizes = [320, 640, 1024, 1280, 1920]) => {
  return sizes
    .map((size) => {
      const url = baseUrl.replace(/\.(jpg|jpeg|png|webp)$/i, `_${size}.$1`);
      return `${url} ${size}w`;
    })
    .join(', ');
};

/**
 * Optimize image loading with blur placeholder
 * @param {string} src - Image source
 * @param {string} placeholder - Low-res placeholder image
 * @returns {Object} - Image props
 */
export const createOptimizedImageProps = (src, placeholder = null) => {
  return {
    'data-src': src,
    src: placeholder || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    loading: 'lazy',
    decoding: 'async',
    className: 'lazy-image',
  };
};

/**
 * Convert image to WebP format (client-side check)
 * @returns {boolean} - Whether WebP is supported
 */
export const supportsWebP = () => {
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Get optimized image URL based on device and format support
 * @param {string} baseUrl - Base image URL
 * @param {Object} options - Optimization options
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (baseUrl, options = {}) => {
  const {
    width = null,
    quality = 80,
    format = 'auto',
  } = options;

  // If it's a relative URL, return as-is
  if (baseUrl.startsWith('/') || baseUrl.startsWith('./')) {
    return baseUrl;
  }

  // Build query parameters for image optimization service
  const params = new URLSearchParams();
  
  if (width) params.append('w', width);
  if (quality) params.append('q', quality);
  if (format === 'auto' && supportsWebP()) {
    params.append('f', 'webp');
  } else if (format && format !== 'auto') {
    params.append('f', format);
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export default {
  createImageObserver,
  lazyLoadImage,
  preloadImage,
  preloadImages,
  generateSrcSet,
  createOptimizedImageProps,
  supportsWebP,
  getOptimizedImageUrl,
};

