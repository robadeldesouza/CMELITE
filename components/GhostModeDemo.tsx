
import React, { useState, useEffect } from 'react';
import { Ghost, ShieldAlert, Cpu, EyeOff, Globe, Lock, Terminal, Activity, Zap, RefreshCw, Server, AlertCircle, Settings, ShieldCheck, Monitor } from 'lucide-react';

export const GhostModeDemo: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentId, setCurrentId] = useState("REAL_DEVICE_ID_7721X");
  const [stealthLevel, setStealthLevel] = useState(0);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 8));
  };

  const startSpoofing = () => {
    if (isActive) return;
    setIsActive(true);
    setProgress(0);
    setStealthLevel(10);
    addLog("[INIT] Ativando Camada de Abstração Stealth 7...");
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          addLog("[SUCCESS] Protocolo Stealth 7 Ativo: Vila Indetectável.");
          return 100;
        }
        
        if (prev === 20) addLog("[NET] Interceptando Handshake da MoonActive...");
        if (prev === 45) addLog("[SPOOF] Gerando Virtual_Device_Hash...");
        if (prev === 70) addLog("[BYPASS] Mascarando Assinatura de Camada 7...");
        if (prev === 90) addLog("[ENCRYPT] Ativando Tunelamento AES-256...");
        
        if (prev % 10 === 0) {
            setCurrentId(`STEALTH_7_${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
            setStealthLevel(s => Math.min(100, s + 10));
        }
        
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex p-3 bg-brand-500/10 rounded-2xl border border-brand-500/20 mb-4">
          <Ghost className="w-10 h-10 text-brand-500 animate-pulse" />
        </div>
        <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Stealth <span className="text-brand-500">7</span></h2>
        <p className="text-secondary mt-2">Torne sua atividade invisível aos sistemas de auditoria do servidor via camuflagem de Camada 7.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-surface border border-border-dim rounded-2xl p-6 shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-20"></div>
          
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Configuração de Stealth
            </h3>

            <div className="space-y-6">
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Identidade de Hardware Atual:</span>
                    <code className="text-brand-400 font-mono font-bold text-lg break-all">
                        {currentId}
                    </code>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-slate-500">Nível de Invisibilidade</span>
                        <span className={stealthLevel > 80 ? "text-emerald-500" : "text-brand-500"}>{stealthLevel}%</span>
                    </div>
                    <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            style={{ width: `${stealthLevel}%` }}
                        ></div>
                    </div>
                </div>

                <button 
                    onClick={startSpoofing}
                    disabled={isActive}
                    className={`w-full py-4 rounded-xl font-display font-black text-lg uppercase tracking-widest transition-all shadow-neon flex items-center justify-center gap-3 ${isActive ? 'bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 cursor-default' : 'bg-brand-600 hover:bg-brand-500 text-white active:scale-95'}`}
                >
                    {isActive ? (
                        <>
                            <ShieldCheck className="w-6 h-6" /> PROTOCOLO ATIVO
                        </>
                    ) : (
                        <>
                            <EyeOff className="w-6 h-6" /> INICIAR CAMUFLAGEM
                        </>
                    )}
                </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Interface em Operação:</span>
                <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video group/img">
                    <img 
                        src="https://i.imgur.com/Y09TX6V.png" 
                        alt="Stealth 7 Preview" 
                        className="w-full h-full object-cover opacity-50 group-hover/img:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-brand-500/10 mix-blend-overlay"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-white/10 scale-90 md:scale-100">
                             <Monitor className="w-4 h-4 text-brand-500" />
                        </div>
                    </div>
                </div>
          </div>
        </div>

        <div className="bg-black rounded-2xl border border-border-dim shadow-2xl flex flex-col h-[520px] md:h-auto font-mono overflow-hidden">
            <div className="bg-surface-highlight px-4 py-2 border-b border-border-dim flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-brand-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stealth_Kernel_Logs</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30"></div>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-brand-900">
                {logs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                        <Activity className="w-12 h-12 text-brand-500 mb-2" />
                        <span className="text-[10px] font-bold">AGUARDANDO INJEÇÃO</span>
                    </div>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className={`text-[11px] animate-fade-in ${log.includes('[SUCCESS]') ? 'text-emerald-400' : log.includes('[ERR]') ? 'text-red-400' : 'text-slate-300'}`}>
                            <span className="text-brand-500 mr-2">➜</span> {log}
                        </div>
                    ))
                )}
                {isActive && progress < 100 && (
                    <div className="flex items-center gap-2 text-brand-500 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span className="text-[10px]">REWRITING_REGISTRY... {progress}%</span>
                    </div>
                )}
            </div>

            <div className="p-3 bg-brand-500/5 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-slate-500" />
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Node: BRA-STEALTH-07</span>
                </div>
                <span className="text-[9px] font-bold text-brand-500">LAYER_7_CAMO: ON</span>
            </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-brand-950/20 border border-brand-500/20 rounded-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center shrink-0 border border-brand-500/20">
              <Lock className="w-8 h-8 text-brand-500" />
          </div>
          <div>
              <h4 className="text-white font-bold mb-1">Por que o Stealth 7 é obrigatório?</h4>
              <p className="text-sm text-secondary leading-relaxed">
                  Ao ativar o Stealth 7, nossa camada de abstração intercepta todas as chamadas de API do Coin Master. 
                  Nós forçamos o envio de um **Device ID randômico** e um **User-Agent modificado**, impedindo que a Moon Active vincule padrões de comportamento à sua conta real.
              </p>
          </div>
      </div>
    </div>
  );
};
