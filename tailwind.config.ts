import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      colors: {
        // Base Theme Colors
        background: "hsl(var(--dg-background))",
        foreground: "hsl(var(--dg-foreground))",
        card: {
          DEFAULT: "hsl(var(--dg-card))",
          foreground: "hsl(var(--dg-card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--dg-primary))",
          foreground: "hsl(var(--dg-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--dg-secondary))",
          foreground: "hsl(var(--dg-secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--dg-muted))",
          foreground: "hsl(var(--dg-muted-foreground))",
        },
        border: "hsl(var(--dg-border))",
        input: "hsl(var(--dg-input))",
        destructive: {
          DEFAULT: "hsl(var(--dg-destructive))",
          foreground: "hsl(var(--dg-destructive-foreground))",
        },

        // Additional Theme Colors
        accent: {
          DEFAULT: "hsl(var(--dg-accent))",
          foreground: "hsl(var(--dg-accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--dg-popover))",
          foreground: "hsl(var(--dg-popover-foreground))",
        },
        ring: "hsl(var(--dg-ring))",

        // Brand Colors
        tactical: {
          light: "hsl(var(--dg-tactical-light))",
          DEFAULT: "hsl(var(--dg-tactical))",
          dark: "hsl(var(--dg-tactical-dark))",
        },
        sand: {
          light: "hsl(var(--dg-sand-light))",
          DEFAULT: "hsl(var(--dg-sand))",
          dark: "hsl(var(--dg-sand-dark))",
        },
        olive: {
          light: "hsl(var(--dg-olive-light))",
          DEFAULT: "hsl(var(--dg-olive))",
          dark: "hsl(var(--dg-olive-dark))",
        },

        // Utility Colors
        success: {
          DEFAULT: "hsl(var(--dg-success))",
          foreground: "hsl(var(--dg-success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--dg-warning))",
          foreground: "hsl(var(--dg-warning-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--dg-error))",
          foreground: "hsl(var(--dg-error-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--dg-info))",
          foreground: "hsl(var(--dg-info-foreground))",
        },

        // Neutral Shades
        neutral: {
          50: "hsl(var(--dg-neutral-50))",
          100: "hsl(var(--dg-neutral-100))",
          200: "hsl(var(--dg-neutral-200))",
          300: "hsl(var(--dg-neutral-300))",
          400: "hsl(var(--dg-neutral-400))",
          500: "hsl(var(--dg-neutral-500))",
          600: "hsl(var(--dg-neutral-600))",
          700: "hsl(var(--dg-neutral-700))",
          800: "hsl(var(--dg-neutral-800))",
          900: "hsl(var(--dg-neutral-900))",
          950: "hsl(var(--dg-neutral-950))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--dg-sidebar-background))",
          foreground: "hsl(var(--dg-sidebar-foreground))",
          primary: "hsl(var(--dg-sidebar-primary))",
          'primary-foreground': "hsl(var(--dg-sidebar-primary-foreground))",
          accent: "hsl(var(--dg-sidebar-accent))",
          'accent-foreground': "hsl(var(--dg-sidebar-accent-foreground))",
          border: "hsl(var(--dg-sidebar-border))",
          ring: "hsl(var(--dg-sidebar-ring))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        cardPop: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.5s ease-out',
        slideRight: 'slideRight 0.5s ease-out',
        cardPop: 'cardPop 0.4s ease-out',
      },
      boxShadow: {
        'card': '0 2px 4px 0 hsl(var(--dg-card-shadow)), 0 1px 2px -1px hsl(var(--dg-card-shadow))',
        'card-hover': '0 8px 12px -2px hsl(var(--dg-card-shadow)), 0 4px 6px -3px hsl(var(--dg-card-shadow))',
        'card-lg': '0 12px 20px -4px hsl(var(--dg-card-shadow)), 0 6px 8px -5px hsl(var(--dg-card-shadow))',
        'section': '0 4px 6px -1px hsl(var(--dg-card-shadow)), 0 2px 4px -2px hsl(var(--dg-card-shadow))',
        'section-hover': '0 10px 15px -3px hsl(var(--dg-card-shadow)), 0 4px 6px -4px hsl(var(--dg-card-shadow))',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
