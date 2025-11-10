/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        foreground: '#f8fafc',
        accent: {
          DEFAULT: '#38bdf8',
          muted: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
