
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Plus, Zap, Star, Settings, ShieldCheck, Activity, Cpu, Terminal, Wifi, Battery, SignalHigh, Gift } from 'lucide-react';

const SYMBOLS = [
  { id: 'pig', icon: '🐷', isImage: false, label: 'RAID' },
  { id: 'hammer', icon: '⚡', isImage: false, label: 'ATTACK' }, 
  { id: 'shield', icon: '🛡️', isImage: false, label: 'SHIELD' },
  { id: 'spin', icon: 'https://i.ibb.co/zW6wpg7N/images.png', isImage: true, label: 'SPINS' },
  { id: 'coin', icon: '💰', isImage: false, label: 'COIN' },
];

const REEL_HEIGHT = 180; // Altura de cada slot de símbolo

export const CoinMasterEmulator: React.FC = () => {
  const [coins, setCoins] = useState(1450200);
  const [spins, setSpins] = useState(50);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hackLog, setHackLog] = useState<string>("");
  const [hackStatus, setHackStatus] = useState<'idle' | 'scanning' | 'injected'>('idle');
  const [reelOffsets, setReelOffsets] = useState([0, 0, 0]);
  const [isWinning, setIsWinning] = useState(false);
  const [winType, setWinType] = useState<'coins' | 'spins' | null>(null);

  const startSpinSequence = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setIsWinning(false);
    setWinType(null);
    setHackStatus('scanning');
    setHackLog("INIT_RNG_INTERCEPT...");
    setSpins(prev => Math.max(0, prev - 1));

    // Determina o tipo de vitória forçada (40% de chance total)
    const rand = Math.random();
    const isPigWin = rand < 0.2; // 20% chance de porcos (coins)
    const isSpinWin = rand >= 0.2 && rand < 0.4; // 20% chance do novo ícone (spins)
    const forceWin = isPigWin || isSpinWin;

    const newOffsets = [
        Math.floor(Math.random() * 10 + 20) * REEL_HEIGHT, 
        Math.floor(Math.random() * 10 + 30) * REEL_HEIGHT, 
        Math.floor(Math.random() * 10 + 40) * REEL_HEIGHT  
    ];

    if (forceWin) {
        setTimeout(() => {
            setHackStatus('injected');
            setHackLog(isSpinWin ? "STATUS: FORCING_SPIN_CLUSTER" : "STATUS: FORCING_PIG_TRIAD");
        }, 1500);

        const targetIndex = isSpinWin ? 3 : 0; // index 3 é 'spin', 0 é 'pig'
        // Calculamos um offset que garanta o símbolo no centro
        // Usamos um multiplicador de 5 (total de símbolos) para cair sempre na mesma posição
        const winPos = (30 * SYMBOLS.length + targetIndex) * REEL_HEIGHT;
        newOffsets[0] = winPos; 
        newOffsets[1] = winPos;
        newOffsets[2] = winPos;
    }

    setReelOffsets(newOffsets);

    await new Promise(r => setTimeout(r, 4200));

    if (forceWin) {
        setIsWinning(true);
        if (isSpinWin) {
            setWinType('spins');
            setHackLog("ALGORITHM_BYPASS: +500 SPINS ADDED");
            setSpins(prev => prev + 500);
        } else {
            setWinType('coins');
            setHackLog("WIN_DETECTED: +2.500.000 COINS");
            let currentReward = 0;
            const totalReward = 2500000;
            const interval = setInterval(() => {
                currentReward += 125000;
                setCoins(prev => prev + 125000);
                if (currentReward >= totalReward) clearInterval(interval);
            }, 50);
        }
    } else {
        setHackLog("EXIT_CLEAN: NO_MATCH_FOUND");
    }

    setIsSpinning(false);
    setTimeout(() => {
        setHackStatus('idle');
        setHackLog("");
    }, 4000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
        if (!isSpinning && !isWinning) startSpinSequence();
    }, 20000);
    return () => clearInterval(timer);
  }, [isSpinning, isWinning]);

  return (
    <div className={`relative w-full max-w-[360px] mx-auto h-[85vh] max-h-[740px] rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)] border-[10px] border-[#0f172a] select-none font-sans bg-[#020617] ring-1 ring-white/10 flex flex-col transition-all duration-700 ${isWinning ? 'ring-brand-500/50 shadow-[0_0_80px_rgba(234,179,8,0.3)]' : ''}`}>
      
      {/* GLITCH OVERLAY */}
      {hackStatus === 'injected' && (
          <div className="absolute inset-0 z-[100] pointer-events-none mix-blend-overlay opacity-20 bg-[url('https://www.transparenttextures.com/asfalt-dark.png')] animate-pulse"></div>
      )}

      {/* BACKGROUND DA VILA */}
      <div 
        className={`absolute inset-0 bg-cover bg-center z-0 transition-all duration-[8s] opacity-30 ${isSpinning ? 'scale-110 blur-[2px]' : 'scale-100 blur-0'}`}
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596401348630-9b6f7902787e?q=80&w=600')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-[#020617]/80"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col p-4 md:p-6">
        
        {/* TOP STATUS BAR */}
        <div className="flex justify-between items-center px-4 mb-4">
            <div className="text-[10px] font-black text-slate-400 font-mono tracking-tighter">9:41</div>
            <div className="w-20 h-5 bg-black rounded-full border border-white/5 flex items-center justify-center gap-1.5 px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="w-1 h-1 rounded-full bg-slate-800"></div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
                <SignalHigh size={12} />
                <Wifi size={12} />
                <Battery size={12} className="rotate-90" />
            </div>
        </div>

        {/* HUD HEADER */}
        <div className="flex justify-between items-start mb-6">
            <div className="p-2 bg-gradient-to-b from-orange-400 to-orange-600 rounded-xl border-b-4 border-orange-800 shadow-lg active:scale-95 transition-transform">
                <Menu className="w-4 h-4 text-white" />
            </div>
            
            <div className="flex flex-col items-center">
                <div className="bg-slate-900/80 backdrop-blur-lg px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-2xl">
                    <Star className="w-3.5 h-3.5 text-brand-400 fill-brand-400 animate-pulse" />
                    <span className="text-white font-black text-xs italic tracking-tighter uppercase">Vila 214</span>
                </div>
                <div className="w-16 bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5 border border-white/5">
                    <div className="h-full bg-gradient-to-r from-brand-600 to-brand-300 w-[78%]"></div>
                </div>
            </div>

            <div className="p-2 bg-slate-800 rounded-xl border-b-4 border-slate-950 shadow-lg">
                <Settings className="w-4 h-4 text-slate-400" />
            </div>
        </div>

        {/* COIN COUNTER */}
        <div className="w-full mb-8">
            <div className="bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-white/5 p-1 flex items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 rounded-xl w-10 h-10 flex items-center justify-center border border-white/20 shadow-inner shrink-0 transform -rotate-3">
                    <span className="text-xl">💰</span>
                </div>
                <div className="flex-1 text-center">
                    <span className={`text-white font-mono font-black text-lg tracking-tighter tabular-nums drop-shadow-md transition-all ${isWinning && winType === 'coins' ? 'text-emerald-400 scale-110' : ''}`}>
                        {Math.floor(coins).toLocaleString()}
                    </span>
                </div>
                <div className="bg-emerald-600 rounded-xl p-2 border-b-4 border-emerald-800 shadow-lg active:scale-90 transition-transform">
                    <Plus className="w-4 h-4 text-white stroke-[3]" />
                </div>
            </div>
        </div>

        {/* SLOT MACHINE UNIT */}
        <div className={`relative mb-8 transform transition-all duration-700 ${isWinning ? 'scale-105' : 'scale-100'}`}>
            
            <div className={`bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 p-1.5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,1)] border border-white/10 relative overflow-visible ${isWinning ? 'brightness-110' : ''}`}>
                
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 px-3 py-1 bg-slate-900 rounded-full border border-white/10">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-2 h-2 rounded-full shadow-lg ${isWinning ? 'bg-red-500 animate-ping' : 'bg-slate-700'}`}></div>
                    ))}
                </div>

                <div className="bg-[#020617] rounded-[2.2rem] border-[4px] border-slate-950 shadow-[inset_0_0_40px_rgba(0,0,0,1)] overflow-hidden relative h-[180px]">
                    
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-red-500/20 z-30 pointer-events-none shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
                    
                    <div className="grid grid-cols-3 gap-2 h-full px-2">
                        {[0, 1, 2].map((reelIdx) => (
                            <div key={reelIdx} className="relative bg-slate-900/40 rounded-2xl overflow-hidden border border-white/5">
                                <div 
                                    className="flex flex-col transition-transform duration-[4200ms] cubic-bezier(0.1, 0, 0.1, 1)"
                                    style={{ 
                                        transform: `translateY(-${reelOffsets[reelIdx]}px)`,
                                        filter: isSpinning ? 'blur(4px)' : 'none'
                                    }}
                                >
                                    {Array.from({length: 120}).map((_, i) => {
                                        const symbol = SYMBOLS[i % SYMBOLS.length];
                                        return (
                                            <div key={i} className="h-[180px] flex items-center justify-center shrink-0">
                                                {symbol.isImage ? (
                                                    <img 
                                                        src={symbol.icon} 
                                                        alt={symbol.label}
                                                        className={`w-20 h-20 object-contain filter drop-shadow-[0_8px_15px_rgba(0,0,0,0.8)] ${isWinning && symbol.id === 'spin' ? 'animate-bounce' : ''}`}
                                                    />
                                                ) : (
                                                    <span className={`text-6xl filter drop-shadow-[0_8px_15px_rgba(0,0,0,0.8)] ${isWinning && symbol.id === 'pig' ? 'animate-bounce' : ''}`}>
                                                        {symbol.icon}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-20 opacity-80"></div>
                            </div>
                        ))}
                    </div>

                    {hackStatus !== 'idle' && (
                        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-400 shadow-[0_0_20px_#eab308] animate-[scan_1.5s_linear_infinite]"></div>
                            <div className="absolute inset-0 bg-brand-500/5 backdrop-contrast-[1.2]"></div>
                        </div>
                    )}
                </div>

                <div className="mt-2 bg-slate-950 p-3 rounded-3xl border border-white/5 flex justify-between items-center relative h-20">
                    <div className="flex flex-col items-center pl-4">
                         <span className="text-[10px] text-brand-500 font-black uppercase tracking-widest mb-1">Aposta</span>
                         <span className="text-white font-black text-lg drop-shadow-sm font-mono">x100</span>
                    </div>

                    <div className="absolute left-1/2 -top-10 -translate-x-1/2">
                        <button 
                            onClick={startSpinSequence}
                            disabled={isSpinning}
                            className={`w-20 h-20 rounded-full border-[5px] transition-all active:translate-y-2 group shadow-[0_12px_0_rgba(0,0,0,0.8)] ${isWinning ? 'bg-gradient-to-b from-emerald-400 to-emerald-700 border-emerald-300' : 'bg-gradient-to-b from-red-500 via-red-600 to-red-800 border-red-300'}`}
                        >
                            <div className="w-full h-full rounded-full flex flex-col items-center justify-center shadow-[inset_0_4px_10px_rgba(255,255,255,0.3)]">
                                <Zap className={`w-5 h-5 text-white fill-white transition-all ${isSpinning ? 'animate-spin' : 'group-hover:scale-110'}`} />
                                <span className="text-white font-black text-[10px] tracking-tighter uppercase">Girar</span>
                            </div>
                        </button>
                    </div>

                    <div className="flex flex-col items-center pr-4">
                         <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Energia</span>
                         <div className="flex items-center gap-1.5">
                             <Zap className={`w-4 h-4 text-blue-400 fill-blue-400 transition-all ${isWinning && winType === 'spins' ? 'scale-150 text-emerald-400' : ''}`} />
                             <span className={`text-white font-black text-lg font-mono transition-all ${isWinning && winType === 'spins' ? 'text-emerald-400 scale-125' : ''}`}>{spins}</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* SYSTEM INTEGRATED CONSOLE */}
        <div className={`mt-auto transition-all duration-700 ${hackStatus !== 'idle' ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-2'}`}>
            <div className="bg-slate-950 border-t-2 border-brand-500/30 rounded-t-3xl p-5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-colors ${hackStatus === 'injected' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-brand-500/10 border-brand-500/30 text-brand-400'}`}>
                        {hackStatus === 'scanning' ? <Activity className="animate-pulse" size={24} /> : <Terminal size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                             <span className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                                <Cpu size={10} /> Core_v4.6.0_Kernel
                             </span>
                             <div className="flex gap-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${hackStatus === 'scanning' ? 'bg-brand-400 animate-bounce' : 'bg-slate-800'}`}></div>
                                <div className={`w-1.5 h-1.5 rounded-full ${hackStatus === 'injected' ? 'bg-emerald-400 animate-bounce' : 'bg-slate-800'}`}></div>
                             </div>
                        </div>
                        <div className="bg-black/40 rounded-lg p-2 border border-white/5">
                            <p className="text-[11px] text-white font-mono font-bold truncate leading-none">
                                {hackLog ? `> ${hackLog}` : "> WAITING_COMMAND_"}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-4">
                    <div 
                        className={`h-full transition-all duration-[4200ms] ease-out shadow-[0_0_10px_rgba(var(--brand-rgb),0.5)] ${hackStatus === 'injected' ? 'bg-emerald-500' : 'bg-brand-500'}`}
                        style={{ width: isSpinning ? '100%' : '0%' }}
                    ></div>
                </div>
            </div>
        </div>

      </div>

      <style>{`
        @keyframes scan {
            0% { transform: translateY(-20px); }
            100% { transform: translateY(200px); }
        }
      `}</style>

    </div>
  );
};
