/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        terracotta: {
          50: '#fdf5f3',
          100: '#fbe8e3',
          200: '#f7d4c9',
          300: '#f0b5a3',
          400: '#e68971',
          500: '#dc6b4e',
          600: '#c8523a',
          700: '#a7402e',
          800: '#8a372a',
          900: '#733127',
        },
        cream: {
          50: '#fdfcfb',
          100: '#faf7f5',
          200: '#f5f0eb',
          300: '#ede4dc',
          400: '#e2d4c8',
          500: '#d4c1b0',
          600: '#b8a090',
          700: '#9a8374',
          800: '#7d6b5f',
          900: '#665850',
        },
        brown: {
          50: '#f9f7f4',
          100: '#f0ebe3',
          200: '#e0d5c7',
          300: '#cbb9a3',
          400: '#b5997d',
          500: '#9f7d5f',
          600: '#8b6a4f',
          700: '#735643',
          800: '#5f483a',
          900: '#4f3d31',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        display: ['Crimson Pro', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 12px 30px -4px rgba(0, 0, 0, 0.08)',
        'strong': '0 10px 40px -5px rgba(0, 0, 0, 0.15), 0 20px 50px -8px rgba(0, 0, 0, 0.12)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}