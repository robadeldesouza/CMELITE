
import React from 'react';
import { Bot, BotArchetype } from '../types';
import { MoreHorizontal, Edit, Trash2, Brain } from 'lucide-react';

interface BotCardProps {
  bot: Bot;
  onEdit: (bot: Bot) => void;
  onDelete: (id: string) => void;
}

const ArchetypeBadge: React.FC<{ type: BotArchetype }> = ({ type }) => {
  const colors: Record<BotArchetype, string> = {
    enthusiast: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
    skeptic: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
    friendly: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    pragmatic: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    curious: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    influencer: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
    experienced: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
    beginner: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
  };

  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide ${colors[type]}`}>
      {type}
    </span>
  );
};

export const BotCard: React.FC<BotCardProps> = ({ bot, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow relative group">
      {/* Botões de Ação: Sempre visíveis */}
      <div className="absolute top-4 right-4 flex space-x-1">
        <button 
          onClick={() => onEdit(bot)} 
          className="p-2 bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors border border-gray-100 dark:border-slate-700"
          title="Editar Bot"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => onDelete(bot.id)} 
          className="p-2 bg-gray-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-500 dark:text-slate-400 hover:text-red-500 rounded-lg transition-colors border border-gray-100 dark:border-slate-700"
          title="Excluir Bot"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-start space-x-4">
        <div className="relative shrink-0">
          <img src={bot.avatar} alt={bot.name} className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${bot.color}`}></div>
        </div>
        <div className="min-w-0 pr-16">
          <h3 className="font-bold text-gray-900 dark:text-white truncate">{bot.name}</h3>
          <div className="mt-1 mb-2 flex items-center flex-wrap gap-1">
            <ArchetypeBadge type={bot.archetype} />
            <div className="flex items-center text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-gray-600 dark:text-slate-400" title="Nível de Conhecimento">
              <Brain size={10} className="mr-1" /> {bot.wisdomLevel}%
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 leading-snug">{bot.description}</p>
        </div>
      </div>
    </div>
  );
};
