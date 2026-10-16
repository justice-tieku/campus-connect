/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        display: ['"Outfit"', '"Inter"', "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eff4ff",
          100: "#dbe6ff",
          200: "#bfd0ff",
          300: "#93b0ff",
          400: "#5f86ff",
          500: "#3b63f5",
          600: "#2549e0",
          700: "#1d3bc0",
          800: "#1c339a",
          900: "#1b2f78",
          950: "#121d4a",
        },
        accent: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          950: "#422006",
        },
        surface: {
          50: "#f7f7f5",
          100: "#efefec",
          200: "#e3e3df",
          300: "#cfcfca",
          400: "#9b9b94",
          500: "#6b6b65",
          600: "#4f4f4a",
          700: "#363632",
          800: "#232320",
          900: "#141413",
          950: "#0a0a09",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,20,19,0.04)",
        elevated: "0 8px 24px rgba(20,20,19,0.08)",
        pop: "4px 4px 0 0 #141413",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out both",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
