import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, ShoppingCart, Menu, X, Maximize, Minimize, Wifi, Cpu, ShieldAlert, Zap, ZapOff, Ghost, Layout } from 'lucide-react';
import { useCore } from '../core/CoreContext';

interface NavbarProps {
  onNavigate: (id: string) => void;
  onOpenCheckout?: () => void;
  hasBanner?: boolean;
  onOpenAdmin?: () => void;
  onOpenShowroom?: () => void;
  isLightMode?: boolean;
  onToggleLightMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
    onNavigate, 
    onOpenCheckout, 
    hasBanner = true, 
    onOpenAdmin,
    onOpenShowroom,
    isLightMode = false,
    onToggleLightMode
}) => {
  const { features } = useCore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY < 10) {
            setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
      }
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error("Erro ao tentar tela cheia:", e);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    onNavigate(id);
  };

  const handleVipClick = () => {
    if (onOpenCheckout) {
        setIsMenuOpen(false);
        onOpenCheckout();
    } else {
        onNavigate('products');
    }
  };

  const handleAdminClick = () => {
      setIsMenuOpen(false);
      if (onOpenAdmin) onOpenAdmin();
  };

  const handleShowroomClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsMenuOpen(false);
      if (onOpenShowroom) onOpenShowroom();
  };

  return (
    <nav 
        className={`fixed left-0 right-0 z-50 bg-page border-b border-border-dim transition-all duration-300 transform 
        ${hasBanner ? 'top-[41px] md:top-[44px]' : 'top-0'}
        ${isVisible ? 'translate-y-0' : '-translate-y-[200%]'}
        `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 group cursor-pointer whitespace-nowrap" onClick={(e) => handleNavClick(e, 'home')}>
            <div className="p-2 rounded-lg transition-all shadow-neon bg-brand-600 group-hover:bg-brand-500">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold tracking-wider text-white">
              CM <span className="text-brand-500">ELITE</span>
            </span>
          </div>

          <div className="hidden md:block">
            <div className="flex items-baseline space-x-2 lg:space-x-4">
              <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="text-secondary hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/5 whitespace-nowrap font-display uppercase tracking-widest">Início</a>
              <a href="#" onClick={(e) => handleNavClick(e, 'connectivity')} className="text-secondary hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/5 flex items-center gap-1 whitespace-nowrap font-display uppercase tracking-widest">
                 <Wifi className="w-3 h-3" /> Conexão
              </a>
              <a href="#" onClick={(e) => handleNavClick(e, 'ghost')} className="text-secondary hover:text-brand-400 px-3 py-2 rounded-md text-sm font-black transition-colors hover:bg-brand-500/5 flex items-center gap-1 whitespace-nowrap font-display uppercase tracking-widest">
                 <Ghost className="w-3 h-3 text-brand-500" /> Stealth 7
              </a>
              <a href="#" onClick={handleShowroomClick} className="text-secondary hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/5 flex items-center gap-1 whitespace-nowrap font-display uppercase tracking-widest">
                 <Layout className="w-3 h-3 text-brand-500" /> Catálogo
              </a>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-4">
            
            {/* Toggle Light Mode (Desktop) */}
            {onToggleLightMode && (
                <button 
                    onClick={onToggleLightMode}
                    className={`hidden md:flex p-2 rounded-lg transition-colors border ${isLightMode ? 'bg-white/10 text-white border-white/20' : 'text-secondary hover:text-white border-transparent hover:bg-surface-highlight'}`}
                    title={isLightMode ? "Desativar Modo Leve" : "Ativar Modo Leve (Economia de Energia)"}
                >
                    {isLightMode ? <ZapOff className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </button>
            )}

            {/* Atalho Admin (Escudo) */}
            {onOpenAdmin && (
                <button 
                    onClick={handleAdminClick}
                    className="flex p-2 text-secondary hover:text-white hover:bg-surface-highlight rounded-lg transition-colors"
                    title="Painel Administrativo"
                >
                    <ShieldAlert className="w-5 h-5" />
                </button>
            )}

            {/* Botão Full Screen */}
            <button 
              className="flex p-2 text-secondary hover:text-white transition-colors hover:bg-surface-highlight rounded-lg"
              onClick={toggleFullScreen}
              title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>

            <button 
              onClick={handleVipClick}
              className="hidden md:flex text-white px-5 py-2 rounded-full text-sm font-bold font-display tracking-wide transition-all shadow-neon hover:shadow-neon-strong transform hover:-translate-y-0.5 whitespace-nowrap bg-brand-600 hover:bg-brand-500"
            >
              MEMBRO VIP
            </button>
            <button 
              className="md:hidden text-secondary p-2 hover:bg-surface-highlight rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar Menu" : "Abrir Menu"}
            >
               {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[64px] bg-page z-40 animate-fade-in flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="block text-secondary hover:text-white hover:bg-surface-highlight/50 px-4 py-4 rounded-xl text-lg font-display font-bold border-b border-border-dim/50">
                🏠 Início
            </a>
            <a href="#" onClick={(e) => handleNavClick(e, 'connectivity')} className="block text-secondary hover:text-white hover:bg-surface-highlight/50 px-4 py-4 rounded-xl text-lg font-display font-bold border-b border-border-dim/50 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-brand-500" /> Teste de Conexão
            </a>
            <a href="#" onClick={(e) => handleNavClick(e, 'ghost')} className="block text-brand-400 hover:text-white hover:bg-surface-highlight/50 px-4 py-4 rounded-xl text-lg font-display font-black border-b border-border-dim/50 flex items-center gap-2">
                <Ghost className="w-5 h-5" /> Stealth 7
            </a>
            <a href="#" onClick={handleShowroomClick} className="block text-secondary hover:text-white hover:bg-surface-highlight/50 px-4 py-4 rounded-xl text-lg font-display font-bold border-b border-border-dim/50 flex items-center gap-2">
                <Layout className="w-5 h-5 text-brand-500" /> Catálogo de Banners
            </a>
            <a href="#" onClick={(e) => handleNavClick(e, 'specs')} className="block text-secondary hover:text-white hover:bg-surface-highlight/50 px-4 py-4 rounded-xl text-lg font-display font-bold border-b border-border-dim/50 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-yellow-500" /> Especificações Técnicas
            </a>
            
            {onToggleLightMode && (
                <button 
                    onClick={() => {
                        onToggleLightMode();
                        setIsMenuOpen(false);
                    }}
                    className={`w-full text-left block px-4 py-4 rounded-xl text-lg font-display font-bold border-b border-border-dim/50 flex items-center gap-2 transition-colors ${isLightMode ? 'text-white bg-white/10' : 'text-secondary hover:text-white hover:bg-surface-highlight/50'}`}
                >
                    {isLightMode ? <ZapOff className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    {isLightMode ? 'Modo Leve: ATIVADO' : 'Ativar Modo Leve'}
                </button>
            )}
            
            <div className="pt-6 px-2">
              <button 
                onClick={handleVipClick}
                className="w-full text-white font-display font-bold py-4 rounded-xl shadow-neon active:scale-95 transition-all text-lg flex items-center justify-center gap-2 uppercase tracking-wider whitespace-nowrap bg-gradient-to-r from-brand-600 to-emerald-600"
              >
                <ShoppingCart className="w-5 h-5" />
                Liberar Acesso VIP
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};