/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Design system grounded in the community-fridge / harvest-crate
        // world this product actually lives in, not a generic palette.
        forest: {
          DEFAULT: "#14301F", // deep canopy green - dark surfaces, nav, footer
          50: "#E8EFE9",
          100: "#C7D9CB",
          400: "#3B7A57",
          600: "#1F4A30",
          900: "#0D1E14",
        },
        leaf: {
          DEFAULT: "#3B7A57", // primary brand green - buttons, links, active states
          light: "#5B9E76",
          dark: "#2A5C40",
        },
        marigold: {
          DEFAULT: "#E8A33D", // harvest gold - donor energy, highlights, CTAs
          light: "#F2C777",
          dark: "#C6841F",
        },
        tomato: {
          DEFAULT: "#C0463A", // requester/urgency energy - expiry, alerts
          light: "#DB6E62",
          dark: "#98342A",
        },
        paper: "#FBF6EC", // crate-label cream - card surfaces, never full-page bg
        ink: "#24211C", // primary text
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        stamp: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        stamp: "0 1px 0 rgba(36,33,28,0.25), 0 4px 10px rgba(20,48,31,0.12)",
        card: "0 2px 6px rgba(20,48,31,0.08), 0 8px 24px rgba(20,48,31,0.06)",
      },
      backgroundImage: {
        grain: "radial-gradient(circle, rgba(36,33,28,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        grain: "4px 4px",
      },
    },
  },
  plugins: [],
}
