/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F4C75',
        secondary: '#1B5F8C',
        accent: '#3282B8',
        light: '#BBE1FA',
      },
    },
  },
  plugins: [],
}
