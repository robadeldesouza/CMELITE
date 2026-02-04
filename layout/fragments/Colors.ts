
/*
 * Fragmento: CORES (SINGLE SOURCE OF TRUTH)
 * AVISO: NÃO adicione cores hardcoded nos componentes. Use var(--brand-*).
 */

// Paleta Ouro/Bronze (Padrão Oficial - LayoutPRINCIPAL)
export const GOLD_PALETTE = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b', // OURO PRINCIPAL
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
  950: '#451a03',
};

// Paleta Cyberpunk (Neon Blue/Pink)
export const CYBER_PALETTE = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9', // AZUL NEON
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49',
};

// Paleta Matrix (Hacker Green)
export const MATRIX_PALETTE = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e', // VERDE TERMINAL
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  950: '#052e16',
};

// Definições RGB para opacidade nas sombras (Tailwind)
export const BRAND_RGB = {
  gold: '245, 158, 11',    // Yellow-500
  cyber: '14, 165, 233',   // Sky-500
  matrix: '34, 197, 94',   // Green-500
};

// CAMADA SEMÂNTICA (O Segredo da Modularidade Total)
// Isso permite trocar de "Dark Mode Slate" para "Dark Mode Zinc" ou "Light Mode" apenas mudando aqui.
export const SEMANTIC_PALETTE = {
    // Fundos
    'bg-page': '#020617',     // slate-950
    'bg-surface': '#0f172a',  // slate-900
    'bg-surface-highlight': '#1e293b', // slate-800
    
    // Bordas
    'border-dim': '#1e293b',  // slate-800
    'border-highlight': '#334155', // slate-700

    // Textos
    'text-primary': '#f1f5f9', // slate-100
    'text-secondary': '#94a3b8', // slate-400
    'text-muted': '#64748b',   // slate-500

    // Status (Abstração do Red/Emerald/Blue)
    'status-error': '#ef4444', // red-500
    'status-success': '#10b981', // emerald-500
    'status-info': '#3b82f6', // blue-500
};

export const COLOR_PALETTE = {
  brand: GOLD_PALETTE,
  cyber: CYBER_PALETTE,
  matrix: MATRIX_PALETTE,
};
