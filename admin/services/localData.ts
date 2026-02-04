import { Bot, BotArchetype, TimelineMessage } from "../types";

export const FIRST_NAMES = [
  "Ana", "Bruno", "Carla", "Daniel", "Eduardo", "Fernanda", "Gabriel", "Helena", 
  "Igor", "Julia", "Lucas", "Mariana", "Nicolas", "Olivia", "Pedro", "Rafael", 
  "Sofia", "Thiago", "Vitoria", "Wesley", "Amanda", "Beatriz", "Caio", "Diego"
];

export const LAST_NAMES = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", 
  "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida"
];

const DESCRIPTIONS: Record<BotArchetype, string[]> = {
  enthusiast: ["Adora novidades e sempre vê o lado bom.", "Sempre empolgado com tecnologia.", "Usa muitos emojis e exclamações."],
  skeptic: ["Questiona tudo antes de acreditar.", "Gosta de ver dados antes de opinar.", "Desconfiado por natureza."],
  friendly: ["Sempre disposto a ajudar.", "Muito educado e acolhedor.", "Gosta de criar conexões."],
  pragmatic: ["Foca no resultado final.", "Gosta de eficiência e rapidez.", "Não gosta de enrolação."],
  curious: ["Faz muitas perguntas.", "Quer entender como tudo funciona.", "Sempre buscando aprender mais."],
  influencer: ["Gosta de compartilhar experiências.", "Fala de forma persuasiva.", "Adora contar histórias."],
  experienced: ["Trabalha na área há anos.", "Já viu de tudo um pouco.", "Gosta de dar conselhos técnicos."],
  beginner: ["Está começando agora.", "Tem dúvidas básicas.", "Adimira os mais experientes."]
};

// Mapeia intenções de fala para frases específicas de cada arquétipo
export const PHRASE_BANK: Record<string, Record<BotArchetype, string[]>> = {
  opener: {
    enthusiast: [
      "Gente! Vocês viram o {topic}? Estou chocado! 😱",
      "Finalmente saiu o {topic}! Quem mais tá animado? 🔥",
      "Bom dia pessoal! Alguém já testou o {topic}?"
    ],
    skeptic: [
      "Alguém aqui realmente confia no {topic}?",
      "Estou vendo muito hype sobre {topic}, mas será que funciona?",
      "Vi o anúncio do {topic}. Parece bom demais pra ser verdade."
    ],
    friendly: [
      "Olá a todos! Alguém poderia me explicar melhor sobre o {topic}?",
      "Que legal ver tanta gente falando sobre {topic} aqui.",
      "Oie! Estava lendo sobre o {topic} e achei interessante."
    ],
    pragmatic: [
      "Alguém tem os dados atualizados sobre o {topic}?",
      "Estou analisando o custo-benefício do {topic}.",
      "O {topic} parece resolver o problema de escala que tínhamos."
    ],
    curious: [
      "Como exatamente funciona o {topic}?",
      "Tenho uma dúvida sobre o {topic}...",
      "Onde vocês viram mais informações sobre {topic}?"
    ],
    influencer: [
      "Acabei de postar no meu stories sobre o {topic}! 📸",
      "Minha experiência com o {topic} mudou meu workflow.",
      "Seguinte galera, a dica de hoje é sobre {topic}."
    ],
    experienced: [
      "Trabalho na área há 10 anos e o {topic} é uma evolução natural.",
      "Já vi coisas parecidas, mas o {topic} tem um diferencial.",
      "Minha dica pra quem tá começando com {topic}: vão com calma."
    ],
    beginner: [
      "Sou novo aqui, o que é esse {topic}?",
      "Desculpe a pergunta boba, mas como começo com {topic}?",
      "Estou meio perdido com tanta informação sobre {topic}."
    ]
  },
  agreement: {
    enthusiast: [
      "Exatamente! É disso que eu tô falando! 🤩",
      "Nossa, sim! 100%!",
      "Amei essa parte também! 💖"
    ],
    skeptic: [
      "É, nesse ponto eu tenho que concordar.",
      "Até que faz sentido.",
      "Surpreendentemente, isso parece correto."
    ],
    friendly: [
      "Concordo plenamente com você.",
      "Muito bem colocado!",
      "Que bom que pensamos igual 😊"
    ],
    pragmatic: [
      "Os fatos comprovam isso.",
      "É a conclusão lógica.",
      "Correto. Isso otimiza o processo."
    ],
    curious: [
      "Sério? Não sabia disso! Que legal.",
      "Interessante... conta mais?",
      "Uau, faz sentido."
    ],
    influencer: [
      "Isso é gold! Vou até salvar aqui.",
      "Super concordo, falo sempre isso.",
      "É o mindset correto."
    ],
    experienced: [
      "Na minha época não era assim, mas concordo que melhorou.",
      "É a melhor prática atualmente.",
      "Validado. É isso mesmo."
    ],
    beginner: [
      "Entendi! Obrigado por explicar.",
      "Ah, agora faz sentido.",
      "Nossa, eu não sabia!"
    ]
  },
  disagreement: {
    enthusiast: [
      "Poxa, mas eu tive uma experiência super boa!",
      "Sério? Eu achei incrível mesmo assim.",
      "Acho que vale a pena dar uma segunda chance! ✨"
    ],
    skeptic: [
      "Não sei não... ainda acho suspeito.",
      "Mas e os custos escondidos?",
      "Duvido que seja tão simples assim."
    ],
    friendly: [
      "Entendo seu ponto, mas talvez tenha outro lado.",
      "Respeito sua opinião, mas comigo foi diferente.",
      "Vamos tentar ver pelo lado positivo?"
    ],
    pragmatic: [
      "Os números não mostram isso.",
      "Isso não escala na prática.",
      "Na teoria é lindo, mas na prática..."
    ],
    curious: [
      "Mas por que você acha isso?",
      "Tem certeza? Onde você viu essa info?",
      "Será que não estamos vendo errado?"
    ],
    influencer: [
      "Galera, vamos focar no que importa.",
      "Eu não faria dessa forma.",
      "Discordo, acho que o futuro é outro."
    ],
    experienced: [
      "Já vi isso dar errado muitas vezes.",
      "Cuidado com essa afirmação.",
      "Na prática, é mais complicado."
    ],
    beginner: [
      "Ué, mas me disseram o contrário...",
      "Estou confuso agora.",
      "Será que eu entendi errado?"
    ]
  },
  closing: {
    enthusiast: [
      "Vou comprar agora mesmo! 🏃‍♂️💨",
      "Mal posso esperar pra testar!",
      "Adorei o papo galera!"
    ],
    skeptic: [
      "Vou pesquisar mais um pouco antes de decidir.",
      "Vou ficar de olho.",
      "Bom, vamos ver cenas dos próximos capítulos."
    ],
    friendly: [
      "Obrigado a todos pela ajuda!",
      "Foi ótimo conversar com vocês.",
      "Tenham um ótimo dia!"
    ],
    pragmatic: [
      "Vou agendar uma demo.",
      "Obrigado pelas informações objetivas.",
      "Vou atualizar meu relatório com isso."
    ],
    curious: [
      "Vou ler a documentação agora.",
      "Obrigado por tirarem minhas dúvidas!",
      "Vou testar e conto pra vocês."
    ],
    influencer: [
      "Vou abrir uma live sobre isso já já.",
      "Sigam lá pra mais dicas!",
      "Valeu community!"
    ],
    experienced: [
      "Qualquer coisa me chamem.",
      "Espero ter ajudado com a experiência.",
      "Sucesso a todos."
    ],
    beginner: [
      "Vocês me ajudaram muito!",
      "Agora me sinto mais seguro.",
      "Obrigado pela paciência gente."
    ]
  }
};

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// UTILS
const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomColor = () => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
    'bg-teal-500', 'bg-cyan-500'
  ];
  return getRandom(colors);
};

/**
 * GERAÇÃO LOCAL DE BOTS (Sem IA)
 */
export const generateLocalBots = (
  quantity: number,
  archetype: BotArchetype,
  wisdomLevel: number
): Bot[] => {
  const bots: Bot[] = [];
  
  for (let i = 0; i < quantity; i++) {
    const firstName = getRandom(FIRST_NAMES);
    const lastName = getRandom(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const desc = getRandom(DESCRIPTIONS[archetype]);
    
    bots.push({
      id: `bot-local-${generateId()}`,
      name,
      avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${name}&backgroundColor=e5e7eb`,
      color: getRandomColor(),
      archetype,
      wisdomLevel: Math.max(10, Math.min(100, wisdomLevel + (Math.random() * 20 - 10))), // Variation around requested level
      description: desc
    });
  }

  return bots;
};

/**
 * GERAÇÃO LOCAL DE TIMELINE (Sem IA)
 * Usa o Phrase Bank para criar uma conversa estruturada
 */
export const generateLocalTimeline = (
  theme: string,
  bots: Bot[],
  durationSeconds: number
): TimelineMessage[] => {
  const messages: TimelineMessage[] = [];
  const msgCount = Math.floor(durationSeconds / 5); // 1 msg every ~5 seconds
  if (bots.length === 0) return [];

  // Logic: 
  // 1. Opener (Random Bot)
  // 2. Middle (Mix of Agreement/Disagreement/Curious)
  // 3. Closing (Last few messages)

  let lastBotId = '';

  for (let i = 0; i < msgCount; i++) {
    // Pick a bot that wasn't the last one (unless only 1 bot)
    let bot = getRandom(bots);
    if (bots.length > 1) {
       while(bot.id === lastBotId) {
         bot = getRandom(bots);
       }
    }
    lastBotId = bot.id;

    let category: 'opener' | 'agreement' | 'disagreement' | 'closing' = 'agreement';
    
    if (i === 0) category = 'opener';
    else if (i >= msgCount - 2) category = 'closing';
    else {
      // Random middle conversation flow
      const rand = Math.random();
      if (rand > 0.7) category = 'disagreement';
      else category = 'agreement';
    }

    // Get phrase based on bot archetype
    const phraseTemplate = getRandom(PHRASE_BANK[category][bot.archetype]);
    const text = phraseTemplate.replace('{topic}', theme || 'produto');

    // Add comment above the fix: Include required timestamp for TimelineMessage
    messages.push({
      id: `msg-local-${Date.now()}-${i}`,
      botId: bot.id,
      text,
      delayAfter: Math.floor(Math.random() * 3) + 3, // 3 to 6 seconds delay
      timestamp: Date.now()
    });
  }

  return messages;
};