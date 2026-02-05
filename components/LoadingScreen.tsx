
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react'; 

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
  "[DONE] Sistema 100% operacional."
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
  const requestRef = useRef<number>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); 
    if (!ctx) return;

    const update = () => {
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() > 0.95 && coinsRef.current.length < 50) {
        coinsRef.current.push({
          x: Math.random() * canvas.width,
          y: -50,
          speed: 2 + Math.random() * 4,
          spinSpeed: (Math.random() - 0.5) * 0.15,
          size: 8 + Math.random() * 12,
          opacity: 1,
          phase: Math.random() * Math.PI
        });
      }

      for (let i = coinsRef.current.length - 1; i >= 0; i--) {
        const coin = coinsRef.current[i];
        coin.y += coin.speed;
        coin.phase += coin.spinSpeed;
        
        if (coin.y > canvas.height - 100) coin.opacity -= 0.03;

        if (coin.opacity <= 0 || coin.y > canvas.height + 20) {
          coinsRef.current.splice(i, 1);
          continue;
        }

        const currentWidth = Math.cos(coin.phase) * coin.size;
        
        ctx.save();
        ctx.globalAlpha = Math.max(0, coin.opacity);
        ctx.translate(coin.x, coin.y);
        
        const grad = ctx.createLinearGradient(-coin.size, -coin.size, coin.size, coin.size);
        grad.addColorStop(0, '#fef08a');
        grad.addColorStop(0.5, '#eab308');
        grad.addColorStop(1, '#854d0e');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.abs(currentWidth), coin.size, 0, 0, Math.PI * 2);
        ctx.fill();
        
        if (Math.abs(currentWidth) > 6) {
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.font = `bold ${coin.size * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);
        }
        ctx.restore();
      }
      
      requestRef.current = requestAnimationFrame(update);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    requestRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + (isSiteReady ? 1.5 : 0.4);
      });
    }, 100);

    const msgTimer = setInterval(() => {
      setStatusIdx(prev => (prev + 1) % STATUS_MESSAGES.length);
    }, 1500);

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
    <div className={`fixed inset-0 z-[4000] bg-[#020617] flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ${isExiting ? 'opacity-0 scale-110' : 'opacity-100'}`}>
      <style>{`
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-shine {
          animation: shine 3s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" />
      
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
        
        {/* TEXTO SUPERIOR - BEM VINDO AO (AUMENTADO PARA IGUALAR AO CM ELITE) */}
        <h3 className="text-brand-500 font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.1em] uppercase mb-4 animate-pulse font-black text-center drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">
            BEM VINDO AO
        </h3>

        {/* LOGO IMAGEM */}
        <div className="mb-4 animate-float relative z-20">
            <img 
                src="https://i.imgur.com/Yp5kB1F.png" 
                alt="Elite Protocol Logo" 
                className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain drop-shadow-[0_0_50px_rgba(234,179,8,0.4)] filter brightness-110"
            />
        </div>

        {/* CM ELITE - TEXTO PERSONALIZADO (AZUL E OURO POLIDO BRILHANDO) */}
        <div className="mb-10 flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tighter flex items-center gap-4 md:gap-8">
                <span className="text-blue-600 drop-shadow-[0_0_30px_rgba(37,99,235,0.8)] filter brightness-125">CM</span>
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#fef08a] via-[#eab308] to-[#854d0e] animate-shine bg-[length:200%_auto] drop-shadow-[0_4px_15px_rgba(0,0,0,1)] filter brightness-110">
                    ELITE
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-shine pointer-events-none mix-blend-overlay"></div>
                </span>
            </h1>
            <div className="mt-2 h-1.5 w-64 md:w-96 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
        </div>

        {/* SELEÇÃO DE IDIOMA - BANDEIRAS MENORES E BOTÕES COMPACTOS */}
        <div className="flex gap-4 mb-8">
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.id}
                    onClick={() => setSelectedLang(lang.id)}
                    className={`group flex flex-col items-center gap-2 p-4 md:p-5 rounded-[2rem] border-2 transition-all duration-300 ${
                        selectedLang === lang.id 
                        ? 'bg-brand-500 border-white shadow-neon scale-105' 
                        : 'bg-slate-900/50 border-white/5 hover:border-brand-500/40'
                    }`}
                >
                    <span className="text-3xl md:text-4xl drop-shadow-md group-hover:scale-110 transition-transform">{lang.flag}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedLang === lang.id ? 'text-black' : 'text-slate-500'}`}>
                        {lang.label}
                    </span>
                </button>
            ))}
        </div>

        {/* STATUS DE PROGRESSO - APROXIMADO DAS BANDEIRAS */}
        <div className="w-full max-w-lg space-y-4 bg-black/70 p-8 rounded-[3rem] border border-white/10 backdrop-blur-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronizando Protocolos de Elite</span>
                <span className="text-base font-mono font-bold text-brand-500">{Math.floor(progress)}%</span>
            </div>
            
            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div 
                    className="h-full bg-gradient-to-r from-blue-600 via-brand-500 to-blue-400 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="h-4 flex items-center justify-center overflow-hidden">
                <p className="text-[10px] font-mono font-bold text-emerald-500 uppercase text-center opacity-80" key={statusIdx}>
                    > {STATUS_MESSAGES[statusIdx]}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
