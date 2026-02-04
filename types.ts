
import { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  icon: LucideIcon;
  badge?: string;
  popularity: number; // 1-100
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

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
  avatar: string; // URL or initials
  color: string;
  archetype: BotArchetype;
  description?: string;
  wisdomLevel: number; // 1-100
}

export interface TimelineMessage {
  id: string;
  botId: string;
  text: string;
  delayAfter: number; // seconds to wait after this message before the next one
  isTyping?: boolean; // Runtime state for preview
  timestamp: number;
  replyToId?: string; // ID da mensagem que está sendo respondida (opcional)
  hideQuote?: boolean; // Se true, o bot responde sem mostrar o balão de citação (usuário "burro" ou preguiçoso)
}

export interface Room {
  id: string;
  name: string;
  description: string;
  theme: string;
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

export interface BotBatchGenerationParams {
  quantity: number;
  archetype: BotArchetype;
  wisdomLevel: number; // 0-100
  baseContext?: string; // Optional: e.g., "Medical Doctors", "Gamers"
}
