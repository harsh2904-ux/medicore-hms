/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#05070A',
          secondary: '#0A0D12',
          surface: '#0F131A',
        },
        surface: {
          DEFAULT: '#0F131A',
          elevated: '#141A24',
          subtle: '#18202C',
        },
        accent: {
          primary: '#5B8CFF',
          secondary: '#7C5CFF',
          hover: '#4A7BE8',
        },
        status: {
          success: '#30D158',
          warning: '#FFB547',
          danger: '#FF5C70',
          info: '#38BDF8',
        },
        text: {
          primary: '#F5F7FA',
          secondary: '#9AA4B2',
          muted: '#687386',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.055)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.085)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      boxShadow: {
        glass: '0 20px 60px rgba(0, 0, 0, 0.25)',
        'glass-sm': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'glow-primary': '0 0 24px rgba(91, 140, 255, 0.25)',
        'glow-secondary': '0 0 24px rgba(124, 92, 255, 0.25)',
      },
      backdropBlur: {
        glass: '20px',
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
      }
    },
  },
  plugins: [],
}
