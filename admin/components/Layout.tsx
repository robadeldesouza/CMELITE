
import React, { useEffect, useState, useRef } from 'react';
import { 
  Bot, MessageSquare, LayoutDashboard, Settings, Layers, Sun, Moon, 
  Sparkles, Zap, ShieldCheck, DollarSign, FileText, 
  Users, Database, LogOut, Briefcase, Activity, ChevronDown, Repeat, X,
  BookOpen, History, ListChecks, Menu as MenuIcon, Wrench
} from 'lucide-react';
import { useStore } from '../store';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExit?: () => void;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onExit, onLogout }) => {
  const theme = useStore(state => state.theme);
  const toggleTheme = useStore(state => state.toggleTheme);
  const useRealAI = useStore(state => state.useRealAI);
  const toggleAI = useStore(state => state.toggleAI);
  const appMode = useStore(state => state.appMode);
  const setAppMode = useStore(state => state.setAppMode);
  const isSystemOverlayActive = useStore(state => state.isSystemOverlayActive);
  const [showModeSwitcher, setShowModeSwitcher] = useState(false);
  
  // Estados para o Menu Inteligente
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const orchestrationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bots', label: 'Agentes', icon: Bot },
    { id: 'rooms', label: 'Campanhas', icon: MessageSquare },
    { id: 'templates', label: 'Ativos', icon: Layers },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  const adminItems = [
    { id: 'admin_overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin_tools', label: 'Ferramentas', icon: Wrench }, // Menu solicitado
    { id: 'admin_pricing', label: 'Faturamento', icon: DollarSign },
    { id: 'admin_content', label: 'Conteúdo', icon: FileText },
    { id: 'admin_automation', label: 'Automação', icon: Zap },
    { id: 'admin_users', label: 'Equipe', icon: Users },
    { id: 'admin_docs', label: 'Manual', icon: BookOpen },
    { id: 'admin_system', label: 'Registros', icon: Database },
  ];

  const activeMenuItems = appMode === 'admin' ? adminItems : orchestrationItems;

  // Lógica de Inatividade (3 Segundos)
  const resetInactivityTimer = () => {
    setIsMenuVisible(true);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    
    inactivityTimerRef.current = setTimeout(() => {
      setIsMenuVisible(false);
    }, 3000);
  };

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleAppMode = () => {
    const nextMode = appMode === 'admin' ? 'orchestration' : 'admin';
    setAppMode(nextMode);
    setShowModeSwitcher(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300 relative">
      
      {/* HEADER GLOBAL - OCULTO SE OVERLAY ATIVO */}
      <header className={`absolute top-0 left-0 right-0 z-[1001] px-6 py-4 flex justify-between items-center bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500 ${isSystemOverlayActive ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="relative">
          <div 
            className="flex items-center space-x-3 cursor-pointer group select-none hover:opacity-80 transition-opacity" 
            onClick={() => setShowModeSwitcher(!showModeSwitcher)}
          >
            <div className="relative w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm group-hover:border-blue-400 transition-all">
              {appMode === 'admin' ? (
                <Briefcase size={20} className="text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Activity size={20} className="text-blue-500" />
              )}
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                    {appMode === 'admin' ? 'Painel Admin' : 'Social Proof Pro'}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showModeSwitcher ? 'rotate-180' : ''}`} />
              </div>
              <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1 opacity-70">
                  CONTEXTO: {appMode === 'admin' ? 'SISTEMA' : 'OPERAÇÕES'}
              </span>
            </div>
          </div>

          {showModeSwitcher && (
            <div className="absolute top-full mt-4 left-0 w-64 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-2 animate-fade-in-up z-50 overflow-hidden ring-1 ring-black/5">
               <button 
                onClick={toggleAppMode}
                className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all group"
               >
                 <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                   {appMode === 'admin' ? <Activity size={18} /> : <Briefcase size={18} />}
                 </div>
                 <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Ir para {appMode === 'admin' ? 'Social Proof' : 'Administração'}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Mudar contexto do terminal</p>
                 </div>
               </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={toggleTheme}
             className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
             title="Alternar Tema"
           >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
           </button>
           <button 
             onClick={toggleAI} 
             className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${useRealAI ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'}`}
           >
              <Sparkles size={16} />
              <span className="text-[10px] font-bold uppercase tracking-tighter hidden sm:inline">{useRealAI ? 'IA Ativa' : 'IA Offline'}</span>
           </button>
           <button onClick={onLogout} className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-red-500 transition-all shadow-sm">
              <LogOut size={16} />
           </button>
           {onExit && (
             <button onClick={onExit} className="p-2 rounded-xl bg-slate-900 dark:bg-brand-600 text-white hover:bg-black dark:hover:bg-brand-500 transition-all shadow-sm">
                <X size={16} />
             </button>
           )}
        </div>
      </header>

      <main className={`flex-1 overflow-y-auto ${isSystemOverlayActive ? 'pt-0' : 'pt-24'} pb-32 px-4 sm:px-8 w-full max-w-7xl mx-auto scroll-smooth custom-scrollbar relative bg-slate-50 dark:bg-slate-950 transition-all duration-500`}>
        {children}
      </main>

      {/* FAB - Só aparece quando o menu some e overlay inativo */}
      {!isMenuVisible && !isSystemOverlayActive && (
        <button 
          onClick={resetInactivityTimer}
          className="fixed bottom-8 right-8 z-[1002] w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center transition-all animate-bounce-in hover:scale-110 active:scale-95"
          title="Mostrar Menu"
        >
          <MenuIcon size={24} />
        </button>
      )}

      {/* NAVEGAÇÃO INFERIOR - OCULTA SE OVERLAY ATIVO */}
      <nav 
        className={`fixed bottom-0 left-0 right-0 z-[1001] px-4 pb-8 pt-2 pointer-events-none transition-all duration-500 ${isMenuVisible && !isSystemOverlayActive ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        onMouseEnter={resetInactivityTimer}
        onTouchStart={resetInactivityTimer}
      >
        <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="bg-white dark:bg-slate-900 backdrop-blur-2xl border-2 border-slate-200 dark:border-slate-700 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] flex justify-around items-center p-2 relative ring-1 ring-white/20 overflow-x-auto no-scrollbar scroll-smooth transition-colors duration-300">
                {activeMenuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex flex-col items-center justify-center py-2 px-2 transition-all duration-300 relative min-w-[85px] shrink-0 ${isActive ? 'scale-110 -translate-y-1' : 'opacity-60 hover:opacity-100'}`}
                        >
                            <div className={`p-3 rounded-2xl transition-all duration-300 ${isActive ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xl shadow-blue-600/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest mt-2 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-500'} whitespace-nowrap`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
      </nav>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}} />
    </div>
  );
};
