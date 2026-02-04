import React, { useEffect, useState, useRef } from 'react';
import { TimelineMessage, Bot } from '../types';
import { Play, Pause, RotateCcw, GripHorizontal, X, Scaling, Maximize2, Minimize2 } from 'lucide-react';

interface ChatPreviewProps {
  timeline: TimelineMessage[];
  bots: Bot[];
  onClose?: () => void;
  isWidgetMode?: boolean; // New prop to style it as a widget in the corner
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({ timeline, bots, onClose, isWidgetMode = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<TimelineMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTypers, setActiveTypers] = useState<string[]>([]);
  
  // Draggable & Resizable State
  const [position, setPosition] = useState({ x: isWidgetMode ? 0 : 50, y: isWidgetMode ? 0 : 50 });
  const [size, setSize] = useState({ w: 380, h: 720 });
  const [isMaximized, setIsMaximized] = useState(false);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const startSizeRef = useRef<{ w: number; h: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // --- Animation Logic ---
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
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
      
      const typingTime = Math.min(1500, msg.text.length * 30) + 500;
      await new Promise(r => { timeoutId = setTimeout(r, typingTime); });

      setActiveTypers(prev => prev.filter(id => id !== msg.botId));
      setVisibleMessages(prev => [...prev, msg]);
      
      await new Promise(r => { timeoutId = setTimeout(r, msg.delayAfter * 1000); });
      setCurrentIndex(prev => prev + 1);
    };

    if (isPlaying) { playNext(); }
    return () => clearTimeout(timeoutId);
  }, [isPlaying, currentIndex]);

  const handleReset = () => {
    setIsPlaying(false);
    setVisibleMessages([]);
    setCurrentIndex(0);
    setActiveTypers([]);
  };

  // --- Dragging Logic ---
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isWidgetMode || isResizing || isMaximized) return; // Disable drag if maximized
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartRef.current = { x: clientX, y: clientY };
    startPosRef.current = { ...position };
  };

  // --- Resizing Logic ---
  const handleResizeDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (isMaximized) return; // Disable resize if maximized
    setIsResizing(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartRef.current = { x: clientX, y: clientY };
    startSizeRef.current = { ...size };
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!dragStartRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;

    if (isDragging && startPosRef.current) {
      e.preventDefault();
      setPosition({
        x: startPosRef.current.x + dx,
        y: startPosRef.current.y + dy
      });
    }

    if (isResizing && startSizeRef.current) {
      e.preventDefault();
      setSize({
        w: Math.max(300, startSizeRef.current.w + dx), // Min width 300
        h: Math.max(400, startSizeRef.current.h + dy)  // Min height 400
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    dragStartRef.current = null;
    startPosRef.current = null;
    startSizeRef.current = null;
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  // Determine Styles
  let containerStyle: React.CSSProperties = {};
  let frameClass = "";

  if (isMaximized) {
    // Full Screen Mode
    containerStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 100,
      backgroundColor: 'rgba(15, 23, 42, 0.95)', // Backdrop
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    };
    // Phone container inside fullscreen
    frameClass = "w-full max-w-[400px] h-full max-h-[850px] bg-white rounded-[2rem] border-[8px] border-slate-900 overflow-hidden relative flex flex-col shadow-2xl";
  } else if (isWidgetMode) {
    // Widget Mode (Fixed Bottom Right)
    containerStyle = {
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      zIndex: 40,
      cursor: 'default',
      width: '350px',
      height: '500px'
    };
    frameClass = "w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col";
  } else {
    // Floating Mode (Default)
    containerStyle = {
      position: 'fixed',
      right: '20px',
      top: '100px',
      transform: `translate(${position.x - 50}px, ${position.y - 50}px)`,
      cursor: isDragging ? 'grabbing' : 'default',
      width: `${size.w}px`,
      height: `${size.h}px`,
      zIndex: 50
    };
    frameClass = "w-full h-full bg-white rounded-[3rem] border-[10px] border-slate-900 overflow-hidden relative flex flex-col shadow-2xl";
  }

  return (
    <div 
      className={`transition-all duration-300 ${(!isWidgetMode && !isMaximized) ? 'shadow-2xl rounded-[3rem]' : ''}`}
      style={containerStyle}
    >
      
      {/* Drag Handle (Only in Floating Mode AND Not Maximized) */}
      {!isWidgetMode && !isMaximized && (
        <div 
          className="absolute -top-12 left-0 right-0 h-10 bg-slate-800 text-white rounded-full flex items-center justify-between px-4 cursor-grab active:cursor-grabbing shadow-lg select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <GripHorizontal size={20} className="text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Preview</span>
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={() => setIsMaximized(true)}
                className="p-1 hover:bg-slate-700 rounded-full text-slate-300"
                title="Maximizar (Full Screen)"
                onMouseDown={(e) => e.stopPropagation()}
             >
                <Maximize2 size={14} />
             </button>
             <button 
               onMouseDown={(e) => e.stopPropagation()} 
               onClick={handleReset} 
               className="p-1 hover:bg-slate-700 rounded-full text-slate-300" 
               title="Reset Chat"
             >
               <RotateCcw size={14} />
             </button>
             {onClose && (
               <button 
                 onMouseDown={(e) => e.stopPropagation()}
                 onClick={onClose}
                 className="p-1 hover:bg-red-900/50 rounded-full text-red-300"
               >
                 <X size={14} />
               </button>
             )}
          </div>
        </div>
      )}

      {/* Main Frame */}
      <div className={frameClass}>
        
        {/* Notch (Only in Phone Modes) */}
        {!isWidgetMode && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-7 bg-slate-900 rounded-b-xl z-20"></div>}

        {/* Header */}
        <div className={`bg-gray-50 border-b border-gray-200 flex items-center shrink-0 z-10 ${isWidgetMode ? 'h-16 px-4' : 'h-20 px-6 pt-6'}`}>
          <div className="flex -space-x-3 overflow-hidden">
            {bots.slice(0, 3).map(bot => (
              <img key={bot.id} className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover" src={bot.avatar} alt=""/>
            ))}
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">Comunidade VIP</p>
            <p className="text-xs text-green-600 font-medium truncate flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
              {bots.length} online agora
            </p>
          </div>
          
          {/* Controls inside header for Fullscreen/Widget mode */}
          <div className="ml-auto flex items-center space-x-1">
             {isMaximized && (
                <button 
                  onClick={() => setIsMaximized(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
                  title="Sair da Tela Cheia"
                >
                  <Minimize2 size={18} />
                </button>
             )}
             {isWidgetMode && (
                <button onClick={handleReset} className="p-2 text-gray-400 hover:text-gray-600">
                  <RotateCcw size={16} />
                </button>
             )}
          </div>
        </div>

        {/* Messages Area */}
        <div ref={containerRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-white scroll-smooth relative">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          {visibleMessages.map((msg) => {
            const bot = bots.find(b => b.id === msg.botId);
            return (
              <div key={msg.id} className="flex items-start space-x-3 animate-fade-in-up">
                <img src={bot?.avatar || ''} alt="" className="w-8 h-8 rounded-full bg-gray-200 shrink-0 object-cover border border-gray-100 shadow-sm" />
                <div className="flex flex-col space-y-1 max-w-[80%]">
                  <span className="text-[10px] font-bold text-gray-500 ml-1 truncate uppercase tracking-tight">{bot?.name}</span>
                  <div className={`px-4 py-2 bg-gray-100 rounded-2xl rounded-tl-none text-sm text-gray-800 shadow-sm break-words leading-relaxed`}>
                    {msg.text}
                  </div>
                </div>
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

        {/* Footer Input */}
        <div className={`bg-gray-50 border-t border-gray-200 px-4 flex items-center shrink-0 ${isWidgetMode ? 'h-14' : 'h-16'}`}>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 transition-all ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} shadow-md`}
          >
            {isPlaying ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor" className="ml-1"/>}
          </button>
          <div className="flex-1 h-10 bg-white border border-gray-300 rounded-full px-4 text-sm flex items-center text-gray-400 shadow-inner">
            Mensagem...
          </div>
        </div>

        {/* Resize Handle (Only Floating and Not Maximized) */}
        {!isWidgetMode && !isMaximized && (
          <div 
            className="absolute bottom-1 right-1 p-2 cursor-nwse-resize text-gray-300 hover:text-gray-500 z-50 opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={handleResizeDown}
            onTouchStart={handleResizeDown}
          >
            <Scaling size={20} />
          </div>
        )}
      </div>
    </div>
  );
};