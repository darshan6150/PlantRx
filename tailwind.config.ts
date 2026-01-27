/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: [
    './client/index.html',
    './client/src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      /* --------------------
         BORDER RADIUS
      -------------------- */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '12px',
        '4xl': '2rem',
      },

      /* --------------------
         COLORS (CSS VAR SAFE)
      -------------------- */
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',

        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',

        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',

        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',

        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',

        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',

        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',

        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        /* Brand helpers */
        gold: '#d4af37',
        cream: '#fffeef',
        green: '#059669',
        'light-orange': '#eab308',
      },

      /* --------------------
         FONTS
      -------------------- */
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
        playfair: ['Playfair Display', 'serif'],
      },

      /* --------------------
         LETTER SPACING
      -------------------- */
      letterSpacing: {
        luxury: '0.03em',
      },

      /* --------------------
         Z-INDEX FIXES
      -------------------- */
      zIndex: {
        max: '999999',
      },

      /* --------------------
         ANIMATIONS
      -------------------- */
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
