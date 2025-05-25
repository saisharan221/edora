/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {              // <─ enables the `.container` utility
      center: true,
      padding: '1rem',
    },
    extend: {},
  },
  plugins: [],
};