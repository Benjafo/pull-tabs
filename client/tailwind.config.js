/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy blues for primary theme
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#94a3b8',
          300: '#64748b',
          400: '#475569',
          500: '#334155',
          600: '#1e293b',
          700: '#0f172a',
          800: '#0c1220',
          900: '#080b16',
        },
        // Rich golds for accents and wins
        gold: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Neutral cream/off-white
        cream: {
          50: '#fefdfb',
          100: '#fef3c7',
          200: '#fae8b6',
          300: '#f5dca5',
        },
        // Semantic colors for game states
        casino: {
          bg: '#0f172a',        // navy-700
          surface: '#1e293b',   // navy-600
          card: '#334155',      // navy-500
          accent: '#d97706',    // gold-600
          highlight: '#fbbf24', // gold-400
          text: '#fef3c7',      // cream-100
          muted: '#64748b',     // navy-300
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-treasure': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}