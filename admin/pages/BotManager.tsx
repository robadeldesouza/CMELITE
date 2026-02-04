
import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store';
import { BotCard } from '../components/BotCard';
import { Search, Package, Loader2, Sparkles, X, ArrowRight, Check, Copy, FileJson, Zap, ToggleLeft, ToggleRight, Plus, Minus, Users, Filter, Save, RefreshCw } from 'lucide-react';
import { Bot, BotArchetype } from '../types';
import { buildBotBatchPrompt, parseBotResponse, generateBotsWithAI } from '../services/geminiService';
import { generateLocalBots } from '../services/localData';

const ARCHETYPES: { id: BotArchetype; label: string; desc: string }[] = [
  { id: 'enthusiast', label: 'Entusiasta', desc: 'Energia alta, emojis.' },
  { id: 'skeptic', label: 'Cético', desc: 'Exige provas e dados.' },
  { id: 'friendly', label: 'Amigável', desc: 'Apoia e concorda.' },
  { id: 'pragmatic', label: 'Pragmático', desc: 'Foco no resultado.' },
  { id: 'curious', label: 'Curioso', desc: 'Faz muitas perguntas.' },
  { id: 'influencer', label: 'Influencer', desc: 'Conta histórias.' },
  { id: 'experienced', label: 'Experiente', desc: 'Tom de mentor.' },
  { id: 'beginner', label: 'Iniciante', desc: 'Dúvidas básicas.' },
];

const BOT_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
  'bg-teal-500', 'bg-cyan-500'
];

export const BotManager: React.FC = () => {
  const bots = useStore(state => state.bots);
  const addBots = useStore(state => state.addBots);
  const updateBot = useStore(state => state.updateBot);
  const deleteBot = useStore(state => state.deleteBot);
  const useRealAI = useStore(state => state.useRealAI);
  const toggleAI = useStore(state => state.toggleAI);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Batch Generator State
  const [isGeneratorOpen, setGeneratorOpen] = useState(false);
  const [step, setStep] = useState<'config' | 'prompt' | 'import'>('config');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [pastedJson, setPastedJson] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Edit State
  const [editingBot, setEditingBot] = useState<Bot | null>(null);

  // Configuration State
  const [distribution, setDistribution] = useState<Partial<Record<BotArchetype, number>>>({ enthusiast: 5 });
  const [wisdomLevel, setWisdomLevel] = useState(50);
  const [context, setContext] = useState('');

  // Stats Calculation
  const totalBotsToGenerate: number = (Object.values(distribution) as number[]).reduce((acc: number, curr) => acc + (Number(curr) || 0), 0);
  const filteredBots = bots.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const mostPopularArchetype = useMemo(() => {
    if (bots.length === 0) return 'Nenhum';
    const counts: Record<string, number> = {};
    bots.forEach(b => counts[b.archetype] = (counts[b.archetype] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }, [bots]);

  // --- Handlers ---

  const handleArchetypeToggle = (id: BotArchetype) => {
    const newDist = { ...distribution };
    if (newDist[id] !== undefined) {
      delete newDist[id];
    } else {
      newDist[id] = 1;
    }
    setDistribution(newDist);
  };

  const handleQuantityChange = (id: BotArchetype, delta: number) => {
    const newDist = { ...distribution };
    const current = newDist[id] || 0;
    const next = Math.max(0, current + delta);
    newDist[id] = next;
    setDistribution(newDist);
  };

  const handleAutoGenerate = async () => {
    if (totalBotsToGenerate === 0) {
      setError("Selecione pelo menos 1 bot.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      let newBots: Bot[] = [];

      if (!useRealAI) {
        await new Promise(r => setTimeout(r, 800)); // UI Delay simulação
        Object.entries(distribution).forEach(([type, count]) => {
           const qty = (count as number) || 0;
           if (qty > 0) newBots.push(...generateLocalBots(qty, type as BotArchetype, wisdomLevel));
        });
      } else {
        newBots = await generateBotsWithAI(distribution, wisdomLevel, context);
      }
      
      addBots(newBots);
      setGeneratorOpen(false);
      setContext('');
      setDistribution({ enthusiast: 5 });
    } catch (e: any) {
      setError(e.message || "Erro desconhecido.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePrompt = () => {
    setGeneratedPrompt(buildBotBatchPrompt(distribution, wisdomLevel, context));
    setStep('prompt');
  };

  const handleImport = () => {
    try {
      setError(null);
      addBots(parseBotResponse(pastedJson));
      setGeneratorOpen(false);
      setStep('config');
      setPastedJson('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSaveEdit = () => {
    if (editingBot) {
        updateBot(editingBot.id, editingBot);
        setEditingBot(null);
    }
  };

  const randomizeAvatar = () => {
      if (editingBot) {
          const seed = Math.random().toString(36).substring(7);
          setEditingBot({
              ...editingBot,
              avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=e5e7eb`
          });
      }
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col space-y-6 animate-fade-in transition-colors duration-300">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Meus Bots
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Gerencie seu exército de prova social. Total: <strong className="text-gray-900 dark:text-white">{bots.length}</strong>
          </p>
          
          {/* Quick Stats Chips */}
          <div className="flex gap-2 mt-3">
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
               <Users size={12} className="mr-1" /> {bots.length} Personagens
             </span>
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 capitalize">
               <Filter size={12} className="mr-1" /> Top: {mostPopularArchetype}
             </span>
          </div>
        </div>

        <button 
          onClick={() => setGeneratorOpen(true)}
          className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white transition-all duration-200 bg-indigo-600 dark:bg-indigo-700 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 active:scale-95"
        >
          <Package className="mr-2 group-hover:rotate-12 transition-transform" size={20} />
          <span>Gerar Bots</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
        </button>
      </div>

      {/* --- STICKY SEARCH BAR --- */}
      <div className="sticky top-0 z-20 py-2 -mx-4 px-4 bg-gray-50/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
        <div className="relative group max-w-7xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nome ou tipo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl leading-5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      {filteredBots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-32">
          {filteredBots.map(bot => (
            <BotCard 
              key={bot.id} 
              bot={bot} 
              onEdit={setEditingBot} 
              onDelete={deleteBot} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
            <Package size={40} className="text-indigo-500 opacity-80" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'Nenhum bot encontrado' : 'Sua sala está vazia'}
          </h3>
          <p className="text-gray-500 dark:text-slate-400 max-w-sm mb-8">
            {searchTerm 
              ? `Não encontramos nada para "${searchTerm}".` 
              : "Você precisa de personagens para criar conversas. Gere alguns bots agora mesmo!"}
          </p>
          {!searchTerm && (
            <button 
              onClick={() => setGeneratorOpen(true)}
              className="px-6 py-2.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
            >
              Criar meu primeiro Bot
            </button>
          )}
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editingBot && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/80 dark:bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-slate-800 animate-fade-in-up transition-colors duration-300">
                <div className="p-5 flex justify-between items-center bg-indigo-600 dark:bg-indigo-700 shrink-0">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles size={20} /> Editar {editingBot.name}
                    </h2>
                    <button onClick={() => setEditingBot(null)} className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                    {/* Avatar Preview */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative group">
                            <img src={editingBot.avatar} className="w-24 h-24 rounded-full border-4 border-indigo-100 dark:border-indigo-900/50 shadow-md bg-gray-50" alt="Avatar" />
                            <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 ${editingBot.color}`}></div>
                            <button onClick={randomizeAvatar} className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-bold">
                                <RefreshCw size={24} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400">Clique para gerar novo avatar</p>
                    </div>

                    {/* Fields */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Nome do Agente</label>
                        <input 
                            type="text" 
                            value={editingBot.name} 
                            onChange={(e) => setEditingBot({...editingBot, name: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-gray-800 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Arquétipo</label>
                            <select 
                                value={editingBot.archetype}
                                onChange={(e) => setEditingBot({...editingBot, archetype: e.target.value as BotArchetype})}
                                className="w-full px-3 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-gray-800 dark:text-white font-medium"
                            >
                                {ARCHETYPES.map(arch => (
                                    <option key={arch.id} value={arch.id}>{arch.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Sabedoria ({editingBot.wisdomLevel}%)</label>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={editingBot.wisdomLevel}
                                onChange={(e) => setEditingBot({...editingBot, wisdomLevel: parseInt(e.target.value)})}
                                className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Descrição / Personalidade</label>
                        <textarea 
                            value={editingBot.description} 
                            onChange={(e) => setEditingBot({...editingBot, description: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm h-24 resize-none text-gray-700 dark:text-slate-300"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Cor de Identificação</label>
                        <div className="flex flex-wrap gap-2">
                            {BOT_COLORS.map(color => (
                                <button 
                                    key={color}
                                    onClick={() => setEditingBot({...editingBot, color})}
                                    className={`w-8 h-8 rounded-full ${color} border-2 transition-transform hover:scale-110 ${editingBot.color === color ? 'border-white dark:border-white ring-2 ring-indigo-500' : 'border-transparent'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-3 shrink-0">
                    <button onClick={() => setEditingBot(null)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors">
                        Cancelar
                    </button>
                    <button onClick={handleSaveEdit} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all">
                        <Save size={18} /> Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- GENERATOR MODAL --- */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/80 dark:bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-slate-800 animate-fade-in-up transition-colors duration-300">
            
            {/* Modal Header */}
            <div className={`p-5 flex justify-between items-center shrink-0 ${useRealAI ? 'bg-indigo-600 dark:bg-indigo-700' : 'bg-emerald-600 dark:bg-emerald-700'}`}>
              <div className="text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                   {step === 'config' ? (useRealAI ? 'Gerador via IA' : 'Gerador Rápido') : 'Importar Bots'}
                </h2>
                <p className="text-xs opacity-90">
                  {step === 'config' ? 'Configure a distribuição do seu "exército".' : 'Finalize a importação.'}
                </p>
              </div>
              <button onClick={() => setGeneratorOpen(false)} className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* AI Toggle Bar */}
            <div className="bg-gray-50 dark:bg-slate-950 px-6 py-3 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center shrink-0">
               <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Engine</span>
               <button 
                 onClick={toggleAI}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${useRealAI ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300'}`}
               >
                 {useRealAI ? <><Sparkles size={14}/> Gemini Online</> : <><Zap size={14}/> Local (Offline)</>}
                 {useRealAI ? <ToggleRight size={18}/> : <ToggleLeft size={18}/>}
               </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 custom-scrollbar">
              
              {step === 'config' && (
                <div className="space-y-6">
                  {/* Archetype Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ARCHETYPES.map((arch) => {
                      const isSelected = distribution[arch.id] !== undefined;
                      const count = distribution[arch.id] || 0;

                      return (
                        <div
                          key={arch.id}
                          onClick={() => handleArchetypeToggle(arch.id)}
                          className={`
                            group relative p-4 rounded-xl border-2 transition-all cursor-pointer select-none flex items-center justify-between
                            ${isSelected 
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                              : 'border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700'}
                          `}
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-gray-900 dark:text-white">{arch.label}</span>
                                {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{arch.desc}</p>
                          </div>

                          {/* Stepper Controls */}
                          {isSelected ? (
                            <div className="flex items-center bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-900/50 p-1" onClick={e => e.stopPropagation()}>
                              <button 
                                onClick={() => handleQuantityChange(arch.id, -1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-indigo-600"
                              >
                                <Minus size={14} />
                              </button>
                              <div className="w-8 text-center font-bold text-gray-900 dark:text-white">{count}</div>
                              <button 
                                onClick={() => handleQuantityChange(arch.id, 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-indigo-600"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full border border-dashed border-gray-300 dark:border-slate-700 flex items-center justify-center text-gray-300 dark:text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-300 transition-colors">
                              <Plus size={14} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {useRealAI && (
                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                           <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nível de Sabedoria</label>
                           <span className="text-sm font-mono text-indigo-600 dark:text-indigo-400 font-bold">{wisdomLevel}%</span>
                        </div>
                        <input 
                          type="range" min="0" max="100" step="5"
                          value={wisdomLevel}
                          onChange={(e) => setWisdomLevel(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contexto (Opcional)</label>
                        <input 
                          type="text" 
                          placeholder="ex: Médicos Cardiologistas, Gamers de RPG..."
                          value={context}
                          onChange={(e) => setContext(e.target.value)}
                          className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-xl text-sm border border-red-100 dark:border-red-900/50 flex items-center">
                      <Zap className="mr-2 shrink-0" size={16} /> {error}
                    </div>
                  )}
                </div>
              )}

              {step === 'prompt' && (
                <div className="space-y-4 h-full flex flex-col">
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl text-sm text-amber-800 dark:text-amber-200 border border-amber-100 dark:border-amber-800/50">
                    Copie o código abaixo e cole no seu Chatbot IA favorito (ChatGPT, Claude).
                  </div>
                  <div className="relative flex-1">
                    <textarea 
                      value={generatedPrompt}
                      readOnly
                      className="w-full h-full min-h-[300px] p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 focus:outline-none resize-none shadow-inner"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPrompt);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }} 
                      className="absolute top-4 right-4 px-3 py-1.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm text-xs font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>} {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
              )}

              {step === 'import' && (
                <div className="space-y-4">
                   <p className="text-sm text-gray-600 dark:text-slate-400">Cole o JSON gerado pela IA:</p>
                   <textarea 
                      value={pastedJson}
                      onChange={(e) => setPastedJson(e.target.value)}
                      placeholder='[ { "name": "...", "archetype": "..." } ]'
                      className="w-full h-64 p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl text-xs font-mono border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none resize-none dark:text-white"
                    />
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-5 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 shrink-0">
              {step === 'config' && (
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleAutoGenerate}
                    disabled={isGenerating || totalBotsToGenerate === 0}
                    className={`
                      w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center
                      ${totalBotsToGenerate > 0 
                        ? (useRealAI ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30') 
                        : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'}
                    `}
                  >
                    {isGenerating ? (
                      <><Loader2 className="mr-2 animate-spin" /> Processando...</>
                    ) : (
                      <>
                         {totalBotsToGenerate > 0 ? (
                            <>
                              {useRealAI ? <Sparkles className="mr-2" size={20} /> : <Zap className="mr-2" size={20} />}
                              Gerar {totalBotsToGenerate} Bot{totalBotsToGenerate > 1 ? 's' : ''} {useRealAI ? 'com IA' : 'Agora'}
                            </>
                         ) : (
                            "Escolha os tipos acima"
                         )}
                      </>
                    )}
                  </button>

                  {useRealAI && !isGenerating && (
                    <button 
                      onClick={handleGeneratePrompt}
                      className="w-full py-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center"
                    >
                      <FileJson className="mr-1.5" size={16} /> Prefiro gerar o prompt manual
                    </button>
                  )}
                </div>
              )}

              {step === 'prompt' && (
                <div className="flex gap-3">
                  <button onClick={() => setStep('config')} className="flex-1 py-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                    Voltar
                  </button>
                  <button onClick={() => setStep('import')} className="flex-1 py-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg">
                    Ir para Importação <ArrowRight size={18} className="inline ml-1" />
                  </button>
                </div>
              )}

              {step === 'import' && (
                <div className="flex gap-3">
                   <button onClick={() => setStep('prompt')} className="flex-1 py-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                     Voltar
                   </button>
                   <button onClick={handleImport} disabled={!pastedJson} className="flex-1 py-3 bg-green-600 dark:bg-green-700 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg disabled:opacity-50">
                    <FileJson size={18} className="inline mr-2" /> Finalizar
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
