/** @type {import('tailwindcss').Config} */

import { createThemes } from 'tw-colors'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  plugins: [
    createThemes({
      'light': {
        'accent': '#007AFF',
        'bg': '#FFF',
        'error': '#CE372D',
      },
      'dark': {
        'accent': '#F6F8F9',
        'bg': '#1C1C1D',
        'error': '#D65F58',
      },
    })
 ],
}

