
import React, { useState, useEffect, useRef } from 'react';
import { 
    MessageCircle, X, Send, ChevronDown, CheckCheck, Smile, 
    Users, Paperclip, CornerUpLeft, Shield, Heart, Dog, 
    Utensils, Flag, Star, Crown, Loader2, User, Plus, Radio,
    Clock, UserPlus
} from 'lucide-react';
import { useCore } from '../core/CoreContext';
import { useStore } from '../store';
import { generateUniqueIdentity } from '../data/names';

interface Message {
    id: string;
    originalId?: string;
    user: string;
    text: string;
    isUser: boolean;
    time: string;
    avatar?: string;
    isSystem?: boolean;
    isUserAdded?: boolean; // Flag para novos membros
    isGoldReview?: boolean;
    replyTo?: Message;
    hideQuote?: boolean;
}

const EMOJI_CATEGORIES = {
    smileys: { icon: Smile, list: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'] },
    animals: { icon: Dog, list: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊'] },
    food: { icon: Utensils, list: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅'] },
    symbols: { icon: Heart, list: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'] },
    flags: { icon: Flag, list: ['🇧🇷', '🇺🇸', '🇵🇹', '🇦🇷', '🇪🇸', '🇫🇷', '🇮🇹', '🇩🇪', '🇯🇵', '🇰🇷', '🇨🇳', '🇬🇧', '🇨🇦', '🇲🇽', '🇺🇾'] }
};

const TOOLS_LIST = [
    'Viking Quest Bot',
    'IA Oráculo (RNG)',
    'Shield Piercer',
    'Card Set Finisher',
    'Stealth 7 (Ghost)',
    'Time-Warp (Speed)',
    'Auto-Play Viking',
    'Bypass Anti-Ban'
];

interface FloatingChatProps {
    hasBottomOffset?: boolean;
    staticMode?: boolean;
    onCTA?: () => void;
}

export const FloatingChat: React.FC<FloatingChatProps> = ({ 
    hasBottomOffset = false, 
    staticMode = false,
    onCTA
}) => {
    const { features, content } = useCore();
    const { rooms, bots, persistentOnlineCount, setOnlineCount } = useStore();
    
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showParticipants, setShowParticipants] = useState(false);
    const [participantsTab, setParticipantsTab] = useState<'membros' | 'grupos'>('membros');
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [visibleLimit, setVisibleLimit] = useState(25);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    
    const [inputText, setInputText] = useState("");
    const [timelineIndex, setTimelineIndex] = useState(0);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeEmojiTab, setActiveEmojiTab] = useState<keyof typeof EMOJI_CATEGORIES>('smileys');
    const [restrictedModal, setRestrictedModal] = useState<{ open: boolean; feature: string }>({ open: false, feature: '' });
    const [longPressId, setLongPressId] = useState<string | null>(null);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const emojiButtonRef = useRef<SVGSVGElement>(null);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const touchStartPos = useRef<{ x: number, y: number, id: string } | null>(null);

    const activeRoom = rooms.find(r => r.id === 'r1') || rooms[0];
    const participantBots = activeRoom?.botIds.map(id => bots.find(b => b.id === id)).filter(Boolean) || [];

    const calculateTypingTime = (text: string): number => {
        const charsPerSecond = 20;
        const baseThinkingTime = 500;
        return Math.min(4000, (text.length / charsPerSecond) * 1000 + baseThinkingTime);
    };

    // Auto-scroll sempre que as mensagens mudarem ou alguém estiver digitando
    useEffect(() => {
        if (isOpen && scrollRef.current) {
            const container = scrollRef.current;
            const timer = setTimeout(() => {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [messages, typingUser, isOpen]);

    // Lógica para fechar o seletor de emojis ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showEmojiPicker && 
                emojiPickerRef.current && 
                !emojiPickerRef.current.contains(event.target as Node) &&
                !emojiButtonRef.current?.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmojiPicker]);

    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
            const min = parseInt(content.socialProof.recentOpensMin) || 10;
            const max = parseInt(content.socialProof.recentOpensMax) || 50;
            const delay = Math.random() * 2000 + 1000;

            const systemTimer = setTimeout(() => {
                const count = Math.floor(Math.random() * (max - min + 1)) + min;
                const text = (content.socialProof.recentOpensTemplate || "+{count} pessoas abriram o chat agora").replace('{count}', count.toString());
                
                const sysMsg: Message = {
                    id: `sys-open-${Date.now()}`,
                    user: "Sistema",
                    text: text,
                    isUser: false,
                    isSystem: true,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, sysMsg]);
            }, delay);

            return () => clearTimeout(systemTimer);
        }
    }, [isOpen, content.socialProof]);

    useEffect(() => {
        const min = parseInt(content.socialProof.chatOnlineMin) || 400;
        const max = parseInt(content.socialProof.chatOnlineMax) || 1500;
        
        if (persistentOnlineCount === null || persistentOnlineCount <= min) {
            setOnlineCount(Math.floor(Math.random() * (max - min + 1) + min));
        }
    }, [content.socialProof.chatOnlineMin, content.socialProof.chatOnlineMax, setOnlineCount, persistentOnlineCount]);

    useEffect(() => {
        if (staticMode || !activeRoom) return;
        
        const currentIdx = timelineIndex % activeRoom.timeline.length;
        const currentTask = activeRoom.timeline[currentIdx];
        const bot = bots.find(b => b.id === currentTask.botId);
        const typingDuration = calculateTypingTime(currentTask.text);
        
        const timer = setTimeout(() => {
            if (isOpen) setTypingUser(bot?.name || "Membro VIP");
            
            setTimeout(() => {
                let parentMessage: Message | undefined = undefined;
                if (currentTask.replyToId) {
                    parentMessage = [...messages].reverse().slice(0, 50).find(m => m.originalId === currentTask.replyToId);
                }

                const shouldAddRandomUser = Math.random() < 0.10;
                let randomUserMsg: Message | null = null;
                
                if (shouldAddRandomUser) {
                    const randomName = generateUniqueIdentity();
                    randomUserMsg = {
                        id: `sys-add-${Date.now()}`,
                        user: "Sistema",
                        text: randomName, 
                        isUser: false,
                        isSystem: true,
                        isUserAdded: true,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                }

                const newMsg: Message = {
                    id: `${currentTask.id}-${Date.now()}`,
                    originalId: currentTask.id,
                    user: bot?.name || "Membro VIP",
                    text: currentTask.text,
                    isUser: false,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    avatar: bot?.avatar,
                    replyTo: parentMessage,
                    hideQuote: currentTask.hideQuote
                };
                
                setTypingUser(null);
                setMessages(prev => randomUserMsg ? [...prev, randomUserMsg, newMsg] : [...prev, newMsg]);
                
                if (!isOpen) {
                    setUnreadCount(prev => prev + (randomUserMsg ? 2 : 1));
                }

                setTimelineIndex(prev => prev + 1);
            }, typingDuration);

        }, (currentTask.delayAfter || 5) * 1000);
        
        return () => clearTimeout(timer);
    }, [timelineIndex, activeRoom, bots, staticMode, isOpen, messages, content.socialProof.userAddedTemplate]);

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleLimit(prev => prev + 25);
            setIsLoadingMore(false);
            if (scrollRef.current) scrollRef.current.scrollTop = 100;
        }, 800);
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;
        const userMsg: Message = {
            id: `user-${Date.now()}`,
            user: "Você",
            text: inputText,
            isUser: true,
            replyTo: replyingTo || undefined,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setReplyingTo(null);
        setShowEmojiPicker(false);
    };

    const handleEliteRestriction = (feature: string) => {
        setRestrictedModal({ open: true, feature });
        setLongPressId(null);
    };

    const handleTouchStart = (e: React.TouchEvent, msg: Message) => {
        touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, id: msg.id };
        longPressTimer.current = setTimeout(() => setLongPressId(msg.id), 600);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        if (!touchStartPos.current) return;
        const diffX = e.changedTouches[0].clientX - touchStartPos.current.x;
        if (diffX > 60) {
          const msg = messages.find(m => m.id === touchStartPos.current?.id);
          if (msg) setReplyingTo(msg);
        }
        touchStartPos.current = null;
    };

    const getMessageTheme = (msg: Message) => {
        if (msg.isGoldReview) return { bubble: 'bg-gradient-to-r from-yellow-400 via-brand-500 to-yellow-600 border border-yellow-200/50 shadow-lg scale-95 mx-auto text-center py-1.5 px-4', text: 'text-white font-bold italic text-[11px]', tail: 'hidden' };
        if (msg.isUser) return { bubble: 'bg-[#dcf8c6]', text: 'text-slate-800', tail: 'bg-[#dcf8c6]' };
        
        // Estilo Premium Unificado para Sistema e UserAdded
        if (msg.isSystem || msg.isUserAdded) return { 
            bubble: 'bg-black/5 backdrop-blur-sm border border-black/5 mx-auto text-center py-2 px-5 rounded-full w-fit max-w-[95%] shadow-sm', 
            text: 'text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em]', 
            tail: 'hidden' 
        };
        
        const n = msg.user.toLowerCase();
        if (n.includes('júlia')) return { bubble: 'bg-[#fdf2f8]', text: 'text-pink-900', tail: 'bg-[#fdf2f8]' };
        if (n.includes('alfredo')) return { bubble: 'bg-[#fce7f3]', text: 'text-pink-950', tail: 'bg-[#fce7f3]' };
        if (n.includes('flávio')) return { bubble: 'bg-[#fefce8]', text: 'text-amber-900', tail: 'bg-[#fefce8]' };
        
        return { bubble: 'bg-white', text: 'text-slate-800', tail: 'bg-white' };
    };

    // Helper para gerar o status de ferramenta usada baseado no ID do bot para ser consistente
    const getBotToolStatus = (botId: string) => {
        const idNum = parseInt(botId.replace(/\D/g, '')) || 0;
        const tool = TOOLS_LIST[idNum % TOOLS_LIST.length];
        const min = (idNum % 14) + 1;
        return { tool, min };
    };

    const visibleMessages = messages.slice(-visibleLimit);
    const hasMore = messages.length > visibleLimit;

    return (
        <>
            {restrictedModal.open && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setRestrictedModal({ open: false, feature: '' })}></div>
                    <div className="relative bg-slate-900 border border-brand-500/30 w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl animate-bounce-in">
                        <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-500/30">
                            <Crown className="w-8 h-8 text-brand-500" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-4">
                            <span className="text-white">Recurso</span> <span className="text-red-600">Bloqueado</span>
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            Você não pode <span className="text-brand-400 font-bold uppercase">{restrictedModal.feature}</span> pois não está cadastrado ou ainda não é um <span className="text-brand-400 font-bold uppercase">Membro da Elite</span>.
                        </p>
                        <button 
                            onClick={() => {
                                setRestrictedModal({ open: false, feature: '' });
                                if (onCTA) onCTA();
                            }} 
                            className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl uppercase tracking-widest text-xs"
                        >
                            ADQUIRIR ACESSO AGORA
                        </button>
                    </div>
                </div>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className={`fixed z-[50] bottom-4 right-4 md:right-6 w-14 h-14 bg-brand-600 hover:bg-brand-500 text-white rounded-full shadow-neon flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${!isOpen && 'animate-bounce-slow'}`}>
                {isOpen ? <X className="w-6 h-6" /> : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <MessageCircle className="w-7 h-7" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-slate-900 shadow-xl animate-bounce-in ring-1 ring-white/10">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </div>
                )}
            </button>

            <div className={`fixed ${hasBottomOffset ? 'bottom-4 md:bottom-24' : 'bottom-4 md:bottom-6'} right-4 md:right-6 w-[calc(100vw-32px)] md:w-[380px] h-[600px] max-h-[80vh] bg-[#e5ddd5] border border-border-dim rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none translate-y-10'}`}>
                
                <div className="bg-[#075e54] text-white p-4 flex items-center justify-between shadow-md z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div onClick={() => setShowParticipants(!showParticipants)} className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-white/20 shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-105">
                            {activeRoom?.groupImage ? <img src={activeRoom.groupImage} className="w-full h-full object-cover" /> : <Users className="text-[#075e54] w-6 h-6" />}
                        </div>
                        <div className="cursor-pointer flex flex-col items-start" onClick={() => setShowParticipants(!showParticipants)}>
                            <h3 className="text-sm font-black uppercase tracking-widest leading-none truncate">{activeRoom?.name || 'Elite VIP Group'}</h3>
                            <div className="flex items-center justify-start gap-1 mt-1">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-tighter">{persistentOnlineCount} online</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors active:scale-90" title="Minimizar Chat">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                <div className="flex-1 relative overflow-hidden">
                    <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ${showParticipants ? '-translate-x-full' : 'translate-x-0'}`}>
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            
                            {hasMore && (
                                <div className="flex justify-center pb-4 border-b border-slate-300/30 mb-4">
                                    <button 
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        className="text-[10px] font-black uppercase tracking-widest bg-white/50 hover:bg-white text-slate-600 px-6 py-2 rounded-full transition-all flex items-center gap-2 shadow-sm border border-slate-300"
                                    >
                                        {isLoadingMore ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3 rotate-180" />}
                                        {isLoadingMore ? 'Sincronizando Histórico...' : 'Carregar mais 25 mensagens...'}
                                    </button>
                                </div>
                            )}

                            {visibleMessages.map((msg) => {
                                const theme = getMessageTheme(msg);
                                const isSelected = replyingTo?.id === msg.id;
                                
                                return (
                                    <div 
                                        key={msg.id} 
                                        className={`flex w-full mb-2 ${msg.isSystem ? 'justify-center' : (msg.isUser ? 'justify-end' : 'justify-start')} animate-fade-in relative group`}
                                        onTouchStart={(e) => handleTouchStart(e, msg)}
                                        onTouchEnd={handleTouchEnd}
                                        onMouseDown={() => { if(!msg.isSystem) longPressTimer.current = setTimeout(() => setLongPressId(msg.id), 600); }}
                                        onMouseUp={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
                                    >
                                        {msg.isSystem || msg.isUserAdded ? (
                                            <div className={`${theme.bubble} flex items-center gap-3 animate-slide-up-fade`}>
                                                <div className="relative">
                                                    {msg.isUserAdded ? (
                                                        <>
                                                            <User size={14} className="text-blue-500" />
                                                            <div className="absolute -top-1.5 -right-1.5 bg-blue-600 rounded-full p-0.5 border border-white dark:border-slate-900 shadow-sm">
                                                                <Plus size={6} className="text-white" strokeWidth={4} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <Radio size={14} className="text-emerald-500 animate-pulse" />
                                                    )}
                                                </div>
                                                <span className={theme.text}>
                                                    {msg.text}{msg.isUserAdded ? ' foi adicionado' : ''}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className={`flex items-center gap-2 max-w-[85%] ${msg.isUser ? 'flex-row' : 'flex-row-reverse'} ${msg.isSystem ? 'max-w-full' : ''}`}>
                                                
                                                {!msg.isSystem && !msg.isGoldReview && !msg.isUser && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); }}
                                                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full transition-all opacity-0 group-hover:opacity-100 text-slate-500 hover:text-emerald-600 shrink-0"
                                                        title="Responder"
                                                    >
                                                        <CornerUpLeft size={16} strokeWidth={2.5} />
                                                    </button>
                                                )}

                                                <div className={`relative min-w-0 ${msg.isSystem ? 'w-full flex justify-center' : ''}`}>
                                                    <div className={`relative px-3 py-2 rounded-2xl shadow-sm transition-all active:scale-[0.98] ${theme.bubble} ${theme.text} ${msg.isUser ? 'rounded-tr-none' : (msg.isSystem || msg.isGoldReview ? '' : 'rounded-tl-none')} ${isSelected ? 'ring-2 ring-emerald-500' : ''}`}>
                                                        {theme.tail !== 'hidden' && (
                                                            <div className={`absolute top-0 w-3 h-4 ${theme.tail} ${msg.isUser ? '-right-2 clip-tail-right' : '-left-2 clip-tail-left'}`}></div>
                                                        )}
                                                        
                                                        {!msg.isSystem && !msg.isUser && !msg.isGoldReview && (
                                                            <div className="flex justify-between items-center mb-1 gap-4">
                                                                <p className="text-[10px] font-black uppercase leading-none text-blue-600">
                                                                    {msg.user}
                                                                </p>
                                                            </div>
                                                        )}
                                                        
                                                        {msg.replyTo && !msg.hideQuote && (
                                                            <div className="mb-2 p-2 bg-black/5 border-l-4 border-emerald-500 rounded text-[10px] opacity-70 max-w-full overflow-hidden">
                                                                <p className="font-bold truncate">{msg.replyTo.user}</p>
                                                                <p className="italic leading-tight line-clamp-2">{msg.replyTo.text}</p>
                                                            </div>
                                                        )}

                                                        <div className="flex items-end gap-2 flex-wrap sm:flex-nowrap">
                                                            <p className={`text-sm leading-relaxed ${msg.isSystem ? 'text-center' : 'text-balance'}`}>{msg.text}</p>
                                                            {!msg.isSystem && !msg.isGoldReview && <span className="text-[9px] font-bold opacity-40 shrink-0 uppercase">{msg.time}</span>}
                                                        </div>

                                                        {longPressId === msg.id && !msg.isSystem && !msg.isGoldReview && (
                                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-[100] flex gap-2 animate-bounce-in whitespace-nowrap">
                                                                <button onMouseDown={(e) => { e.preventDefault(); handleEliteRestriction('chamar este membro no privado'); }} className="text-[10px] font-black uppercase text-emerald-600 px-2">Chamar no Privado</button>
                                                                <div className="w-px h-3 bg-slate-200 self-center"></div>
                                                                <button onMouseDown={(e) => { e.preventDefault(); setLongPressId(null); }} className="text-[10px] font-bold text-slate-400 uppercase px-2">X</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            
                            {typingUser && (
                                <div className="flex flex-col items-start gap-1 ml-2 mb-4 animate-fade-in">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1">
                                        {typingUser} está digitando...
                                    </span>
                                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {showEmojiPicker && (
                            <div ref={emojiPickerRef} className="absolute bottom-16 left-2 right-2 bg-white rounded-3xl shadow-2xl border border-slate-200 z-[40] animate-slide-up overflow-hidden flex flex-col h-[320px]">
                                <div className="flex bg-slate-50 border-b border-slate-100 px-2 py-2 justify-between items-center overflow-x-auto no-scrollbar shrink-0">
                                    {(Object.keys(EMOJI_CATEGORIES) as Array<keyof typeof EMOJI_CATEGORIES>).map(cat => {
                                        const CatIcon = EMOJI_CATEGORIES[cat].icon;
                                        return (
                                            <button key={cat} onClick={() => setActiveEmojiTab(cat)} className={`p-2 rounded-xl transition-all ${activeEmojiTab === cat ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'}`}>
                                                <CatIcon size={20} />
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-6 gap-4 custom-scrollbar items-center">
                                    {EMOJI_CATEGORIES[activeEmojiTab].list.map((emoji, i) => (
                                        <button key={i} onClick={() => setInputText(prev => prev + emoji)} className="text-2xl hover:scale-125 transition-transform">{emoji}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="p-2 bg-[#f0f0f0] border-t border-slate-300 shrink-0">
                            {replyingTo && (
                                <div className="p-2 bg-white border-l-4 border-emerald-500 rounded-lg mb-2 flex justify-between items-center animate-slide-up">
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-emerald-600">Respondendo a {replyingTo.user}</p>
                                        <p className="text-xs text-slate-500 truncate">{replyingTo.text}</p>
                                    </div>
                                    <X size={16} className="text-slate-400 cursor-pointer" onClick={() => setReplyingTo(null)} />
                                </div>
                            )}
                            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                                <div className="flex-1 bg-white rounded-full flex items-center px-3 py-1 shadow-sm border border-slate-200">
                                    <Smile 
                                        ref={emojiButtonRef}
                                        className="w-6 h-6 text-slate-400 cursor-pointer mr-2" 
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                                    />
                                    <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Digite uma mensagem" className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-black py-2 outline-none" />
                                    <Paperclip className="w-6 h-6 text-slate-400 cursor-pointer rotate-45 ml-2" onClick={() => handleEliteRestriction('enviar anexos')} />
                                </div>
                                <button type="submit" className="w-11 h-11 bg-[#075e54] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all shrink-0">
                                    <Send className="w-5 h-5 ml-1" />
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className={`absolute inset-0 flex flex-col bg-[#f0f2f5] transition-transform duration-300 z-[60] ${showParticipants ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="bg-white border-b border-slate-200 shadow-sm">
                            <div className="p-4 flex justify-between items-center"><h4 className="text-xs font-black text-[#075e54] uppercase tracking-widest">Info do Grupo</h4><button onClick={() => setShowParticipants(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={18}/></button></div>
                            <div className="flex px-4 gap-6">
                                {['membros', 'grupos'].map(tab => (
                                    <button key={tab} onClick={() => setParticipantsTab(tab as any)} className={`pb-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${participantsTab === tab ? 'border-[#075e54] text-[#075e54]' : 'border-transparent text-slate-400'}`}>{tab === 'membros' ? 'Participantes' : 'Grupos Elite'}</button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {participantsTab === 'membros' ? (
                                <div className="space-y-4">
                                    {participantBots.length > 0 ? participantBots.map(bot => {
                                        const status = getBotToolStatus(bot?.id || '0');
                                        return (
                                            <div key={bot?.id} className="flex items-center gap-4 border-b border-slate-100 pb-3 last:border-0 animate-fade-in group/member">
                                                <img src={bot?.avatar} className="w-11 h-11 rounded-full border border-slate-200 shadow-sm" alt={bot?.name} />
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-sm font-bold text-slate-900 truncate">{bot?.name}</h5>
                                                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-tight flex items-center gap-1.5">
                                                        <Clock size={10} className="text-emerald-500" />
                                                        Usou {status.tool} há {status.min} min
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div className="flex items-center gap-1.5 bg-brand-500/10 px-2 py-1 rounded-lg border border-brand-500/20">
                                                        <span className="text-[8px] font-black text-brand-600 uppercase tracking-tighter">Membro Elite</span>
                                                        <Shield size={12} className="text-brand-600" />
                                                    </div>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleEliteRestriction('adicionar um amigo'); }}
                                                        className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-full transition-all"
                                                        title="Adicionar aos Amigos"
                                                    >
                                                        <UserPlus size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest opacity-50">Sincronizando participantes...</div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {[
                                        { name: 'Troca de Cartas Raras', icon: Star, color: 'text-purple-500' },
                                        { name: 'Troca de Cartas Douradas', icon: Crown, color: 'text-amber-500' }
                                    ].map((g, i) => (
                                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 group hover:border-brand-500/50 transition-all cursor-pointer" onClick={() => handleEliteRestriction('acessar grupos exclusivos')}>
                                            <div className={`w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shadow-sm ${g.color}`}><g.icon size={24} /></div>
                                            <div className="flex-1">
                                                <h5 className="text-sm font-bold text-black">{g.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Restrito: Licença Vitalícia</p>
                                            </div>
                                            <ChevronDown className="-rotate-90 text-slate-300" size={18} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .clip-tail-left { clip-path: polygon(0 0, 100% 0, 100% 100%, 25% 100%, 0 70%); }
                .clip-tail-right { clip-path: polygon(0 0, 100% 0, 100% 70%, 75% 100%, 0 100%); }
            `}} />
        </>
    );
};
