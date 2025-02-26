/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
],
theme: {
    container: {
        center: true,
        padding: {
            DEFAULT: "1rem",
            md: "2rem",
            lg: "4rem",
        },
    },
    fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
    },
    screens: {
        sm: "375px",
        md: "768px",
        lg: "1200px",
    },
},
plugins: [],
};