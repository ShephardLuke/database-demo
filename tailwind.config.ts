// website-shared v1.1

import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'link': '#0000EE',
        'dark-blue':'#0d203b',
        'light-blue':'#1a3e74',
        'darkest-blue':'#0a182b',
        'lightest-blue': '#3b82f6',
      },
    },
  },
  plugins: [],
} satisfies Config;
