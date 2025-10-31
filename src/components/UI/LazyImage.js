/**
 * LazyImage Component
 * Optimized image component with lazy loading, blur placeholder, and error handling
 */

import React, { useState, useEffect, useRef } from 'react';
import { createImageObserver } from '../../utils/imageOptimizer';

const LazyImage = ({
  src,
  alt = '',
  placeholder = null,
  className = '',
  width,
  height,
  onLoad,
  onError,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Create intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      observerRef.current = createImageObserver({
        rootMargin: '50px',
      });

      const handleIntersection = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;
            const imageSrc = image.dataset.src;

            if (imageSrc) {
              image.src = imageSrc;
            }

            if (observerRef.current) {
              observerRef.current.unobserve(image);
            }
          }
        });
      };

      observerRef.current = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '50px',
        threshold: 0.01,
      });

      observerRef.current.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      img.src = src;
    }

    return () => {
      if (observerRef.current && img) {
        observerRef.current.unobserve(img);
      }
    };
  }, [src]);

  const handleLoad = (e) => {
    setLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setError(true);
    if (onError) onError(e);
  };

  // Inline placeholder (1x1 transparent gif)
  const defaultPlaceholder = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  return (
    <div className={`lazy-image-container ${className}`} style={{ width, height }}>
      <img
        ref={imgRef}
        data-src={src}
        src={placeholder || defaultPlaceholder}
        alt={alt}
        className={`lazy-image ${loaded ? 'loaded' : ''} ${error ? 'error' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.3s ease-in-out',
          opacity: loaded ? 1 : 0.3,
        }}
        {...props}
      />
      
      {error && (
        <div className="image-error-placeholder" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
        }}>
          <span>Image failed to load</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;

