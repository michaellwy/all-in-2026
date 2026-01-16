/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        host: {
          friedberg: '#3B82F6',
          chamath: '#10B981',
          sacks: '#F59E0B',
          jason: '#EF4444',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
