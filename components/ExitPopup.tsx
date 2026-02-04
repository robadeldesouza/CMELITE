
import React, { useState, useEffect } from 'react';
import { X, Lock, Unlock, Zap, Brain, ShieldCheck, ArrowRight, AlertTriangle, Clock, Terminal, ShieldAlert } from 'lucide-react';
import { useCore } from '../core/CoreContext';
import { useDiscountTimer } from '../hooks/useDiscountTimer';

interface ExitPopupProps {
  onAccept: () => void;
  onOpenAdmin?: () => void;
}

export const ExitPopup: React.FC<ExitPopupProps> = ({ onAccept, onOpenAdmin }) => {
  const { features, isNemesisPopupForced, triggerNemesisPopup, toggleFeature, logAction } = useCore();
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isNemesisPopupForced) {
        setIsVisible(true);
        logAction('NEMESIS_TRIGGERED_BY_ADMIN', 'Gatilho Nêmesis disparado manualmente via Admin.', 'info');
        triggerNemesisPopup(false);
    }
  }, [isNemesisPopupForced]);

  const triggerOffer = (source: string) => {
    if (features.nemesisCampaignActive) return;
    setHasTriggered(true);
    setIsVisible(true);
    logAction('EXIT_INTENT_DETECTED', `Popup visualizado via ${source}.`, 'info');
  };

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !hasTriggered && !features.nemesisCampaignActive) {
        const alreadyClosed = localStorage.getItem('cm_exit_offer_closed');
        if (!alreadyClosed) triggerOffer('MOUSE_EXIT');
      }
    };
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && !hasTriggered && !features.nemesisCampaignActive) {
            triggerOffer('VISIBILITY_EXIT');
        }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasTriggered, features.nemesisCampaignActive]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem('cm_exit_offer_closed', 'true');
    logAction('EXIT_OFFER_IGNORED', 'Usuário fechou o modal.', 'info');
  };

  const handleClaim = () => {
    setIsVisible(false);
    if (!features.nemesisCampaignActive) toggleFeature('nemesisCampaignActive');
    logAction('NEMESIS_ACTIVATED', 'Usuário aceitou o acordo.', 'critical');
    onAccept();
  };

  const handleSecretAdmin = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onOpenAdmin) onOpenAdmin();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={(e) => handleClose(e)}></div>

      {/* WRAPPER COM OVERFLOW VISIBLE PARA ELEMENTOS EXTERNOS */}
      <div className="relative w-full max-w-xl overflow-visible animate-bounce-in">
        
        {/* MENSAGEM DE INTERCEPÇÃO: LADO DE FORA (TOP CENTER) */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-fit whitespace-nowrap z-30 pointer-events-none">
            <div className="bg-red-600 text-white px-6 py-2 rounded-full font-black text-[10px] md:text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(220,38,38,0.8)] border border-red-400/50 animate-pulse flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <span>INTERCEPÇÃO DE SEGURANÇA: NÃO FECHE</span>
                <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
        </div>

        {/* GATILHO SECRETO EXTERNO: REDUZIDO E MOVIDO PARA NÃO OVERLAPAR O BOTÃO X */}
        <button 
            onClick={handleSecretAdmin}
            className="absolute -top-4 left-0 p-4 text-red-600/0 hover:text-red-600/10 transition-all z-[10] cursor-default group/sec-out"
            title="S_Trigger_01"
        >
            <ShieldAlert className="w-4 h-4 opacity-0 group-hover/sec-out:opacity-100" />
        </button>

        {/* CORPO DO MODAL */}
        <div className="relative w-full bg-surface rounded-[2rem] border-2 border-red-600/40 shadow-[0_0_80px_rgba(185,28,28,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-none relative">
            
            {/* BOTÃO DE FECHAR: Aumentado Z-INDEX para prioridade máxima */}
            <button 
              onClick={(e) => handleClose(e)}
              className="absolute top-4 right-4 text-muted hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full z-[50] bg-surface/50 backdrop-blur-sm"
              aria-label="Fechar oferta"
            >
              <X className="w-6 h-6" />
            </button>

            {/* GATILHO SECRETO INTERNO: MOVIDO PARA LONGE DO CANTO SUPERIOR DIREITO */}
            <button 
              onClick={handleSecretAdmin}
              className="absolute bottom-4 right-4 p-2 text-red-600/0 hover:text-red-600/5 transition-colors z-10 cursor-default group/sec-in"
              title="S_Trigger_02"
            >
              <Terminal className="w-4 h-4 opacity-0 group-hover/sec-in:opacity-40" />
            </button>

            <div className="text-center mb-8 pt-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white leading-none tracking-tighter uppercase">
                  Vamos fechar um <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-400 to-red-700 animate-shine bg-[length:200%_auto] drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">acordo secreto</span>?
                </h2>
                <div className="h-1 w-20 bg-red-600 mt-3 rounded-full mx-auto shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              
              <div className="w-full md:w-[48%]">
                <div className="h-full bg-page border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center shadow-inner ring-1 ring-white/5 relative group">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-900/40 rounded-full flex items-center justify-center mb-4 text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                     <Lock className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-lg font-black text-white mb-1 font-display uppercase tracking-tight">PROTOCOLO NÊMESIS</h3>
                  <p className="text-[10px] text-red-500 font-bold tracking-[0.25em] mb-4 uppercase">Módulo Injetável</p>
                  
                  <p className="text-[13px] text-secondary leading-snug mb-6">
                    O protocolo Nêmesis é um recurso restrito que <span className="text-red-500 font-bold">só é liberado em janelas raras</span>. Decidimos abrir uma exceção para sua conta.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 w-full mt-auto pt-4 border-t border-white/5">
                     <div className="flex items-center gap-1.5 text-secondary text-[10px] font-bold uppercase tracking-tighter">
                        <Zap className="w-3 h-3 text-yellow-500" /> Time-Warp
                     </div>
                     <div className="flex items-center gap-1.5 text-secondary text-[10px] font-bold uppercase tracking-tighter">
                        <Brain className="w-3 h-3 text-blue-500" /> IA Oráculo
                     </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[52%] flex flex-col justify-center">
                <div className="bg-red-950/20 border border-red-600/20 p-5 rounded-xl mb-6 relative overflow-hidden">
                   <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-red-500 animate-pulse" />
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Oferta Expirando</span>
                   </div>
                   <p className="text-[14px] font-serif italic text-slate-200 leading-snug">
                    Ao aceitar, você terá exatamente <span className="text-white font-bold">05:00 (5h)</span> para garantir seu acesso. Após esse tempo, o código de injeção será deletado permanentemente.
                   </p>
                </div>

                <button 
                  onClick={handleClaim}
                  className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-display font-black py-5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <Unlock className="w-6 h-6" />
                  <span className="text-base">PEGAR PRESENTE AGORA</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
