
import { Zap, Target, Brain, Magnet, ShieldAlert, Rabbit, Crown, Ghost, Coins } from 'lucide-react';
import { Product } from '../types';

export const products: Product[] = [
  {
    id: 'bundle_elite',
    name: 'CM Elite Pass (All-in-One)',
    description: 'A chave mestra. Desbloqueia TODAS as ferramentas abaixo + acesso ao grupo VIP de troca de {{GOLD}}CARTAS DOURADAS{{/GOLD}}.',
    benefits: [
      'Auto-Play na Viking Quest (Infinito)',
      'Troca de Cartas Douradas (Glitch)',
      'Proteção Anti-Ban 3.0',
      'Updates Automáticos Pós-Evento'
    ],
    icon: Crown,
    badge: 'OFERTA LIMITADA',
    popularity: 100
  },
  {
    id: 'tool_viking',
    name: 'Viking Quest Bot',
    description: 'Não gaste mais 5 bilhões para terminar a Viking. O bot joga o padrão "Low-High" perfeito para lucrar spins.',
    benefits: [
      'Garante a Carta Dourada Final',
      'Lucro de +50k Spins por evento',
      'Mode: Apenas Lucro (Para na roda bônus)'
    ],
    icon: Coins,
    badge: 'META ATUAL',
    popularity: 99
  },
  {
    id: 'tool_sequence',
    name: 'IA Oráculo (Sequence Reader)',
    description: 'A inteligência que prevê o futuro da roleta. O sistema antecipa quando o servidor enviará 3 Porcos ou Martelos para você apostar x500.',
    benefits: [
      'Economia de 80% em Spins',
      'Predição RNG em Tempo Real',
      'Funciona em Eventos de Símbolo'
    ],
    icon: Brain,
    popularity: 95
  },
  {
    id: 'tool_sniper',
    name: 'Shield Piercer (Bypass)',
    description: 'Ignora o Rinoceronte e os Escudos do oponente. Seus ataques sempre contam como "Perfect Raid".',
    benefits: [
      'Foxy/Tigre sempre ativado',
      'Drena 100% do banco do alvo',
      'Nunca falha um ataque'
    ],
    icon: Target,
    badge: 'CRÍTICO',
    popularity: 92
  },
  {
    id: 'tool_cards',
    name: 'Card Set Finisher',
    description: 'Manipula a probabilidade dos baús. Se você precisa de uma carta específica, a chance dela vir aumenta em 4000%.',
    benefits: [
      'Prioriza Cartas Novas',
      'Rastreia Baús Mágicos',
      'Completa Sets em minutos'
    ],
    icon: Magnet,
    popularity: 88
  },
  {
    id: 'tool_ghost',
    name: 'Stealth 7 (Protocolo Fantasma)',
    description: 'Camuflagem de hardware nível 7. Torna sua vila invisível no mapa de amigos e remove seus logs de atividade dos servidores oficiais.',
    benefits: [
      'Imune a Vingança (Revenge)',
      'Vila Invisível no Mapa Global',
      'Segurança de Conta Principal'
    ],
    icon: Ghost,
    popularity: 96
  },
  {
    id: 'tool_speed',
    name: 'Time-Warp (Speed Hack)',
    description: 'Otimize o tempo. Pula animações de construção, abertura de baús e giros da roleta instantaneamente via manipulação de clock.',
    benefits: [
      'Farm 8x mais rápido',
      'Ideal para Eventos Curtos (30min)',
      'Alimenta Pet Automaticamente'
    ],
    icon: Rabbit,
    badge: 'UTILITÁRIO',
    popularity: 85
  }
];
