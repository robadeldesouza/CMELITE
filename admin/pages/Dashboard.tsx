
import React from 'react';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, MessageSquare, Eye, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const rooms = useStore(state => state.rooms);
  const bots = useStore(state => state.bots);

  // Aggregated Stats
  const totalViews = rooms.reduce((acc, r) => acc + r.stats.views, 0);
  const totalMessages = rooms.reduce((acc, r) => acc + r.timeline.length, 0);
  const avgCompletion = Math.round(rooms.reduce((acc, r) => acc + r.stats.completionRate, 0) / (rooms.length || 1));

  const data = [
    { name: 'Seg', views: 400 },
    { name: 'Ter', views: 300 },
    { name: 'Qua', views: 550 },
    { name: 'Qui', views: 800 },
    { name: 'Sex', views: 650 },
    { name: 'Sab', views: 900 },
    { name: 'Dom', views: 1200 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-fade-in pb-10">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis font-sans tracking-tight uppercase">Painel de Operações</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">Status atual do ecossistema e métricas de engajamento.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400 truncate">Visualizações</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalViews.toLocaleString()}</h3>
            </div>
            <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
              <Eye size={16} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <span className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 flex items-center mt-2 font-medium truncate">
            <TrendingUp size={12} className="mr-1" /> +12% esta semana
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400 truncate">Taxa de Conclusão</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{avgCompletion}%</h3>
            </div>
            <div className="p-1.5 sm:p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg shrink-0">
              <TrendingUp size={16} className="sm:w-5 sm:h-5" />
            </div>
          </div>
           <span className="text-[10px] sm:text-xs text-gray-400 dark:text-slate-500 mt-2 block truncate">Usuários que viram todo o fluxo</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400 truncate">Agentes Ativos</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{bots.length}</h3>
            </div>
            <div className="p-1.5 sm:p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg shrink-0">
              <Users size={16} className="sm:w-5 sm:h-5" />
            </div>
          </div>
           <span className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 mt-2 block truncate">Em {rooms.length} campanhas</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400 truncate">Mensagens</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalMessages}</h3>
            </div>
            <div className="p-1.5 sm:p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg shrink-0">
              <MessageSquare size={16} className="sm:w-5 sm:h-5" />
            </div>
          </div>
           <span className="text-[10px] sm:text-xs text-gray-400 dark:text-slate-500 mt-2 block truncate">Total de interações roteirizadas</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors flex flex-col min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Tendência de Engajamento</h3>
          <div className="flex-1 w-full min-h-[300px] sm:min-h-[350px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', backgroundColor: '#1e293b', color: '#fff' }} />
                <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-tighter text-sm">Salas Populares</h3>
          <div className="space-y-4">
            {rooms.map((room, idx) => (
              <div key={room.id} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 mr-3 shrink-0 border border-slate-200 dark:border-slate-700">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{room.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{room.stats.views} visualizações</p>
                </div>
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-500 whitespace-nowrap ml-2">
                  {room.stats.completionRate}%
                </div>
              </div>
            ))}
            {rooms.length === 0 && (
               <p className="text-sm text-gray-400 text-center py-4">Nenhuma campanha ativa.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
