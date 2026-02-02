/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans KR"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
      },
      colors: {
        pen: {
          blue: '#2c3a6d',
          red: '#b92b27',
        },
        primary: {
          DEFAULT: '#7184e6',
          dark: '#6f8cbd',
        },
        gray: {
          100: '#f9fafc',
          200: '#f3f4f6',
          300: '#e5e7eb',
          500: '#6a7282',
          700: '#4a5565',
          900: '#101828',
        },
        activity: {
          1: '#d4daef',
          2: '#a8b4e3',
          3: '#8d9dd9',
          4: '#7184e6',
        }
      },
      boxShadow: {
        'card': '0px 4px 4px 0px rgba(0,0,0,0.25)',
        'hard': '4px 4px 0px 0px rgba(0,0,0,1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
