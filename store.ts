
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Bot, Room, TimelineMessage, BotArchetype } from './types';

export type AppMode = 'none' | 'orchestration' | 'admin';

const FIRST_NAMES = ["Ana", "Bruno", "Carla", "Daniel", "Eduardo", "Fernanda", "Gabriel", "Helena", "Igor", "Julia", "Lucas", "Mariana", "Nicolas", "Olivia", "Pedro", "Rafael", "Sofia", "Thiago", "Vitoria", "Wesley", "Amanda", "Beatriz", "Caio", "Diego", "Ricardo", "Marcelo", "Leandro", "Tiago", "Anderson", "Rodrigo", "Pablo", "Diogo", "Fagner", "Júlio", "Gilberto", "Renan", "Douglas", "Wagner", "Everton", "Jeferson"];
const LAST_NAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa", "Rocha", "Dias", "Nascimento", "Andrade", "Moreira"];
const ARCHETYPES: BotArchetype[] = ['enthusiast', 'skeptic', 'friendly', 'pragmatic', 'curious', 'influencer', 'experienced', 'beginner'];
const COLORS = ['bg-pink-500', 'bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'];

const generateLargeBotArmy = (count: number): Bot[] => {
  const army: Bot[] = [];
  for (let i = 0; i < count; i++) {
    const name = `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`;
    const archetype = ARCHETYPES[i % ARCHETYPES.length];
    const color = COLORS[i % COLORS.length];
    const wisdom = Math.floor(Math.random() * 90) + 10;
    
    army.push({
      id: `bot-army-${i}`,
      name,
      avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(name)}&backgroundColor=e5e7eb`,
      color,
      archetype,
      description: `Membro Elite - Focado em ${archetype === 'experienced' ? 'estratégias avançadas' : 'resultados rápidos'}.`,
      wisdomLevel: wisdom
    });
  }
  return army;
};

const INITIAL_BOT_ARMY = generateLargeBotArmy(1321);

interface AppState {
  isAuthenticated: boolean;
  appMode: AppMode;
  theme: 'light' | 'dark';
  useRealAI: boolean;
  bots: Bot[];
  rooms: Room[];
  currentRoomId: string | null;
  isSystemOverlayActive: boolean;
  userReactions: Record<string, string>;
  persistentOnlineCount: number | null;
  
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
  setReaction: (messageId: string, emoji: string | null) => void;
  setOnlineCount: (count: number) => void;
}

const MOCK_ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'Elite VIP Group',
    description: 'Comunidade secreta de troca de informações e auditoria de roleta.',
    theme: 'CoinMaster Dominance',
    botIds: INITIAL_BOT_ARMY.map(b => b.id),
    status: 'active',
    stats: { views: 12840, completionRate: 94 },
    timeline: [
      { id: 'm1', botId: 'bot-army-10', text: 'Gente! Acabei de testar o novo Bypass do Rinoceronte. O pet do oponente nem reagiu kkkkk 🐷🔥', delayAfter: 6, timestamp: Date.now() },
      { id: 'm2', botId: 'bot-army-15', text: 'Sério? Mas precisa de Root ou Jailbreak? Tenho medo de perder minha conta principal.', delayAfter: 4, timestamp: Date.now() },
      { id: 'm3', botId: 'bot-army-12', text: 'Alguém aqui já conseguiu fechar o set das Cartas Douradas de hoje?', delayAfter: 5, timestamp: Date.now() },
      { id: 'm4', botId: 'bot-army-5', text: 'O sistema é 100% Cloud. Ele injeta direto no protocolo do servidor via Stealth 7, seu celular nem detecta.', delayAfter: 4, timestamp: Date.now(), replyToId: 'm2' },
      { id: 'm5', botId: 'bot-army-22', text: 'Fiz o teste com a IA Oráculo agora cedo. Previu 3 sequências de porcos seguidas no x500.', delayAfter: 6, timestamp: Date.now() },
      { id: 'm6', botId: 'bot-army-8', text: 'Eu fechei! Usei o Card Finisher e veio a que faltava no primeiro baú mágico.', delayAfter: 4, timestamp: Date.now(), replyToId: 'm3' },
      { id: 'm7', botId: 'bot-army-3', text: 'O lucro na Viking Quest tá absurdo com o script novo. Recuperei 40k spins.', delayAfter: 5, timestamp: Date.now() },
      { id: 'm8', botId: 'bot-army-15', text: 'Nossa, vou testar agora então. Valeu por avisar sobre o Stealth 7!', delayAfter: 6, timestamp: Date.now(), replyToId: 'm4' },
      { id: 'm9', botId: 'bot-army-30', text: 'Acabei de subir 12 vilas em 20 minutos. Esse Speed Hack não tem erro.', delayAfter: 7, timestamp: Date.now() },
      { id: 'm10', botId: 'bot-army-10', text: 'Exatamente! Valeu cada centavo, já recuperei o investimento só com os spins.', delayAfter: 5, timestamp: Date.now(), replyToId: 'm7' },
      { id: 'm11', botId: 'bot-army-45', text: 'Galera, qual o multiplicador seguro pra usar com o Oráculo?', delayAfter: 4, timestamp: Date.now() },
      { id: 'm12', botId: 'bot-army-5', text: 'Eu recomendo x100 no início, depois que o sinal brilhar você joga x500.', delayAfter: 6, timestamp: Date.now(), replyToId: 'm11' },
      { id: 'm13', botId: 'bot-army-12', text: 'Alguém tem a dourada "Mestre dos Mares" sobrando pra troca?', delayAfter: 5, timestamp: Date.now() },
      { id: 'm14', botId: 'bot-army-20', text: 'Tenho sim! Me chama no privado que a gente faz o glitch de envio.', delayAfter: 4, timestamp: Date.now(), replyToId: 'm13', hideQuote: true },
      { id: 'm15', botId: 'bot-army-2', text: 'O suporte me ajudou a configurar o bot no iOS, rodando perfeitamente.', delayAfter: 8, timestamp: Date.now() },
      { id: 'm16', botId: 'bot-army-100', text: 'Qual era o ID daquela ferramenta de esconder a vila mesmo?', delayAfter: 6, timestamp: Date.now() },
      { id: 'm17', botId: 'bot-army-110', text: 'É o Stealth 7 mano, tá no topo do painel.', delayAfter: 4, timestamp: Date.now(), replyToId: 'm16', hideQuote: true },
      { id: 'm18', botId: 'bot-army-55', text: 'Caramba, o Oráculo previu o raid certinho de novo!', delayAfter: 5, timestamp: Date.now() }
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
      bots: INITIAL_BOT_ARMY,
      rooms: MOCK_ROOMS,
      currentRoomId: 'r1',
      isSystemOverlayActive: false,
      userReactions: {},
      persistentOnlineCount: 1321, 

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

      setReaction: (messageId, emoji) => set((state) => {
          const newReactions = { ...state.userReactions };
          if (emoji === null) delete newReactions[messageId];
          else newReactions[messageId] = emoji;
          return { userReactions: newReactions };
      }),
      setOnlineCount: (count) => set({ persistentOnlineCount: count }),
    }),
    {
      name: 'social-proof-ai-storage-v1321',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        appMode: state.appMode,
        theme: state.theme,
        useRealAI: state.useRealAI,
        bots: state.bots,
        rooms: state.rooms,
        userReactions: state.userReactions,
        persistentOnlineCount: state.persistentOnlineCount,
        currentRoomId: state.currentRoomId
      }),
    }
  )
);
