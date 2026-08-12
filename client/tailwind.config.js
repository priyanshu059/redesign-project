/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind where to look for class names
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colors matching original Bootstrap theme
      colors: {
        primary: {
          DEFAULT: '#0d6efd',
          dark: '#0a58ca',
          light: '#6ea8fe',
        },
        dark: {
          DEFAULT: '#212529',
          card: '#1a1d20',
          nav: '#0d1117',
        },
      },
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(10px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
