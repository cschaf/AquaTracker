/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-blue': '#2C3E50',
        'dark-blue-lighter': '#34495E',
        'dark-text': '#ECF0F1',
        'dark-text-secondary': '#BDC3C7',
      },
    },
  },
  plugins: [],
}
