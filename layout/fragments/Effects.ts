
/*
 * Fragmento: EFEITOS
 * Sombras (Glow), Animações e Keyframes.
 * Nota: As sombras dependem da variável CSS --brand-rgb (definida em Colors.ts) para cor dinâmica.
 */

export const EFFECTS = {
  boxShadow: {
    'neon': '0 0 10px rgba(var(--brand-rgb), 0.3), 0 0 20px rgba(var(--brand-rgb), 0.1)',
    'neon-strong': '0 0 15px rgba(var(--brand-rgb), 0.5), 0 0 30px rgba(var(--brand-rgb), 0.2)',
    'neon-red': '0 0 10px rgba(239, 68, 68, 0.4), 0 0 20px rgba(239, 68, 68, 0.2)',
    'metallic': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  // As animações abaixo devem ter correspondência no arquivo LayoutPRINCIPAL.css
  animation: {
    'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'float': 'float 3s ease-in-out infinite',
    'slide-up-fade-slow': 'slideUpFade 2s ease-out forwards',
    'blink-urgency': 'blinkColors 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'shine': 'shine 3s linear infinite',
  }
};
