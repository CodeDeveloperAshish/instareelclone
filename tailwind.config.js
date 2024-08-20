/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/screens/**/*.js", "./app/components/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#7656f3",
      },
    },
  },
  plugins: [],
};
