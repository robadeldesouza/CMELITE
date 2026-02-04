import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bot, AIGenerationParams } from '../types';
import { X, Sparkles, Copy, Check, ArrowRight, FileJson, Terminal, Zap, ToggleLeft, ToggleRight, MessageSquarePlus } from 'lucide-react';
import { buildConversationPrompt, parseConversationResponse } from '../services/geminiService';
import { generateLocalTimeline } from '../services/localData';
import { useStore } from '../store';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  bots: Bot[];
  roomId: string;
}

type Step = 'config' | 'prompt' | 'import';

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({ isOpen, onClose, bots, roomId }) => {
  const [step, setStep] = useState<Step>('config');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [pastedJson, setPastedJson] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useRealAI = useStore(state => state.useRealAI);
  const toggleAI = useStore(state => state.toggleAI);
  const updateTimeline = useStore(state => state.updateTimeline);

  const { register, handleSubmit } = useForm<AIGenerationParams>({
    defaultValues: {
      durationSeconds: 120,
      tone: 'casual',
      botIds: bots.map(b => b.id).slice(0, 4)
    }
  });

  if (!isOpen) return null;

  const handleConfigSubmit = (data: AIGenerationParams) => {
    const selectedBots = bots.filter(b => data.botIds.includes(b.id));
    
    if (!useRealAI) {
      // --- LOCAL GENERATION MODE ---
      const timeline = generateLocalTimeline(
        data.theme,
        selectedBots,
        data.durationSeconds
      );
      updateTimeline(roomId, timeline);
      onClose();
    } else {
      // --- PROMPT BUILDER MODE ---
      const prompt = buildConversationPrompt(
        data.theme,
        data.objective,
        data.tone,
        selectedBots,
        data.durationSeconds
      );
      setGeneratedPrompt(prompt);
      setStep('prompt');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    try {
      setError(null);
      const selectedBots = bots;
      const timeline = parseConversationResponse(pastedJson, selectedBots);
      updateTimeline(roomId, timeline);
      onClose();
      // Reset
      setStep('config');
      setPastedJson('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up my-auto border border-gray-200 dark:border-slate-800">
        
        {/* Header */}
        <div className={`p-6 flex justify-between items-start transition-colors ${useRealAI ? 'bg-gradient-to-r from-indigo-600 to-blue-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              {useRealAI ? <MessageSquarePlus size={22} /> : <Zap size={22} />}
              {useRealAI 
                ? (step === 'config' ? '1. Configurar Roteiro' : step === 'prompt' ? '2. Copiar Prompt Gerado' : '3. Importar JSON')
                : 'Gerador Rápido (Local)'
              }
            </h2>
            <p className="text-white/90 text-xs sm:text-sm mt-1">
              {useRealAI 
                ? 'Configure a cena e gere um prompt otimizado para usar no ChatGPT/Claude.' 
                : 'Cria uma conversa genérica instantaneamente sem sair do app.'}
            </p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* MODE SWITCHER */}
        <div className="bg-gray-50 dark:bg-slate-950 px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">Modo de Operação</span>
            <button 
              onClick={toggleAI}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all w-full sm:w-auto justify-center ${useRealAI ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 ring-1 ring-indigo-500/30' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 ring-1 ring-emerald-500/30'}`}
            >
              {useRealAI ? (
                <>
                  <Sparkles size={14} /> Construtor de Prompt (ChatGPT/Claude)
                  <ToggleRight size={20} className="ml-1" />
                </>
              ) : (
                <>
                  <Zap size={14} /> Gerador Local (Sem IA Externa)
                  <ToggleLeft size={20} className="ml-1" />
                </>
              )}
            </button>
        </div>

        {/* Step 1: Configuração */}
        {step === 'config' && (
          <form onSubmit={handleSubmit(handleConfigSubmit)} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-1">
                Tema Principal <span className="text-red-500">*</span>
              </label>
              <input 
                {...register('theme', { required: true })}
                placeholder={useRealAI ? "ex: Anatomia Humana e Dissecação" : "ex: Produto X"}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white placeholder:text-gray-400"
              />
            </div>

            {/* Inputs de Contexto (Apenas no Modo Roteirista/Prompt) */}
            {useRealAI && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                  <label className="block text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                    Objetivo da Conversa <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">O que os bots devem atingir com esse papo?</p>
                  <input 
                    {...register('objective')}
                    placeholder="ex: Explicar cientificamente as diferenças biológicas..."
                    className="w-full px-4 py-2 border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tom de Voz</label>
                    <select {...register('tone')} className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white">
                      <option value="casual">Casual (Gírias leves)</option>
                      <option value="professional">Profissional & Técnico</option>
                      <option value="educational">Educacional / Didático</option>
                      <option value="debate">Debate / Polêmico</option>
                      <option value="excited">Empolgado / Vendas</option>
                    </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Duração Aprox.</label>
                     <select {...register('durationSeconds')} className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white">
                        <option value={60}>Curta (~60 seg / 12 msgs)</option>
                        <option value={120}>Média (~120 seg / 24 msgs)</option>
                        <option value={180}>Longa (~180 seg / 36 msgs)</option>
                      </select>
                  </div>
                </div>
              </div>
            )}

            {!useRealAI && (
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Duração</label>
                  <select {...register('durationSeconds')} className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:text-white">
                    <option value={30}>Rápida (30s)</option>
                    <option value={60}>Normal (60s)</option>
                    <option value={90}>Estendida (90s)</option>
                  </select>
               </div>
            )}

            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Quem vai participar?</label>
               <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1 border border-gray-100 dark:border-slate-800 rounded-lg bg-gray-50 dark:bg-slate-900/50">
                 {bots.map(bot => (
                   <label key={bot.id} className="cursor-pointer group">
                     <input 
                      type="checkbox" 
                      value={bot.id} 
                      {...register('botIds')}
                      className="peer sr-only"
                     />
                     <div className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-gray-600 dark:text-slate-400 peer-checked:bg-indigo-100 peer-checked:text-indigo-700 peer-checked:border-indigo-300 dark:peer-checked:bg-indigo-900/40 dark:peer-checked:text-indigo-300 dark:peer-checked:border-indigo-700 transition-all flex items-center gap-2 select-none shadow-sm">
                       <img src={bot.avatar} className="w-4 h-4 rounded-full opacity-70 group-hover:opacity-100" alt="" />
                       <span className="truncate max-w-[100px]">{bot.name}</span>
                     </div>
                   </label>
                 ))}
               </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                className={`flex items-center px-6 py-3 text-white font-bold rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-0.5 ${useRealAI ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'}`}
              >
                {useRealAI ? (
                  <>Gerar Roteiro (Prompt) <ArrowRight size={18} className="ml-2" /></>
                ) : (
                  <>Gerar Agora (Local) <Zap size={18} className="ml-2" /></>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Prompt View (Prompt Builder Mode) */}
        {useRealAI && step === 'prompt' && (
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200 mb-2 flex items-start">
              <span className="mr-2 text-xl">📋</span>
              <div>
                <p className="font-bold mb-1">Quase lá! Siga os passos:</p>
                <ol className="list-decimal ml-4 space-y-1 opacity-90">
                  <li>Copie o prompt estruturado abaixo.</li>
                  <li>Cole no seu chat com IA favorito (ChatGPT, Claude, etc).</li>
                  <li>Copie a resposta (JSON) que ele gerar e volte aqui.</li>
                </ol>
              </div>
            </div>

            <div className="relative group">
              <textarea 
                value={generatedPrompt}
                readOnly
                className="w-full h-64 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 focus:outline-none resize-none shadow-inner"
              />
              <button 
                onClick={handleCopy}
                className={`absolute top-3 right-3 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-lg border ${copied ? 'bg-green-500 text-white border-green-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copiado com Sucesso!' : 'Copiar Prompt'}
              </button>
            </div>

            <div className="flex justify-between pt-4">
               <button onClick={() => setStep('config')} className="text-gray-500 hover:text-gray-700 dark:text-slate-500 dark:hover:text-slate-300 text-sm font-medium">
                 Voltar e Editar
               </button>
               <button 
                onClick={() => setStep('import')}
                className="flex items-center px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
              >
                Já tenho o JSON <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Import View */}
        {useRealAI && step === 'import' && (
          <div className="p-6 space-y-4">
             <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">
               <Terminal size={16} className="text-indigo-500" />
               Cole aqui o JSON que a IA gerou:
             </div>

             <textarea 
                value={pastedJson}
                onChange={(e) => setPastedJson(e.target.value)}
                placeholder='[ { "botName": "Sara J.", "text": "..." }, ... ]'
                className="w-full h-48 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-inner"
              />

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 animate-pulse">
                  ⚠️ {error}
                </div>
              )}

             <div className="flex justify-between pt-4">
               <button onClick={() => setStep('prompt')} className="text-gray-500 hover:text-gray-700 dark:text-slate-500 dark:hover:text-slate-300 text-sm font-medium">
                 Voltar ao Prompt
               </button>
               <button 
                onClick={handleImport}
                disabled={!pastedJson}
                className="flex items-center px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
              >
                <FileJson size={18} className="mr-2" /> Processar e Criar Timeline
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};