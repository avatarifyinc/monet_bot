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
        'bg': '#FFFFFF',
        'error': '#CE372D',
        'oslo': '#1C1C1D',
      },
      'dark': {
        'accent': '#F6F8F9',
        'bg': '#1C1C1D',
        'error': '#D65F58',
        'oslo': '#FFFFFF',
      },
    })
 ],
}

