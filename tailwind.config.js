/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#E68744',
        secondary: '#FBAE1D',
        accent: '#F59E0B',
        background: '#F9FAFB',
        'chat-user': '#F8E2D0',
        'chat-bot': '#F3F4F6'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        crimson: ['"Crimson Text"', 'serif']
      }
    }
  },
  plugins: []
}