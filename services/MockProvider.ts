
import { IDataProvider } from './DataProvider.ts';
import { AppConfig, FeatureFlags, SystemAuditLog, AppContent, PaymentSettings } from '../core/types.ts';

const STORAGE_KEYS = {
  CONFIG: 'cm_elite_core_config_v3',
  FEATURES: 'cm_elite_core_features_v3',
  LOGS: 'cm_elite_core_logs_v3',
  SECURITY: 'cm_elite_core_security_v3',
  CONTENT: 'cm_elite_core_content_v8'
};

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
    pix: { enabled: true, titular: "ELITE HACKS LTDA", chave: "contato@elitehacks.com" },
    copyPaste: { enabled: true, titular: "ELITE HACKS", code: "00020126580014BR.GOV.BCB.PIX0136653ea967-8547-497d-947b-1234567890125204000053039865802BR5913ELITE_HACKS6009SAO_PAULO62070503***6304" },
    paymentLink: { enabled: true, titular: "", url: "https://pay.elitehacks.com/checkout/elite-pass" },
    card: { enabled: true, titular: "ELITE GATEWAY", gatewayUrl: "https://pay.elitehacks.com/card" },
    crypto: {
      enabled: true,
      titular: "ELITE CRYPTO",
      selectedCoin: 'BTC',
      wallets: {
        BTC: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        ETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        DOGE: "DH5yaieqZN36fDVci2no8CGEUnFhd7dBtU"
      }
    }
};

const DEFAULT_CONFIG: AppConfig = {
  pricingMode: 'LayoutPRINCIPAL',
  themeMode: 'gold',
  provider: 'mock',
  environment: 'prod',
  maintenanceMode: false,
  version: '4.7.0',
  nemesisAnchorPrice: 350
};

const DEFAULT_FEATURES: FeatureFlags = {
  salesToast: true,
  exitPopup: true,
  floatingChat: true,
  topBanner: true,
  emulator: true,
  nemesisCampaignActive: false,
  geminiEnabled: false, 
  globalNotes: true    
};

const ALL_TOOLS = ['bundle_elite', 'tool_viking', 'tool_sequence', 'tool_sniper', 'tool_cards', 'tool_ghost', 'tool_speed'];

const DEFAULT_CONTENT: AppContent = {
  hero: {
    titleLine1: "DOMINE O JOGO.",
    titleLine2: "ATÉ 10x MAIS SPINS.",
    subtitle: "Você não está comprando um hack caseiro. Está assumindo controle sobre um jogo que foi feito para explorar quem joga no modo comum.",
    ctaButton: "LIBERAR ACESSO ELITE"
  },
  socialProof: {
    totalMembers: "9.854",
    totalReviews: "1.342",
    satisfactionRate: "98.5%",
    refundRate: "1.2%",
    averageRating: "4.9",
    recentOpensTemplate: "+{count} pessoas abriram o chat agora",
    recentOpensMin: "12",
    recentOpensMax: "47",
    chatOnlineMin: "400",
    chatOnlineMax: "1500",
    userAddedTemplate: "{name} foi adicionado"
  },
  plans: [
    {
      id: 'plan_anual',
      name: 'Plano Anual',
      type: 'annual',
      active: true,
      priceFrom: 299.00,
      priceTo: 100.00,
      highlight: false,
      order: 1,
      description: "Acesso completo a todas as ferramentas por 1 ano.",
      features: [
        "⭐ Licença Anual Completa",
        "⭐ Viking Quest Bot (Incluso)",
        "⭐ IA Oráculo (Incluso)",
        "⭐ Stealth 7 Protocol (Incluso)",
        "⭐ Suporte chat prioritário",
        "⭐ Grupo Troca de Cartas",
        "⭐ Atualizações semanais",
        "⭐ Operação Cloud 100%"
      ],
      includedTools: ALL_TOOLS,
      paymentSettings: { ...DEFAULT_PAYMENT_SETTINGS }
    },
    {
      id: 'plan_vitalicio',
      name: 'Acesso Vitalício',
      type: 'lifetime',
      active: true,
      priceFrom: 350.00,
      priceTo: 150.00,
      highlight: true,
      order: 2,
      description: "A chave mestra definitiva. Pague uma vez, use para sempre com todos os recursos.",
      features: [
        "⭐ Licença Vitalícia (Sem mensalidade)",
        "⭐ Todas as Ferramentas Desbloqueadas",
        "⭐ Grupo VIP de Troca de Cartas",
        "⭐ Acesso Antecipado a Betas",
        "⭐ Atualizações Semanais Vitalícias",
        "⭐ Operação Cloud 100%",
        "⭐ Sorteios Exclusivos",
        "⭐ Suporte Prioritário 24/7",
        "⭐ Direito a Revenda de Licenças"
      ],
      includedTools: ALL_TOOLS,
      paymentSettings: { ...DEFAULT_PAYMENT_SETTINGS }
    }
  ],
  paymentSettings: { ...DEFAULT_PAYMENT_SETTINGS },
  products: [
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
      iconName: 'Crown',
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
      iconName: 'Coins',
      badge: 'META ATUAL',
      popularity: 99
    },
    {
      id: 'tool_sequence',
      name: 'IA Oráculo (Sequence Reader)',
      description: 'A inteligência que prevê o futuro da roleta.',
      benefits: ['Economia de 80% em Spins', 'Predição RNG em Tempo Real'],
      iconName: 'Brain',
      popularity: 95
    },
    {
      id: 'tool_sniper',
      name: 'Shield Piercer (Bypass)',
      description: 'Ignora o Rinoceronte e os Escudos do oponente. Seus ataques always contam como "Perfect Raid".',
      benefits: ['Foxy/Tigre always ativado', 'Drena 100% do banco do alvo'],
      iconName: 'Target',
      popularity: 92
    },
    {
        id: 'tool_cards',
        name: 'Card Set Finisher',
        description: 'Manipula a probabilidade dos baús para cartas específicas.',
        benefits: ['Prioriza Cartas Novas', 'Rastreia Baús Mágicos'],
        iconName: 'Magnet',
        popularity: 88
    },
    {
        id: 'tool_ghost',
        name: 'Stealth 7 (Protocolo Fantasma)',
        description: 'Torna sua vila invisível no mapa de amigos e remove logs oficiais.',
        benefits: ['Imune a Vingança', 'Vila Invisível'],
        iconName: 'Ghost',
        popularity: 96
    },
    {
        id: 'tool_speed',
        name: 'Time-Warp (Speed Hack)',
        description: 'Pula animações de construção e giros instantaneamente.',
        benefits: ['Farm 8x mais rápido', 'Alimenta Pet Automático'],
        iconName: 'Rabbit',
        popularity: 85
    }
  ],
  features: [
    { iconName: 'Shield', title: 'Blindagem de Conta', description: 'Ocultamos sua atividade dos sistemas de vigilância.' },
    { iconName: 'Zap', title: 'Entrega Instantânea', description: 'Sua licença é ativada no momento da confirmação.' }
  ],
  faq: [
    { category: 'Confiança e Legitimidade', question: '1. Funciona mesmo ou é só marketing?', answer: 'Funciona de verdade. O sistema automatiza tarefas que pessoas já fazem manualmente, só que de forma mais organizada e eficiente.' },
    { category: 'Confiança e Legitimidade', question: '2. Alguém já usa isso de verdade?', answer: 'Sim. Tudo aqui foi baseado em usos reais, não em ideias teóricas.' },
    { category: 'Confiança e Legitimidade', question: '3. É permitido usar isso?', answer: 'Sim se você comprou, você tem permissão para usar. Você decide como usar o sistema, sempre de forma consciente e sob seu controle.' },
    { category: 'Confiança e Legitimidade', question: '4. Tem risco de bloqueio ou punição?', answer: 'O sistema funciona de forma natural e progressiva, sempre dentro de limites seguros que são limitados por IA e sob controle do usuário.' },
    
    { category: 'O que exatamente é o produto', question: '5. Isso é um programa ou um serviço?', answer: 'É uma plataforma online com várias ferramentas reunidas em um só lugar superando a concorrência.' },
    { category: 'O que exatamente é o produto', question: '6. Preciso instalar algo no meu computador ou celular?', answer: 'Não. Você não precisa instalar nada, sistema funciona diretamente via navegador web.' },
    { category: 'O que exatamente é o produto', question: '7. Mesmo quem não entende muito consegue usar?', answer: 'Sim. O sistema é simples de começar e fácil de aprender.' },
    { category: 'O que exatamente é o produto', question: '8. Isso funciona sozinho ou eu controlo?', answer: 'Você controla. O sistema apenas executa o que você permitir.' },
    { category: 'O que exatamente é o produto', question: '9. Isso usa inteligência artificial de verdade?', answer: 'Sim. A IA Oráculo funciona apenas para prever jogabilidades e rates de sucesso.' },

    { category: 'Ferramentas', question: '10. Para que servem essas ferramentas?', answer: 'Para facilitar tarefas, evitar erros e economizar tempo.' },
    { category: 'Ferramentas', question: '11. Posso usar só uma ferramenta se quiser?', answer: 'Sim. Você usa apenas o que fizer sentido para você.' },
    { category: 'Ferramentas', question: '12. As ferramentas funcionam juntas?', answer: 'Sim. Elas se complementam.' },
    { category: 'Ferramentas', question: '13. Por onde eu devo começar?', answer: 'Comece pela ferramenta que resolve o seu maior problema agora.' },
    { category: 'Ferramentas', question: '14. As ferramentas são atualizadas?', answer: 'Sim. Melhorias são feitas constantemente.' },

    { category: 'Benefícios reais', question: '15. O que eu ganho logo que entro?', answer: 'Acesso imediato às ferramentas e às vantagens do sistema.' },
    { category: 'Benefícios reais', question: '16. Qual é o maior benefício de tudo isso?', answer: 'Fazer mais em menos tempo, com menos esforço.' },
    { category: 'Benefícios reais', question: '17. Isso substitui pessoas?', answer: 'Não. Substitui erros e tarefas repetitivas. As decisões continuam sendo suas.' },
    { category: 'Benefícios reais', question: '18. Dá para ver resultado rápido?', answer: 'Sim, principalmente quando o sistema é usado corretamente.' },

    { category: 'Plano Elite', question: '19. O que muda de Anual para Vitalício?', answer: 'No anual, você tem alguns limites a menos do que o plano vitalício que permite recuperar a grana investida pois você tem direito a revenda, ferramentas exclusivas para divulgação.' },
    { category: 'Plano Elite', question: '20. Vale a pena pelo valor cobrado?', answer: 'Para quem usar, sim.' },
    { category: 'Plano Elite', question: '21. Por que nem tudo é liberado no plano básico?', answer: 'Para manter o sistema funcionando bem para todos.' },
    { category: 'Plano Elite', question: '22. Posso cancelar quando quiser?', answer: 'Sim. Você pode pausar o uso de qualquer ferramenta e mesmo que você volte anos depois ela ainda estará ali esperando por você.' },

    { category: 'Uso no dia a dia', question: '23. É difícil de usar?', answer: 'Não. Qualquer pessoa consegue usar, mesmo sem conhecimento técnico.' },
    { category: 'Uso no dia a dia', question: '24. Funciona no celular, tablet e computador?', answer: 'Sim. Funciona em qualquer aparelho com internet.' },
    { category: 'Uso no dia a dia', question: '25. Posso usar em mais de uma conta ou dispositivo?', answer: 'Sim, dentro dos limites do plano escolhido.' },
    { category: 'Uso no dia a dia', question: '26. Tem alguém para ajudar se eu tiver dúvidas?', answer: 'Sim. Existe suporte disponível 24h boa grupos exclusivos.' },

    { category: 'Segurança e controle', question: '27. Meus dados ficam seguros?', answer: 'Sim. A segurança é prioridade no sistema.' },
    { category: 'Segurança e controle', question: '28. Vocês têm acesso à minha conta ou dados pessoais?', answer: 'Não. Seus dados ficam apenas no seu próprio dispositivo.' },
    { category: 'Segurança e controle', question: '29. Existe risco de vazamento ou bloqueio?', answer: 'Não. O sistema é protegido e não se conecta diretamente à sua conta.' },

    { category: 'Comparação e decisão', question: '30. Por que escolher isso e não outra opção?', answer: 'Porque tudo funciona em um único lugar, de forma simples, porque temos satisfação garantida com mais de 97% dos nossos clientes.' },
    { category: 'Comparação e decisão', question: '31. Mais exiatem ferramentas gratuitas, pra que pagar?', answer: 'Toda ferramenta gratuita que disponibilizam por aí possui um sistema de pagamento invisível onde o que você usa para pagar é a sua privacidade. Programadores mal-intencionados criam aplicações que te obrigam a assistir anúncios, e se a ferramenta for uma ferramenta de instalar no seu celular você ainda corre o risco de ser invadido. Nossa ferramenta é segura por não ser uma instalação, com isso não temos acesso às suas contas, não temos acesso às suas informações pessoais, temos acesso ao seu dispositivo.' },
    { category: 'Comparação e decisão', question: '32. Para quem isso não é indicado?', answer: 'Para quem não pretende usar de verdade.' },
    { category: 'Comparação e decisão', question: '33. Para quem isso é ideal?', answer: 'Para quem quer praticidade, controle e melhores resultados.' },

    { category: 'Últimas dúvidas antes de comprar', question: '34. Posso testar antes de decidir?', answer: 'Sim. Você tem 7 dias para usar e, se não gostar, pode pedir seu dinheiro de volta.' },
    { category: 'Últimas dúvidas antes de comprar', question: '35. Isso é só moda passageira?', answer: 'Não. O sistema foi construído para funcionar a longo prazo, estamos funcionando com atualizações constantes para manter tudo funcionando desde 2023.' },
    { category: 'Últimas dúvidas antes de comprar', question: '36. Por que aparece tanta gente usando?', answer: 'Porque o sistema foi feito para funcionar melhor em grupo.' },
    { category: 'Últimas dúvidas antes de comprar', question: '37. Isso realmente me dá vantagem?', answer: 'Sim, quando usado com estratégia.' },

    { category: 'Fechamento', question: '38. O que acontece depois que eu pago?', answer: 'O acesso é liberado imediatamente após confirmação do pagamento junto com manual de uso.' },
    { category: 'Fechamento', question: '39. Qual o maior erro de quem entra?', answer: 'Não aproveitar tudo o que o sistema oferece.' }
  ],
  footer: {
    copyrightText: "© 2026 CM ELITE - JARVIS PROTOCOL",
    disclaimerText: "Plataforma independente. Não possuímos vínculo com os desenvolvedores oficiais do game."
  }
};

export class MockProvider implements IDataProvider {
  async init(): Promise<void> {
    if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FEATURES)) {
      localStorage.setItem(STORAGE_KEYS.FEATURES, JSON.stringify(DEFAULT_FEATURES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTENT)) {
      localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(DEFAULT_CONTENT));
    }
  }

  async getConfig(): Promise<AppConfig> {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  }

  async saveConfig(config: AppConfig): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }

  async getFeatures(): Promise<FeatureFlags> {
    const saved = localStorage.getItem(STORAGE_KEYS.FEATURES);
    return saved ? JSON.parse(saved) : DEFAULT_FEATURES;
  }

  async saveFeatures(features: FeatureFlags): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.FEATURES, JSON.stringify(features));
  }

  async getContent(): Promise<AppContent> {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTENT);
    const content = saved ? JSON.parse(saved) : DEFAULT_CONTENT;
    
    const plansWithPayments = (content.plans || DEFAULT_CONTENT.plans).map(p => ({
        ...p,
        paymentSettings: p.paymentSettings || { ...DEFAULT_PAYMENT_SETTINGS }
    }));

    return { 
      ...DEFAULT_CONTENT, 
      ...content, 
      plans: plansWithPayments, 
      paymentSettings: content.paymentSettings || DEFAULT_CONTENT.paymentSettings 
    };
  }

  async saveContent(content: AppContent): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(content));
  }

  async getLogs(): Promise<SystemAuditLog[]> {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : [];
  }

  async addLog(log: SystemAuditLog): Promise<void> {
    const logs = await this.getLogs();
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([log, ...logs].slice(0, 100)));
  }
}
