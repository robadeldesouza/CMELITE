import React, { useState } from 'react';
import { TimelineMessage, Bot } from '../types';
import { Clock, MessageCircle, MoveUp, MoveDown, Trash2, Plus, Sparkles } from 'lucide-react';
import { useStore } from '../store';

interface TimelineEditorProps {
  messages: TimelineMessage[];
  bots: Bot[];
  onChange: (messages: TimelineMessage[]) => void;
  onGenerateAI: () => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({ messages, bots, onChange, onGenerateAI }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleUpdate = (id: string, updates: Partial<TimelineMessage>) => {
    const newMessages = messages.map(m => m.id === id ? { ...m, ...updates } : m);
    onChange(newMessages);
  };

  const handleDelete = (id: string) => {
    onChange(messages.filter(m => m.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === messages.length - 1) return;
    
    const newMessages = [...messages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newMessages[index], newMessages[targetIndex]] = [newMessages[targetIndex], newMessages[index]];
    onChange(newMessages);
  };

  const handleAdd = () => {
    // Add comment above the fix: Added mandatory timestamp for TimelineMessage compatibility
    const newMessage: TimelineMessage = {
      id: `man-${Date.now()}`,
      botId: bots[0]?.id || '',
      text: 'Nova mensagem...',
      delayAfter: 3,
      timestamp: Date.now()
    };
    onChange([...messages, newMessage]);
    setEditingId(newMessage.id);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 h-full flex flex-col">
      <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 rounded-t-xl shrink-0">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center text-sm sm:text-base whitespace-nowrap">
          <Clock size={18} className="mr-2 text-brand-600 dark:text-brand-400" /> Timeline
        </h3>
        <div className="flex space-x-2">
           <button 
            onClick={onGenerateAI}
            className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-purple-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Gerar com IA</span>
            <span className="sm:hidden">IA</span>
          </button>
          <button 
            onClick={handleAdd}
            className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 bg-brand-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-brand-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Adicionar Msg</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-slate-500">
            <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Sem mensagens. Adicione ou gere com IA.</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const bot = bots.find(b => b.id === msg.botId);
          return (
            <div 
              key={msg.id} 
              className={`relative border rounded-lg p-2 sm:p-3 transition-all ${editingId === msg.id ? 'border-brand-500 ring-1 ring-brand-100 bg-brand-50 dark:bg-slate-800' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'}`}
            >
              {/* Connector Line */}
              {index < messages.length - 1 && (
                <div className="absolute left-6 bottom-0 top-full w-0.5 bg-gray-200 dark:bg-slate-700 h-3 z-0"></div>
              )}

              <div className="flex items-start gap-3 relative z-10">
                <div className="flex-shrink-0">
                  {bot ? (
                    <img src={bot.avatar} alt={bot.name} className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-700" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <select 
                      value={msg.botId} 
                      onChange={(e) => handleUpdate(msg.id, { botId: e.target.value })}
                      className="text-xs font-semibold text-gray-700 dark:text-slate-300 bg-transparent border-none p-0 focus:ring-0 cursor-pointer max-w-[120px] truncate"
                    >
                      {bots.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    <div className="flex items-center space-x-1">
                      <button onClick={() => handleMove(index, 'up')} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-gray-400 hover:text-gray-600" disabled={index === 0}>
                        <MoveUp size={12} />
                      </button>
                      <button onClick={() => handleMove(index, 'down')} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-gray-400 hover:text-gray-600" disabled={index === messages.length - 1}>
                        <MoveDown size={12} />
                      </button>
                      <button onClick={() => handleDelete(msg.id)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    value={msg.text}
                    onChange={(e) => handleUpdate(msg.id, { text: e.target.value })}
                    onFocus={() => setEditingId(msg.id)}
                    className="w-full text-sm text-gray-800 dark:text-slate-200 bg-transparent border-gray-200 dark:border-slate-700 rounded-md focus:border-brand-500 focus:ring-1 focus:ring-brand-500 min-h-[60px] resize-none"
                    placeholder="Conteúdo da mensagem..."
                  />

                  <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-slate-500">
                    <Clock size={12} className="mr-1" />
                    <span className="mr-2 whitespace-nowrap">Espera:</span>
                    <input 
                      type="number" 
                      min="1" 
                      max="60"
                      value={msg.delayAfter}
                      onChange={(e) => handleUpdate(msg.id, { delayAfter: parseInt(e.target.value) || 2 })}
                      className="w-12 py-0.5 px-1 text-center border border-gray-200 dark:border-slate-700 bg-transparent rounded text-xs dark:text-slate-300"
                    />
                    <span className="ml-1">s</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};