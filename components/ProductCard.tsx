
import React from 'react';
import { Product } from '../types';
import { Check, Lock, ChevronRight, Sparkles } from 'lucide-react';
import { useCore } from '../core/CoreContext';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  isFeatured?: boolean;
}

// Helper para renderizar texto rico (Ouro)
const RichTextRenderer = ({ text }: { text: string }) => {
    if (!text.includes('{{GOLD}}')) return <>{text}</>;
    
    const parts = text.split(/({{GOLD}}|{{\/GOLD}})/g);
    
    return (
        <>
            {parts.map((part, i) => {
                if (part === '{{GOLD}}' || part === '{{/GOLD}}') return null;
                const prev = parts[i-1];
                if (prev === '{{GOLD}}') {
                    return (
                        <span key={i} className="text-transparent bg-clip-text bg-gradient-to-b from-brand-300 via-brand-500 to-brand-600 font-black drop-shadow-sm uppercase tracking-wide">
                            {part}
                        </span>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
};

// Card Principal (Grande)
export const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy, isFeatured }) => {
  const Icon = product.icon;
  const { config } = useCore();

  return (
    <div className={`group relative bg-surface/80 backdrop-blur-xl rounded-3xl p-8 transition-all duration-300 flex flex-col break-inside-avoid mb-6 
      ${isFeatured 
        ? 'border-2 border-brand-500/50 shadow-neon scale-[1.02] z-10' 
        : 'border border-border-dim hover:border-brand-500/30 hover:bg-surface'
      }`}>
      
      {/* Badge de Promoção/Tag Extra */}
      {product.badge && !isFeatured && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-brand-600 to-brand-400 rounded-full text-xs font-bold text-white shadow-lg z-10 whitespace-nowrap">
          {product.badge}
        </div>
      )}

      {isFeatured && (
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600 text-white text-xs font-display font-bold tracking-[0.2em] uppercase rounded-full shadow-neon whitespace-nowrap">
            Recomendado pela Elite
         </div>
      )}

      <div className={`mb-6 flex items-center gap-4 mt-2 ${isFeatured ? 'justify-center' : ''}`}>
        {/* Ícone */}
        <div className={`p-4 rounded-2xl shrink-0 transition-colors ${isFeatured ? 'bg-brand-500 text-white shadow-neon' : 'bg-surface-highlight text-secondary group-hover:bg-brand-900/50 group-hover:text-brand-400'}`}>
          <Icon className="w-8 h-8" />
        </div>

        {/* Área de Badges - Flex Column sem itens-start para permitir stretch, e sem flex-1 para largura intrínseca */}
        <div className="flex flex-col gap-1.5 pt-0.5">
          {isFeatured && (
            <div className="flex items-center justify-center gap-1.5 text-brand-400 font-bold uppercase tracking-widest text-xs animate-pulse-fast font-display whitespace-nowrap mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Destaque da Comunidade</span>
            </div>
          )}
          
          <span className="flex items-center justify-center gap-2 text-[10px] font-mono text-secondary bg-surface-highlight/50 border border-border-highlight/50 px-4 py-1.5 rounded-lg uppercase tracking-wider whitespace-nowrap w-full">
            <Lock className="w-3 h-3" />
            INCLUSO NO PACOTE
          </span>
        </div>
      </div>

      <h3 className={`text-2xl font-display font-bold text-primary mb-3 uppercase tracking-wide group-hover:text-brand-400 transition-colors ${isFeatured ? 'text-center' : ''}`}>{product.name}</h3>
      <p className={`text-secondary text-sm mb-8 leading-relaxed ${isFeatured ? 'text-center' : ''}`}>
        <RichTextRenderer text={product.description} />
      </p>

      <div className="space-y-4 mb-8">
        {product.benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className={`mt-0.5 p-0.5 rounded-full ${isFeatured ? 'bg-brand-500/20 text-brand-400' : 'bg-surface-highlight text-muted'}`}>
               <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-secondary text-sm font-medium">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="relative">
        {isFeatured && (
            <div className="absolute -top-3 -right-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-lg z-20 animate-pulse border border-white/20 transform rotate-2 whitespace-nowrap">
                Últimas Vagas
            </div>
        )}
        <button
            onClick={() => onBuy(product)}
            className={`w-full py-4 px-6 font-display font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wide relative overflow-hidden whitespace-nowrap
            ${isFeatured 
                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-neon hover:shadow-neon-strong' 
                : 'bg-surface-highlight hover:bg-brand-600 text-white border border-border-highlight hover:border-brand-500 shadow-sm'
            }`}
        >
            ATIVAR NO PAINEL
        </button>
        <p className="text-center text-[10px] text-muted mt-3 font-mono tracking-wide">
            Ferramentas governadas pelo <span className="text-brand-400 font-bold">Core v{config.version}</span>.
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border-dim/50">
        <div className="flex justify-between text-xs text-muted mb-2 font-mono uppercase">
          <span className="whitespace-nowrap">Popularidade</span>
          <span className={`whitespace-nowrap ${isFeatured ? 'text-brand-400' : ''}`}>Alta Demanda</span>
        </div>
        <div className="w-full bg-surface-highlight rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full ${isFeatured ? 'bg-gradient-to-r from-brand-600 to-brand-300 animate-shine bg-[length:200%_auto]' : 'bg-brand-500'}`}
            style={{ width: `${Math.min(100, product.popularity + 10)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Grid Card Compacto (Vertical)
export const GridProductCard: React.FC<ProductCardProps> = ({ product, onBuy }) => {
  const Icon = product.icon;

  return (
    <div 
      onClick={() => onBuy(product)}
      className="group relative flex flex-col h-full bg-surface/40 border border-border-dim/60 hover:border-brand-500/50 hover:bg-surface-highlight/60 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-surface-highlight rounded-xl text-secondary group-hover:text-brand-400 group-hover:bg-brand-950 transition-colors shadow-inner">
          <Icon className="w-5 h-5" />
        </div>
        {product.badge && (
          <span className="text-[9px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 px-1.5 py-0.5 rounded-md uppercase tracking-wide font-mono whitespace-nowrap">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex-1 relative z-10">
        <h4 className="font-display font-bold text-primary text-base mb-2 leading-tight group-hover:text-brand-400 transition-colors uppercase">
          {product.name}
        </h4>
        <p className="text-[11px] leading-relaxed text-muted line-clamp-3">
           <RichTextRenderer text={product.description} />
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-border-dim/50 flex items-center justify-center relative z-10">
        <span className="text-[10px] font-bold text-brand-400 group-hover:text-brand-300 transition-colors font-mono uppercase tracking-widest flex items-center gap-1 whitespace-nowrap">
          ATIVAR <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
