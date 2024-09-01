/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  extend: {
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.50)",
          "0 0px 65px rgba(255, 255,255, 0.35)",
        ],
      },
      colors: {
        background: "#000",
        secondary: "#191919",
        primary: "#00fdd0",
        text: "#fff",
        placeholder: "#898888",
        yellow: "#FDE400",
        orange: "#FF812E",
        red: "#FF2E2F",
      },
      fontFamily: {
        "fff-forward": "var(--fff-forward)",
        "made-outer-sans": "var(--made-outer-sans)",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        marquee2: "marquee2 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
    },
  theme: {
    extend: {},
  },
  plugins: [],
}