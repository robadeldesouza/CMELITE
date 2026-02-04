
import React from 'react';
import { useStore } from '../store';
import { MessageSquare, Calendar, Play, MoreVertical, Plus } from 'lucide-react';
import { BotArchetype } from '../types';

interface RoomListProps {
  onSelect: (id: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({ onSelect }) => {
  const rooms = useStore(state => state.rooms);
  const bots = useStore(state => state.bots);
  const selectRoom = useStore(state => state.selectRoom);

  const handleSelect = (id: string) => {
    selectRoom(id);
    onSelect(id);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">Salas de Chat</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Suas campanhas de prova social ativas.</p>
        </div>
        <button 
          className="bg-brand-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:bg-brand-700 hover:shadow-lg transition-all flex items-center text-sm sm:text-base whitespace-nowrap"
        >
          <Plus size={20} className="mr-2" /> Nova Sala
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col h-64">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2 py-1 text-xs font-semibold rounded uppercase ${room.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
                  {room.status === 'active' ? 'Ativa' : 'Pausada'}
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">