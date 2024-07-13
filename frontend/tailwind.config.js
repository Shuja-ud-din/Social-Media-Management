/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn-primary': {
          '@apply  relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500':
            {},
        },
        '.btn-outlined': {
          '@apply  relative hover:text-[white] w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-[white] text-indigo-600 hover:bg-indigo-600 border border-indigo-600 font-semibold py-2 px-4 rounded':
            {},
        },
      })
    },
  ],
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
}
