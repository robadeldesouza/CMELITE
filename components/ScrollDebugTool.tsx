import React, { useState, useEffect } from 'react';
import { Ruler, ChevronDown, RotateCcw, Target, MousePointerClick } from 'lucide-react';

interface ScrollDebugToolProps {
  currentOffset: number;
  onOffsetChange: (val: number) => void;
  onTestScroll: (id: string) => void;
}

export const ScrollDebugTool: React.FC<ScrollDebugToolProps> = ({ 
  currentOffset, 
  onOffsetChange,
  onTestScroll
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Estado para o "Modo Inteligente"
  const [targetSection, setTargetSection] = useState('products');
  const [detectedOffset, setDetectedOffset] = useState(0);

  // Função que calcula o offset baseado no visual
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Lógica do Modo Inteligente
      const el = document.getElementById(targetSection);
      if (el) {
        const rect = el.getBoundingClientRect();
        // rect.top é a distância exata do elemento até o topo da tela VISÍVEL.
        // Se o usuário rolou até onde ele acha bonito, esse valor É o offset ideal.
        setDetectedOffset(Math.round(rect.top));
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Chama uma vez para iniciar
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetSection]); // Recalcula se mudar a seção alvo

  const handleApplyDetected = () => {
    onOffsetChange(detectedOffset);
  };

  if (!isExpanded) {
    return (
      <button 
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 left-4 z-[9999] bg-brand-600 text-white p-3 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform animate-bounce"
        title="Abrir Calibrador"
      >
        <Ruler className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] w-80 bg-slate-950/95 backdrop-blur border-2 border-brand-500 rounded-xl shadow-2xl overflow-hidden font-sans text-xs">
      {/* Header */}
      <div className="bg-brand-600 text-white p-3 flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(false)}>
        <div className="flex items-center gap-2 font-bold text-sm">
          <Target className="w-4 h-4" />
          CALIBRADOR INTELIGENTE
        </div>
        <ChevronDown className="w-4 h-4" />
      </div>

      <div className="p-4 space-y-5">
        
        {/* SETOR INTELIGENTE */}
        <div className="bg-slate-900/50 p-3 rounded-lg border border-brand-500/30">
            <div className="flex items-center gap-2 mb-2 text-brand-400 font-bold uppercase tracking-wider text-[10px]">
                <MousePointerClick className="w-3 h-3" />
                1. Escolha a Seção Alvo
            </div>
            <select 
                value={targetSection} 
                onChange={(e) => setTargetSection(e.target.value)}
                className="w-full bg-slate-800 text-white border border-slate-700 rounded p-2 mb-3 focus:border-brand-500 outline-none"
            >
                <option value="products">Produtos (Hacks)</option>
                <option value="features">Vantagens (Features)</option>
                <option value="reviews">Depoimentos</option>
                <option value="faq">FAQ</option>
            </select>

            <p className="text-slate-400 leading-relaxed mb-3">
                Agora <strong>role a tela manualmente</strong> até a seção escolhida ficar na posição perfeita para você.
            </p>

            <div className="flex items-center justify-between bg-black/40 p-2 rounded border border-slate-700">
                <span className="text-slate-400">Offset Detectado:</span>
                <span className="text-2xl font-bold text-brand-400">{detectedOffset}px</span>
            </div>
            
            <button 
                onClick={handleApplyDetected}
                className="w-full mt-2 bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 rounded transition-colors flex items-center justify-center gap-2"
            >
                Testar Esse Valor
            </button>
        </div>

        <div className="h-px bg-slate-800"></div>

        {/* CONTROLE FINO / MANUAL */}
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 font-bold">Valor Atual em Uso:</span>
                <span className="text-white font-mono bg-slate-800 px-2 py-1 rounded border border-slate-700">{currentOffset}px</span>
            </div>
            <input 
                type="range" 
                min="-50" 
                max="300" 
                value={currentOffset} 
                onChange={(e) => onOffsetChange(Number(e.target.value))}
                className="w-full accent-brand-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2">
                <button onClick={() => onOffsetChange(100)} className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-white"><RotateCcw className="w-3 h-3"/> Resetar Padrão (100px)</button>
            </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 p-2 rounded text-[10px] text-yellow-200 text-center">
            Quando achar o valor perfeito, me envie o número do <strong>"Offset Detectado"</strong>.
        </div>
      </div>
    </div>
  );
};