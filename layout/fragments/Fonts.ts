
/*
 * Fragmento: FONTES (SINGLE SOURCE OF TRUTH)
 * Definições de tipografia do sistema.
 * 
 * Estas definições são injetadas como variáveis CSS pelo App.tsx.
 */

export const TYPOGRAPHY = {
  // A URL que será injetada no <head> dinamicamente
  cdnUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&family=Rajdhani:wght@500;600;700;800&display=swap",
  
  fontFamily: {
    // As strings devem incluir o fallback (sans-serif, monospace)
    sans: '"Inter", sans-serif',
    display: '"Rajdhani", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  weights: {
    regular: '400',
    medium: '500',
    bold: '700',
    black: '900',
  }
};
