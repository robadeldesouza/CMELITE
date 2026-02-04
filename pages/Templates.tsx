import React, { useState } from 'react';
import { PHRASE_BANK } from '../services/localData';
import { BotArchetype } from '../types';
import { Copy, Check, Quote, Layers, ArrowRight } from 'lucide-react';

export const Templates: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<keyof typeof PHRASE_BANK>('opener');

  const categories = [
    { id: 'opener', label: 'Abertura / Gancho' },
    { id: 'agreement', label: 'Concordância' },
    { id: 'disagreement', label: 'Objeção / Dúvida' },
    { id: 'closing', label: 'Fechamento / CTA' },
  ];

  const handleCopy = (text: string, id: string) => {
    const finalText = text.replace('{topic}', topic || 'produto');
    navigator.clipboard.writeText(finalText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-2 sm:p-4 md:p-8 max-w-7xl mx-auto animate-fade-in pb-20">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">Biblioteca de Frases</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Templates rápidos para construir conversas manualmente.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-4 sm:p-6 mb-6 sm:mb-8 transition-colors">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          Sobre o que os bots vão falar? (Tópico)
        </label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="ex: Black Friday, Novo Curso, Recurso X..."
            className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Isso substituirá o termo <strong>{'{topic}'}</strong> nas frases abaixo.
        </p>
      </div>

      {/* Categories Tabs */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-slate-950 py-2 -mx-2 px-2 sm:mx-0 sm:px-0">
        <div className="flex overflow-x-auto space-x-2 pb-2 mb-2 custom-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phrases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {(Object.keys(PHRASE_BANK[activeCategory]) as BotArchetype[]).map((archetype) => {
          const phrases = PHRASE_BANK[activeCategory][archetype];
          
          return (
            <div key={archetype} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                  {archetype}
                </span>
                <Quote size={14} className="opacity-20" />
              </div>
              <div className="p-4 space-y-3 flex-1">
                {phrases.map((phrase, idx) => {
                  const id = `${archetype}-${idx}`;
                  const displayPhrase = phrase.replace('{topic}', topic || '...');
                  
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleCopy(phrase, id)}
                      className="group relative p-3 rounded-lg bg-gray-50 dark:bg-slate-950 hover:bg-brand-50 dark:hover:bg-brand-900/10 border border-transparent hover:border-brand-200 dark:hover:border-brand-800 cursor-pointer transition-all duration-200"
                    >
                      <p className="text-sm text-gray-700 dark:text-slate-300 pr-6 leading-relaxed">
                        "{displayPhrase}"
                      </p>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-500">
                        {copiedId === id ? <Check size={14} /> : <Copy size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};