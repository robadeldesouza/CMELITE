
import React, { useState, useEffect, useRef } from 'react';
import { useStore, AppMode } from '../store';
import { Radiation, Cpu, ShieldCheck, Volume2, VolumeX, Zap } from 'lucide-react';

// FLAG DE CONTROLE GLOBAL DE ÁUDIO - DEFINA COMO TRUE PARA REATIVAR O SOM
const AUDIO_SYSTEM_ENABLED = false;

export const LoginPage: React.FC = () => {
  const login = useStore(state => state.login);
  const setAppMode = useStore(state => state.setAppMode);
  const [isMuted, setIsMuted] = useState(true);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenOscRef = useRef<OscillatorNode | null>(null);

  const initAudio = () => {
    // Verifica se o áudio está habilitado globalmente antes de inicializar
    if (!AUDIO_SYSTEM_ENABLED || isAudioInitialized) return;
    
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;
    setIsAudioInitialized(true);
    
    if (!isMuted) startAmbientSiren();
  };

  const startAmbientSiren = () => {
    if (!AUDIO_SYSTEM_ENABLED || !audioCtxRef.current || sirenOscRef.current) return;
    
    const ctx = audioCtxRef.current;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 5); 
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 100; 
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    sirenOscRef.current = osc;
  };

  const handleSelectZone = (mode: AppMode) => {
    if (AUDIO_SYSTEM_ENABLED) {
        initAudio();
    }
    login(); // Autentica automaticamente
    setAppMode(mode); // Define a zona
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans select-none" onClick={initAudio}>
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30 animate-zombie-breath pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542259649-650a229c1186?q=80&w=1920&auto=format&fit=crop')", filter: "grayscale(100%) contrast(120%) brightness(50%)" }}></div>
      <div className="chain-link-fence"></div>
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_90%,rgba(0,0,0,1)_100%)] pointer-events-none"></div>

      <div className="relative z-20 text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-4">
             <div className="relative group">
                <div className="absolute -inset-2 bg-toxic-500 rounded-full blur opacity-20 group-hover:opacity-40 transition animate-pulse-slow"></div>
                <Radiation size={64} className="text-stone-300 relative z-10" />
             </div>
          </div>
          <h1 className="font-military text-4xl sm:text-6xl text-white tracking-[0.2em] uppercase drop-shadow-[0_0_20px_rgba(132,204,22,0.3)]">Chernobyl Engine</h1>
          <p className="text-toxic-500 font-mono text-xs sm:text-sm tracking-[0.5em] uppercase mt-4 font-bold">Inicie o Protocolo de Operação</p>
      </div>

      <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4 animate-fade-in-up">
          {/* ORCHESTRATION CARD */}
          <button 
              onClick={() => handleSelectZone('orchestration')}
              className="group relative text-left outline-none"
          >
              <div className="absolute -inset-1 bg-toxic-500 rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-500"></div>
              <div className="rust-texture relative flex flex-col items-center p-10 bg-slate-900/80 border border-slate-700 rounded-2xl transform transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 active:scale-95 overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Cpu size={120} />
                  </div>
                  <div className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center mb-6 border-2 border-toxic-900 group-hover:border-toxic-500 group-hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] transition-all">
                      <Cpu size={36} className="text-toxic-500 group-hover:animate-pulse" />
                  </div>
                  <h3 className="font-military text-2xl text-white mb-2 tracking-widest text-center">Orchestrator</h3>
                  <p className="text-stone-400 text-[10px] text-center uppercase tracking-widest leading-relaxed max-w-[200px]">
                      Controle do enxame de bots, salas de chat e fluxos de prova social.
                  </p>
                  <div className="mt-8 px-6 py-2 border border-toxic-800 text-toxic-600 font-black text-[10px] uppercase tracking-[0.3em] group-hover:bg-toxic-500 group-hover:text-black transition-all">
                      [ Abrir Swarm ]
                  </div>
              </div>
          </button>

          {/* ADMIN CARD */}
          <button 
              onClick={() => handleSelectZone('admin')}
              className="group relative text-left outline-none"
          >
              <div className="absolute -inset-1 bg-blue-500 rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-500"></div>
              <div className="rust-texture relative flex flex-col items-center p-10 bg-slate-900/80 border border-slate-700 rounded-2xl transform transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 active:scale-95 overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShieldCheck size={120} />
                  </div>
                  <div className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center mb-6 border-2 border-blue-900 group-hover:border-blue-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                      <ShieldCheck size={36} className="text-blue-500" />
                  </div>
                  <h3 className="font-military text-2xl text-white mb-2 tracking-widest text-center">System Admin</h3>
                  <p className="text-stone-400 text-[10px] text-center uppercase tracking-widest leading-relaxed max-w-[200px]">
                      Configurações globais, planos, usuários e auditoria do banco de dados.
                  </p>
                  <div className="mt-8 px-6 py-2 border border-blue-800 text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] group-hover:bg-blue-500 group-hover:text-black transition-all">
                      [ Acesso Master ]
                  </div>
              </div>
          </button>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            if (AUDIO_SYSTEM_ENABLED) setIsMuted(!isMuted); 
          }} 
          className={`p-2 transition-colors ${AUDIO_SYSTEM_ENABLED ? 'text-stone-500 hover:text-toxic-500' : 'text-stone-800 cursor-not-allowed opacity-50'}`}
          title={AUDIO_SYSTEM_ENABLED ? "Alternar som" : "Áudio desativado no sistema"}
        >
          {isMuted || !AUDIO_SYSTEM_ENABLED ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>
    </div>
  );
};
