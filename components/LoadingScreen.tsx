
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Zap, Cpu, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onFinish: (lang: string) => void;
  isSiteReady: boolean;
}

const STATUS_MESSAGES = [
  "[BOOT] Handshake com MoonActive API... [OK]",
  "[NET] Nó estável localizado em BRA-SOUTH-1... [SUCCESS]",
  "[SEC] Protocolo Stealth 7 ativado em Ring-0... [ESTÁVEL]",
  "[DATA] RNG Seeds sincronizadas com precisão... [OK]",
  "[AUTH] Assinatura de dispositivo virtual validada... [SUCCESS]",
  "[BYPASS] Camada de camuflagem L7 injetada... [OK]",
  "[SYNC] Download de metadados de vilas ricas... [CONCLUÍDO]",
  "[DONE] Sistema 100% operacional e indetectável."
];

const LANGUAGES = [
  { id: 'pt', label: 'Português', flag: '🇧🇷' },
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'es', label: 'Español', flag: '🇪🇸' }
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish, isSiteReady }) => {
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coinsRef = useRef<any[]>([]);

  // Lógica do Canvas (Chuva de Moedas Metálicas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // ADICIONAR: Criar moedas em intervalos aleatórios
      if (Math.random() > 0.94) {
        coinsRef.current.push({
          x: Math.random() * canvas.width,
          y: -50,
          speed: 2 + Math.random() * 5,
          angle: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() - 0.5) * 0.2,
          size: 10 + Math.random() * 15,
          opacity: 1,
          phase: Math.random() * Math.PI // Para o efeito de rotação 3D
        });
      }

      // REMOVER e ATUALIZAR
      coinsRef.current.forEach((coin, index) => {
        coin.y += coin.speed;
        coin.phase += coin.spinSpeed;
        
        // Efeito de desvanecimento ao chegar no final
        if (coin.y > canvas.height - 100) {
          coin.opacity -= 0.02;
        }

        // Desenhar Moeda Dourada
        const currentWidth = Math.cos(coin.phase) * coin.size;
        
        ctx.save();
        ctx.globalAlpha = Math.max(0, coin.opacity);
        ctx.translate(coin.x, coin.y);
        
        // Brilho externo (Glow)
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#eab308";
        
        // Corpo da moeda com Gradiente
        const grad = ctx.createLinearGradient(-coin.size, -coin.size, coin.size, coin.size);
        grad.addColorStop(0, '#fde047');
        grad.addColorStop(0.5, '#ca8a04');
        grad.addColorStop(1, '#713f12');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.abs(currentWidth), coin.size, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Detalhe interno ($)
        if (Math.abs(currentWidth) > 5) {
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.font = `bold ${coin.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);
        }
        
        ctx.restore();
      });

      // FILTRAR: Remove moedas que saíram da tela ou ficaram transparentes
      coinsRef.current = coinsRef.current.filter(c => c.y < canvas.height + 50 && c.opacity > 0);
      
      animationFrame = requestAnimationFrame(update);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    update();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        const boost = isSiteReady ? 1.2 : 0.3;
        return prev + (Math.random() * boost);
      });
    }, 100);

    const msgTimer = setInterval(() => {
      setStatusIdx(prev => (prev + 1) % STATUS_MESSAGES.length);
    }, 1800);

    return () => {
      clearInterval(timer);
      clearInterval(msgTimer);
    };
  }, [isSiteReady]);

  useEffect(() => {
    if (selectedLang && progress >= 100 && isSiteReady && !isExiting) {
        setIsExiting(true);
        setTimeout(() => onFinish(selectedLang), 800);
    }
  }, [selectedLang, progress, isSiteReady, onFinish, isExiting]);

  return (
    <div className={`fixed inset-0 z-[4000] bg-[#020617] flex flex-col items-center justify-center overflow-hidden font-sans transition-all duration-1000 ease-in-out ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />
      
      <div className="relative z-10 w-full max-w-xl px-6 flex flex-col items-center">
        <div className="mb-10 animate-float">
            <div className="w-24 h-24 bg-brand-500 rounded-[2rem] flex items-center justify-center shadow-neon border-2 border-white/20">
                <Cpu className="w-12 h-12 text-white" />
            </div>
        </div>

        <h2 className="text-white font-display font-black text-2xl md:text-4xl uppercase tracking-[0.3em] mb-12 text-center">
          Sincronizar <span className="text-brand-500">Módulos</span>
        </h2>

        <div className="flex gap-4 mb-20">
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.id}
                    onClick={() => setSelectedLang(lang.id)}
                    className={`group flex flex-col items-center gap-3 p-6 rounded-[2.5rem] border-2 transition-all duration-500 ${
                        selectedLang === lang.id 
                        ? 'bg-brand-500 border-white shadow-neon scale-110 z-10' 
                        : 'bg-surface/30 border-border-dim hover:border-brand-500/50'
                    }`}
                >
                    <span className="text-5xl drop-shadow-lg group-hover:scale-110 transition-transform">{lang.flag}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedLang === lang.id ? 'text-black' : 'text-slate-500'}`}>
                        {lang.label}
                    </span>
                </button>
            ))}
        </div>

        <div className="w-full max-w-md space-y-4 bg-black/40 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Integrity</span>
                <span className="text-xs font-mono font-bold text-brand-500">{Math.floor(progress)}%</span>
            </div>
            
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-300 shadow-neon"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="h-6 flex items-center justify-center overflow-hidden">
                <p className="text-[10px] font-mono font-bold text-emerald-500 uppercase text-center animate-slide-up" key={statusIdx}>
                    > {STATUS_MESSAGES[statusIdx]}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
