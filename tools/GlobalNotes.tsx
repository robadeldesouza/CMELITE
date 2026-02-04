
import React, { useState, useEffect, useRef } from 'react';
import { 
  ClipboardList, CheckSquare, Square, Trash2, CornerDownLeft, 
  Copy, Check, ArrowLeft, Download, GripVertical, Move, 
  Target, Crosshair, MousePointerClick, Code, Plus, X
} from 'lucide-react';

interface NoteItem {
  id: string;
  text: string;
  context: string;
  timestamp: number;
  isCompleted: boolean;
  domSelector?: string; // Seletor do elemento vinculado
  elementPreview?: string; // Preview do elemento (tag + classes)
}

interface GlobalNotesProps {
  forcedContext?: string; 
  storageKey?: string;    
  onHide?: () => void;    
}

const TRIGGER_POS_KEY = 'cm_elite_notes_trigger_pos';
const PANEL_POS_KEY = 'cm_elite_notes_panel_pos';

// Função para gerar um seletor CSS amigável para o desenvolvedor
const getFriendlySelector = (el: HTMLElement): { selector: string, preview: string } => {
    let path: string[] = [];
    let current: HTMLElement | null = el;
    
    while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();
        if (current.id) {
            selector += `#${current.id}`;
            path.unshift(selector);
            break; 
        } else {
            let className = current.className;
            if (typeof className === 'string' && className.trim()) {
                selector += `.${className.trim().split(/\s+/)[0]}`;
            }
            path.unshift(selector);
        }
        current = current.parentElement;
    }
    
    const fullSelector = path.join(' > ');
    
    let classNamePart = '';
    if (typeof el.className === 'string' && el.className.trim()) {
        classNamePart = '.' + el.className.trim().split(/\s+/)[0];
    }
    const preview = `${el.tagName.toLowerCase()}${classNamePart}`;
    
    return { selector: fullSelector, preview };
};

export const GlobalNotes: React.FC<GlobalNotesProps> = ({ 
    forcedContext, 
    storageKey, 
    onHide 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [isInspecting, setIsInspecting] = useState(false);
  const [hoveredNoteSelector, setHoveredNoteSelector] = useState<string | null>(null);

  const [focusMode, setFocusMode] = useState<{ active: boolean; id: string | null; text: string; selector?: string; preview?: string }>({
      active: false,
      id: null,
      text: ''
  });
  
  // ESTADOS DE ARRASTE
  const [triggerPos, setTriggerPos] = useState(() => {
    const saved = localStorage.getItem(TRIGGER_POS_KEY);
    return saved ? JSON.parse(saved) : { x: 16, y: 480 };
  });

  const [panelPos, setPanelPos] = useState(() => {
    const saved = localStorage.getItem(PANEL_POS_KEY);
    return saved ? JSON.parse(saved) : { x: window.innerWidth / 2 - 225, y: window.innerHeight / 2 - 300 };
  });

  const [isDraggingTrigger, setIsDraggingTrigger] = useState(false);
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const focusInputRef = useRef<HTMLTextAreaElement>(null);
  const currentContext = forcedContext || 'CoinMaster';
  const effectiveStorageKey = storageKey || `cm_elite_notes_v1_${currentContext}`;

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem(effectiveStorageKey);
            if (saved) return JSON.parse(saved);
        } catch (e) {}
    }
    return [];
  });

  // Salvar Notas
  useEffect(() => {
    localStorage.setItem(effectiveStorageKey, JSON.stringify(notes));
  }, [notes, effectiveStorageKey]);

  // LÓGICA DE ARRASTE GLOBAL
  useEffect(() => {
    if (!isDraggingTrigger && !isDraggingPanel) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        if (isDraggingTrigger) {
            const newPos = { x: clientX - dragOffset.current.x, y: clientY - dragOffset.current.y };
            setTriggerPos(newPos);
        } else if (isDraggingPanel) {
            const newPos = { x: clientX - dragOffset.current.x, y: clientY - dragOffset.current.y };
            setPanelPos(newPos);
        }
    };

    const handleEnd = () => {
        if (isDraggingTrigger) localStorage.setItem(TRIGGER_POS_KEY, JSON.stringify(triggerPos));
        if (isDraggingPanel) localStorage.setItem(PANEL_POS_KEY, JSON.stringify(panelPos));
        setIsDraggingTrigger(false);
        setIsDraggingPanel(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingTrigger, isDraggingPanel, triggerPos, panelPos]);

  const startDraggingTrigger = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragOffset.current = { x: clientX - triggerPos.x, y: clientY - triggerPos.y };
    setIsDraggingTrigger(true);
  };

  const startDraggingPanel = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragOffset.current = { x: clientX - panelPos.x, y: clientY - panelPos.y };
    setIsDraggingPanel(true);
  };

  // LÓGICA DO MODO INSPETOR
  useEffect(() => {
    if (!isInspecting) return;

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('.layout-notes-ui')) return;
        target.style.outline = '2px dashed #3b82f6';
        target.style.outlineOffset = '2px';
    };

    const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        target.style.outline = '';
    };

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.target as HTMLElement;
        if (target.closest('.layout-notes-ui')) return;

        const { selector, preview } = getFriendlySelector(target);
        
        target.style.outline = '';
        setFocusMode(prev => ({ 
            ...prev, 
            selector, 
            preview,
            text: prev.text || `[Link: ${preview}] ` 
        }));
        
        setIsInspecting(false);
        setIsOpen(true);
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, { capture: true });

    return () => {
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [isInspecting]);

  // LÓGICA DE HIGHLIGHT AO PASSAR O MOUSE NA NOTA
  useEffect(() => {
      if (!hoveredNoteSelector) return;
      try {
          const el = document.querySelector(hoveredNoteSelector) as HTMLElement;
          if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.style.outline = '4px solid #eab308';
              el.style.outlineOffset = '4px';
              el.style.boxShadow = '0 0 30px rgba(234, 179, 8, 0.8)';
              el.classList.add('animate-pulse');
              
              return () => {
                  el.style.outline = '';
                  el.style.outlineOffset = '';
                  el.style.boxShadow = '';
                  el.classList.remove('animate-pulse');
              };
          }
      } catch (e) {}
  }, [hoveredNoteSelector]);

  const saveFocusNote = () => {
      const text = focusMode.text.trim();
      if (!text) { setFocusMode({ active: false, id: null, text: '' }); return; }

      if (focusMode.id) {
          setNotes(prev => prev.map(n => n.id === focusMode.id ? { ...n, text, domSelector: focusMode.selector, elementPreview: focusMode.preview } : n));
      } else {
          setNotes(prev => [{
              id: Date.now().toString(),
              text,
              context: currentContext,
              timestamp: Date.now(),
              isCompleted: false,
              domSelector: focusMode.selector,
              elementPreview: focusMode.preview
          }, ...prev]);
      }
      setFocusMode({ active: false, id: null, text: '' });
  };

  const handleCopyNotes = async () => {
    let report = `** RELATÓRIO DE EDIÇÃO TÉCNICA - CONTEXTO: ${currentContext} **\n\n`;
    
    notes.forEach((note, index) => {
        const status = note.isCompleted ? '- [×]' : '- [ ]';
        report += `${status} ${note.text}\n`;
        
        if (note.domSelector) {
            report += `\nTARGET: ${note.domSelector}\n`;
        }
        
        if (index < notes.length - 1) {
            report += `\n---\n\n`;
        }
    });
    
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startAddingNote = () => {
    setFocusMode({ active: true, id: null, text: '' });
    setIsOpen(true);
  };

  const startEditingNote = (note: NoteItem) => {
    setFocusMode({ 
      active: true, 
      id: note.id, 
      text: note.text, 
      selector: note.domSelector, 
      preview: note.elementPreview 
    });
    setIsOpen(true);
  };

  return (
    <>
      {/* MODO FOCO / EDITOR */}
      {isOpen && focusMode.active && (
          <div className="fixed inset-0 z-[10000] flex flex-col justify-end layout-notes-ui">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFocusMode(p => ({...p, active: false}))} />
              <div className="relative z-10 bg-slate-900 border-t-2 border-brand-500 p-6 shadow-2xl animate-slide-up-fade">
                  <div className="max-w-4xl mx-auto">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-white font-black uppercase tracking-tighter text-sm flex items-center gap-2">
                             <Crosshair className="text-brand-500 w-4 h-4" /> 
                             {focusMode.id ? 'Editar Registro' : 'Novo Registro de Alteração'}
                          </h3>
                          {focusMode.selector && (
                              <div className="bg-brand-500/10 border border-brand-500/30 px-3 py-1 rounded-full flex items-center gap-2">
                                  <Code className="w-3 h-3 text-brand-400" />
                                  <span className="text-[10px] text-brand-400 font-mono font-bold truncate max-w-[200px]">{focusMode.selector}</span>
                                  <button onClick={() => setFocusMode(p => ({...p, selector: undefined, preview: undefined}))} className="text-red-400 hover:text-red-300 ml-1">
                                      <X size={12} />
                                  </button>
                              </div>
                          )}
                      </div>
                      
                      <div className="flex gap-4 items-end">
                          <div className="flex-1 space-y-2">
                            <textarea
                                ref={focusInputRef}
                                value={focusMode.text}
                                onChange={(e) => setFocusMode(prev => ({ ...prev, text: e.target.value }))}
                                placeholder="Descreva o que deve ser alterado..."
                                className="w-full bg-slate-950 rounded-xl p-4 text-white font-bold text-lg border border-slate-800 focus:border-brand-500 outline-none resize-none h-24"
                            />
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => { setIsInspecting(true); setIsOpen(false); }}
                                className="h-12 px-4 bg-slate-800 hover:bg-slate-700 text-brand-400 rounded-xl flex items-center justify-center gap-2 border border-brand-500/30 transition-all active:scale-95"
                                title="Vincular Elemento"
                            >
                                <Target size={20} />
                                <span className="text-[10px] font-black uppercase">Vincular</span>
                            </button>
                            <button 
                                onClick={saveFocusNote}
                                className="h-12 w-full bg-brand-600 hover:bg-brand-500 text-white rounded-xl flex items-center justify-center shadow-lg transition-transform active:scale-95 px-6 border border-brand-400/30"
                            >
                                <Check size={24} strokeWidth={3} />
                            </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* BOTÃO FLUTUANTE ARRASTÁVEL */}
      <div 
        className={`fixed z-[9999] layout-notes-ui transition-transform hover:scale-105 active:scale-95 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{ left: triggerPos.x, top: triggerPos.y }}
      >
         <div className="relative group flex flex-col items-center gap-2">
            <div 
                onMouseDown={startDraggingTrigger}
                onTouchStart={startDraggingTrigger}
                className="w-8 h-4 bg-brand-500/20 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical size={12} className="text-brand-500 rotate-90" />
            </div>
            <div 
                onClick={() => setIsOpen(true)}
                className="w-12 h-12 bg-slate-900 text-brand-500 border-2 border-brand-500 rounded-xl flex items-center justify-center shadow-2xl transition-all cursor-pointer"
            >
                {isInspecting ? <Crosshair className="animate-spin text-blue-400" /> : <ClipboardList size={24} strokeWidth={2.5} />}
                {notes.length > 0 && !isInspecting && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900">
                        {notes.filter(n => !n.isCompleted).length}
                    </span>
                )}
            </div>
         </div>
      </div>

      {/* PAINEL LISTA ARRASTÁVEL */}
      {isOpen && !focusMode.active && (
        <div className="layout-notes-ui">
            <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-[2px]" onClick={() => setIsOpen(false)}></div>
            <div 
                className="fixed z-[9999] w-[95vw] md:w-[450px] bg-slate-900 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] border-2 border-brand-500 flex flex-col overflow-hidden h-[600px] animate-zoom-in"
                style={{ left: panelPos.x, top: panelPos.y }}
            >
                {/* Header (Drag Handle) */}
                <div 
                    onMouseDown={startDraggingPanel}
                    onTouchStart={startDraggingPanel}
                    className="px-6 py-4 flex items-center justify-between bg-slate-800 border-b border-brand-500/30 cursor-move"
                >
                    <div className="flex items-center gap-3">
                        <GripVertical className="text-slate-500" size={16} />
                        <div className="flex items-center gap-2">
                            <ClipboardList className="text-brand-500" size={18} />
                            <h2 className="text-white font-black uppercase tracking-tighter text-xs">Anotações do Projeto</h2>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleCopyNotes} className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-500 text-white' : 'hover:bg-slate-700 text-slate-400'}`}>
                            {copied ? <Check size={18}/> : <Copy size={18} />}
                        </button>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-50/20 text-slate-400 hover:text-red-500 transition-colors"><X size={18}/></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {notes.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 uppercase font-black text-xs">
                            Nenhuma anotação vinculada.
                        </div>
                    ) : (
                        notes.map(note => (
                            <div 
                                key={note.id} 
                                onMouseEnter={() => note.domSelector && setHoveredNoteSelector(note.domSelector)}
                                onMouseLeave={() => setHoveredNoteSelector(null)}
                                className={`p-4 rounded-xl border transition-all ${note.isCompleted ? 'bg-slate-950 border-slate-800 opacity-40' : 'bg-slate-800/50 border-slate-700 hover:border-brand-500/50 shadow-lg'}`}
                            >
                                <div className="flex items-start gap-3">
                                    <button 
                                        onClick={() => setNotes(prev => prev.map(n => n.id === note.id ? {...n, isCompleted: !n.isCompleted} : n))}
                                        className={`mt-1 transition-colors ${note.isCompleted ? 'text-emerald-500' : 'text-slate-500'}`}
                                    >
                                        {note.isCompleted ? <CheckSquare size={20} /> : <Square size={20} />}
                                    </button>
                                    <div className="flex-1 min-w-0" onClick={() => startEditingNote(note)}>
                                        <p className={`text-sm font-bold text-white leading-snug mb-2 ${note.isCompleted ? 'line-through opacity-50' : ''}`}>{note.text}</p>
                                        {note.domSelector && (
                                            <div className="flex items-center gap-1.5 text-[9px] font-mono text-brand-400 bg-brand-500/5 px-2 py-1 rounded border border-brand-500/20 w-fit">
                                                <Target size={10} /> {note.elementPreview}
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => setNotes(prev => prev.filter(n => n.id !== note.id))} className="text-slate-600 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-slate-950 border-t border-slate-800">
                    <button 
                        onClick={startAddingNote}
                        className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border border-brand-400/30"
                    >
                        <Plus className="w-5 h-5" /> Adicionar Ponto de Edição
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};
