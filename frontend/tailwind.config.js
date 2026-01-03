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
          DEFAULT: '#FF6B35',
          light: '#FF8A65',
          dark: '#E55A2B',
          lighter: '#FFF3E0',
        },
        secondary: {
          DEFAULT: '#2C3E50',
        },
        accent: '#FFB74D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

