import React, { useState } from 'react';
import { useStore } from '../store';
import { TimelineEditor } from '../components/TimelineEditor';
import { ChatPreview } from '../components/ChatPreview';
import { LandingPageSimulation } from '../components/LandingPageSimulation';
import { AIGeneratorModal } from '../components/AIGeneratorModal';
import { ArrowLeft, Share2, Save, Smartphone, MonitorPlay } from 'lucide-react';

export const RoomEditor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const currentRoomId = useStore(state => state.currentRoomId);
  const rooms = useStore(state => state.rooms);
  const bots = useStore(state => state.bots);
  const updateTimeline = useStore(state => state.updateTimeline);
  
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isPreviewVisible, setPreviewVisible] = useState(true);
  const [isSimulationMode, setSimulationMode] = useState(false);

  // Safe fallback if room deleted or not found
  const room = rooms.find(r => r.id === currentRoomId);
  if (!room) return <div className="p-8 text-center dark:text-white">Sala não encontrada</div>;

  const roomBots = bots.filter(b => room.botIds.includes(b.id));

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden relative">
      {/* Toolbar */}
      <div className="h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-3 sm:px-6 flex justify-between items-center shrink-0 z-20">
        <div className="flex items-center space-x-2 min-w-0">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-slate-300 shrink-0">
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-white truncate text-sm sm:text-base">{room.name}</h2>
            <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 truncate">
               <span className={`w-2 h-2 rounded-full shrink-0 ${room.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
               <span>{room.status === 'active' ? 'Ativa' : 'Pausada'}</span>
               <span className="hidden sm:inline">•</span>
               <span className="hidden sm:inline">{room.timeline.length} msgs</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
           {/* Simulation Mode Toggle */}
           <button 
             onClick={() => setSimulationMode(!isSimulationMode)}
             className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-colors border ${isSimulationMode ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300' : 'bg-white border-gray-200 text-gray-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-gray-50'}`}
             title="Simular Site"
           >
             <MonitorPlay size={16} />
             <span className="hidden md:inline">{isSimulationMode ? 'Voltar' : 'Simular'}</span>
           </button>

           {/* Preview Toggle (Only in Editor Mode) */}
           {!isSimulationMode && (
             <button 
               onClick={() => setPreviewVisible(!isPreviewVisible)}
               className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-colors ${isPreviewVisible ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
               title="Mostrar/Ocultar Preview"
             >
               <Smartphone size={16} />
               <span className="hidden md:inline">{isPreviewVisible ? 'Ocultar' : 'Preview'}</span>
             </button>
           )}

           <div className="h-4 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>

           <button className="p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800" title="Gerar Código Embed">
             <Share2 size={18} />
           </button>
           <button className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 bg-slate-900 dark:bg-brand-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-brand-700 font-medium shadow-sm text-xs sm:text-sm whitespace-nowrap">
             <Save size={16} className="shrink-0" />
             <span className="hidden sm:inline">Salvar</span>
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {isSimulationMode ? (
          <div className="absolute inset-0 z-0">
             <LandingPageSimulation room={room} />
             {/* Widget Mode Preview */}
             <ChatPreview 
               timeline={room.timeline} 
               bots={roomBots} 
               isWidgetMode={true}
             />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto h-full p-2 sm:p-4 md:p-6">
            <TimelineEditor 
              messages={room.timeline} 
              bots={roomBots} 
              onChange={(newTimeline) => updateTimeline(room.id, newTimeline)}
              onGenerateAI={() => setAIModalOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Floating Chat Preview Overlay (Only in Editor Mode) */}
      {!isSimulationMode && isPreviewVisible && (
        <ChatPreview 
          timeline={room.timeline} 
          bots={roomBots} 
          onClose={() => setPreviewVisible(false)}
        />
      )}

      <AIGeneratorModal 
        isOpen={isAIModalOpen} 
        onClose={() => setAIModalOpen(false)}
        bots={roomBots}
        roomId={room.id}
      />
    </div>
  );
};