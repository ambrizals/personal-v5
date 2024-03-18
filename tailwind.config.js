const {
  iconsPlugin,
  getIconCollections,
} = require("@egoist/tailwindcss-icons");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [iconsPlugin()],
};
