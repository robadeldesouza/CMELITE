
import { TechChecklistItem } from './types';

export const INITIAL_CHECKLIST: TechChecklistItem[] = [
  {
    id: 'audit_dynamic_themes',
    area: 'ARCHITECTURE',
    topic: 'Dynamic Theme Engine: Bot-Centric Metadata',
    currentStatus: 'Nomes de bots hardcoded no sistema de cores (FloatingChat.tsx).',
    technicalRisk: 'CRITICAL',
    impact: 'Violação de CMS Headless; impossibilita mudança de nomes via Admin sem quebra de CSS.',
    recommendation: 'Migrar esquemas de cores para metadados na interface Bot e injetar via CSS Variables.',
    decision: 'PENDING'
  },
  {
    id: 'audit_sim_orchestration',
    area: 'PERFORMANCE',
    topic: 'Simulation Logic Decoupling: useChatSimulation',
    currentStatus: 'Lógica de processamento da timeline misturada com renderização de UI.',
    technicalRisk: 'HIGH',
    impact: 'Risco de race conditions em timers e degradação de frames em sessões longas.',
    recommendation: 'Extrair motor de simulação para o Custom Hook useChatSimulation com RequestAnimationFrame.',
    decision: 'PENDING'
  },
  {
    id: 'audit_a11y_chat',
    area: 'UX_PATTERNS',
    topic: 'WCAG 2.1 Compliance: Chat Accessibility',
    currentStatus: 'Falta de suporte a navegação por teclado e leitores de tela.',
    technicalRisk: 'MEDIUM',
    impact: 'Usuários com deficiência ou navegando via teclado não acessam funções críticas do chat.',
    recommendation: 'Implementar Tab Trapping, Escape-to-Close e ARIA Live Regions (aria-live="polite").',
    decision: 'PENDING'
  },
  {
    id: 'audit_component_fragmentation',
    area: 'ARCHITECTURE',
    topic: 'Atomic Refactor: FloatingChat Fragmentation',
    currentStatus: 'Componente FloatingChat.tsx atingiu o estado de "God Component".',
    technicalRisk: 'MEDIUM',
    impact: 'Dificuldade de manutenção e impossibilidade de testes unitários granulares.',
    recommendation: 'Fragmentar em sub-componentes: ChatHeader, MessageList e ChatInput.',
    decision: 'PENDING'
  },
  {
    id: 'audit_jade_ux_feedback',
    area: 'UX_PATTERNS',
    topic: 'Jade AI Response: Asynchronous Feedback',
    currentStatus: 'Chamada direta para JadeAI sem estados de progresso detalhados.',
    technicalRisk: 'LOW',
    impact: 'Sensação de latência alta para o usuário final durante a consulta ao LLM.',
    recommendation: 'Implementar mensagens de estado intermediárias ("Jade consultando...") ou Streaming.',
    decision: 'PENDING'
  },
  {
    id: 'audit_layout_zindex',
    area: 'ARCHITECTURE',
    topic: 'Z-Index Normalization: UI Stacking',
    currentStatus: 'Inconsistências detectadas entre Modais e Banners.',
    technicalRisk: 'HIGH',
    impact: 'Elementos sobrepondo menus de navegação críticos.',
    recommendation: 'Utilizar variáveis CSS (--z-*) para centralizar o controle de profundidade.',
    decision: 'PENDING'
  },
  {
    id: 'audit_spin_injector',
    area: 'SECURITY',
    topic: 'Spin Injector Pro: 10x Payload Scaling',
    currentStatus: 'Aguardando teste de estresse no servidor.',
    technicalRisk: 'CRITICAL',
    impact: 'Multiplicação de pacotes de recompensa interceptados.',
    recommendation: 'Validar se a rajada de bypass (Sync Burst) está saturando o firewall do servidor corretamente.',
    decision: 'PENDING'
  },
  {
    id: 'audit_rng_reader',
    area: 'SECURITY',
    topic: 'Sequence Reader: Port 443 Decryption',
    currentStatus: 'Certificado SSL de interceptação ativo.',
    technicalRisk: 'HIGH',
    impact: 'Previsão de 100% dos resultados da roleta (Porcos/Raids).',
    recommendation: 'Garantir que a decodificação da seed não gere latência no frame de áudio.',
    decision: 'PENDING'
  },
  {
    id: 'audit_ghost_mode',
    area: 'SECURITY',
    topic: 'Ghost Mode 4.0: Kernel Abstraction',
    currentStatus: 'Módulo de anonimato operando em camada invisível.',
    technicalRisk: 'CRITICAL',
    impact: 'Invisibilidade total perante o sistema anti-fraude.',
    recommendation: 'Realizar auditoria de logs para garantir que nenhum ID de dispositivo real está vazando.',
    decision: 'PENDING'
  }
];
