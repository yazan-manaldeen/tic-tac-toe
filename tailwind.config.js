module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: 'rgb(var(--app-color-default) / <alpha-value>)',
          50: 'rgb(var(--app-color-50) / <alpha-value>)',
          100: 'rgb(var(--app-color-100) / <alpha-value>)',
          200: 'rgb(var(--app-color-200) / <alpha-value>)',
          300: 'rgb(var(--app-color-300) / <alpha-value>)',
          400: 'rgb(var(--app-color-400) / <alpha-value>)',
          500: 'rgb(var(--app-color-500) / <alpha-value>)',
          600: 'rgb(var(--app-color-600) / <alpha-value>)',
          700: 'rgb(var(--app-color-700) / <alpha-value>)',
          800: 'rgb(var(--app-color-800) / <alpha-value>)',
          900: 'rgb(var(--app-color-900) / <alpha-value>)',
          950: 'rgb(var(--app-color-950) / <alpha-value>)',
        }
      }
    }
  },
  plugins: [],
}
