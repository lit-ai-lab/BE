/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    extend: {
      fontFamily: {
        nexon: ['Noto Sans Korean', 'sans-serif'], // 유틸리티용 커스텀 키
        sans: ['Noto Sans Korean', 'sans-serif'], // Tailwind 기본 sans 대체
      }
    },
  },
  plugins: [],
}

