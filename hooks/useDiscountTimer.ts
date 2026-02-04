
import { useState, useEffect } from 'react';

const TIMER_STORAGE_KEY = 'cm_elite_discount_timer_v1';
const PROMO_DURATION = 5 * 60 * 60; // 5 Horas (Contagem Regressiva)
const GRACE_PERIOD = 1 * 60 * 60;  // 1 Hora (Zerado mas Ativo)
const TOTAL_CYCLE = PROMO_DURATION + GRACE_PERIOD; // 6 Horas total

export const useDiscountTimer = () => {
  const [timeLeft, setTimeLeft] = useState(PROMO_DURATION);
  const [isExpired, setIsExpired] = useState(false);
  const [status, setStatus] = useState<'counting' | 'zeroed' | 'expired'>('counting');

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    let startTime = parseInt(localStorage.getItem(TIMER_STORAGE_KEY) || '0');

    if (!startTime) {
        startTime = now;
        localStorage.setItem(TIMER_STORAGE_KEY, startTime.toString());
    }

    const calculateTime = () => {
        const currentNow = Math.floor(Date.now() / 1000);
        const elapsed = currentNow - startTime;
        
        if (elapsed >= TOTAL_CYCLE) {
            // Ciclo completo de 6 horas: Expira tudo
            setTimeLeft(0);
            setIsExpired(true);
            setStatus('expired');
        } else if (elapsed >= PROMO_DURATION) {
            // Entre 5h e 6h: Relógio fica em 00:00:00 mas ainda NÃO expirou
            setTimeLeft(0);
            setIsExpired(false);
            setStatus('zeroed');
        } else {
            // Primeiras 5 horas: Contagem regressiva normal
            setTimeLeft(PROMO_DURATION - elapsed);
            setIsExpired(false);
            setStatus('counting');
        }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return { timeLeft, formatTime, isExpired, status };
};
