
import React from 'react';
import { ShieldAlert, ShieldCheck, Globe, Smartphone, Monitor, Watch, X, CheckCircle2, Lock, Facebook, Mail, MonitorSmartphone, Target, Zap } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-3 md:p-6 animate-fade-in">
      {/* Backdrop de Ultra Definição */}
      <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" />

      {/* Container Elite com Brilho de Borda Metálico */}
      <div className="relative w-full max-w-4xl bg-[#020617] border border-brand-500/40 rounded-[3rem] shadow-[0_0_150px_rgba(234,179,8,0.25)] overflow-hidden animate-bounce-in flex flex-col max-h-[95vh] ring-1 ring-white/10">
        
        {/* Mascote de Fundo (Marca D'água do Rhino) */}
        <div className="absolute -left-20 -bottom-20 opacity-[0.03] rotate-12 pointer-events-none">
            <img src="https://i.ibb.co/VWVvTf1J/rhino.png" alt="Rhino Decor" className="w-[500px]" />
        </div>

        {/* Detalhe de Scanner no Topo */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent animate-pulse"></div>
        
        <div className="p-6 md:p-14 overflow-y-auto custom-scrollbar relative z-10">
          {/* Header de Autoridade */}
          <div className="text-center mb-12 relative">
            <div className="inline-flex p-4 bg-brand-500/5 rounded-[2rem] border border-brand-500/20 mb-6 shadow-neon relative group">
                <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full opacity-50"></div>
                <ShieldAlert className="w-12 h-12 text-brand-500 relative z-10 animate-pulse" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-black text-white leading-none tracking-tighter uppercase mb-4 italic">
              ATENÇÃO <span className="text-transparent bg-clip-text bg-gradient-to-b from-brand-300 to-brand-600 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">JOGADOR!</span>
            </h2>
            
            <div className="flex items-center justify-center gap-6">
                <div className="h-px w-16 bg-brand-500/30"></div>
                <p className="text-brand-400 font-mono text-xs font-black tracking-[0.6em] uppercase">
                  CM ELITE PROTOCOL
                </p>
                <div className="h-px w-16 bg-brand-500/30"></div>
            </div>
          </div>

          {/* GRID "NUNCA" - CARDS GIGANTES E LADO A LADO */}
          <div className="grid grid-cols-3 gap-3 md:gap-8 mb-14">
            {[
              { label: "CONTA FACEBOOK", icon: <Facebook className="w-10 h-10 md:w-16 md:h-16" />, color: "from-blue-600/30" },
              { label: "CONTA GMAIL", icon: <Mail className="w-10 h-10 md:w-16 md:h-16" />, color: "from-red-600/30" },
              { label: "SEU DISPOSITIVO", icon: <MonitorSmartphone className="w-10 h-10 md:w-16 md:h-16" />, color: "from-emerald-600/30" }
            ].map((item, i) => (
              <div key={i} className={`relative group flex flex-col items-center text-center p-6 md:p-12 rounded-[2.5rem] bg-gradient-to-b ${item.color} to-black/80 border-2 border-white/5 hover:border-brand-500/50 transition-all duration-700 shadow-2xl transform hover:-translate-y-2`}>
                <div className="text-white mb-6 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-neon">
                    {item.icon}
                </div>
                <div className="space-y-2">
                    <span className="text-red-500 font-black text-[9px] md:text-[13px] uppercase tracking-[0.2em] block leading-none">NUNCA</span>
                    <span className="text-white font-black text-[10px] md:text-[15px] uppercase block pt-2 border-t border-white/10 mt-3">{item.label}</span>
                </div>
                
                <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,1)] animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Descrição do Sistema Web - Box Premium com Trio Mascote */}
          <div className="bg-gradient-to-br from-brand-500/10 to-transparent border border-brand-500/20 p-8 md:p-10 rounded-[3rem] mb-12 relative overflow-hidden group shadow-inner">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <img src="https://i.ibb.co/S7Vn5F5B/trio.png" alt="Trio Mascots" className="w-48" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                <div className="p-5 bg-brand-500 rounded-3xl shadow-neon shrink-0">
                    <Globe className="w-10 h-10 text-black" />
                </div>
                <div className="text-center md:text-left max-w-xl">
                    <h4 className="text-brand-400 font-black text-sm md:text-base uppercase tracking-[0.3em] mb-3">SISTEMA 100% CLOUD-BASED</h4>
                    <p className="text-slate-300 text-base md:text-lg leading-relaxed font-medium">
                        Nosso sistema funciona inteiramente via web. <span className="text-white font-bold underline decoration-brand-500/40">Zero instalação</span>. Seguro, rápido e indetectável, sem necessidade de Jailbreak ou Root.
                    </p>
                </div>
            </div>
          </div>

          {/* Compatibilidade */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-black/40 p-8 rounded-[2.5rem] border border-white/5">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
                    <Target className="text-brand-500 w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm">Disponível em:</h4>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-tighter">Multi-Plataforma Estável</p>
                </div>
             </div>
             
             <div className="flex gap-10 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                <Smartphone className="w-7 h-7 text-white" />
                <Monitor className="w-7 h-7 text-white" />
                <Watch className="w-7 h-7 text-white" />
                <Zap className="w-7 h-7 text-brand-500" />
             </div>
          </div>
        </div>

        {/* Footer com Botão REFINADO */}
        <div className="p-8 md:p-12 bg-black/80 border-t border-white/5 mt-auto flex flex-col items-center">
          <button 
            onClick={onClose}
            className="w-full max-w-md group relative py-5 bg-brand-600 hover:bg-brand-500 text-black font-display font-black text-xl uppercase tracking-[0.3em] rounded-[1.5rem] shadow-neon transition-all transform active:scale-95 flex items-center justify-center gap-4 border border-white/10"
          >
            <CheckCircle2 className="w-7 h-7" />
            INICIAR AGORA
          </button>
          
          <div className="flex items-center gap-3 mt-6 opacity-30">
             <Lock className="w-3 h-3 text-emerald-500" />
             <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.4em]">
               Encryption Secure Handshake v4.7
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
