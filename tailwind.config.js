/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./web/**/*.{html,js}",
    "./popup.html",
    "./content.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e7f3ff',
          100: '#d2e9ff',
          500: '#1877f2',
          600: '#166fe5',
        }
      }
    }
  },
  plugins: [],
}
