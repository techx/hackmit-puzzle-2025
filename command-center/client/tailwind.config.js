/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#131b29",
        secondary: "#30445c",
        tertiary: "#202c3c",
        accent: "#29bffd",
      },
    },
  },
  plugins: [],
};
