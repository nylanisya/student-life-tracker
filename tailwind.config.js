/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pink: {
          50: "#FFF0F5",
          200: "#FFB6C1",
        },
      },
    },
  },
  plugins: [],
};
