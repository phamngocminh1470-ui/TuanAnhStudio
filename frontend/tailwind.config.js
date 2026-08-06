/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c7ff',
          400: '#85a3ff',
          500: '#5275ff',
          600: '#334eff',
          700: '#243be6',
          800: '#1d2ebc',
          900: '#1c2b94',
          950: '#10175b',
        }
      }
    },
  },
  plugins: [],
}
