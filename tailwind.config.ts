import type { Config } from 'tailwindcss'

import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'
// import { getThemesFromEnv } from '@/lib/utils/theme'

function getThemesFromEnv() {
  if (process.env.NEXT_PUBLIC_DAISYUI_THEMES) {
      return JSON.parse(process.env.NEXT_PUBLIC_DAISYUI_THEMES)
  }

  return ['light', 'dark']
}


export default {
  darkMode: 'class',

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        gray: colors.slate,
        red: colors.rose,
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(17, 25, 40, 0.75)',
        },
      },
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        serif: ['Roboto', ...defaultTheme.fontFamily.serif],
        mono: ['Source Code Pro', ...defaultTheme.fontFamily.mono],
      },
      animation: {
        'fade-in': 'fade-in 0.5s linear forwards',
        'glass-shine': 'glass-shine 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        'glass-shine': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },

  variants: {
    extend: {},
  },

  // daisyUI config (optional) //https://daisyui.com/docs/config/
  daisyui: {
    styled: true,
    themes: getThemesFromEnv(),
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: '',
    darkTheme: 'dark',
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
    require('daisyui'),
  ],
} satisfies Config
