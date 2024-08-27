import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      lg: "1025px",
      md: "766px",
      sm: "640px",
    },
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
  },
  plugins: [],
};
export default config;
