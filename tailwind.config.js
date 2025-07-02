/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F5F5F0',
          100: '#E8E8E0',
          200: '#D1D1C0',
          300: '#B8B89E',
          400: '#9CAF88',
          500: '#8A9A76',
          600: '#7A8A66',
          700: '#6A7A56',
          800: '#5A6A46',
          900: '#4A5A36',
        },
        nordic: {
          sage: '#9CAF88',
          slate: '#6B7280',
          cream: '#F5F5F0',
          charcoal: '#374151',
          forest: '#4A6741',
          sky: '#87CEEB',
          warm: '#D4A574',
          cool: '#A8DADC',
        }
      },
    },
  },
  plugins: [],
} 