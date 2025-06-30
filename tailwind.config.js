/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'swasti-yellow': '#f59e0b',
        'swasti-green': '#15803d',
        'swasti-light-yellow': '#fef3c7',
        'swasti-light-green': '#dcfce7',
      },
    },
  },
  plugins: [],
};