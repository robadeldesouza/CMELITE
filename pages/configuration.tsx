
import React, { useState, useEffect, useRef } from 'react';
import { useStore, AppMode } from '../store';
import { Briefcase, Activity, Volume2, VolumeX, Sparkles, LayoutDashboard, ShieldCheck } from 'lucide-react';

const AUDIO_SYSTEM_ENABLED = false;

export const ConfigurationPage: React.FC = () => {
  const login = useStore(state => state.login);
  const setAppMode = useStore(state => state.setAppMode);
  const [isMuted, setIsMuted] = useState(true);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!AUDIO_SYSTEM_ENABLED || isAudioInitialized) return;
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;
    setIsAudioInitialized(true);
  };

  const handleSelectZone = (mode: AppMode) => {
    if (AUDIO_SYSTEM_ENABLED) initAudio();
    login(); 
    setAppMode(mode); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6 overflow-hidden relative font-sans select-none" onClick={initAudio}>
      
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-200/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-200/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-3xl relative z-20">
        
        <div className="text-center mb-10 md:mb-14 animate-fade-in">
            <div className="flex justify-center mb-4">
               <div className="relative group">
                  <div className="absolute -inset-4 bg-white rounded-full blur-xl opacity-40"></div>
                  <div className="bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-white/60 shadow-sm relative z-10">
                     <ShieldCheck size={32} className="text-blue-600 md:w-10 md:h-10" />
                  </div>
               </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight">Plataforma Social Proof</h1>
            <p className="text-blue-600 font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase mt-3 opacity-60">Selecione o Terminal de Acesso</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 animate-fade-in-up">
            
            <button 
                onClick={() => handleSelectZone('orchestration')}
                className="group relative text-left outline-none w-full"
            >
                <div className="absolute -inset-1 bg-blue-400 rounded-[2rem] blur opacity-0 group-hover:opacity-10 transition duration-700"></div>
                <div className="relative flex flex-col items-center p-6 md:p-10 bg-white/50 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-sm transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 active:scale-95 overflow-hidden">
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-blue-50/50 rounded-3xl flex items-center justify-center mb-4 md:mb-6 border border-blue-100 group-hover:bg-white transition-all">
                        <Activity size={28} className="text-blue-600 md:w-9 md:h-9" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 tracking-tight text-center">Operações</h3>
                    <p className="text-slate-500 text-[11px] md:text-xs text-center leading-relaxed max-w-[200px] font-medium mb-6">
                        Gestão de agentes simuladores, campanhas de prova social e métricas.
                    </p>
                    <div className="px-6 py-2 rounded-full bg-blue-600/10 text-blue-700 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-200/50">
                        Acessar Terminal
                    </div>
                </div>
            </button>

            <button 
                onClick={() => handleSelectZone('admin')}
                className="group relative text-left outline-none w-full"
            >
                <div className="absolute -inset-1 bg-indigo-400 rounded-[2rem] blur opacity-0 group-hover:opacity-10 transition duration-700"></div>
                <div className="relative flex flex-col items-center p-6 md:p-10 bg-white/50 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-sm transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 active:scale-95 overflow-hidden">
                    <div className="w-14 h-14 md:w-20 md:h-20 bg-indigo-50/50 rounded-3xl flex items-center justify-center mb-4 md:mb-6 border border-indigo-100 group-hover:bg-white transition-all">
                        <Briefcase size={28} className="text-indigo-600 md:w-9 md:h-9" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2 tracking-tight text-center">Administração</h3>
                    <p className="text-slate-500 text-[11px] md:text-xs text-center leading-relaxed max-w-[200px] font-medium mb-6">
                        Configuração de faturamento, controle de equipe e auditoria do sistema.
                    </p>
                    <div className="px-6 py-2 rounded-full bg-indigo-600/10 text-indigo-700 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm border border-indigo-200/50">
                        Acesso Restrito
                    </div>
                </div>
            </button>
        </div>

        <div className="mt-12 md:mt-16 opacity-30 flex justify-center items-center gap-4 animate-fade-in font-mono">
          <div className="h-px w-10 bg-slate-300"></div>
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-500">Corporate v1.0</span>
          <div className="h-px w-10 bg-slate-300"></div>
        </div>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={(e) => { e.stopPropagation(); }} 
          className="p-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-slate-300 cursor-not-allowed opacity-40 shadow-sm"
        >
          <VolumeX size={18} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-pulse-slow {
          animation: pulse 10s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};
