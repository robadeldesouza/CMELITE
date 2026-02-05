import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { ChatTemplate } from '../types';
import { 
  Sparkles, Check, X, ChevronLeft, ChevronRight, 
  Smartphone as MobileIcon, Tablet as TabletIcon, Monitor as DesktopIcon,
  Search, Terminal, Command, Cpu, Globe, Radio, Users, MoreVertical,
  Paperclip, Send, Image as ImageIcon, FileText, CornerUpLeft, Mic, Camera,
  CheckCheck, Star, Crown
} from 'lucide-react';
import { useStore } from '../store';

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void;
  onCancel: () => void;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface PreviewState {
  templateId: string;
  device: DeviceType;
}

const TEMPLATES: ChatTemplate[] = [
  { id: 'obsidian', name: 'Obsidian Onyx', style: 'Dark Stealth Luxury', primaryColor: '#0a0a0a', accentColor: '#FFD700', isDark: true, thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=600&h=400&fit=crop' },
  { id: 'nebula', name: 'Nebula Flux', style: 'Cyberpunk Glass', primaryColor: '#1a0b2e', accentColor: '#22D3EE', isDark: true, thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop' },
  { id: 'ethereal', name: 'Ethereal White', style: 'Minimalist High-End', primaryColor: '#f8fafc', accentColor: '#3B82F6', isDark: false, thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&h=400&fit=crop' },
  { id: 'titan', name: 'Titan Monolith', style: 'Neo-Brutalism', primaryColor: '#ffffff', accentColor: '#FF5F1F', isDark: false, thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&h=400&fit=crop' },
  { id: 'matrix', name: 'Matrix Green', style: 'Retro-Futurist', primaryColor: '#000000', accentColor: '#39FF14', isDark: true, thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop' },
  { id: 'zenith', name: 'Zenith Carbon', style: 'Automotive Sport', primaryColor: '#111111', accentColor: '#E30613', isDark: true, thumbnail: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=400&fit=crop' },
  { id: 'ice', name: 'Ice Sypher', style: 'Arctic Frosted', primaryColor: '#f0f9ff', accentColor: '#0ea5e9', isDark: false, thumbnail: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=600&h=400&fit=crop' },
  { id: 'solar', name: 'Solar Flare', style: 'NASA Aesthetic', primaryColor: '#ffffff', accentColor: '#FF4F00', isDark: false, thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop' },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, onCancel }) => {
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const setSystemOverlay = useStore(state => state.setSystemOverlay);

  useEffect(() => {
    setSystemOverlay(!!preview);
    return () => setSystemOverlay(false);
  }, [preview, setSystemOverlay]);

  const currentIndex = preview ? TEMPLATES.findIndex(t => t.id === preview.templateId) : -1;

  const navigateTemplate = (direction: 'next' | 'prev') => {
    if (!preview) return;
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % TEMPLATES.length 
      : (currentIndex - 1 + TEMPLATES.length) % TEMPLATES.length;
    setPreview({ ...preview, templateId: TEMPLATES[newIndex].id });
  };

  useLayoutEffect(() => {
    if (!preview) return;
    const calculateScale = () => {
      if (!stageRef.current) return;
      const margin = 48; 
      const stageW = stageRef.current.clientWidth - margin;
      const stageH = stageRef.current.clientHeight - margin;
      let targetW = 1280; let targetH = 800;
      if (preview.device === 'mobile') { targetW = 375; targetH = 750; }
      else if (preview.device === 'tablet') { targetW = 768; targetH = 950; }
      const scaleX = stageW / targetW; const scaleY = stageH / targetH;
      setScale(Math.min(scaleX, scaleY, 1));
    };
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [preview]);

  const activeTemplate = preview ? TEMPLATES[currentIndex] : null;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 animate-fade-in overflow-hidden relative select-none">
      <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-[60] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg"><Sparkles className="text-white" size={20} /></div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Engines Visual</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">DNA Visual do Chat</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-slate-400 hover:text-red-500 transition-all"><X size={20} /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {TEMPLATES.map((tmpl) => (
            <div key={tmpl.id} className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={tmpl.thumbnail} alt={tmpl.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <div className="flex gap-2 p-2 bg-white/90 rounded-2xl border border-white">
                      <button onClick={() => setPreview({ templateId: tmpl.id, device: 'desktop' })} className="p-2.5 text-slate-900 hover:bg-brand-500 hover:text-white rounded-xl transition-all"><DesktopIcon size={18} /></button>
                      <button onClick={() => setPreview({ templateId: tmpl.id, device: 'tablet' })} className="p-2.5 text-slate-900 hover:bg-brand-500 hover:text-white rounded-xl transition-all"><TabletIcon size={18} /></button>
                      <button onClick={() => setPreview({ templateId: tmpl.id, device: 'mobile' })} className="p-2.5 text-slate-900 hover:bg-brand-500 hover:text-white rounded-xl transition-all"><MobileIcon size={18} /></button>
                   </div>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-tighter truncate">{tmpl.name}</h3>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tmpl.accentColor }}></div>
                </div>
                <button onClick={() => onSelect(tmpl.id)} className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white transition-all shadow-md">Usar Engine</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {preview && activeTemplate && (
        <div className="fixed inset-0 z-[10002] flex flex-col bg-slate-200 animate-fade-in overflow-hidden touch-none">
          <div className="px-4 py-3 border-b border-slate-300 bg-white flex items-center justify-between z-50 shadow-sm">
             <button onClick={() => setPreview(null)} className="text-slate-500 hover:text-slate-900 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest"><ChevronLeft size={16} /> Voltar</button>
             <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 scale-90 sm:scale-100">
                {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((d) => (
                    <button key={d} onClick={() => setPreview({ ...preview, device: d })} className={`p-2 rounded-md transition-all ${preview.device === d ? 'bg-white text-brand-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                        {/* Fix: Replace incorrect dWidth with strokeWidth for Lucide icons */}
                        {d === 'desktop' && <DesktopIcon size={16} strokeWidth={2.5}/>}
                        {/* Fix: Replace incorrect dWidth with strokeWidth for Lucide icons */}
                        {d === 'tablet' && <TabletIcon size={16} strokeWidth={2.5}/>}
                        {/* Fix: Replace incorrect dWidth with strokeWidth for Lucide icons */}
                        {d === 'mobile' && <MobileIcon size={16} strokeWidth={2.5}/>}
                    </button>
                ))}
             </div>
             <button onClick={() => onSelect(activeTemplate.id)} className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Confirmar</button>
          </div>

          <div 
            ref={stageRef} 
            className="flex-1 overflow-hidden flex items-center justify-center relative p-8 group/stage"
          >
             <button onClick={() => navigateTemplate('prev')} className="absolute left-6 z-50 p-4 bg-white/80 hover:bg-white text-slate-900 rounded-full shadow-2xl transition-all opacity-0 group-hover/stage:opacity-100 hidden md:flex"><ChevronLeft size={32} /></button>
             <button onClick={() => navigateTemplate('next')} className="absolute right-6 z-50 p-4 bg-white/80 hover:bg-white text-slate-900 rounded-full shadow-2xl transition-all opacity-0 group-hover/stage:opacity-100 hidden md:flex"><ChevronRight size={32} /></button>

             <div 
               key={activeTemplate.id}
               className="transition-all duration-500 shadow-2xl flex flex-col overflow-hidden relative origin-center"
               style={{ 
                 width: preview.device === 'mobile' ? '375px' : preview.device === 'tablet' ? '768px' : '100%',
                 maxWidth: preview.device === 'desktop' ? '1280px' : 'none',
                 height: preview.device === 'mobile' ? '750px' : preview.device === 'tablet' ? '950px' : '100%',
                 maxHeight: preview.device === 'desktop' ? '800px' : 'none',
                 transform: `scale(${scale})`,
                 borderRadius: preview.device === 'desktop' ? '8px' : '44px',
                 border: preview.device === 'desktop' ? '1px solid #cbd5e1' : '12px solid #1e293b'
               }}
             >
                {preview.device !== 'desktop' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1e293b] rounded-b-[1.25rem] z-50"></div>}
                <ChatInterfaceTemplate template={activeTemplate} />
             </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .clip-tail-left { clip-path: polygon(0 0, 100% 0, 100% 100%, 25% 100%, 0 70%); }
        .clip-tail-right { clip-path: polygon(0 0, 100% 0, 100% 70%, 75% 100%, 0 100%); }
      `}} />
    </div>
  );
};

// MOTOR DE RENDERIZAÇÃO ESTILO WHATSAPP PARA PREVIEWS
const ChatInterfaceTemplate: React.FC<{ template: ChatTemplate }> = ({ template }) => {
  
  const styleConfig = {
    obsidian: {
      bg: 'bg-[#0a0a0a]',
      header: 'bg-[#111] border-b border-white/5 py-4',
      botBubble: 'bg-zinc-800 text-zinc-100 border border-white/5',
      userBubble: 'bg-[#FFD700] text-black border-none',
      input: 'bg-zinc-900 border-zinc-800 rounded-full',
      font: 'font-serif',
      accent: 'text-[#FFD700]'
    },
    nebula: {
      bg: 'bg-[#0d0221]',
      header: 'bg-white/5 backdrop-blur-xl border-b border-cyan-500/20 py-4',
      botBubble: 'bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 text-cyan-50',
      userBubble: 'bg-cyan-500/80 text-white border-none shadow-[0_0_15px_rgba(34,211,238,0.4)]',
      input: 'bg-black/40 backdrop-blur-xl border-cyan-500/30 rounded-full',
      font: 'font-sans',
      accent: 'text-cyan-400'
    },
    ethereal: {
      bg: 'bg-[#e5ddd5]', 
      header: 'bg-[#075e54] text-white py-4',
      botBubble: 'bg-white text-slate-800 shadow-sm border-none',
      userBubble: 'bg-[#dcf8c6] text-slate-800 shadow-sm border-none',
      input: 'bg-white border-transparent rounded-full',
      font: 'font-sans',
      accent: 'text-[#075e54]'
    },
    titan: {
      bg: 'bg-white',
      header: 'bg-white border-b-4 border-black py-4',
      botBubble: 'bg-white border-4 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
      userBubble: 'bg-[#FF5F1F] border-4 border-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
      input: 'bg-white border-4 border-black rounded-none',
      font: 'font-sans font-black',
      accent: 'text-[#FF5F1F]'
    },
    matrix: {
      bg: 'bg-black',
      header: 'bg-black border-b border-[#39FF14]/30 py-4',
      botBubble: 'bg-black border border-[#39FF14]/50 text-[#39FF14]',
      userBubble: 'bg-[#39FF14]/20 border border-[#39FF14] text-[#39FF14]',
      input: 'bg-black border-[#39FF14]/30 rounded-none',
      font: 'font-mono',
      accent: 'text-[#39FF14]'
    },
    zenith: {
      bg: 'bg-[#0f0f0f]',
      header: 'bg-red-600 py-4 shadow-lg',
      botBubble: 'bg-zinc-800 border-l-4 border-red-600 text-white italic',
      userBubble: 'bg-red-600 text-white italic',
      input: 'bg-zinc-900 border-zinc-800 rounded-none',
      font: 'font-sans italic',
      accent: 'text-red-500'
    },
    ice: {
      bg: 'bg-[#f0f9ff]',
      header: 'bg-blue-500 text-white py-4',
      botBubble: 'bg-white text-blue-900 shadow-sm border border-blue-100',
      userBubble: 'bg-blue-600 text-white shadow-md border-none',
      input: 'bg-white border-blue-100 rounded-full',
      font: 'font-sans',
      accent: 'text-blue-500'
    },
    solar: {
      bg: 'bg-slate-50',
      header: 'bg-slate-900 text-white py-4',
      botBubble: 'bg-white border border-slate-200 text-slate-900',
      userBubble: 'bg-[#FF4F00] text-white border-none',
      input: 'bg-white border-2 border-slate-900 rounded-md',
      font: 'font-sans uppercase tracking-tighter',
      accent: 'text-[#FF4F00]'
    }
  };

  const config = styleConfig[template.id as keyof typeof styleConfig] || styleConfig.ethereal;

  return (
    <div className={`w-full h-full flex flex-col ${config.bg} ${config.font} transition-all duration-500 overflow-hidden`}>
      
      {/* HEADER SIMULADO */}
      <div className={`flex items-center justify-between px-6 ${config.header} shrink-0 transition-all z-10`}>
         <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full overflow-hidden border shadow-sm ${template.id === 'titan' ? 'border-4 border-black rounded-none' : 'border-white/10'}`}>
               <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${template.id}&backgroundColor=b6e3f4`} alt="" />
            </div>
            <div>
               <h4 className={`text-sm font-bold truncate ${template.id === 'titan' || template.id === 'ethereal' || template.id === 'ice' || (template.id === 'solar' && !template.isDark) ? 'text-slate-900' : 'text-white'}`}>
                 {template.name}
               </h4>
               <span className={`text-[9px] uppercase tracking-widest opacity-60 font-black ${template.id === 'titan' || template.id === 'ethereal' || template.id === 'ice' || (template.id === 'solar' && !template.isDark) ? 'text-slate-500' : 'text-white'}`}>Ativo</span>
            </div>
         </div>
         <div className="flex gap-4 opacity-70">
            <Users size={18} />
            <MoreVertical size={18} />
         </div>
      </div>

      {/* ÁREA DE MENSAGENS COM BIQUINHO */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col custom-scrollbar">
         
         <div className="flex flex-col items-start max-w-[85%]">
            <div className={`relative px-4 py-3 rounded-2xl rounded-tl-none ${config.botBubble} shadow-sm transition-all`}>
               {/* Tail Left */}
               <div className={`absolute top-0 -left-2 w-3 h-4 ${config.botBubble.split(' ')[0]} clip-tail-left`}></div>
               <p className="text-xs leading-relaxed">
                 Bem-vindo à engine <span className={`font-black ${config.accent}`}>{template.name}</span>. Todos os balões possuem o biquinho estilo WhatsApp.
               </p>
               <div className="text-[8px] text-right mt-1 opacity-40 font-bold uppercase">10:42 AM</div>
            </div>
         </div>

         <div className="flex flex-col items-end self-end max-w-[85%]">
            <div className={`relative px-4 py-3 rounded-2xl rounded-tr-none ${config.userBubble} shadow-md transition-all`}>
               {/* Tail Right */}
               <div className={`absolute top-0 -right-2 w-3 h-4 ${config.userBubble.split(' ')[0]} clip-tail-right`}></div>
               <p className="text-xs leading-relaxed font-medium">
                 O biquinho herda as propriedades de borda e sombra da engine automaticamente. Perfeito!
               </p>
               <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                  <span className="text-[8px] font-bold">10:43 AM</span>
                  <CheckCheck size={10} strokeWidth={3} />
               </div>
            </div>
         </div>

         <div className="flex flex-col items-start max-w-[85%]">
            <div className={`relative p-1 rounded-2xl rounded-tl-none ${config.botBubble} shadow-sm overflow-hidden`}>
               <div className={`absolute top-0 -left-2 w-3 h-4 ${config.botBubble.split(' ')[0]} clip-tail-left`}></div>
               <div className="rounded-xl overflow-hidden mb-1">
                  <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=300&h=200&fit=crop" className="w-full h-32 object-cover opacity-80" alt="" />
               </div>
               <div className="px-3 pb-2 pt-1">
                  <p className="text-[10px] font-bold italic opacity-70">audit_log_preview.jpg</p>
               </div>
            </div>
         </div>
      </div>

      {/* INPUT BAR */}
      <div className={`p-3 border-t ${template.id === 'obsidian' || template.id === 'matrix' || template.isDark ? 'border-white/5 bg-black/20' : 'border-black/5 bg-white'} shrink-0`}>
         <div className="flex items-center gap-3">
            <div className={`flex flex-1 items-center gap-3 p-2 border ${config.input} transition-all`}>
               <div className="flex gap-2 opacity-40">
                   <ImageIcon size={18} />
                   <Camera size={18} />
               </div>
               <div className="flex-1 text-[11px] opacity-30 italic font-medium px-1 truncate">Mensagem...</div>
               <Mic size={18} className="opacity-40" />
            </div>
            <button className={`w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all ${template.id === 'obsidian' ? 'bg-[#FFD700] text-black' : template.id === 'matrix' ? 'bg-[#39FF14] text-black' : template.id === 'zenith' ? 'bg-red-600 text-white' : (template.id === 'ethereal' ? 'bg-[#075e54] text-white' : 'bg-brand-600 text-white')}`}>
               <Send size={18} className="ml-1" />
            </button>
         </div>
      </div>

      {template.id === 'matrix' && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50"></div>
      )}
    </div>
  );
};
