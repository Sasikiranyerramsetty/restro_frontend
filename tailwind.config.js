/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  // Optimize for production - remove unused CSS
  safelist: [
    // Add any dynamic classes that should never be purged
    'animate-spin',
    'animate-pulse',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E63946',      // Primary red
          cream: '#F1FAEE',    // Light cream/white
          teal: '#A8DADC',     // Light teal
          blue: '#457B9D',     // Medium blue
          navy: '#1D3557',     // Dark navy
        },
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#E63946',
          600: '#D32F3D',
          700: '#C12533',
          800: '#9A1E28',
          900: '#7A1820',
        },
        background: '#F1FAEE',
        foreground: '#1D3557',
        border: '#E5E7EB',
        dark: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#999999',
          500: '#666666',
          600: '#4D4D4D',
          700: '#333333',
          800: '#2D2D2D',
          900: '#1D3557',
        },
        secondary: {
          50: '#F0F8F9',
          100: '#E0F1F3',
          200: '#C7E6EA',
          300: '#A8DADC',
          400: '#8BCFD2',
          500: '#6DC4C8',
          600: '#457B9D',
          700: '#396782',
          800: '#2E5367',
          900: '#1D3557',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FFC107',
          600: '#F59E0B',
          700: '#D97706',
          800: '#B45309',
          900: '#92400E',
        }
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        body: ['Open Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'none',
        'slide-up': 'none',
        'slide-down': 'none',
        'bounce-in': 'none',
        'scale-in': 'none',
        'float': 'none',
        'pulse-slow': 'none',
        'shimmer': 'none',
        'slide-in-left': 'none',
        'slide-in-right': 'none',
        'rotate-in': 'none',
        'zoom-in': 'none',
        'wiggle': 'none',
        'heartbeat': 'none',
        'glow': 'none',
        'slide-right': 'none',
        'scale-up': 'none',
        'image-zoom': 'none',
        'spin': 'none',
        'ping': 'none',
        'pulse': 'none',
        'bounce': 'none',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-180deg)', opacity: '0' },
          '100%': { transform: 'rotate(0deg)', opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 107, 53, 0.5)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 107, 53, 0.8)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(4px)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        imageZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}
