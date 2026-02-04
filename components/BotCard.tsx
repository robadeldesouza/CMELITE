
import React from 'react';
import { Bot, BotArchetype } from '../types';
import { MoreHorizontal, Edit, Trash2, Brain } from 'lucide-react';

interface BotCardProps {
  bot: Bot;
  onEdit: (bot: Bot) => void;
  onDelete: (id: string) => void;
}

const ArchetypeBadge: React.FC<{ type: BotArchetype }> = ({ type }) => {
  const config: Record<BotArchetype, { label: string; style: string }> = {
    enthusiast: { label: 'Entusiasta', style: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    skeptic: { label: 'Cético', style: 'bg-red-100 text-red-800 border-red-200' },
    friendly: { label: 'Amigável', style: 'bg-green-100 text-green-800 border-green-200' },
    pragmatic: { label: 'Pragmático', style: 'bg-blue-100 text-blue-800 border-blue-200' },
    curious: { label: 'Curioso', style: 'bg-purple-100 text-purple-800 border-purple-200' },
    influencer: { label: 'Influenciador', style: 'bg-pink-100 text-pink-800 border-pink-200' },
    experienced: { label: 'Experiente', style: 'bg-slate-100 text-slate-800 border-slate-200' },
    beginner: { label: 'Iniciante', style: 'bg-orange-100 text-orange-800 border-orange-200' },
  };

  const { label, style } = config[type];

  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide ${style}`}>
      {label}
    </span>
  );
};

export const BotCard: React.FC<BotCardProps> = ({ bot, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow relative group">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <button onClick={() => onDelete(bot.id)} className="p-1.5 hover:bg-red-50 rounded-md text-red-500">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-start space-x-4">
        <div className="relative shrink-0">
          <img src={bot.avatar} alt={bot.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${bot.color}`}></div>
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 truncate">{bot.name}</h3>
          <div className="mt-1 mb-2 flex items-center flex-wrap gap-1">
            <ArchetypeBadge type={bot.archetype} />
            <div className="flex items-center text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500" title="Nível de Conhecimento">
              <Brain size={10} className="mr-1" /> {bot.wisdomLevel}%
            </div>
          </div>
          <p className="text-sm text-slate-500 line-clamp-2 leading-snug">{bot.description}</p>
        </div>
      </div>
    </div>
  );
};
