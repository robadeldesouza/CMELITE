
import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, User, Zap, MapPin } from 'lucide-react';
import { getRandomCity } from '../data/cities';
import { generateUniqueIdentity } from '../data/names';

const plans = ["Acesso Vitalício", "Plano Anual", "Pacote Elite", "Gerador de Spins"];

interface SalesToastProps {
    staticMode?: boolean;
}

export const SalesToast: React.FC<SalesToastProps> = ({ staticMode = false }) => {
  const [show, setShow] = useState(false);
  const [type, setType] = useState<'sale' | 'review'>('sale');
  const [data, setData] = useState({ name: '', action: '', detail: '', location: '' });
  
  // Estado para visibilidade baseada no scroll (Footer)
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // Monitora o scroll
  useEffect(() => {
    if (staticMode) return; // Otimização: não adiciona listener se estiver em modo estático

    const handleScroll = () => {
        const currentScroll = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        // Se estiver nos últimos 150px da página (Rodapé), marca como visível o footer
        const isNearBottom = (currentScroll + windowHeight) >= (docHeight - 150);
        setIsFooterVisible(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, [staticMode]);

  // Lógica do Toast com loop seguro (Correção do Memory Leak e Audio Leak)
  useEffect(() => {
    // SE O MODO LEVE ESTIVER ATIVO, MATA O PROCESSO IMEDIATAMENTE
    if (staticMode) {
        setShow(false);
        return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextToast = () => {
      // Intervalo aleatório entre 10 e 20 segundos
      const nextTime = Math.random() * (20000 - 10000) + 10000;
      
      timeoutId = setTimeout(() => {
          showToast();
      }, nextTime);
    };

    const showToast = () => {
      // Dupla verificação de segurança antes de executar qualquer lógica
      if (staticMode) return;

      const isSale = Math.random() > 0.3; // 70% Vendas, 30% Reviews
      const city = getRandomCity();
      const fullName = generateUniqueIdentity(); // Usa gerador centralizado
      const firstName = fullName.split(' ')[0];
      const lastNameInitial = fullName.split(' ')[1] ? fullName.split(' ')[1][0] : '';
      const displayName = `${firstName} ${lastNameInitial}.`;

      if (isSale) {
        const randomPlan = plans[Math.floor(Math.random() * plans.length)];
        setType('sale');
        setData({ 
          name: displayName,
          action: 'ativou o',
          detail: randomPlan,
          location: city
        });

        // AUDITORIA: BLOQUEIO RIGOROSO DE ÁUDIO NO MODO LEVE
        // Se staticMode for true, isso aqui NÃO pode rodar
        if (!document.hidden && !staticMode) {
            try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3');
                audio.volume = 0.2;
                audio.play().catch(e => console.warn("Audio autoplay blocked", e));
            } catch (e) {
                console.error(e);
            }
        }
      } else {
        setType('review');
        setData({
          name: displayName,
          action: 'avaliou com',
          detail: '5 estrelas',
          location: city
        });
      }

      setShow(true);
      
      // Oculta após 7 segundos e agenda o próximo
      setTimeout(() => {
          setShow(false);
          if (!staticMode) scheduleNextToast();
      }, 7000);
    };

    // Inicia o primeiro ciclo apenas se não estiver em modo estático
    if (!staticMode) {
        scheduleNextToast();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [staticMode]);

  // Se estiver em modo estático, não renderiza nada no DOM
  if (staticMode) return null;

  return (
    <div className={`fixed bottom-28 md:bottom-6 left-4 right-auto md:left-6 z-40 transition-all duration-500 ease-in-out pointer-events-none flex items-center md:max-w-sm w-[calc(100%-32px)] 
        ${show && !isFooterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
    `}>
      
      <div className="group relative w-full bg-surface/95 backdrop-blur-md border border-border-highlight p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center gap-3 pointer-events-auto ring-1 ring-white/10 hover:bg-surface-highlight transition-colors cursor-default">
        
        {/* Ícone Circular */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${type === 'sale' ? 'bg-gradient-to-br from-brand-600 to-emerald-900 border border-brand-500/30' : 'bg-gradient-to-br from-yellow-500 to-amber-800 border border-yellow-500/30'}`}>
        {type === 'sale' ? (
            <Zap className="w-5 h-5 text-white fill-white animate-pulse" />
        ) : (
            <Star className="w-5 h-5 text-white fill-white" />
        )}
        </div>

        {/* Texto */}
        <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
                <span className="text-primary font-bold text-xs truncate mr-2">{data.name}</span>
                <span className="text-[10px] text-muted flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3" /> {data.location.split('-')[0]}
                </span>
            </div>
            
            <div className="flex items-center gap-1">
                <span className="text-secondary text-xs">{data.action}</span>
                <span className={`text-xs font-bold truncate ${type === 'sale' ? 'text-brand-400' : 'text-yellow-400'}`}>
                    {data.detail}
                </span>
            </div>
        </div>

        {/* Badge Lateral */}
        {type === 'sale' && (
            <div className="flex pl-2 border-l border-border-dim shrink-0">
                <span className="flex items-center justify-center w-6 h-6 bg-emerald-500/10 rounded-full text-emerald-500">
                    <ShieldCheck className="w-4 h-4" />
                </span>
            </div>
        )}
      </div>
    </div>
  );
};
