/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./.dist/**/*.html", // Altere para o caminho onde ficam seus arquivos HTML.
    "./.dist/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html", // Altere para o caminho onde ficam seus arquivos HTML.
    "./public/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

