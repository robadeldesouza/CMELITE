import React, { useState, useEffect } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCore } from '../core/CoreContext';
import { formatCurrency } from '../data/pricing';

interface StickyCTAProps {
  onOpenCheckout: () => void;
  product?: Product;
}

export const StickyCTA: React.FC<StickyCTAProps> = ({ onOpenCheckout, product }) => {
  const { content, features, config } = useCore();
  const [isVisible, setIsVisible] = useState(false);

  // Busca o plano anual para exibir no Sticky
  const annualPlan = content.plans?.find(p => p.type === 'annual') || content.plans?.[0];
  
  if (!annualPlan) return null;

  // Lógica de precificação dinâmica sincronizada
  const isPromoActive = features.nemesisCampaignActive || config.pricingMode === 'LayoutPROMO';
  
  // Define o preço original (base para o cálculo da %)
  const currentFrom = annualPlan.priceFrom || (annualPlan.priceTo * 1.5);
  
  // Define o preço final atual
  let currentTo = annualPlan.priceTo;
  if (isPromoActive) {
      currentTo = Number((annualPlan.priceTo * 0.5).toFixed(2));
  }

  // CÁLCULO AUTOMÁTICO REAL: (1 - (Preço Atual / Preço Original)) * 100
  // Para 299 -> 100, resulta em 66.55, arredondado para 67
  const discountPercent = Math.round((1 - (currentTo / currentFrom)) * 100);
  const toPriceFormatted = currentTo.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const currentScroll = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const isPastHero = currentScroll > 600;
      const isNearBottom = (currentScroll + windowHeight) >= (docHeight - 150);
      setIsVisible(isPastHero && !isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-20 z-[45] md:hidden animate-slide-up-fade h-14">
      <div 
        className="relative h-full bg-surface border border-brand-500/40 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex items-center justify-between gap-3 ring-1 ring-white/5 overflow-visible group pr-1 pl-3 cursor-pointer" 
        onClick={onOpenCheckout}
      >
        
        {/* Badge de Porcentagem (Cálculo Automático) */}
        <div className="absolute -top-2.5 right-6 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full z-10 font-mono pointer-events-none shadow-lg border border-white/20 whitespace-nowrap animate-bounce-slow">
            -{discountPercent}% OFF
        </div>

        <div className="flex flex-col justify-center leading-none">
            {/* Preço Riscado: Aumentada visibilidade para text-slate-300 */}
            <span className="text-[9px] text-slate-300 font-mono flex items-center gap-1 line-through decoration-red-500 decoration-1 mb-0.5 whitespace-nowrap">
                {formatCurrency(currentFrom)}
            </span>
            <div className="flex items-baseline gap-1">
                <span className="text-primary font-display font-bold text-xl drop-shadow-sm">R$ {toPriceFormatted.split(',')[0]}</span>
                <span className="text-[10px] text-brand-400 font-bold">,{toPriceFormatted.split(',')[1]}</span>
            </div>
        </div>

        <button 
            className="h-10 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-display font-black px-4 rounded-xl shadow-neon transition-all active:scale-95 flex items-center justify-center gap-1 text-xs uppercase tracking-widest whitespace-nowrap border border-white/10"
        >
            RESGATAR
            <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};