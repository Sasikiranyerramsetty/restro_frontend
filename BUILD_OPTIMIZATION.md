# Build Optimization Guide

This guide explains how to build and deploy the optimized React application for production.

## Quick Start

```bash
cd frontend
npm run build
```

The optimized production build will be created in the `frontend/build` directory.

## Build Process Optimizations

### 1. Code Splitting

The application uses React.lazy() and dynamic imports to split code into smaller chunks:

- **Main bundle**: Core application code (~800-900 KB)
- **Admin chunk**: Admin pages and components (loaded only for admin users)
- **Employee chunk**: Employee pages and components (loaded only for employees)
- **Customer chunk**: Customer pages and components (loaded for all users)
- **Vendor chunks**: Third-party libraries split into separate chunks

### 2. Minification

All JavaScript and CSS is automatically minified by Create React App's build process:

- JavaScript: Minified with Terser
- CSS: Minified with cssnano
- HTML: Minified with html-minifier

### 3. Tree Shaking

Unused code is automatically removed during the build process:

- Only imported functions are included
- Dead code is eliminated
- Unused exports are removed

### 4. Asset Optimization

#### Images
- Automatically hashed filenames for cache busting
- Can be optimized with tools like imagemin
- Support for WebP format with fallbacks

#### Fonts
- Font files are hashed and cached
- Consider using `font-display: swap` in CSS

### 5. Source Maps

For production builds, source maps are disabled by default to reduce bundle size:

```bash
# In .env.production
GENERATE_SOURCEMAP=false
```

Enable them for debugging production issues:

```bash
GENERATE_SOURCEMAP=true npm run build
```

## Environment-Specific Builds

### Development Build
```bash
npm start
# Runs development server with hot reloading
# Source maps enabled
# React.StrictMode enabled
```

### Production Build
```bash
npm run build
# Creates optimized production build
# Code splitting enabled
# Minification enabled
# Source maps disabled (by default)
```

### Production Build with Analysis
```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Add to package.json scripts:
# "analyze": "source-map-explorer 'build/static/js/*.js'"

npm run build
npm run analyze
```

## Deployment Checklist

### Before Building

- [ ] Update environment variables for production
- [ ] Test all routes and features
- [ ] Run linter and fix all issues
- [ ] Run tests
- [ ] Update API URLs to production endpoints
- [ ] Remove console.log statements (or use build to strip them)
- [ ] Verify all assets are properly referenced

### Build Command

```bash
cd frontend
npm ci  # Clean install dependencies
npm run build
```

### After Building

- [ ] Verify build succeeded without errors
- [ ] Check bundle sizes in `build/static/js/`
- [ ] Test the production build locally:
  ```bash
  npm install -g serve
  serve -s build
  ```
- [ ] Test all critical user flows
- [ ] Verify lazy loading works (check Network tab)
- [ ] Test on different devices and browsers
- [ ] Run Lighthouse audit
- [ ] Check Console for errors

## Performance Targets

### Bundle Sizes
- Main bundle: < 1 MB
- Vendor bundle: < 500 KB
- Route chunks: < 300 KB each

### Loading Performance
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

### Lighthouse Scores (Target)
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

## Server Configuration

### Node.js / Express Server

```javascript
const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();

// Enable gzip compression
app.use(compression());

// Serve static files with caching
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: '1y',
  etag: false,
}));

// Cache HTML files for 1 hour
app.use('*.html', express.static(path.join(__dirname, 'build'), {
  maxAge: '1h',
}));

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000);
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/build;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
    gzip_comp_level 6;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache HTML for 1 hour
    location ~* \.(html)$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # React Router support
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache Configuration

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType application/x-font-woff "access plus 1 year"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# React Router support
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

## CDN Configuration

### Using a CDN (Recommended)

1. **Upload build files to CDN**
2. **Configure CDN caching rules:**
   - JavaScript/CSS: Cache for 1 year
   - Images: Cache for 1 year
   - HTML: Cache for 1 hour
   - Set proper Cache-Control headers

3. **Update API URLs:**
   ```javascript
   // In your API service
   const API_URL = process.env.REACT_APP_CDN_URL || 'https://your-cdn.com';
   ```

### Popular CDN Options
- AWS CloudFront
- Cloudflare
- Netlify
- Vercel
- Azure CDN

## Monitoring Production Performance

### 1. Real User Monitoring (RUM)

Use services like:
- Google Analytics (with Web Vitals)
- New Relic
- Datadog
- Sentry Performance

### 2. Synthetic Monitoring

Regular checks using:
- Lighthouse CI
- WebPageTest
- GTmetrix
- Pingdom

### 3. Custom Performance Monitoring

The app includes built-in performance monitoring:

```javascript
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';

const MyComponent = () => {
  usePerformanceMonitor('MyComponent');
  // Component code
};
```

## Troubleshooting

### Large Bundle Size

**Problem**: Main bundle is too large (> 1 MB)

**Solutions**:
1. Analyze bundle with webpack-bundle-analyzer
2. Check for duplicate dependencies
3. Use dynamic imports for large components
4. Consider code splitting for large libraries

### Slow Initial Load

**Problem**: App takes too long to become interactive

**Solutions**:
1. Check bundle sizes
2. Verify code splitting is working
3. Optimize images
4. Enable CDN caching
5. Use preloading for critical resources

### Route Loading Delays

**Problem**: Noticeable delay when navigating between routes

**Solutions**:
1. Implement route preloading
2. Use loading skeletons instead of spinners
3. Optimize lazy-loaded components
4. Consider prefetching on hover

## Continuous Optimization

### Regular Tasks

- **Weekly**: Review bundle sizes
- **Monthly**: Run Lighthouse audits
- **Quarterly**: Dependency updates and optimization review

### Performance Budget

Set and enforce performance budgets:

```json
{
  "budgets": [
    {
      "resourceSizes": [
        { "resourceType": "script", "budget": 1000 },
        { "resourceType": "style", "budget": 150 },
        { "resourceType": "image", "budget": 500 },
        { "resourceType": "font", "budget": 100 }
      ],
      "resourceCounts": [
        { "resourceType": "script", "budget": 10 },
        { "resourceType": "stylesheet", "budget": 5 }
      ]
    }
  ]
}
```

## Conclusion

Following these optimization practices ensures your React application loads quickly and provides a smooth user experience. Regular monitoring and continuous optimization are key to maintaining performance over time.

For questions or issues, refer to the PERFORMANCE_OPTIMIZATIONS.md document or consult with the development team.

