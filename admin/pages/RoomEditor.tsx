
import React, { useState, useRef } from 'react';
import { useStore } from '../store';
import { TimelineEditor } from '../components/TimelineEditor';
import { ChatPreview } from '../components/ChatPreview';
import { LandingPageSimulation } from '../components/LandingPageSimulation';
import { AIGeneratorModal } from '../components/AIGeneratorModal';
import { 
  ArrowLeft, Share2, Save, Smartphone, MonitorPlay, 
  Image as ImageIcon, Upload, Link, X, Users, CheckCircle2 
} from 'lucide-react';

export const RoomEditor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const currentRoomId = useStore(state => state.currentRoomId);
  const rooms = useStore(state => state.rooms);
  const bots = useStore(state => state.bots);
  const updateRoom = useStore(state => state.updateRoom);
  const updateTimeline = useStore(state => state.updateTimeline);
  
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [isSimulationMode, setSimulationMode] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const room = rooms.find(r => r.id === currentRoomId);
  if (!room) return <div className="p-8 text-center dark:text-white">Sala não encontrada</div>;

  const roomBots = bots.filter(b => room.botIds.includes(b.id));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateRoom(room.id, { groupImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Zustand persist middleware já lida com o localStorage, 
    // aqui apenas simulamos o delay de escrita e damos feedback
    setTimeout(() => {
        setIsSaving(false);
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden relative transition-colors duration-300">
      {/* Toolbar */}
      <div className="h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-3 sm:px-6 flex justify-between items-center shrink-0 z-20 transition-colors duration-300">
        <div className="flex items-center space-x-2 min-w-0">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-slate-300 shrink-0">
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-white truncate text-sm sm:text-base uppercase tracking-tight">{room.name}</h2>
            <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 truncate">
               <span className={`w-2 h-2 rounded-full shrink-0 ${room.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
               <span>{room.status === 'active' ? 'Ativa' : 'Pausada'}</span>
               <span className="hidden sm:inline">•</span>
               <span className="hidden sm:inline">{room.timeline.length} msgs</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
           {/* Botão de Configuração de Asset do Grupo */}
           <button 
             onClick={() => setIsConfigOpen(!isConfigOpen)}
             className={`p-2 rounded-lg transition-colors border ${isConfigOpen ? 'bg-brand-500 text-white border-brand-600 shadow-neon' : 'bg-white border-gray-200 text-gray-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
             title="Configurações do Grupo"
           >
             <ImageIcon size={16} />
           </button>

           <button 
             onClick={() => setSimulationMode(!isSimulationMode)}
             className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-colors border ${isSimulationMode ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300' : 'bg-white border-gray-200 text-gray-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-gray-50'}`}
             title="Simular Site"
           >
             <MonitorPlay size={16} />
             <span className="hidden md:inline">{isSimulationMode ? 'Voltar' : 'Simular'}</span>
           </button>

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
           
           {/* Correção: Adicionado onClick handleSave e estado de loading/success */}
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-lg font-medium shadow-sm text-xs sm:text-sm whitespace-nowrap transition-all active:scale-95 ${isSaving ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-brand-600 text-white hover:bg-slate-800 dark:hover:bg-brand-700'}`}
           >
             {isSaving ? <CheckCircle2 size={16} className="shrink-0 animate-pulse" /> : <Save size={16} className="shrink-0" />}
             <span className="hidden sm:inline">{isSaving ? 'Salvo!' : 'Salvar'}</span>
           </button>
        </div>
      </div>

      {/* PAINEL DE CONFIGURAÇÃO DE IMAGEM */}
      {isConfigOpen && (
          <div className="absolute top-16 right-6 z-50 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-4 animate-slide-up-fade">
             <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} className="text-brand-500" /> Identidade do Grupo
                </h4>
                <button onClick={() => setIsConfigOpen(false)}><X size={16} className="text-slate-400" /></button>
             </div>

             <div className="space-y-4">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-slate-100 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900 flex items-center justify-center relative group shadow-inner">
                        {room.groupImage ? (
                            <img src={room.groupImage} className="w-full h-full object-cover" alt="Grupo" />
                        ) : (
                            <Users size={40} className="text-slate-300" />
                        )}
                        {room.groupImage && (
                            <button 
                                onClick={() => updateRoom(room.id, { groupImage: '' })}
                                className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                                <X size={24} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Via Link (URL)</label>
                    <div className="relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input 
                            type="text"
                            placeholder="https://..."
                            value={room.groupImage && !room.groupImage.startsWith('data:') ? room.groupImage : ''}
                            onChange={(e) => updateRoom(room.id, { groupImage: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs dark:text-white focus:ring-1 focus:ring-brand-500 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Via Upload Direto</label>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors border border-dashed border-slate-300 dark:border-slate-600"
                    >
                        <Upload size={14} /> Selecionar Arquivo
                    </button>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                    <button 
                        onClick={() => {
                            setIsConfigOpen(false);
                            handleSave();
                        }}
                        className="w-full py-2 bg-brand-600 text-white text-[10px] font-black uppercase rounded shadow-md active:scale-95 transition-transform"
                    >
                        Concluir Identidade
                    </button>
                </div>
             </div>
          </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
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
