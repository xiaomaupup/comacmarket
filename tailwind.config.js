/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,vue}",
    "./components/**/*.{js,ts,vue}",
    "./services/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'deep-space': {
          50: '#f0f4f8',
          100: '#d9e2ec',
          800: '#102a43',
          900: '#001529', // Main dark background
        },
        'aero': {
          400: '#4dabf7',
          500: '#339af0',
          600: '#228be6', // Primary accent
          gradient: 'linear-gradient(135deg, #0052cc 0%, #209cff 100%)'
        }
      },
      backgroundImage: {
        'sky-gradient': 'linear-gradient(to bottom, #f0f7ff, #ffffff)',
        'user-bubble': 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'float': '0 10px 40px -10px rgba(0,0,0,0.1)',
      }
    }
  },
  plugins: [],
}

