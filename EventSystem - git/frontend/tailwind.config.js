/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // <--- خط حیاتی که نبود!
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-vazir)'], // اتصال فونت وزیر به کل سایت
      },
      colors: {
        primary: '#2563EB', // رنگ آبی اصلی برند
      },
    },
  },
  plugins: [],
};