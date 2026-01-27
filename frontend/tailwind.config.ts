import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Warna utama GoldGuard
                gold: {
                    50: "#FFFDF5",
                    100: "#FFF9E5",
                    200: "#FFF0BF",
                    300: "#FFE799",
                    400: "#FFDE73",
                    500: "#FFD700", // Primary Gold
                    600: "#E6C200",
                    700: "#B39700",
                    800: "#806C00",
                    900: "#4D4100",
                },
                // Background dark theme
                dark: {
                    50: "#f8fafc",
                    100: "#f1f5f9",
                    200: "#e2e8f0",
                    300: "#cbd5e1",
                    400: "#94a3b8",
                    500: "#64748b",
                    600: "#475569",
                    700: "#334155",
                    800: "#1e293b",
                    900: "#0f172a", // Primary Background
                    950: "#020617",
                },
                // Accent colors
                success: {
                    DEFAULT: "#10B981",
                    light: "#34D399",
                    dark: "#059669",
                },
                danger: {
                    DEFAULT: "#EF4444",
                    light: "#F87171",
                    dark: "#DC2626",
                },
                // Base blue
                base: {
                    DEFAULT: "#0052FF",
                    light: "#3B7FFF",
                    dark: "#0041CC",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "Fira Code", "monospace"],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "fade-up": "fadeUp 0.5s ease-out",
                "slide-up": "slideUp 0.3s ease-out",
                "slide-down": "slideDown 0.3s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                shimmer: "shimmer 2s linear infinite",
                "spin-slow": "spin 3s linear infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
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
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-gold":
                    "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
                "gradient-dark":
                    "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
                shimmer:
                    "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.1) 50%, transparent 100%)",
            },
            boxShadow: {
                gold: "0 4px 20px rgba(255, 215, 0, 0.3)",
                "gold-lg": "0 10px 40px rgba(255, 215, 0, 0.4)",
                glow: "0 0 20px rgba(255, 215, 0, 0.5)",
            },
            borderRadius: {
                "4xl": "2rem",
            },
        },
    },
    plugins: [],
};

export default config;
