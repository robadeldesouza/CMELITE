
import React, { useState, useEffect, useRef } from 'react';
import { TimelineMessage, Bot } from '../types';
import { 
  Play, Pause, RotateCcw, X, Send, Paperclip, 
  Users, ChevronDown, CheckCheck, Smile, Camera, CornerUpLeft,
  ArrowUpCircle, Shield, Crown, Star, User, Plus, Radio
} from 'lucide-react';

interface ChatPreviewProps {
  timeline: TimelineMessage[];
  bots: Bot[];
  onClose?: () => void;
  isWidgetMode?: boolean;
  onSendMessage?: (msg: TimelineMessage) => void;
}

interface ExtendedMessage extends TimelineMessage {
  isGoldReview?: boolean;
  user?: string;
  isUser?: boolean;
  isSystem?: boolean;
  isUserAdded?: boolean;
  replyTo?: ExtendedMessage;
}

const SYSTEM_PHRASES = [
    "Servidor ALPHA-1 reiniciado com sucesso.",
    "Servidor BETA-Ouro ativado em São Paulo - SP.",
    "Protocolo de camuflagem atualizado globalmente.",
    "Servidor Delta-Invisível migrado para node internacional.",
    "Nova rota de bypass estabelecida em Porto Alegre - RS."
];

export const ChatPreview: React.FC<ChatPreviewProps> = ({ timeline, bots, onClose, isWidgetMode = false, onSendMessage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<ExtendedMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTypers, setActiveTypers] = useState<string[]>([]);
  
  const [inputText, setInputText] = useState("");
  const [replyingTo, setReplyingTo] = useState<ExtendedMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participantsTab, setParticipantsTab] = useState<'membros' | 'grupos'>('membros');
  const [longPressMenu, setLongPressMenu] = useState<{ id: string } | null>(null);
  const [restrictedModal, setRestrictedModal] = useState<{ open: boolean; feature: string }>({ open: false, feature: '' });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPos = useRef<{ x: number, y: number, id: string } | null>(null);

  const calculateTypingTime = (text: string): number => {
    const charsPerSecond = 18; 
    const baseThinkingTime = 600; 
    const maxTypingTime = 4500; 
    
    const calculatedTime = (text.length / charsPerSecond) * 1000 + baseThinkingTime;
    const withRandomness = calculatedTime * (0.85 + Math.random() * 0.3); 
    
    return Math.min(maxTypingTime, withRandomness);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker && emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.8) {
        const rating = (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1);
        const goldMsg: ExtendedMessage = {
          id: `gold-rev-${Date.now()}`,
          botId: 'system',
          text: `Novo membro Elite avaliou o painel com ${rating} estrelas ⭐`,
          isGoldReview: true,
          timestamp: Date.now(),
          delayAfter: 0
        };
        setVisibleMessages(prev => [...prev, goldMsg]);
      } else if (rand < 0.1) {
        const sysMsg: ExtendedMessage = {
            id: `sys-auto-${Date.now()}`,
            botId: 'system',
            text: SYSTEM_PHRASES[Math.floor(Math.random() * SYSTEM_PHRASES.length)],
            isSystem: true,
            timestamp: Date.now(),
            delayAfter: 0
        };
        setVisibleMessages(prev => [...prev, sysMsg]);
      }
    }, 25000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollTimer = setTimeout(() => {
          container.scrollTo({
              top: container.scrollHeight,
              behavior: 'smooth'
          });
      }, 50);
      return () => clearTimeout(scrollTimer);
    }
  }, [visibleMessages, activeTypers]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const playNext = async () => {
      if (!isPlaying || currentIndex >= timeline.length) {
        setIsPlaying(false);
        return;
      }

      const msg = timeline[currentIndex];
      setActiveTypers(prev => [...new Set([...prev, msg.botId])]);
      
      const typingTime = calculateTypingTime(msg.text);
      await new Promise(r => { timeoutId = setTimeout(r, typingTime); });

      setActiveTypers(prev => prev.filter(id => id !== msg.botId));
      
      const newMsg: ExtendedMessage = { ...msg, timestamp: Date.now() };
      setVisibleMessages(prev => [...prev, newMsg]);
      
      await new Promise(r => { timeoutId = setTimeout(r, msg.delayAfter * 1000); });
      setCurrentIndex(prev => prev + 1);
    };

    if (isPlaying) { playNext(); }
    return () => clearTimeout(timeoutId);
  }, [isPlaying, currentIndex, timeline]);

  const handleReset = () => {
    setIsPlaying(false);
    setVisibleMessages([]);
    setCurrentIndex(0);
    setActiveTypers([]);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const msg: ExtendedMessage = {
      id: `user-${Date.now()}`,
      botId: 'user',
      text: inputText,
      timestamp: Date.now(),
      isUser: true,
      delayAfter: 0,
      replyTo: replyingTo || undefined
    };
    setVisibleMessages(prev => [...prev, msg]);
    setInputText("");
    setReplyingTo(null);
    setShowEmojiPicker(false);
    if (onSendMessage) onSendMessage(msg);
  };

  const handleEliteRestriction = (feature: string) => {
    setRestrictedModal({ open: true, feature });
    setLongPressMenu(null);
  };

  const handleTouchStart = (e: React.TouchEvent, msg: ExtendedMessage) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY, id: msg.id };
    longPressTimer.current = setTimeout(() => {
      setLongPressMenu({ id: msg.id });
    }, 600);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (!touchStartPos.current) return;
    const diffX = e.changedTouches[0].clientX - touchStartPos.current.x;
    if (diffX > 60) {
      const msg = visibleMessages.find(m => m.id === touchStartPos.current?.id);
      if (msg) setReplyingTo(msg);
    }
    touchStartPos.current = null;
  };

  const getMessageTheme = (msg: ExtendedMessage) => {
    if (msg.isGoldReview) return { bubble: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 border border-yellow-200/50 shadow-lg scale-95 mx-auto text-center py-1.5 px-4', text: 'text-white font-bold italic text-[11px]', tail: 'hidden' };
    if (msg.isUser) return { bubble: 'bg-[#dcf8c6]', text: 'text-slate-800', tail: 'bg-[#dcf8c6]' };
    
    // Suporte ao design Premium unificado para Sistema e UserAdded no preview
    if (msg.isSystem || msg.isUserAdded || (msg.botId === 'system' && (msg.text.includes('adicionado') || msg.text.includes('abriram')))) return { 
        bubble: 'bg-black/5 backdrop-blur-sm border border-black/5 mx-auto text-center py-2 px-5 rounded-full w-fit max-w-[95%] shadow-sm', 
        text: 'text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em]', 
        tail: 'hidden' 
    };

    const bot = bots.find(b => b.id === msg.botId);
    const n = bot?.name.toLowerCase() || '';
    if (n.includes('júlia')) return { bubble: 'bg-[#fdf2f8]', text: 'text-pink-900', tail: 'bg-[#fdf2f8]' };
    if (n.includes('alfredo')) return { bubble: 'bg-[#fce7f3]', text: 'text-pink-950', tail: 'bg-[#fce7f3]' };
    if (n.includes('flávio')) return { bubble: 'bg-[#fefce8]', text: 'text-amber-900', tail: 'bg-[#fefce8]' };
    
    return { bubble: 'bg-white', text: 'text-slate-800', tail: 'bg-white' };
  };

  return (
    <>
      {restrictedModal.open && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setRestrictedModal({ open: false, feature: '' })}></div>
          <div className="relative bg-slate-900 border border-brand-500/30 w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl animate-bounce-in">
            <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-500/30">
              <Crown className="w-8 h-8 text-brand-500" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Recurso Elite</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              A funcionalidade <span className="text-brand-400 font-bold">{restrictedModal.feature}</span> requer licença Vitalícia.
            </p>
            <button onClick={() => setRestrictedModal({ open: false, feature: '' })} className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl uppercase tracking-widest text-xs">ADQUIRIR ACESSO AGORA</button>
          </div>
        </div>
      )}

      <div className={`fixed z-[10005] overflow-hidden bg-[#e5ddd5] shadow-2xl transition-all duration-300 ${isWidgetMode ? 'bottom-6 right-6 w-[360px] h-[550px] rounded-2xl border border-slate-300' : 'top-20 right-8 w-[380px] h-[750px] rounded-[3rem] border-[10px] border-slate-900'}`}>
        
        <div className="bg-[#075e54] text-white p-4 flex items-center justify-between shrink-0 h-16 pt-6 z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div onClick={() => setShowParticipants(!showParticipants)} className="flex -space-x-3 cursor-pointer active:scale-95 transition-transform">
              {bots.slice(0, 3).map(b => (
                <img key={b.id} src={b.avatar} className="w-8 h-8 rounded-full border-2 border-[#075e54] object-cover" alt="" />
              ))}
            </div>
            <div className="min-w-0 cursor-pointer" onClick={() => setShowParticipants(!showParticipants)}>
              <h4 className="text-sm font-bold truncate">Elite VIP Group</h4>
              <span className="text-[10px] opacity-80 block truncate">clique para ver info...</span>
            </div>
          </div>
          <div className="flex gap-1">
            {!isWidgetMode && onClose && (
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {showParticipants && (
          <div className="absolute inset-0 z-50 bg-white animate-slide-in-right flex flex-col pt-4">
            <div className="p-4 border-b bg-slate-50">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-sm font-bold uppercase tracking-widest text-slate-600">Info do Grupo</h5>
                <button onClick={() => setShowParticipants(false)} className="p-1 hover:bg-slate-200 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex gap-6">
                {['membros', 'grupos'].map(tab => (
                    <button key={tab} onClick={() => setParticipantsTab(tab as any)} className={`pb-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${participantsTab === tab ? 'border-[#075e54] text-[#075e54]' : 'border-transparent text-slate-400'}`}>
                        {tab === 'membros' ? 'Participantes' : 'Grupos Elite'}
                    </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {participantsTab === 'membros' ? (
                <div className="space-y-1">
                  {bots.map(b => (
                    <div key={b.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-100 last:border-0">
                      <img src={b.avatar} className="w-12 h-12 rounded-full border shadow-sm" alt="" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{b.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Membro Elite</p>
                      </div>
                      <Shield size={14} className="ml-auto text-brand-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 p-2">
                  {[
                    { name: 'Troca de Cartas Raras', icon: Star, color: 'text-purple-500' },
                    { name: 'Troca de Cartas Douradas', icon: Crown, color: 'text-amber-500' }
                  ].map((g, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 group hover:border-emerald-500 transition-all cursor-pointer" onClick={() => handleEliteRestriction('Acesso a Grupos')}>
                      <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm ${g.color}`}><g.icon size={24} /></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-black">{g.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black">Restrito: Licença Vitalícia</p>
                      </div>
                      <ChevronDown className="-rotate-90 text-slate-300" size={18} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative scroll-smooth custom-scrollbar">
          {visibleMessages.map((msg) => {
            const isUserAdded = msg.isUserAdded || (msg.botId === 'system' && msg.text.includes('adicionado'));
            const isSystemNotify = msg.isSystem || (msg.botId === 'system' && msg.text.includes('abriram'));
            const bot = bots.find(b => b.id === msg.botId);
            const isUser = !!msg.isUser;
            const theme = getMessageTheme(msg);
            const isSelected = replyingTo?.id === msg.id;

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isUser ? 'items-end' : (isUserAdded || isSystemNotify ? 'items-center' : 'items-start')} animate-fade-in group relative`}
                onTouchStart={(e) => handleTouchStart(e, msg)}
                onTouchEnd={(e) => handleTouchEnd(e)}
                onMouseDown={() => { if(!isUserAdded && !isSystemNotify) longPressTimer.current = setTimeout(() => setLongPressMenu({ id: msg.id }), 600); }}
                onMouseUp={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
              >
                {isUserAdded || isSystemNotify ? (
                    <div className={`${theme.bubble} flex items-center gap-3 animate-slide-up-fade`}>
                        <div className="relative">
                            {isUserAdded ? (
                                <>
                                    <User size={14} className="text-blue-500" />
                                    <div className="absolute -top-1.5 -right-1.5 bg-blue-600 rounded-full p-0.5 border border-white shadow-sm">
                                        <Plus size={6} className="text-white" strokeWidth={4} />
                                    </div>
                                </>
                            ) : (
                                <Radio size={14} className="text-emerald-500 animate-pulse" />
                            )}
                        </div>
                        <span className={theme.text}>
                            {msg.text.replace('+👤 ', '')} {isUserAdded && !msg.text.includes('adicionado') ? 'foi adicionado' : ''}
                        </span>
                    </div>
                ) : (
                    <div className={`relative min-w-0 px-3 py-2 rounded-2xl shadow-sm cursor-pointer transition-all active:scale-[0.98] ${theme.bubble} ${theme.text} ${isUser ? 'rounded-tr-none' : (msg.isSystem || msg.isGoldReview ? '' : 'rounded-tl-none')} ${isSelected ? 'ring-2 ring-emerald-500' : ''}`}>
                        {theme.tail !== 'hidden' && (
                            <div className={`absolute top-0 w-3 h-4 ${theme.tail} ${isUser ? '-right-2 clip-tail-right' : '-left-2 clip-tail-left'}`}></div>
                        )}

                        {!isUser && !msg.isGoldReview && !msg.isSystem && (
                          <div className="flex justify-between items-center mb-1 gap-4">
                            <p className={`text-[10px] font-bold leading-none ${bot?.name.toLowerCase().includes('flávio') ? 'text-amber-600' : 'text-blue-600'}`}>{bot?.name}</p>
                            <CornerUpLeft size={10} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); }} />
                          </div>
                        )}

                        {msg.replyTo && (
                          <div className={`mb-2 p-2 rounded-lg border-l-4 text-[10px] overflow-hidden ${isUser ? 'bg-black/5 border-emerald-500' : 'bg-slate-100 border-blue-500'}`}>
                            <p className="font-bold truncate">{bots.find(b => b.id === msg.replyTo?.botId)?.name || 'Você'}</p>
                            <p className="italic leading-tight line-clamp-2">{msg.replyTo?.text}</p>
                          </div>
                        )}

                        <div className="flex items-end gap-2 flex-wrap sm:flex-nowrap">
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          {!msg.isGoldReview && !msg.isSystem && (
                            <div className="flex items-center gap-1 opacity-50 shrink-0">
                              <span className="text-[9px] font-medium uppercase">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {isUser && <CheckCheck size={12} className="text-blue-500" />}
                            </div>
                          )}
                        </div>

                        {longPressMenu?.id === msg.id && !msg.isGoldReview && !msg.isSystem && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-[100] flex gap-2 animate-bounce-in whitespace-nowrap">
                            <button onClick={() => handleEliteRestriction('Chamar no Privado')} className="text-[10px] font-black uppercase text-emerald-600 px-2">Chamar no Privado</button>
                            <div className="w-px h-3 bg-slate-200 self-center"></div>
                            <button onClick={() => setLongPressMenu(null)} className="text-[10px] font-bold text-slate-400 uppercase px-2">X</button>
                          </div>
                        )}
                    </div>
                )}
              </div>
            );
          })}

          {activeTypers.length > 0 && (
            <div className="flex items-end space-x-2 animate-pulse">
               <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 shrink-0">...</div>
               <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                 <div className="flex space-x-1">
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                 </div>
               </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-[#f0f0f0] border-t border-slate-300 flex flex-col shrink-0">
          {replyingTo && (
            <div className="flex items-center justify-between p-2 mb-2 bg-white border-l-4 border-emerald-500 rounded animate-slide-up-fade">
               <div className="min-w-0">
                  <p className="text-[10px] font-bold text-emerald-600">Respondendo a {bots.find(b => b.id === replyingTo.botId)?.name || 'Você'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{replyingTo.text}</p>
               </div>
               <button onClick={() => setReplyingTo(null)} className="p-1 text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="flex bg-white rounded-full items-center px-3 py-1 flex-1 shadow-sm">
              <Smile size={24} className="text-slate-400 mr-2 shrink-0 cursor-pointer" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
              <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Digite uma mensagem" className="flex-1 bg-transparent border-none text-sm text-black focus:ring-0 py-2 outline-none" />
              <Paperclip size={22} className="text-slate-400 ml-2 rotate-45 shrink-0 cursor-pointer" onClick={() => handleEliteRestriction('Anexos')} />
            </div>
            <button onClick={handleSend} className="w-11 h-11 bg-[#075e54] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
              <Send size={20} className="ml-1" />
            </button>
          </div>

          {!isWidgetMode && (
            <div className="mt-4 flex items-center justify-center gap-6 border-t pt-3 border-slate-200">
               <button onClick={handleReset} className="text-[9px] font-black uppercase text-slate-400 hover:text-red-500 flex items-center gap-1">
                 <RotateCcw size={12} /> Reset
               </button>
               <button onClick={() => setIsPlaying(!isPlaying)} className={`text-[9px] font-black uppercase flex items-center gap-1 ${isPlaying ? 'text-amber-500' : 'text-[#075e54]'}`}>
                 {isPlaying ? <><Pause size={12} /> Pausar Fluxo</> : <><Play size={12} /> Iniciar Fluxo</>}
               </button>
            </div>
          )}
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .clip-tail-left { clip-path: polygon(0 0, 100% 0, 100% 100%, 25% 100%, 0 70%); }
          .clip-tail-right { clip-path: polygon(0 0, 100% 0, 100% 70%, 75% 100%, 0 100%); }
        `}} />
      </div>
    </>
  );
};
