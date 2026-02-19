/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#e50914',
          black: '#141414',
          dark: '#181818',
          gray: '#2f2f2f',
        },
      },
      fontFamily: {
        sans: ['Netflix Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-bottom': 'linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.6) 50%, transparent 100%)',
        'gradient-right': 'linear-gradient(to right, rgba(20,20,20,1) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
};
