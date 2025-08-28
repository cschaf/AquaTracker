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
        'dark-blue': 'oklch(0.22 0.04 255)',
        'dark-blue-lighter': 'oklch(0.27 0.045 255)',
        'dark-text': 'oklch(0.8 0.02 255)',
        'dark-text-secondary': 'oklch(0.6 0.02 255)',
      },
    },
  },
  plugins: [],
}
