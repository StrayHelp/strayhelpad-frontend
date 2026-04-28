/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFD93D',
        success: '#6BCB77',
        error: '#FF6B6B',
        warning: '#FFD93D',
        info: '#4D96FF',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
