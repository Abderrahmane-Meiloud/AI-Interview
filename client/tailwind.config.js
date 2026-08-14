/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22A85F',
          600: '#166534',
          700: '#15803D',
          800: '#14532D',
          900: '#0F3D22',
        },
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#166534',
          600: '#15803D',
          700: '#14532D',
        },
        warning: {
          50: '#fbf0da',
          100: '#f6e3b8',
          500: '#92660a',
          600: '#7c5709',
          700: '#634507',
        },
        danger: {
          50: '#fbe8e6',
          100: '#f7d1cd',
          500: '#b23a3a',
          600: '#9c3232',
          700: '#7e2828',
        },
        ink: {
          DEFAULT: '#17201B',
          soft: '#647067',
          faint: '#8B978F',
        },
        line: {
          DEFAULT: '#DDE5DF',
          soft: '#E9EFEB',
        },
        app: {
          DEFAULT: '#F8FAF9',
        },
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23,32,27,0.04), 0 1px 3px rgba(23,32,27,0.06)',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};
