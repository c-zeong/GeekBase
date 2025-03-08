/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FFB800',
        'light-bg': '#FFFFFF',
        'light-card': '#F5F5F5',
        'dark-bg': '#1A1A1A',
        'dark-card': '#2D2D2D',
      },
    },
  },
  plugins: [],
};
