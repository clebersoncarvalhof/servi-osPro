/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(224 71.4% 4.1%)",
        foreground: "hsl(210 20% 98%)",
        card: "hsl(224 71.4% 4.1%)",
        "card-foreground": "hsl(210 20% 98%)",
        popover: "hsl(224 71.4% 4.1%)",
        "popover-foreground": "hsl(210 20% 98%)",
        primary: "hsl(263.4 70% 50.4%)",
        "primary-foreground": "hsl(210 20% 98%)",
        secondary: "hsl(215 27.9% 16.9%)",
        "secondary-foreground": "hsl(210 20% 98%)",
        muted: "hsl(215 27.9% 16.9%)",
        "muted-foreground": "hsl(217.9 10.6% 64.9%)",
        accent: "hsl(215 27.9% 16.9%)",
        "accent-foreground": "hsl(210 20% 98%)",
        destructive: "hsl(0 62.8% 30.6%)",
        "destructive-foreground": "hsl(210 20% 98%)",
        border: "hsl(215 27.9% 16.9%)",
        input: "hsl(215 27.9% 16.9%)",
        ring: "hsl(263.4 70% 50.4%)",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "calc(0.75rem - 2px)",
        sm: "calc(0.75rem - 4px)",
      }
    },
  },
  plugins: [],
}
