
import React, { useState, useEffect, useRef } from 'react';
import { Ruler, X, Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, MousePointer2, Keyboard, RefreshCcw, Plus, Minus, Layers, Magnet, BoxSelect, Grid, ChevronRight } from 'lucide-react';

interface LayoutDesignerProps {
  active: boolean;
  onToggle: (isActive: boolean) => void;
}

const TRIGGER_POS_KEY = 'cm_elite_designer_trigger_pos_v2';
const PANEL_POS_KEY = 'cm_elite_designer_panel_pos_v2';

// Estrutura para guias de alinhamento
interface SnapGuide {
    type: 'vertical' | 'horizontal';
    pos: number;
    // Onde a linha começa e termina (para não desenhar tela inteira se for snap local)
    start?: number; 
    end?: number;
    color?: string; // Vermelho para centro global, Verde para elementos irmãos
}

export const LayoutDesigner: React.FC<LayoutDesignerProps> = ({ active, onToggle }) => {
  // --- ESTADOS DO COMPONENTE ---
  const [selectedEl, setSelectedEl] = useState<HTMLElement | null>(null);
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [showLayers, setShowLayers] = useState(false);
  const [isGroupMode, setIsGroupMode] = useState(true); // True = Agrupado, False = Desagrupado
  
  // Armazena as transformações (X, Y)
  const transforms = useRef<Map<HTMLElement, { x: number, y: number }>>(new Map());
  // Armazena a escala (Scale)
  const scales = useRef<Map<HTMLElement, number>>(new Map());

  // Refs para controle do movimento contínuo
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guideClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- NOVO: ESTADO DE GUIAS MAGNÉTICAS ---
  const [snapLines, setSnapLines] = useState<SnapGuide[]>([]);

  // --- INJEÇÃO DE ESTILOS GLOBAIS (SUPER FORÇA) ---
  useEffect(() => {
    if (active) {
      const style = document.createElement('style');
      style.id = 'layout-designer-global-override';
      style.innerHTML = `
        /* Força tudo (exceto a UI do designer) a ser clicável */
        body.design-mode * {
          cursor: crosshair !important;
          pointer-events: auto !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          touch-action: none !important; /* Previne scroll ao arrastar */
        }
        
        /* Protege a UI do Designer para funcionar normalmente */
        .layout-designer-ui, .layout-designer-ui * {
          cursor: default !important;
          pointer-events: auto !important;
          touch-action: auto !important;
        }

        /* Remove comportamento de arrastar imagem nativo */
        img {
          -webkit-user-drag: none;
          user-drag: none;
        }

        /* Highlight para o modo de camadas */
        .layer-highlight {
           background-color: rgba(59, 130, 246, 0.2);
           outline: 1px solid #3b82f6;
        }
      `;
      document.head.appendChild(style);
      document.body.classList.add('design-mode');
    } else {
      const style = document.getElementById('layout-designer-global-override');
      if (style) style.remove();
      document.body.classList.remove('design-mode');
    }

    return () => {
      const style = document.getElementById('layout-designer-global-override');
      if (style) style.remove();
      document.body.classList.remove('design-mode');
    };
  }, [active]);

  // --- POSICIONAMENTO ROBUSTO ---
  const clampPosition = (x: number, y: number, width: number, height: number) => {
      const padding = 10;
      const maxX = window.innerWidth - width - padding;
      const maxY = window.innerHeight - height - padding;
      
      return {
          x: Math.min(Math.max(padding, x), maxX),
          y: Math.min(Math.max(padding, y), maxY)
      };
  };

  const [triggerPos, setTriggerPos] = useState({ x: 16, y: 140 }); // Posição exata do print
  const [panelPos, setPanelPos] = useState({ x: 20, y: window.innerHeight - 300 });
  
  const [isDraggingTrigger, setIsDraggingTrigger] = useState(false);
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);

  // Carregar e Validar Posições
  useEffect(() => {
    const loadPositions = () => {
        try {
            const savedTrigger = localStorage.getItem(TRIGGER_POS_KEY);
            const savedPanel = localStorage.getItem(PANEL_POS_KEY);
            
            if (savedTrigger) {
                const pos = JSON.parse(savedTrigger);
                setTriggerPos(clampPosition(pos.x, pos.y, 60, 60));
            }
            if (savedPanel) {
                const pos = JSON.parse(savedPanel);
                setPanelPos(clampPosition(pos.x, pos.y, 200, 250));
            } else {
                setPanelPos({ 
                    x: (window.innerWidth / 2) - 100, 
                    y: window.innerHeight - 280 
                });
            }
        } catch (e) {
            console.error("Erro ao carregar posições do Designer", e);
        }
    };
    loadPositions();
    const handleResize = () => {
        setTriggerPos(prev => clampPosition(prev.x, prev.y, 60, 60));
        setPanelPos(prev => clampPosition(prev.x, prev.y, 200, 250));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- LÓGICA DE ARRASTAR UI (DRAG) ---
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, type: 'trigger' | 'panel') => {
    if (type === 'trigger') setIsDraggingTrigger(true);
    else setIsDraggingPanel(true);
  };

  useEffect(() => {
    if (!isDraggingTrigger && !isDraggingPanel) return;

    const handleMove = (clientX: number, clientY: number) => {
      if (isDraggingTrigger) {
        setTriggerPos({ x: clientX - 25, y: clientY - 25 });
      } else if (isDraggingPanel) {
        setPanelPos({ x: clientX - 100, y: clientY - 20 });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        handleMove(e.clientX, e.clientY);
    };
    
    const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    };

    const onEnd = () => {
      setIsDraggingTrigger(false);
      setIsDraggingPanel(false);
      localStorage.setItem(TRIGGER_POS_KEY, JSON.stringify(triggerPos));
      localStorage.setItem(PANEL_POS_KEY, JSON.stringify(panelPos));
    };

    window.addEventListener('mousemove', onMouseMove, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDraggingTrigger, isDraggingPanel, triggerPos, panelPos]);

  // --- FUNÇÃO CENTRALIZADA DE APLICAÇÃO DE ESTILOS ---
  const applyStyles = (el: HTMLElement) => {
      const t = transforms.current.get(el) || { x: 0, y: 0 };
      const s = scales.current.get(el) || 1;
      
      const computedDisplay = window.getComputedStyle(el).display;
      if (computedDisplay === 'inline') {
          el.style.display = 'inline-block';
      }

      el.style.transform = `translate(${t.x}px, ${t.y}px) scale(${s})`;
      
      if (window.getComputedStyle(el).position === 'static') {
          el.style.position = 'relative';
      }
      
      el.style.zIndex = '9999'; 
      el.style.transition = 'none'; 
  };

  // --- LÓGICA DE ALINHAMENTO INTELIGENTE (ENTRE ELEMENTOS) ---
  // Verifica alinhamento com o Centro da Tela E com Elementos Irmãos
  const calculateSnapping = (target: HTMLElement, currentRect: DOMRect, dx: number, dy: number) => {
      const screenCx = window.innerWidth / 2;
      const screenCy = window.innerHeight / 2;
      const SNAP_THRESHOLD = 5; 
      
      // Coordenadas propostas VISUAIS (baseadas no rect original + delta)
      // Nota: currentRect já é o rect atualizado visualmente
      const targetCx = currentRect.left + currentRect.width / 2;
      const targetCy = currentRect.top + currentRect.height / 2;

      let snapAdjX = 0;
      let snapAdjY = 0;
      const newGuides: SnapGuide[] = [];

      // 1. SNAP GLOBAL (Centro da Tela)
      if (Math.abs(targetCx - screenCx) < SNAP_THRESHOLD) {
          snapAdjX = screenCx - targetCx;
          newGuides.push({ type: 'vertical', pos: screenCx, color: '#f43f5e' }); // Vermelho
      }
      if (Math.abs(targetCy - screenCy) < SNAP_THRESHOLD) {
          snapAdjY = screenCy - targetCy;
          newGuides.push({ type: 'horizontal', pos: screenCy, color: '#f43f5e' });
      }

      // 2. SNAP LOCAL (Elementos Irmãos - "Bolinhas")
      // Só executa se não houve snap global forte ou para refinar
      if (target.parentElement) {
          const siblings = Array.from(target.parentElement.children) as HTMLElement[];
          
          for (const sibling of siblings) {
              if (sibling === target) continue;
              // Ignora elementos invisíveis ou muito distantes
              if (sibling.style.display === 'none') continue;

              const sibRect = sibling.getBoundingClientRect();
              const sibCx = sibRect.left + sibRect.width / 2;
              const sibCy = sibRect.top + sibRect.height / 2;

              // --- ALINHAMENTO VERTICAL (Lados e Centro) ---
              
              // Esquerda com Esquerda
              if (Math.abs(currentRect.left - sibRect.left) < SNAP_THRESHOLD) {
                  const diff = sibRect.left - currentRect.left;
                  if (Math.abs(diff) < Math.abs(snapAdjX) || snapAdjX === 0) {
                      snapAdjX = diff;
                      newGuides.push({ type: 'vertical', pos: sibRect.left, color: '#22c55e' }); // Verde
                  }
              }
              // Centro com Centro X
              if (Math.abs(targetCx - sibCx) < SNAP_THRESHOLD) {
                  const diff = sibCx - targetCx;
                   if (Math.abs(diff) < Math.abs(snapAdjX) || snapAdjX === 0) {
                      snapAdjX = diff;
                      newGuides.push({ type: 'vertical', pos: sibCx, color: '#22c55e' });
                   }
              }
              // Direita com Direita
              if (Math.abs(currentRect.right - sibRect.right) < SNAP_THRESHOLD) {
                   const diff = sibRect.right - currentRect.right;
                   if (Math.abs(diff) < Math.abs(snapAdjX) || snapAdjX === 0) {
                      snapAdjX = diff;
                      newGuides.push({ type: 'vertical', pos: sibRect.right, color: '#22c55e' });
                   }
              }


              // --- ALINHAMENTO HORIZONTAL (Topos e Centro) ---

              // Topo com Topo
              if (Math.abs(currentRect.top - sibRect.top) < SNAP_THRESHOLD) {
                  const diff = sibRect.top - currentRect.top;
                  if (Math.abs(diff) < Math.abs(snapAdjY) || snapAdjY === 0) {
                      snapAdjY = diff;
                      newGuides.push({ type: 'horizontal', pos: sibRect.top, color: '#22c55e' });
                  }
              }
              // Centro com Centro Y
              if (Math.abs(targetCy - sibCy) < SNAP_THRESHOLD) {
                  const diff = sibCy - targetCy;
                  if (Math.abs(diff) < Math.abs(snapAdjY) || snapAdjY === 0) {
                      snapAdjY = diff;
                      newGuides.push({ type: 'horizontal', pos: sibCy, color: '#22c55e' });
                  }
              }
               // Base com Base
               if (Math.abs(currentRect.bottom - sibRect.bottom) < SNAP_THRESHOLD) {
                  const diff = sibRect.bottom - currentRect.bottom;
                  if (Math.abs(diff) < Math.abs(snapAdjY) || snapAdjY === 0) {
                      snapAdjY = diff;
                      newGuides.push({ type: 'horizontal', pos: sibRect.bottom, color: '#22c55e' });
                  }
              }
          }
      }

      return { x: snapAdjX, y: snapAdjY, guides: newGuides };
  };

  // --- MOVIMENTO (NUDGE) ---
  const nudge = (dx: number, dy: number) => {
    if (!selectedEl) return;
    const current = transforms.current.get(selectedEl) || { x: 0, y: 0 };
    const newX = current.x + dx;
    const newY = current.y + dy;
    
    transforms.current.set(selectedEl, { x: newX, y: newY });
    applyStyles(selectedEl);
    
    // Agora verifica as guias DEPOIS de aplicar o estilo
    requestAnimationFrame(() => {
       const rect = selectedEl.getBoundingClientRect();
       const snapData = calculateSnapping(selectedEl, rect, 0, 0);
       setSnapLines(snapData.guides);
       
       // Limpa timer antigo
       if (guideClearTimerRef.current) clearTimeout(guideClearTimerRef.current);
       guideClearTimerRef.current = setTimeout(() => setSnapLines([]), 2000);
    });
  };

  const changeScale = (delta: number) => {
      if (!selectedEl) return;
      const current = scales.current.get(selectedEl) || 1;
      const newScale = Math.max(0.1, current + delta);
      
      scales.current.set(selectedEl, newScale);
      applyStyles(selectedEl);
  }

  // --- RAPID FIRE ---
  const stopAction = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
    
    // Limpa guias rapidamente ao soltar botão do mouse
    setTimeout(() => setSnapLines([]), 1500);
  };

  const startNudge = (e: React.MouseEvent | React.TouchEvent, dx: number, dy: number) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      nudge(dx, dy);
      timeoutRef.current = setTimeout(() => {
          intervalRef.current = setInterval(() => { nudge(dx, dy); }, 30); 
      }, 300);
  };

  const startScale = (e: React.MouseEvent | React.TouchEvent, delta: number) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      changeScale(delta);
      timeoutRef.current = setTimeout(() => {
          intervalRef.current = setInterval(() => { changeScale(delta); }, 50); 
      }, 300);
  }

  // --- AUXILIAR DE CAMADAS ---
  const getElementLabel = (el: HTMLElement) => {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const cls = el.className && typeof el.className === 'string' ? `.${el.className.split(' ')[0]}` : '';
    let text = '';
    // Pega apenas texto direto, sem filhos
    if (el.childNodes.length > 0) {
        el.childNodes.forEach(n => {
            if (n.nodeType === Node.TEXT_NODE && n.textContent?.trim()) {
                text = n.textContent.trim().substring(0, 15);
            }
        });
    } else {
        text = el.textContent?.trim().substring(0, 15) || '';
    }
    
    return `${tag}${id}${cls} "${text}"`;
  };

  // --- SELEÇÃO DE ELEMENTOS (CORE) ---
  useEffect(() => {
    if (!active) {
      setSelectedEl(null);
      setHoveredEl(null);
      setSnapLines([]); // Limpa linhas ao fechar
      return;
    }

    const isUI = (target: HTMLElement) => target.closest('.layout-designer-ui');

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isUI(target) || target.tagName === 'BODY' || target.tagName === 'HTML') return;
      
      e.stopPropagation();
      setHoveredEl(target);
      target.style.outline = '2px dashed #3b82f6';
      target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isUI(target)) return;
      
      if (target !== selectedEl) {
          target.style.outline = '';
          target.style.boxShadow = '';
      }
    };

    // DRAG AND DROP MANUAL NA TELA COM ALINHAMENTO MAGNÉTICO
    const handleMouseDown = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      if (isUI(target) || target.tagName === 'BODY' || target.tagName === 'HTML') return;
      
      e.preventDefault();
      e.stopPropagation();

      // --- LÓGICA DE AGRUPAMENTO (GROUP MODE) ---
      // Se estiver no modo Agrupado, tenta pegar o bloco pai significativo
      if (isGroupMode) {
          // Procura o container mais próximo que não seja o próprio body
          const container = target.closest('div, section, article, h1, h2, h3, button, a') as HTMLElement;
          if (container && container !== document.body) {
              target = container;
          }
      } else {
          // MODO DESAGRUPADO (GRANULAR)
          // Pega exatamente onde clicou. Se for um SVG path, pega o SVG pai pra facilitar
          if (target.tagName === 'path' || target.tagName === 'circle' || target.tagName === 'rect') {
              const svg = target.closest('svg');
              if (svg) target = svg as unknown as HTMLElement;
          }
      }
      
      // Limpa seleção anterior
      if (selectedEl && selectedEl !== target) {
          selectedEl.style.outline = '';
          selectedEl.style.boxShadow = '';
          selectedEl.style.zIndex = ''; 
          if (transforms.current.has(selectedEl)) {
             selectedEl.style.position = 'relative'; 
             selectedEl.style.zIndex = '50';
          }
      }
      
      setSelectedEl(target);
      target.style.outline = '3px solid #facc15';
      target.style.boxShadow = '0 0 15px rgba(250, 204, 21, 0.5)';
      
      const startX = e.clientX;
      const startY = e.clientY;
      const initialPos = transforms.current.get(target) || { x: 0, y: 0 };
      const startRect = target.getBoundingClientRect(); // Rect inicial visual

      const computed = window.getComputedStyle(target);
      if (computed.display === 'inline') target.style.display = 'inline-block';
      if (computed.position === 'static') target.style.position = 'relative';
      target.style.zIndex = '9999';

      const onMouseMove = (ev: MouseEvent) => {
          ev.preventDefault();
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          
          // Calcula onde o elemento ESTARIA visualmente sem snap
          const tempRect = new DOMRect(
              startRect.left + dx,
              startRect.top + dy,
              startRect.width,
              startRect.height
          );

          // Calcula snap baseado nesse rect temporário
          const snap = calculateSnapping(target, tempRect, dx, dy);
          
          setSnapLines(snap.guides);

          // Aplica posição real + ajuste do snap
          const newX = initialPos.x + dx + snap.x;
          const newY = initialPos.y + dy + snap.y;
          
          transforms.current.set(target, { x: newX, y: newY });
          applyStyles(target);
      };

      const onMouseUp = () => {
          setSnapLines([]); 
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!isUI(target)) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('click', handleClick, true);
      
      if (hoveredEl) {
         hoveredEl.style.outline = '';
         hoveredEl.style.boxShadow = '';
      }
    };
  }, [active, selectedEl, hoveredEl, isGroupMode]);

  // --- TECLADO ---
  useEffect(() => {
    if (!active || !selectedEl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            const mult = e.shiftKey ? 10 : 1;
            if (e.key === 'ArrowUp') nudge(0, -1 * mult);
            if (e.key === 'ArrowDown') nudge(0, 1 * mult);
            if (e.key === 'ArrowLeft') nudge(-1 * mult, 0);
            if (e.key === 'ArrowRight') nudge(1 * mult, 0);
        }
        if (e.key === '+' || e.key === '=') { e.preventDefault(); changeScale(0.1); }
        if (e.key === '-') { e.preventDefault(); changeScale(-0.1); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, selectedEl]);

  const resetPanelPosition = (e: React.MouseEvent) => {
      e.stopPropagation();
      setPanelPos({ x: (window.innerWidth / 2) - 100, y: window.innerHeight - 280 });
  };
  
  // Função para selecionar via Camadas
  const handleLayerSelect = (el: HTMLElement) => {
      if (selectedEl) {
          selectedEl.style.outline = '';
          selectedEl.style.boxShadow = '';
      }
      setSelectedEl(el);
      // Simula o estilo de seleção
      el.style.outline = '3px solid #facc15';
      el.style.boxShadow = '0 0 15px rgba(250, 204, 21, 0.5)';
      
      // Garante que é movível
      const computed = window.getComputedStyle(el);
      if (computed.display === 'inline') el.style.display = 'inline-block';
      if (computed.position === 'static') el.style.position = 'relative';
      el.style.zIndex = '9999';
  };

  // --- RENDER ---
  if (!active) {
    return (
      <div 
        className="fixed z-[10000] cursor-move layout-designer-ui touch-none"
        style={{ left: triggerPos.x, top: triggerPos.y }}
        onMouseDown={(e) => handleDragStart(e, 'trigger')}
        onTouchStart={(e) => handleDragStart(e, 'trigger')}
        onClick={() => { if (!isDraggingTrigger) onToggle(true); }}
      >
        <div className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg border-2 border-white/20 flex items-center justify-center">
          <Ruler className="w-6 h-6" />
        </div>
      </div>
    );
  }

  return (
    <>
        {/* RENDERIZAÇÃO DAS GUIAS MAGNÉTICAS */}
        {snapLines.map((line, i) => (
            <div 
                key={i}
                className="fixed z-[99999] pointer-events-none animate-fade-in"
                style={{
                    left: line.type === 'vertical' ? line.pos : 0,
                    top: line.type === 'horizontal' ? line.pos : 0,
                    width: line.type === 'vertical' ? '1px' : '100%',
                    height: line.type === 'horizontal' ? '1px' : '100%',
                    backgroundColor: line.color || '#f43f5e',
                    boxShadow: `0 0 8px ${line.color || '#f43f5e'}`
                }}
            />
        ))}

        <div className="layout-designer-ui">
        {/* Barra de Status */}
        <div className="fixed top-0 left-0 right-0 h-14 bg-surface/95 backdrop-blur z-[10000] flex items-center justify-between px-4 border-b border-border-dim shadow-xl gap-2">
            <div className="flex items-center gap-2 text-primary shrink-0">
                <MousePointer2 className="w-4 h-4" />
                <span className="font-bold text-sm hidden md:inline">Editor</span>
            </div>
            
            {/* CONTROLES DE AGRUPAMENTO (TOP BAR) */}
            <div className="flex items-center bg-surface-highlight rounded-lg p-1 border border-border-dim">
                <button 
                    onClick={() => setIsGroupMode(true)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all ${isGroupMode ? 'bg-blue-600 text-white shadow' : 'text-secondary hover:text-white'}`}
                    title="Selecionar Container/Bloco inteiro"
                >
                    <BoxSelect className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Agrupado</span>
                </button>
                <div className="w-px h-4 bg-border-dim mx-1"></div>
                <button 
                    onClick={() => setIsGroupMode(false)}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all ${!isGroupMode ? 'bg-blue-600 text-white shadow' : 'text-secondary hover:text-white'}`}
                    title="Selecionar Item Específico (Fura Bloqueio)"
                >
                    <Grid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Desagrupado</span>
                </button>
            </div>
            
            <button 
                onClick={() => setShowLayers(!showLayers)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded border text-xs font-bold transition-all ${showLayers ? 'bg-brand-500/20 text-brand-400 border-brand-500/50' : 'bg-surface-highlight text-secondary border-border-dim'}`}
            >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Camadas</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
                {selectedEl && (
                    <span className="hidden lg:inline text-[10px] bg-black/40 px-2 py-1 rounded text-brand-400 font-mono border border-brand-500/30 truncate max-w-[150px]">
                        {getElementLabel(selectedEl)}
                    </span>
                )}
                <button 
                    onClick={() => onToggle(false)}
                    className="bg-red-600 px-3 py-1.5 rounded text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                    <X className="w-3 h-3" /> <span className="hidden sm:inline">SAIR</span>
                </button>
            </div>
        </div>

        {/* PAINEL DE CAMADAS (LATERAL) */}
        {showLayers && (
            <div className="fixed top-14 right-0 bottom-0 w-64 bg-surface/95 backdrop-blur border-l border-border-dim shadow-2xl z-[10000] overflow-y-auto animate-slide-in-right">
                <div className="p-3 border-b border-border-dim bg-surface-highlight/50 font-bold text-secondary text-xs flex items-center justify-between">
                    <span>ARVORE DE ELEMENTOS</span>
                    <button onClick={() => setShowLayers(false)}><X className="w-4 h-4" /></button>
                </div>
                <div className="p-2 space-y-1">
                    {!selectedEl ? (
                        <div className="text-secondary text-xs p-4 text-center">Selecione um elemento na tela para ver sua hierarquia.</div>
                    ) : (
                        <>
                            {/* PAI */}
                            {selectedEl.parentElement && selectedEl.parentElement !== document.body && (
                                <div 
                                    className="p-2 rounded hover:bg-surface-highlight cursor-pointer text-secondary flex items-center gap-2 border border-transparent hover:border-border-dim"
                                    onClick={() => handleLayerSelect(selectedEl.parentElement as HTMLElement)}
                                >
                                    <ArrowUp className="w-3 h-3" />
                                    <div className="text-xs truncate font-mono">{getElementLabel(selectedEl.parentElement)}</div>
                                </div>
                            )}
                            
                            {/* ATUAL */}
                            <div className="p-2 rounded bg-blue-900/30 border border-blue-500/50 text-blue-300 flex items-center gap-2 ml-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="text-xs truncate font-bold font-mono">{getElementLabel(selectedEl)}</div>
                            </div>

                            {/* FILHOS */}
                            {Array.from(selectedEl.children).length > 0 && (
                                <div className="ml-4 mt-1 border-l-2 border-border-dim pl-2 space-y-1">
                                    <div className="text-[10px] text-muted uppercase font-bold mb-1">Filhos (Conteúdo)</div>
                                    {Array.from(selectedEl.children).map((child, idx) => (
                                        <div 
                                            key={idx}
                                            className="p-1.5 rounded hover:bg-surface-highlight cursor-pointer text-secondary flex items-center gap-2 text-xs transition-colors hover:text-white"
                                            onClick={() => handleLayerSelect(child as HTMLElement)}
                                        >
                                            <ChevronRight className="w-3 h-3" />
                                            <div className="truncate font-mono">{getElementLabel(child as HTMLElement)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        )}

        {/* Painel de Controle */}
        <div 
            className="fixed z-[10001] bg-surface/95 backdrop-blur border border-border-dim rounded-2xl shadow-2xl w-[200px] touch-none flex flex-col items-center p-4 animate-fade-in"
            style={{ left: panelPos.x, top: panelPos.y }}
        >
            <div 
                className="w-full flex items-center justify-between pb-2 mb-2 border-b border-border-dim cursor-move"
                onMouseDown={(e) => handleDragStart(e, 'panel')}
                onTouchStart={(e) => handleDragStart(e, 'panel')}
            >
                <div className="flex items-center gap-2 text-secondary">
                    <Move className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Controle</span>
                </div>
                <button onClick={resetPanelPosition} className="text-muted hover:text-white" title="Resetar painel">
                    <RefreshCcw className="w-3 h-3" />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
                <button 
                    className="w-14 h-14 bg-surface-highlight border-2 border-border-dim rounded-lg flex items-center justify-center text-red-400 active:bg-red-900/50 active:border-red-500 transition-colors touch-none select-none"
                    onMouseDown={(e) => startScale(e, -0.05)}
                    onMouseUp={stopAction}
                    onMouseLeave={stopAction}
                    onTouchStart={(e) => startScale(e, -0.05)}
                    onTouchEnd={stopAction}
                >
                    <Minus className="w-6 h-6" />
                </button>

                <button 
                    className="w-14 h-14 bg-surface-highlight border-2 border-border-dim rounded-lg flex items-center justify-center text-primary active:bg-blue-600 active:border-blue-400 transition-colors touch-none select-none"
                    onMouseDown={(e) => startNudge(e, 0, -1)}
                    onMouseUp={stopAction}
                    onMouseLeave={stopAction}
                    onTouchStart={(e) => startNudge(e, 0, -1)}
                    onTouchEnd={stopAction}
                >
                    <ArrowUp className="w-8 h-8" />
                </button>

                <button 
                    className="w-14 h-14 bg-surface-highlight border-2 border-border-dim rounded-lg flex items-center justify-center text-green-400 active:bg-green-900/50 active:border-green-500 transition-colors touch-none select-none"
                    onMouseDown={(e) => startScale(e, 0.05)}
                    onMouseUp={stopAction}
                    onMouseLeave={stopAction}
                    onTouchStart={(e) => startScale(e, 0.05)}
                    onTouchEnd={stopAction}
                >
                    <Plus className="w-6 h-6" />
                </button>

                <button 
                    className="w-14 h-14 bg-surface-highlight border-2 border-border-dim rounded-lg flex items-center justify-center text-primary active:bg-blue-600 active:border-blue-400 transition-colors touch-none select-none"
                    onMouseDown={(e) => startNudge(e, -1, 0)}
                    onMouseUp={stopAction}
                    onMouseLeave={stopAction}
                    onTouchStart={(e) => startNudge(e, -1, 0)}
                    onTouchEnd={stopAction}
                >
                    <ArrowLeft className="w-8 h-8" />
                </button>
                
                <div className="w-14 h-14 flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full ${selectedEl ? 'bg-green-500 animate-pulse' : 'bg-red-900'}`}></div>
                </div>

                <button 
                    className="w-14 h-14 bg-surface-highlight border-2 border-border-dim rounded-lg flex items-center justify-center text-primary active:bg-blue-600 active:border-blue-400 transition-colors touch-none select-none"
                    onMouseDown={(e) => startNudge(e, 1, 0)}
                    onMouseUp={stopAction}
                    onMouseLeave={stopAction}
                    onTouchStart={(e) => startNudge(e, 1, 0)}
                    onTouchEnd={stopAction}
                >
                    <ArrowRight className="w-8 h-8" />
                </button>

                <div></div>
                <button 
                    className="w-14 h-14 bg-surface-highlight border-2 border-border-dim rounded-lg flex items-center justify-center text-primary active:bg-blue-600 active:border-blue-400 transition-colors touch-none select-none"
                    onMouseDown={(e) => startNudge(e, 0, 1)}
                    onMouseUp={stopAction}
                    onMouseLeave={stopAction}
                    onTouchStart={(e) => startNudge(e, 0, 1)}
                    onTouchEnd={stopAction}
                >
                    <ArrowDown className="w-8 h-8" />
                </button>
                <div></div>
            </div>
            
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted px-2 mt-1">
                <Magnet className="w-3 h-3 text-red-500" />
                <span>Réguas Ativadas</span>
            </div>
        </div>
        </div>
    </>
  );
};
