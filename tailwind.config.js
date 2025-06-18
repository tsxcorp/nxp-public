/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#FF0000', // Replace with your desired accent color
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(40px) scale(0.95)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0) scale(1)'
          }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.7s ease-out forwards'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide'),
  ],
} 