
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Bot, Room, TimelineMessage } from './types';

export type AppMode = 'none' | 'orchestration' | 'admin';

interface AppState {
  isAuthenticated: boolean;
  appMode: AppMode;
  theme: 'light' | 'dark';
  useRealAI: boolean;
  bots: Bot[];
  rooms: Room[];
  currentRoomId: string | null;
  isSystemOverlayActive: boolean; // Estado para ocultar UI chrome
  
  // Actions
  login: () => void;
  logout: () => void;
  setAppMode: (mode: AppMode) => void;
  toggleTheme: () => void;
  toggleAI: () => void;
  setSystemOverlay: (active: boolean) => void;
  addBot: (bot: Bot) => void;
  addBots: (bots: Bot[]) => void;
  updateBot: (id: string, updates: Partial<Bot>) => void;
  deleteBot: (id: string) => void;
  
  addRoom: (room: Room) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  selectRoom: (id: string) => void;
  
  updateTimeline: (roomId: string, timeline: TimelineMessage[]) => void;
}

const MOCK_BOTS: Bot[] = [
  { id: 'b1', name: 'Júlia', avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Julia&backgroundColor=ffd5dc', color: 'bg-pink-500', archetype: 'enthusiast', description: 'Usuária heavy de eventos, sempre animada.', wisdomLevel: 40 },
  { id: 'b2', name: 'Flávio', avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Flavio&backgroundColor=c0aede', color: 'bg-blue-500', archetype: 'experienced', description: 'Analista técnico, entende dos protocolos de injeção.', wisdomLevel: 95 },
  { id: 'b3', name: 'Alfredo', avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Alfredo&backgroundColor=ffdfbf', color: 'bg-orange-500', archetype: 'beginner', description: 'Iniciante cauteloso, faz muitas perguntas.', wisdomLevel: 20 },
  { id: 'b4', name: 'Marcos R.', avatar: 'https://api.dicebear.com/9.x/notionists/svg?seed=Marcos&backgroundColor=d1d4f9', color: 'bg-green-500', archetype: 'pragmatic', description: 'Focado em lucro e eficiência de spins.', wisdomLevel: 85 },
];

const MOCK_ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'Elite VIP Group',
    description: 'Comunidade secreta de troca de informações e auditoria de roleta.',
    theme: 'CoinMaster Dominance',
    groupImage: '',
    botIds: ['b1', 'b2', 'b3', 'b4'],
    status: 'active',
    stats: { views: 12840, completionRate: 94 },
    timeline: [
      { id: 'm1', botId: 'b1', text: 'Gente! Acabei de testar o novo Bypass do Rinoceronte. O pet do oponente nem reagiu kkkkk 🐷🔥', delayAfter: 4, timestamp: Date.now() },
      { id: 'm2', botId: 'b3', text: 'Sério Júlia? Mas precisa de Root ou Jailbreak? Tenho medo de perder minha conta principal.', delayAfter: 5, timestamp: Date.now() },
      { id: 'm3', botId: 'b2', text: 'Alfredo, o sistema é 100% Cloud. Ele injeta direto no protocolo do servidor via Stealth 7, seu celular nem detecta. Risco zero de ban.', delayAfter: 6, timestamp: Date.now() },
      { id: 'm4', botId: 'b4', text: 'Fiz o teste com a IA Oráculo agora cedo. Previu 3 sequências de porcos seguidas no x500. Subi 15 vilas em 10 minutos.', delayAfter: 4, timestamp: Date.now() },
      { id: 'm5', botId: 'b1', text: 'É isso que eu tô falando! Valeu cada centavo, já recuperei o investimento só com os spins que ganhei na Viking. 😍🚀', delayAfter: 3, timestamp: Date.now() },
    ]
  }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      appMode: 'none',
      theme: 'dark', 
      useRealAI: false,
      bots: MOCK_BOTS,
      rooms: MOCK_ROOMS,
      currentRoomId: 'r1',
      isSystemOverlayActive: false,

      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false, appMode: 'none' }),
      setAppMode: (mode) => set({ appMode: mode }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      toggleAI: () => set((state) => ({ useRealAI: !state.useRealAI })),
      setSystemOverlay: (active) => set({ isSystemOverlayActive: active }),

      addBot: (bot) => set((state) => ({ bots: [...state.bots, bot] })),
      addBots: (newBots) => set((state) => ({ bots: [...state.bots, ...newBots] })),
      
      updateBot: (id, updates) => set((state) => ({
        bots: state.bots.map(b => b.id === id ? { ...b, ...updates } : b)
      })),
      deleteBot: (id) => set((state) => ({ bots: state.bots.filter(b => b.id !== id) })),

      addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
      updateRoom: (id, updates) => set((state) => ({
        rooms: state.rooms.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      selectRoom: (id) => set({ currentRoomId: id }),
      
      updateTimeline: (roomId, timeline) => set((state) => ({
        rooms: state.rooms.map(r => r.id === roomId ? { ...r, timeline } : r)
      })),
    }),
    {
      name: 'social-proof-ai-storage-admin',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        appMode: state.appMode,
        theme: state.theme,
        useRealAI: state.useRealAI,
        bots: state.bots,
        rooms: state.rooms,
        currentRoomId: state.currentRoomId
      }),
    }
  )
);
