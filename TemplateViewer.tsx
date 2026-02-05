
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, Layout, MousePointer2, Minus, Tag, 
  Component, Volume2, Search, ChevronRight, 
  Box, Palette, Eye, Copy, Check, Download,
  Code, Play, Pause, Music, Radio, Activity, 
  Terminal as TerminalIcon, Zap, Loader2
} from 'lucide-react';

type CatalogTab = 'banners' | 'buttons' | 'dividers' | 'badges' | 'icons' | 'players';

const TABS: { id: CatalogTab; label: string; icon: any }[] = [
    { id: 'banners', label: 'Top Banners', icon: Layout },
    { id: 'buttons', label: 'Botões', icon: MousePointer2 },
    { id: 'dividers', label: 'Divisórias', icon: Minus },
    { id: 'badges', label: 'Badges', icon: Tag },
    { id: 'icons', label: 'Ícones', icon: Component },
    { id: 'players', label: 'Players', icon: Volume2 }
];

const MOCK_PLAYERS = [
    { id: 'p1', name: 'Formula 01', variant: 'Singleton Audio Ref' },
    { id: 'p2', name: 'Formula 02', variant: 'Hidden HTML5 Tag' },
    { id: 'p3', name: 'Formula 03', variant: 'Fetch Blob ObjectURL' },
    { id: 'p4', name: 'Formula 04', variant: 'Constructor Setter' },
    { id: 'p5', name: 'Formula 05', variant: 'Forced Preload Auto' },
    { id: 'p6', name: 'Formula 06', variant: 'Web AudioContext API' },
    { id: 'p7', name: 'Formula 07', variant: 'Absolute Path (/assets)' },
    { id: 'p8', name: 'Formula 08', variant: 'Relative Path (assets/)' },
    { id: 'p9', name: 'Formula 09', variant: 'Load() Event Unlock' },
    { id: 'p10', name: 'Formula 10', variant: 'CrossOrigin Anonymous' }
];

const AudioTester: React.FC<{ id: string, variant: string }> = ({ id, variant }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Refs para os diferentes métodos
    const audioObj = useRef<HTMLAudioElement | null>(null);
    const tagRef = useRef<HTMLAudioElement>(null);
    const contextRef = useRef<AudioContext | null>(null);
    const bufferRef = useRef<AudioBuffer | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);

    // Método 01: Singleton
    const singletonAudio = useMemo(() => new Audio('/assets/Eli.mp3'), []);

    const togglePlay = async () => {
        try {
            setLoading(true);
            
            // LÓGICA POR FÓRMULA
            switch (id) {
                case 'p1': // Singleton
                    if (isPlaying) singletonAudio.pause();
                    else await singletonAudio.play();
                    setIsPlaying(!isPlaying);
                    break;

                case 'p2': // Tag HTML5
                    if (tagRef.current) {
                        if (isPlaying) tagRef.current.pause();
                        else await tagRef.current.play();
                        setIsPlaying(!isPlaying);
                    }
                    break;

                case 'p3': // Blob Object URL
                    if (!audioObj.current) {
                        const resp = await fetch('/assets/Eli.mp3');
                        const blob = await resp.blob();
                        const url = URL.createObjectURL(blob);
                        audioObj.current = new Audio(url);
                    }
                    if (isPlaying) audioObj.current.pause();
                    else await audioObj.current.play();
                    setIsPlaying(!isPlaying);
                    break;

                case 'p4': // Constructor Setter
                    if (!audioObj.current) {
                        audioObj.current = new Audio();
                        audioObj.current.src = '/assets/Eli.mp3';
                    }
                    if (isPlaying) audioObj.current.pause();
                    else await audioObj.current.play();
                    setIsPlaying(!isPlaying);
                    break;

                case 'p5': // Preload Auto
                    if (!audioObj.current) {
                        audioObj.current = new Audio('/assets/Eli.mp3');
                        audioObj.current.preload = "auto";
                    }
                    if (isPlaying) audioObj.current.pause();
                    else await audioObj.current.play();
                    setIsPlaying(!isPlaying);
                    break;

                case 'p6': // AudioContext (Low Level)
                    if (!contextRef.current) {
                        contextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                        const response = await fetch('/assets/Eli.mp3');
                        const arrayBuffer = await response.arrayBuffer();
                        bufferRef.current = await contextRef.current.decodeAudioData(arrayBuffer);
                    }
                    if (isPlaying) {
                        sourceRef.current?.stop();
                    } else {
                        sourceRef.current = contextRef.current.createBufferSource();
                        sourceRef.current.buffer = bufferRef.current;
                        sourceRef.current.connect(contextRef.current.destination);
                        sourceRef.current.start(0);
                        sourceRef.current.onended = () => setIsPlaying(false);
                    }
                    setIsPlaying(!isPlaying);
                    break;

                case 'p7': // Absolute Path
                    if (!audioObj.current) audioObj.current = new Audio('/assets/Eli.mp3');
                    if (isPlaying) audioObj.current.pause();
                    else await audioObj.current.play();
                    setIsPlaying(!isPlaying);
                    break;

                case 'p8': // Relative Path
                    if (!audioObj.current) audioObj.current = new Audio('assets/Eli.mp3');
                    if (isPlaying) audioObj.current.pause();
                    else await audioObj.current.play();
                    setIsPlaying(!isPlaying);
                    break;

                case 'p9': // Load() Unlock
                    if (!audioObj.current) audioObj.current = new Audio('/assets/Eli.mp3');
                    audioObj.current.load();
                    if (isPlaying) audioObj.current.pause();
                    else await audioObj.current.play();
                    setIsPlaying(!isPlaying);
                    break;

                case 'p10': // CrossOrigin
                    if (!audioObj.current) {
                        audioObj.current = new Audio();
                        audioObj.current.crossOrigin = "anonymous";
                        audioObj.current.src = '/assets/Eli.mp3';
                    }
                    if (isPlaying) audioObj.current.pause();
                    else await audioObj.current.play();
                    setIsPlaying(!isPlaying);
                    break;
            }
        } catch (err) {
            console.error(`Falha na ${variant}:`, err);
            alert(`Erro na ${variant}. Verifique o console.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {/* Tag para P2 */}
            {id === 'p2' && <audio ref={tagRef} src="/assets/Eli.mp3" />}
            
            <button 
                onClick={togglePlay}
                disabled={loading}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg border-2 ${
                    isPlaying 
                    ? 'bg-brand-500 border-white text-black scale-110' 
                    : 'bg-slate-800 border-slate-700 text-white hover:border-brand-400'
                }`}
            >
                {loading ? <Loader2 className="animate-spin" /> : isPlaying ? <Pause fill="currentColor" /> : <Play className="ml-1" fill="currentColor" />}
            </button>
            
            <div className="text-center">
                <p className="text-[10px] font-mono text-brand-500 font-bold uppercase mb-1">Status: {isPlaying ? 'REPRODUZINDO' : 'PARADO'}</p>
                <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-brand-500 transition-all duration-300 ${isPlaying ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                </div>
            </div>
        </div>
    );
};

export const TemplateViewer: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [activeTab, setActiveTab] = useState<CatalogTab>('players');

    return (
        <div className="fixed inset-0 z-[1000] bg-[#020617] flex flex-col animate-fade-in overflow-hidden">
            <header className="relative z-10 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 p-4 md:p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-neon">
                        <Palette className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-display font-black text-white uppercase tracking-tighter">
                            Laboratório de <span className="text-brand-500">Áudio</span>
                        </h2>
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                            Diagnostic Mode: Searching for working formula
                        </p>
                    </div>
                </div>
                <button onClick={onExit} className="p-2.5 bg-red-950/20 text-red-500 border border-red-900/30 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                    <X size={20} />
                </button>
            </header>

            <nav className="relative z-10 bg-slate-900/30 border-b border-white/5 px-4 overflow-x-auto no-scrollbar">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-6">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all ${
                                activeTab === tab.id ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500'
                            }`}
                        >
                            <tab.icon size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.02)_0%,transparent_70%)]">
                <div className="max-w-6xl mx-auto">
                    {activeTab === 'players' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {MOCK_PLAYERS.map((player) => (
                                <div key={player.id} className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:border-brand-500/30 transition-all group">
                                    <AudioTester id={player.id} variant={player.variant} />
                                    <div className="text-center mt-2">
                                        <h4 className="text-white font-bold text-xs uppercase">{player.name}</h4>
                                        <p className="text-[8px] text-slate-500 font-mono mt-1 uppercase tracking-tighter">{player.variant}</p>
                                    </div>
                                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-[8px] font-black text-brand-500 uppercase flex items-center gap-1">
                                            <Code size={10} /> Ver Código
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 opacity-20">
                            <Box size={64} className="mb-4 text-slate-500" />
                            <p className="text-sm font-mono uppercase tracking-widest text-slate-400">Selecione a aba Players para o teste</p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="bg-slate-950 border-t border-white/5 p-3 flex justify-between items-center text-[8px] font-mono text-slate-600 tracking-widest uppercase font-bold">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Diagnostic_Active</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Eli.mp3_Source_Loaded</span>
                </div>
                <div>ROOT_DIR: /assets/Eli.mp3</div>
            </footer>

            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 2px; }
            `}} />
        </div>
    );
};
