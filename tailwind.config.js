/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#22C55E',
          greenSoft: '#F0FDF4',
          greenHover: '#16A34A',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.06)',
        soft: '0 8px 24px -8px rgba(0,0,0,0.12)',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};
