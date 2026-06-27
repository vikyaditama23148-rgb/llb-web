/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        terminal: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        vt323: ['VT323', 'monospace'],
      },
      colors: {
        green: '#00ff41',
        'red-blood': '#ff0040',
      },
    },
  },
  plugins: [],
}
