import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#d8f1ff",
          200: "#bae7ff",
          300: "#8adaff",
          400: "#52c3ff",
          500: "#2aa4ff",
          600: "#1486f5",
          700: "#0d6de1",
          800: "#1158b6",
          900: "#144b8f",
          950: "#112f57",
        },
        surface: {
          DEFAULT: "#0a0e17",
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d5d9e2",
          300: "#b0b8c9",
          400: "#8592ab",
          500: "#657590",
          600: "#505e77",
          700: "#424d61",
          800: "#394252",
          900: "#1a1f2e",
          950: "#0d1117",
        },
        gain: "#22c55e",
        loss: "#ef4444",
      },
    },
  },
  plugins: [],
};
export default config;
