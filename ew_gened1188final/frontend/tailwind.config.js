/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tell Tailwind where to look for class names ──>
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // everything in app/, pages/, components/, etc.
  ],

  theme: {
    extend: {
      /* ----------  FONTS  ---------- */
      fontFamily: {
        helvetica: ["Helvetica", "Arial", "sans-serif"],
      },

      /* ----------  ANIMATIONS  ---------- */
      keyframes: {
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
