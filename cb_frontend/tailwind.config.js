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
      textShadow: {
        'lg': '3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'paper': "url('/public/assets/textures/paper-texture.jpg')",
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.1)',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-45deg)' },
          '30%, 100%': { transform: 'translateX(400%) skewX(-45deg)' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-lg': {
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.6)',
        },
      })
    }
  ],
}