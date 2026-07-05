/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f0ff',
          100: '#e9e3ff',
          200: '#d6ccff',
          300: '#b8a4ff',
          400: '#9b78ff',
          500: '#7c4dff',
          600: '#6b3fe6',
          700: '#5a32c4',
          800: '#4a2aa0',
          900: '#3d2580',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 8px 24px -4px rgb(124 77 255 / 0.18)',
      },
    },
  },
  plugins: [],
}
