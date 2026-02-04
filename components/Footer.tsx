
import React, { useState } from 'react';
import { Gamepad2, X, FileText, CreditCard, ShieldCheck } from 'lucide-react';
import { useCore } from '../core/CoreContext';

export const Footer: React.FC = () => {
  const { content } = useCore();
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalTitle, setLegalTitle] = useState('');

  const openLegalModal = (title: string, e: React.MouseEvent) => {
    e.preventDefault();
    setLegalTitle(title);
    setShowLegalModal(true);
  };

  return (
    <footer className="bg-page border-t border-border-dim pt-16 pb-12 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-brand-600 rounded-lg">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-display font-bold text-primary tracking-wide">CM <span className="text-brand-500">ELITE</span></span>
            </div>
            
            {/* TEXTO PREMIUM DESTAQUE */}
            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-surface to-surface-highlight border border-brand-500/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden group max-w-md">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <ShieldCheck className="w-16 h-16 text-brand-500 rotate-12" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                
                <p className="text-secondary text-sm font-medium leading-relaxed relative z-10">
                    A plataforma com parceria junto aos <span className="text-brand-400 font-bold">principais líderes de alteração de games</span>.
                </p>
                <div className="w-10 h-0.5 bg-brand-500/50 my-3 rounded-full"></div>
                <p className="text-muted text-xs leading-relaxed relative z-10">
                    {content.footer.disclaimerText}
                </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
                {/* Fake Payment Icons */}
                <div className="px-2 py-1 bg-white rounded flex items-center justify-center h-8 w-12" title="PIX">
                    <span className="text-[10px] font-black text-slate-800 tracking-tighter whitespace-nowrap">PIX</span>
                </div>
                <div className="px-2 py-1 bg-white rounded flex items-center justify-center h-8 w-12" title="Visa">
                    <span className="text-[10px] font-black text-blue-800 italic whitespace-nowrap">VISA</span>
                </div>
                <div className="px-2 py-1 bg-white rounded flex items-center justify-center h-8 w-12" title="Mastercard">
                    <div className="flex -space-x-1">
                        <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
                    </div>
                </div>
            </div>
          </div>

          {/* Empty Space / Right Side decorations if needed */}
          <div className="hidden md:block">
             {/* Espaço reservado para balancear o layout se necessário, ou deixado vazio conforme pedido de remoção das outras colunas */}
          </div>
        </div>

        {/* Links Row (Above Divider) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 mt-12">
            <div className="text-left w-full md:w-auto">
                <h4 className="text-primary font-display font-bold uppercase tracking-wider text-sm flex items-center gap-2 whitespace-nowrap">
                    <ShieldCheck className="w-4 h-4 text-brand-500" />
                    Central de Suporte
                </h4>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 text-xs text-secondary font-medium uppercase tracking-wide">
                <a href="#faq" className="hover:text-brand-400 transition-colors whitespace-nowrap">
                  Central de Ajuda (FAQ)
                </a>
                <a href="#" onClick={(e) => openLegalModal("Termos de Serviço", e)} className="hover:text-brand-400 transition-colors whitespace-nowrap">
                   Termos de Serviço
                </a>
                <a href="#" onClick={(e) => openLegalModal("Política de Reembolso", e)} className="hover:text-brand-400 transition-colors whitespace-nowrap">
                   Política de Reembolso
                </a>
                <a href="#" onClick={(e) => openLegalModal("Política de Privacidade", e)} className="hover:text-brand-400 transition-colors whitespace-nowrap">
                   Política de Privacidade
                </a>
            </div>
        </div>

        {/* Standard Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border-highlight to-transparent mb-8"></div>

        {/* Copyright Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-muted text-[10px] font-bold tracking-widest uppercase">
            {content.footer.copyrightText}
          </p>
          <div className="text-muted text-[10px] uppercase font-bold tracking-widest whitespace-nowrap">
            Protótipo de Alta Fidelidade v{useCore().config.version}
          </div>
        </div>
      </div>

      {/* Simple Legal Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLegalModal(false)}></div>
          <div className="relative bg-surface border border-border-highlight w-full max-w-md rounded-xl p-6 shadow-2xl animate-fade-in">
             <div className="flex justify-between items-center mb-4 border-b border-border-dim pb-4">
               <h3 className="text-primary font-bold text-lg">{legalTitle}</h3>
               <button onClick={() => setShowLegalModal(false)} className="text-secondary hover:text-white">
                 <X className="w-5 h-5" />
               </button>
             </div>
             <div className="space-y-4 text-secondary text-sm h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-surface-highlight">
               <p>Esta é uma versão demonstrativa (Protótipo de Alta Fidelidade).</p>
               <p>O acesso ao sistema é concedido exclusivamente via painel web, não havendo download de software executável.</p>
               <p>Ao utilizar nossa plataforma, você concorda com o uso de cookies para manutenção da sessão.</p>
               <p className="text-xs text-muted mt-4">Versão v{useCore().config.version}</p>
             </div>
             <button onClick={() => setShowLegalModal(false)} className="w-full mt-4 bg-surface-highlight hover:bg-border-highlight text-white font-bold py-3 rounded-lg transition-colors">
               Entendi
             </button>
          </div>
        </div>
      )}
    </footer>
  );
};
