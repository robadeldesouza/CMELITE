
import { useEffect, useState } from 'react';

type PerformanceTier = 'low' | 'high';

interface NetworkInformation extends EventTarget {
  saveData: boolean;
  effectiveType: string;
}

declare global {
  interface Navigator {
    deviceMemory?: number;
    connection?: NetworkInformation;
  }
}

/**
 * Lógica de Classificação de Hardware
 * REVISÃO: Lite Mode (low) agora é o padrão de fábrica.
 */
const getHardwareTier = (): PerformanceTier => {
  return 'low'; 
};

export const usePerformanceMonitoring = () => {
  const [tier, setTier] = useState<PerformanceTier>('low');

  useEffect(() => {
    // Força o atributo de performance no HTML como 'low' por padrão
    const initialTier = getHardwareTier();
    setTier(initialTier);
    document.documentElement.setAttribute('data-perf', initialTier);

    // Listener para acessibilidade (respeita a preferência do SO se o usuário mudar)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      const nextTier = e.matches ? 'low' : 'high';
      setTier(nextTier);
      document.documentElement.setAttribute('data-perf', nextTier);
    };

    if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', handleMotionChange);
    } else {
        motionQuery.addListener(handleMotionChange);
    }

    console.log(`[Audit] System initialized in LITE MODE (Optimized Performance)`);

    return () => {
        if (motionQuery.removeEventListener) {
            motionQuery.removeEventListener('change', handleMotionChange);
        } else {
            motionQuery.removeListener(handleMotionChange);
        }
    };
  }, []);

  return tier;
};
