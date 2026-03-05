/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wolf: {
          900: '#0e0f12',
          700: '#1b1d23',
          500: '#2f3440',
          300: '#8a94a6',
          100: '#e6ebf5'
        },
        accent: '#d4a840'
      }
    }
  },
  plugins: []
}
