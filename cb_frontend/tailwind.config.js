/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        handwriting: ['Architects Daughter', 'cursive'],
        children: ['Children', 'cursive'],
        buwicked: ['Bu-Wicked', 'cursive'],
      },
      cursor: {
        'pencil': "url('/public/assets/cursors/pencil-cursor.svg') 0 32, auto",
        'select': "url('/public/assets/cursors/select.svg') 14 -2, pointer",
      },
      textShadow: {
        'lg': '3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'paper': "url('/public/assets/textures/paper-texture.jpg')",
        'title-banner': "url('/public/assets/textures/V_2/title-banner.png')",
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-45deg)' },
          '30%, 100%': { transform: 'translateX(400%) skewX(-45deg)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-lg': {
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.6)',
        }
      })
    }
  ],
}