import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  darkMode: ["class", '[data-theme="dark"]'],
  
  theme: {
    extend: {
      gap: {
        "gridGap": "clamp(1.25rem, -0.582rem + 3.45vw, 2.5rem)",
      },

      padding: {
        "paddingGrid": "clamp(0.625rem, -1.665rem + 4.31vw, 2.188rem)",
      },

      backgroundColor: {
        "task": "rgba(26, 26, 26, 0.6)",
        "task-l": "rgba(219, 218, 218, 0.8)",
      },

      fontSize: {
        "titleGrid": "clamp(1.563rem, 0.921rem + 1.21vw, 2rem)",
        "textGrid": "clamp(1rem, 0.634rem + 0.69vw, 1.25rem)",
        "titleMain": "clamp(2.5rem, 1.779rem + 3.6vw, 5rem)",
        "textMain": "clamp(1.25rem, 1.07rem + 0.9vw, 1.875rem)"
      },

      lineHeight: {
        "lineGrid": "clamp(1.625rem, 0.343rem + 2.41vw, 2.5rem)",
      },
      
      margin: {
        "topGrid": "clamp(0.438rem, -0.753rem + 2.24vw, 1.25rem)",
        "bottomMainGrid": "clamp(6.25rem, 5.115rem + 5.68vw, 10.188rem)"
      },

      height: {
        "mobileGrid": "clamp(15.625rem, 11.851rem + 18.87vw, 21.875rem)"
      }
    },
  },
  plugins: [],
};
export default config;
