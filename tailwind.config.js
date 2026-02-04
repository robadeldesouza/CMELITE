
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        // --- CAMADA SEMÂNTICA ---
        page: 'var(--bg-page)',
        surface: 'var(--bg-surface)',
        'surface-highlight': 'var(--bg-surface-highlight)',
        
        'border-dim': 'var(--border-dim)',
        'border-highlight': 'var(--border-highlight)',

        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',

        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
          950: 'var(--brand-950)',
        },
        emerald: {
          500: 'var(--status-success)', 
          600: '#059669',
        }
      },
      boxShadow: {
        'neon': 'var(--effect-shadow-neon)',
        'neon-strong': 'var(--effect-shadow-neon-strong)',
        'neon-red': 'var(--effect-shadow-neon-red)',
        'metallic': 'var(--effect-shadow-metallic)',
      },
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant('perf-low', 'html[data-perf="low"] &');
      addVariant('perf-high', 'html[data-perf="high"] &');
    }
  ]
}
