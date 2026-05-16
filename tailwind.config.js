/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#111',
            a: {
              color: '#111',
              textDecoration: 'underline',
              textDecorationColor: '#d4d4d4',
              '&:hover': {
                textDecorationColor: '#111',
              },
            },
            blockquote: {
              borderLeftColor: '#111',
              fontStyle: 'normal',
              fontWeight: '300',
              quotes: 'none',
            },
            code: {
              backgroundColor: '#f5f5f5',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
          },
        },
      },
    },
  },
  plugins: [],
}


