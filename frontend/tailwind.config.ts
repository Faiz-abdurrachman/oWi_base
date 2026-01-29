import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Gold
        gold: {
          50: "#FFFDF0",
          100: "#FFF9D6",
          200: "#FFF3AD",
          300: "#FFEC85",
          400: "#FFE45C",
          500: "#FFD700", // Main gold
          600: "#E6C200",
          700: "#B89800",
          800: "#8A7200",
          900: "#5C4C00",
        },
        // Secondary - Navy/Deep Blue
        navy: {
          50: "#E8EDF5",
          100: "#C5D0E6",
          200: "#9FB0D4",
          300: "#7990C2",
          400: "#5370B0",
          500: "#0A2540", // Main navy
          600: "#091F36",
          700: "#07192C",
          800: "#051322",
          900: "#030C18",
        },
        // Background - Slate/Dark
        slate: {
          750: "#1E293B", // Card background
          850: "#0F172A", // Main background
          950: "#020617", // Deepest dark
        },
        // Status Colors
        success: {
          400: "#4ADE80",
          500: "#10B981",
          600: "#059669",
        },
        danger: {
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
        },
        warning: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-dark":
          "linear-gradient(to bottom, #0F172A, #020617)",
        "gradient-gold":
          "linear-gradient(135deg, #FFD700 0%, #B89800 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.8) 100%)",
      },
      boxShadow: {
        "gold-glow": "0 0 20px rgba(255, 215, 0, 0.3)",
        "gold-glow-lg": "0 0 40px rgba(255, 215, 0, 0.4)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.36)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "fade-up": "fadeUp 0.4s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-gold": "pulseGold 2s infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 215, 0, 0.5)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
