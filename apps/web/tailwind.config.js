/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#FBF8F3',
          200: '#F5EFEB',
          300: '#ECE3D8',
          400: '#DFD3C4',
          500: '#CFC0AE',
        },
        forest: {
          50: '#EDF4F0',
          100: '#D5E5DC',
          200: '#ACC8B9',
          600: '#2A5541',
          700: '#214434',
          800: '#1A382B',
          900: '#12261D',
          950: '#0B1711',
        },
        terracotta: {
          50: '#FAF0EB',
          100: '#F5DDD3',
          200: '#EBBBAA',
          500: '#C85A32',
          600: '#B64E28',
          700: '#993E1D',
        },
        mango: {
          50: '#FCF7EC',
          100: '#F7ECCF',
          200: '#EFD59D',
          500: '#EAA838',
          600: '#D49226',
        },
        sage: {
          50: '#EEF5F4',
          100: '#D8E8E6',
          500: '#3D7871',
          600: '#32625C',
        },
        charcoal: {
          50: '#F3F4F4',
          100: '#E1E4E2',
          300: '#9BA39E',
          500: '#585E5A',
          700: '#2C312E',
          900: '#181B19',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -2px rgba(24, 27, 25, 0.06), 0 2px 8px -2px rgba(24, 27, 25, 0.04)',
        hover: '0 12px 32px -4px rgba(24, 27, 25, 0.12), 0 4px 12px -2px rgba(24, 27, 25, 0.06)',
        editorial: '0 20px 40px -8px rgba(18, 38, 29, 0.15)',
      },
    },
  },
  plugins: [],
};
