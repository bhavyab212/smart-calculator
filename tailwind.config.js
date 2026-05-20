/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        lcd: {
          bg: '#1a2e0a',
          text: '#c8f090',
          dim: '#7aaa40',
          border: '#3d5a1a',
        },
        calc: {
          body: '#1e1e2e',
          surface: '#181825',
          key: {
            num: '#2a2a3e',
            op: '#1e3a5f',
            fn: '#2a1a3e',
            shift: '#cc6600',
            alpha: '#4a1a7a',
            exe: '#1a5f9f',
            system: '#1a2a1a',
          }
        }
      },
      boxShadow: {
        'key': '0 4px 6px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'key-pressed': '0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(0,0,0,0.2)',
        'lcd': 'inset 0 2px 8px rgba(0,0,0,0.6), 0 0 20px rgba(100,200,50,0.1)',
        'calc': '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        press: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(2px)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        slideUp: 'slideUp 0.2s ease-out',
        fadeIn: 'fadeIn 0.15s ease-out',
        press: 'press 0.1s ease-in-out',
      }
    },
  },
  plugins: [],
}
