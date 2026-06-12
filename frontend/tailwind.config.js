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
          50: '#f0f4f8',
          100: '#bbE1FA',
          200: '#9FD3F7',
          300: '#83C5F4',
          400: '#5BA3D0',
          500: '#3B82A8',
          600: '#2872A3',
          700: '#1B5F8C',
          800: '#154F75',
          900: '#0F4C75',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#BBE1FA',
          200: '#9FD3F7',
          300: '#83C5F4',
          400: '#5BA3D0',
          500: '#3B82A8',
          600: '#2872A3',
          700: '#1B5F8C',
          800: '#154F75',
          900: '#0F4C75',
        },
      },
    },
  },
  plugins: [],
}