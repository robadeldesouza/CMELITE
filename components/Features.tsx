
import React, { useState } from 'react';
import { Shield, Zap, Lock, Headphones, RefreshCw, TrendingUp, Users, PiggyBank, Smartphone, Plus, ArrowRight, Star, ThumbsUp, AlertCircle, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { useCore } from '../core/CoreContext';

interface FeaturesProps {
    onOpenDetails?: () => void;
    staticMode?: boolean;
}

const ICON_MAP: Record<string, any> = {
    Shield, Zap, Lock, Headphones, RefreshCw, TrendingUp, Users, PiggyBank, Smartphone
};

export const Features: React.FC<FeaturesProps> = ({ onOpenDetails, staticMode = false }) => {
  const { content } = useCore();
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  
  // Hidratação dos ícones
  const features = content.features.map(f => ({
      ...f,
      icon: ICON_MAP[f.iconName] || Zap
  }));

  // Mostra os primeiros 4 ou todos
  const visibleFeatures = showAllFeatures ? features : features.slice(0, 4);

  return (
    <section id="features" className="py-20 md:py-24 bg-page relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-primary mb-4 uppercase tracking-tighter">VOCÊ MANDA!</h2>
          <p className="text-secondary max-w-3xl mx-auto text-xl md:text-2xl font-light tracking-wide">
            O jogo obedece.
          </p>
        </div>

        <div className="space-y-12">
            
            {/* CONTAINER COM COLAPSO */}
            <div className="relative">
                {/* 1. GRID DE BENEFÍCIOS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {visibleFeatures.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="group relative bg-surface/40 border border-border-dim/60 p-6 rounded-2xl hover:border-brand-500/50 hover:bg-surface-highlight/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden flex flex-col h-full animate-fade-in"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-surface-highlight rounded-xl flex items-center justify-center text-secondary group-hover:text-brand-400 group-hover:bg-brand-950 transition-colors shadow-inner border border-border-highlight/50 group-hover:border-brand-500/20">
                                {React.createElement(feature.icon, { className: "w-6 h-6" })}
                            </div>
                        </div>

                        <h3 className="text-base md:text-lg font-bold text-primary mb-3 group-hover:text-brand-400 transition-colors leading-tight">
                            {feature.title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted leading-relaxed group-hover:text-secondary transition-colors">
                            {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fade Out Effect */}
                {!showAllFeatures && (
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-page to-transparent pointer-events-none z-10"></div>
                )}
            </div>

            {/* BOTÃO PARA EXPANDIR/COLAPSAR */}
            <div className="text-center relative z-20">
                <button 
                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                    className="inline-flex items-center gap-2 text-secondary hover:text-white bg-surface/80 hover:bg-surface-highlight border border-border-highlight rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all mb-8 whitespace-nowrap"
                >
                    {showAllFeatures ? (
                        <>Menos Detalhes <ChevronUp className="w-3 h-3" /></>
                    ) : (
                        <>Ver todas as vantagens <ChevronDown className="w-3 h-3" /></>
                    )}
                </button>
            </div>
        </div>

      </div>
    </section>
  );
};
