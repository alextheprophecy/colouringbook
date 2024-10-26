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