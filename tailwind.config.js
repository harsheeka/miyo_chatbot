/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        sakura: {
          light: "#ffe5ef",
          DEFAULT: "#ffb7d5",
          dark: "#5e3a55",
          deep: "#452a3d",
        },
      },
    },
  },

  plugins: [],
};
