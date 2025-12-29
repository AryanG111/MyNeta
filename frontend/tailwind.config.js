/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35', // Primary Orange
          light: '#FF8A65',
          dark: '#E55A2B',
        },
        secondary: {
          DEFAULT: '#2C3E50', // Dark Blue/Grey
        }
      }
    },
  },
  plugins: [],
}
