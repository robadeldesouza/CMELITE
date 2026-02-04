
export type BotArchetype = 
  | 'enthusiast' 
  | 'skeptic' 
  | 'friendly' 
  | 'pragmatic' 
  | 'curious' 
  | 'influencer' 
  | 'experienced' 
  | 'beginner';

export interface Bot {
  id: string;
  name: string;
  avatar: string;
  color: string;
  archetype: BotArchetype;
  description?: string;
  wisdomLevel: number;
}

export interface TimelineMessage {
  id: string;
  botId: string;
  text: string;
  delayAfter: number;
  isTyping?: boolean;
  replyToId?: string; // ID da mensagem que está sendo respondida
  mediaUrl?: string;  // URL de imagem ou arquivo
  mediaType?: 'image' | 'file';
  timestamp: number;
  isUser?: boolean; // Se a mensagem foi enviada pelo operador humano
}

export interface ChatTemplate {
  id: string;
  name: string;
  style: string;
  primaryColor: string;
  accentColor: string;
  thumbnail: string;
  isDark: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  theme: string;
  groupImage?: string; // Imagem do grupo (Base64 ou URL)
  templateId?: string;
  botIds: string[];
  timeline: TimelineMessage[];
  status: 'active' | 'paused' | 'draft';
  stats: {
    views: number;
    completionRate: number;
  };
}

export interface AIGenerationParams {
  theme: string;
  objective: string;
  tone: 'casual' | 'professional' | 'excited' | 'debate';
  botIds: string[];
  durationSeconds: number;
}
