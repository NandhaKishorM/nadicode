// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    animation: {
      wave: "wave 2.5s linear infinite",
      enter: "enter 200ms ease-out",
      "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
      leave: "leave 150ms ease-in forwards",
      "bounce-down": "bounce-down 3s infinite",
    },
    keyframes: {
      wave: {
        "0%": { transform: "rotate( 0.0deg)" },
        "10%": { transform: "rotate(14.0deg)" },
        "20%": { transform: "rotate(-8.0deg)" },
        "30%": { transform: "rotate(14.0deg)" },
        "40%": { transform: "rotate(-4.0deg)" },
        "50%": { transform: "rotate(10.0deg)" },
        "60%": { transform: "rotate( 0.0deg)" },
        "100%": { transform: "rotate( 0.0deg)" },
      },
      enter: {
        "0%": { transform: "scale(0.8)", opacity: "0" },
        "100%": { transform: "scale(1)", opacity: "1" },
      },
      leave: {
        "0%": { transform: "scale(1)", opacity: "1" },
        "100%": { transform: "scale(0.8)", opacity: "0" },
      },
      "slide-in": {
        "0%": { transform: "translateY(-100%)" },
        "100%": { transform: "translateY(0)" },
      },
      "bounce-down": {
        "0%,20%, 50%,80%,100%": { transform: "translateY(0)" },
        "40%": { transform: "translateY(-8px)" },
        "60%": { transform: "translateY(-4px)" },
      },
    },
    container: {
      center: true,
      padding: "16px",
    },
    fontFamily: {
      sans: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Oxygen-Sans",
        "Ubuntu,Cantarell",
        "Helvetica",
        "sans-serif",
      ],
    },
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};
