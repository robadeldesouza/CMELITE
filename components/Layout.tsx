
import React, { useEffect, useState } from 'react';
import { 
  Bot, MessageSquare, LayoutDashboard, Settings, Layers, Sun, Moon, 
  Sparkles, Zap, ShieldCheck, DollarSign, FileText, 
  Users, Database, LogOut, Briefcase, Activity, ChevronDown, Repeat
} from 'lucide-react';
import { useStore } from '../store';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const theme = useStore(state => state.theme);
  const useRealAI = useStore(state => state.useRealAI);
  const toggleAI = useStore(state => state.toggleAI);
  const logout = useStore(state => state.logout);
  const appMode = useStore(state => state.appMode);
  const setAppMode = useStore(state => state.setAppMode);
  const [showModeSwitcher, setShowModeSwitcher] = useState(false);

  const orchestrationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bots', label: 'Agentes', icon: Bot },
    { id: 'rooms', label: 'Campanhas', icon: MessageSquare },
    { id: 'templates', label: 'Ativos', icon: Layers },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  const adminItems = [
    { id: 'admin_overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin_pricing', label: 'Faturamento', icon: DollarSign },
    { id: 'admin_content', label: 'Conteúdo', icon: FileText },
    { id: 'admin_users', label: 'Equipe', icon: Users },
    { id: 'admin_system', label: 'Registros', icon: Database },
  ];

  const activeMenuItems = appMode === 'admin' ? adminItems : orchestrationItems;

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleAppMode = () => {
    const nextMode = appMode === 'admin' ? 'orchestration' : 'admin';
    setAppMode(nextMode);
    setShowModeSwitcher(false);
  };

  const handleToggleAI = () => {
    const action = useRealAI ? 'desativar' : 'ativar';
    const confirmMessage = `Você deseja ${action} o motor de Inteligência Artificial (Gemini)?\n\nIsso alterará como os bots e conversas são processados.`;
    
    if (window.confirm(confirmMessage)) {
      toggleAI();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 text-slate-800 font-sans overflow-hidden transition-colors duration-500 relative">
      
      {/* CABEÇALHO SUPERIOR */}
      <header className="absolute top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-center bg-white/40 backdrop-blur-xl border-b border-blue-100/50 shadow-sm">
        <div className="relative">
          <div 
            className="flex items-center space-x-3 cursor-pointer group select-none hover:opacity-80 transition-opacity" 
            onClick={() => setShowModeSwitcher(!showModeSwitcher)}
          >
            <div className="relative w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm group-hover:border-blue-400 transition-all">
              {appMode === 'admin' ? (
                <Briefcase size={20} className="text-indigo-600" />
              ) : (
                <Activity size={20} className="text-blue-500 animate-pulse-slow" />
              )}
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-slate-800 tracking-tight uppercase">
                    {appMode === 'admin' ? 'Painel Administrativo' : 'Social Proof Pro'}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showModeSwitcher ? 'rotate-180' : ''}`} />
              </div>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1 opacity-70">
                  ESTADO: {useRealAI ? 'IA CONECTADA' : 'MODO LOCAL'}
              </span>
            </div>
          </div>

          {/* MENU DE TROCA DE MODO (FAB STYLE DROPDOWN) */}
          {showModeSwitcher && (
            <div className="absolute top-full mt-4 left-0 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl border border-blue-100 shadow-2xl p-2 animate-fade-in-up z-50 overflow-hidden ring-1 ring-black/5">
               <div className="px-4 py-2 border-b border-slate-100 mb-1">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alternar Terminal</p>
               </div>
               <button 
                onClick={toggleAppMode}
                className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-all group"
               >
                 <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                   {appMode === 'admin' ? <Activity size={18} /> : <Briefcase size={18} />}
                 </div>
                 <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">Ir para {appMode === 'admin' ? 'Social Proof' : 'Administração'}</p>
                    <p className="text-[10px] text-slate-500">Mudar contexto do sistema</p>
                 </div>
               </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={handleToggleAI} 
             className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md border transition-all ${useRealAI ? 'bg-indigo-100 border-indigo-200 text-indigo-600 shadow-sm' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'}`}
             title={useRealAI ? "IA Ativa (Clique para desativar)" : "IA em Standby (Clique para ativar)"}
           >
              <Sparkles size={16} />
              <span className="text-[10px] font-bold uppercase tracking-tighter hidden sm:inline">{useRealAI ? 'IA Ativa' : 'IA Offline'}</span>
           </button>
           <button onClick={logout} className="p-2 rounded-xl bg-white/40 border border-blue-100 text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-sm">
              <LogOut size={16} />
           </button>
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO */}
      <main className="flex-1 overflow-y-auto pt-24 pb-32 px-4 sm:px-8 w-full max-w-7xl mx-auto scroll-smooth custom-scrollbar relative">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* MENU INFERIOR COM SOMBRA E GLOW REFORÇADO */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-8 pt-2 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
            <div className="bg-white/80 backdrop-blur-2xl border-2 border-blue-200/50 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(59,130,246,0.4),0_0_20px_rgba(59,130,246,0.1)] flex justify-around items-center p-2 relative overflow-hidden ring-1 ring-white/50">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-400/10 to-transparent pointer-events-none"></div>
                
                {activeMenuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-500 relative min-w-[64px] ${isActive ? 'scale-110 -translate-y-1' : 'opacity-40 hover:opacity-70'}`}
                        >
                            <div className={`p-3 rounded-2xl transition-all duration-500 ${isActive ? 'bg-blue-600 text-white shadow-[0_8px_25px_rgba(37,99,235,0.4)] ring-2 ring-blue-400/30' : 'text-slate-600 border border-transparent hover:border-blue-100'}`}>
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider mt-2 transition-colors ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
      </nav>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.15) !important;
        }
      `}} />
    </div>
  );
};
