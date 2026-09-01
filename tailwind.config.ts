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
        navy: {
          950: "#040D1E", // Deepest Heritage Navy
          900: "#06152F", // Deep Navy
          800: "#082B5C", // Royal Blue
          700: "#0B4F8A", // CSK Blue
          600: "#136CBD",
          500: "#2B8BE3",
        },
        cskgold: {
          50: "#FFFDF0",
          100: "#FFF8C5",
          200: "#FFED85",
          300: "#F7E199",
          400: "#F5D374", // Bright Gold
          500: "#E5B842", // Luxury Metallic Gold
          600: "#C99727",
          700: "#B38622",
        },
        cskgray: {
          50: "#F8FAFC",
          100: "#F4F5F7",
          200: "#E2E8F0",
          300: "#CBD5E1",
          800: "#1E293B",
          900: "#101828",
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Montserrat'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Montserrat'", "'Oswald'", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        'xxs': ['0.65rem', { lineHeight: '0.85rem' }],
        'xs': ['0.8125rem', { lineHeight: '1.15rem' }],
        'sm': ['0.9375rem', { lineHeight: '1.4rem' }],
        'base': ['1.0625rem', { lineHeight: '1.65rem' }],
        'lg': ['1.1875rem', { lineHeight: '1.75rem' }],
        'xl': ['1.35rem', { lineHeight: '1.85rem' }],
        '2xl': ['1.65rem', { lineHeight: '2.1rem' }],
        '3xl': ['2.15rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.75rem', { lineHeight: '3.1rem' }],
        '5xl': ['3.5rem', { lineHeight: '3.8rem' }],
        '6xl': ['4.5rem', { lineHeight: '4.8rem' }],
        '7xl': ['5.5rem', { lineHeight: '5.8rem' }],
        '8xl': ['6.5rem', { lineHeight: '6.8rem' }],
      }
    },
  },
  plugins: [],
};
export default config;
