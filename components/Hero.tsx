
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Zap, ChevronDown, Lock, Crown, Play, Pause, Loader2 } from 'lucide-react';
import { TerminalBackground } from './TerminalBackground';
import { useCore } from '../core/CoreContext';

// PADRONIZAÇÃO: Todos apontam para Eli.mp3 que é a fonte validada
const juliaAudioFile = '/assets/Eli.mp3';
const carlosAudioFile = '/assets/Eli.mp3';
const joaoPabloAudioFile = '/assets/Eli.mp3';

interface HeroProps {
  onNavigate: (id: string) => void;
  onOpenCheckout?: () => void;
  onOpenServerStatus: () => void;
  paused?: boolean;
}

const CompactAudioPlayer: React.FC<any> = ({ id, image, user, audioUrl, activeAudioId, onToggleActive, pausedMode }) => {
    const [playing, setPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const objectUrlRef = useRef<string | null>(null);

    // Sincroniza o estado de reprodução: se outro player for ativado, este para.
    useEffect(() => {
        if (activeAudioId !== id && playing) {
            audioRef.current?.pause();
            setPlaying(false);
        }
    }, [activeAudioId, id, playing]);

    // Cleanup: Revoga a URL da memória ao desmontar o componente
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
        };
    }, []);

    const togglePlay = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (pausedMode) return;

        if (playing) {
            audioRef.current?.pause();
            setPlaying(false);
            onToggleActive(null);
        } else {
            // LÓGICA DA FÓRMULA 03: FETCH BLOB + OBJECT URL
            if (!audioRef.current) {
                try {
                    setIsLoading(true);
                    const response = await fetch(audioUrl);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    
                    objectUrlRef.current = url;
                    audioRef.current = new Audio(url);
                    audioRef.current.volume = 0.8;
                    
                    audioRef.current.onended = () => {
                        setPlaying(false);
                        onToggleActive(null);
                    };
                } catch (err) {
                    console.error("Erro na Fórmula 03:", err);
                    setIsLoading(false);
                    return;
                } finally {
                    setIsLoading(false);
                }
            }
            
            try {
                await audioRef.current?.play();
                setPlaying(true);
                onToggleActive(id);
            } catch (err) {
                console.warn("Erro ao reproduzir:", err);
            }
        }
    };

    return (
        <div 
            onClick={togglePlay}
            className="flex flex-col items-center gap-2 group cursor-pointer touch-none select-none transition-transform active:scale-95"
        >
            <div className={`relative w-[50px] h-[50px] rounded-full overflow-hidden border-2 transition-all duration-500 ${playing ? 'border-brand-500 shadow-neon scale-110' : 'border-brand-500/20 group-hover:border-brand-500/50'}`}>
                <img src={image} alt={user} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" />
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${playing ? 'opacity-0' : 'opacity-100'}`}>
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : playing ? (
                        <Pause className="w-5 h-5 text-white fill-white" />
                    ) : (
                        <Play className="w-5 h-5 text-white fill-white ml-1" />
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center gap-1.5">
                <span className={`text-[8px] font-black uppercase tracking-[0.1em] transition-colors ${playing ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {user.split(' ')[0]}
                </span>
                <div className="flex items-center gap-0.5 h-3">
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-[2px] rounded-full transition-all duration-300 ${playing ? 'animate-pulse-fast bg-brand-400' : 'bg-brand-500/30'}`} 
                            style={{ 
                                height: playing ? `${Math.max(30, Math.random() * 100)}%` : `${40 + (i % 2) * 40}%`,
                                animationDelay: `${i * 0.1}s` 
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenCheckout, onOpenServerStatus, paused = false }) => {
  const { content } = useCore();
  const [activeAudioId, setActiveAudioId] = useState<number | null>(null);
  
  const handleVipClick = () => onOpenCheckout ? onOpenCheckout() : onNavigate('products');

  const audioTestimonials = [
      { id: 1, user: "Carlos Pereira", img: "https://randomuser.me/api/portraits/men/75.jpg", audioUrl: carlosAudioFile },
      { id: 2, user: "Olga Silva", img: "https://randomuser.me/api/portraits/women/68.jpg", audioUrl: juliaAudioFile },
      { id: 3, user: "João Pablo", img: "https://randomuser.me/api/portraits/men/85.jpg", audioUrl: joaoPabloAudioFile }
  ];

  return (
    <div className="relative pt-28 pb-20 sm:pt-40 sm:pb-32 overflow-hidden min-h-[90vh] flex flex-col justify-center bg-page">
      <div className="perf-low:hidden"><TerminalBackground paused={paused} /></div>
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] transition-all" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-[120px] transition-all" />
        <div className="absolute inset-0 bg-gradient-to-b from-page/80 via-transparent to-page/90"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center">
        <div>
          <button onClick={onOpenServerStatus} className="group inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-950/60 border border-brand-500/30 text-brand-400 text-sm font-bold mb-8 animate-fade-in-up backdrop-blur-md shadow-neon hover:bg-brand-950/80 hover:border-brand-500/50 hover:scale-105 transition-all cursor-pointer whitespace-nowrap">
            <div className="p-1 bg-brand-500/10 rounded-full group-hover:bg-brand-500/20 transition-colors"><ShieldCheck className="w-4 h-4 text-brand-400" /></div>
            <span className="tracking-widest font-mono text-xs md:text-sm border-r border-brand-500/30 pr-3 mr-1">BYPASS ATIVO v4.3</span>
            <span className="flex items-center gap-2 text-[10px] md:text-xs text-brand-300 font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                SISTEMA INDETECTÁVEL
            </span>
          </button>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-white mb-6 uppercase leading-[0.9]">
            {content.hero.titleLine1}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-100 to-brand-500 animate-shine bg-[length:200%_auto]">
              {content.hero.titleLine2}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-secondary mb-10 font-light leading-relaxed text-balance">{content.hero.subtitle}</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button onClick={handleVipClick} className="inline-flex justify-center items-center px-10 py-5 text-lg font-display font-bold tracking-wide rounded-full text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-neon hover:shadow-neon-strong hover:-translate-y-1 cursor-pointer w-full sm:w-auto uppercase gap-3 group whitespace-nowrap">
              <div className="relative">
                 <Crown className="w-5 h-5 text-brand-50 fill-brand-50" />
              </div>
              {content.hero.ctaButton}
              <ArrowRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-muted text-sm font-medium font-mono uppercase tracking-wider">
                <div className="flex items-center gap-2 whitespace-nowrap"><Lock className="w-4 h-4 text-secondary" /><span>Criptografia de Ponta</span></div>
                <div className="flex items-center gap-2 whitespace-nowrap"><Zap className="w-4 h-4 text-brand-500" /><span>Entrega Imediata</span></div>
            </div>

            <div className="flex flex-row flex-wrap justify-center items-center gap-10 md:gap-14 animate-fade-in mt-4">
                {audioTestimonials.map(audio => (
                    <CompactAudioPlayer 
                        key={audio.id}
                        id={audio.id}
                        image={audio.img}
                        user={audio.user}
                        pausedMode={paused}
                        audioUrl={audio.audioUrl}
                        activeAudioId={activeAudioId}
                        onToggleActive={setActiveAudioId}
                    />
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted/50 flex flex-col items-center gap-2 cursor-pointer hover:text-brand-400 transition-colors" onClick={() => onNavigate('products')}><ChevronDown className="w-8 h-8 opacity-70" /></div>
    </div>
  );
};
