
import React, { useState } from 'react';
import { useStore } from '../store';
import { MessageSquare, Calendar, Play, MoreVertical, Plus } from 'lucide-react';
import { Room } from '../types';
import { TemplateSelector } from '../components/TemplateSelector';

interface RoomListProps {
  onSelect: (id: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ onSelect }) => {
  const rooms = useStore(state => state.rooms);
  const bots = useStore(state => state.bots);
  const selectRoom = useStore(state => state.selectRoom);
  const addRoom = useStore(state => state.addRoom);

  const [isSelectingTemplate, setIsSelectingTemplate] = useState(false);

  const handleSelect = (id: string) => {
    selectRoom(id);
    onSelect(id);
  };

  const handleCreateRoomWithTemplate = (templateId: string) => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: 'Nova Campanha',
      description: 'Sem descrição definida.',
      theme: 'Geral',
      groupImage: '', // Inicializado para edição posterior
      templateId: templateId,
      botIds: [],
      timeline: [],
      status: 'draft',
      stats: {
        views: 0,
        completionRate: 0
      }
    };
    addRoom(newRoom);
    setIsSelectingTemplate(false);
    handleSelect(newRoom.id);
  };

  if (isSelectingTemplate) {
    return <TemplateSelector 
             onSelect={handleCreateRoomWithTemplate} 
             onCancel={() => setIsSelectingTemplate(false)} 
           />;
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto transition-colors duration-300">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap uppercase tracking-tighter">Salas de Chat</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Suas campanhas de prova social ativas.</p>
        </div>
        <button 
          onClick={() => setIsSelectingTemplate(true)}
          className="bg-brand-600 dark:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-md hover:bg-brand-700 dark:hover:bg-brand-600 hover:shadow-lg transition-all flex items-center text-sm sm:text-base whitespace-nowrap uppercase tracking-tighter"
        >
          <Plus size={20} className="mr-2" /> Nova Sala
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-64 overflow-hidden">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2 py-1 text-xs font-semibold rounded uppercase tracking-tighter ${room.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
                  {room.status === 'active' ? 'Ativa' : 'Pausada'}
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-1 truncate">
                  {room.groupImage ? (
                      <img src={room.groupImage} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" alt="" />
                  ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          <MessageSquare className="w-4 h-4 text-slate-400" />
                      </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight truncate">{room.name}</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 leading-snug">{room.description}</p>

              <div className="flex -space-x-2 overflow-hidden mb-4">
                 {room.botIds.map(botId => {
                   const bot = bots.find(b => b.id === botId);
                   if (!bot) return null;
                   return (
                     <img key={bot.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover border border-slate-200 dark:border-slate-800" src={bot.avatar} alt={bot.name} title={bot.name} />
                   )
                 })}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 p-4 rounded-b-xl flex justify-between items-center transition-colors">
               <div className="text-xs text-gray-500 dark:text-slate-400">
                 <span className="block font-semibold text-gray-900 dark:text-white">{room.timeline.length}</span>
                 msgs
               </div>
               <div className="h-4 w-px bg-gray-300 dark:bg-slate-700 mx-2"></div>
               <div className="text-xs text-gray-500 dark:text-slate-400">
                 <span className="block font-semibold text-gray-900 dark:text-white">{room.stats.views}</span>
                 views
               </div>
               <button 
                onClick={() => handleSelect(room.id)}
                className="ml-4 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-brand-600 dark:text-brand-400 rounded-lg text-sm font-bold uppercase tracking-tight hover:bg-brand-50 dark:hover:bg-slate-700 hover:border-brand-200 transition-colors whitespace-nowrap"
               >
                 Editar Timeline
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
