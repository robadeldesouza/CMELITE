
import { Bot, BotArchetype, TimelineMessage } from "../types";

export const FIRST_NAMES = ["Ana", "Bruno", "Carla", "Daniel", "Eduardo", "Fernanda", "Gabriel", "Helena", "Igor", "Julia", "Lucas", "Mariana", "Nicolas", "Olivia", "Pedro", "Rafael", "Sofia", "Thiago", "Vitoria", "Wesley"];
export const LAST_NAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes"];

// REGRAS DE CONHECIMENTO POR ARQUÉTIPO
export const PHRASE_BANK: Record<string, Record<BotArchetype, string[]>> = {
  opener: {
    experienced: [
      "Logs de hoje mostram que o bypass tá ignorando 100% do escudo do Rhino. 🦏🚫",
      "Dica pros novatos: não subam o multiplicador logo de cara. Esperem o sinal do Oráculo.",
      "Vila 340 batida. O farm de moedas no x500 com o bot é covardia kkkkk"
    ],
    beginner: [
      "Gente, sou novo aqui... Esse sistema realmente não dá ban? Tenho medo pela minha conta.",
      "Alguém me ajuda? Como eu instalo o bypass no Android?",
      "Vi o anúncio e achei bom demais pra ser verdade. Funciona mesmo?"
    ],
    skeptic: [
      "Duvido que esse bypass de evento seja indetectável. Cadê os logs de segurança? 🤔",
      "Mais um grupo de 'spins grátis'? Quero ver alguém postar print de saque real.",
      "Sempre a mesma história... alguém aqui realmente lucrou nos últimos 15 min?"
    ],
    enthusiast: [
      "MEU DEUS! Acabei de fechar o set das Cartas de Ouro! Esse painel é MÁGICO! 😍🔥",
      "Simplesmente o melhor investimento que fiz esse ano. 50k de spins em 10 minutos!",
      "GENTE! O sinal de porcos do Oráculo acabou de bater certinho! x500 na veia! 🐷🚀"
    ],
    pragmatic: [
      "Analisando o ROI aqui: em 2 dias o bot já se pagou só com o que economizei de spins.",
      "Direto ao ponto: o script de construção rápida tá poupando 4h de farm por dia. 🛠️",
      "Alguém tem a tabela de probabilidade da Viking atualizada pro bot?"
    ],
    friendly: [
      "Bom dia grupo! Mais alguém conseguiu bater a meta da Viking hoje? ✨",
      "Se precisarem de ajuda com a configuração do Ghost Mode, podem me chamar!",
      "Que vibe boa esse grupo! É muito bom lucrar com a galera que entende."
    ],
    curious: [
      "Como o sistema consegue ler a seed da roleta antes do giro parar? ⚙️",
      "Qual a diferença técnica entre o Stealth 7 e um VPN comum?",
      "Alguém sabe onde encontro o manual das funções avançadas do Kernel?"
    ],
    influencer: [
      "Postei lá no meu canal a estratégia de hoje usando o Sniper de Vilas. 📣",
      "O segredo não é sorte, é ter a ferramenta certa no momento certo. Foco no lucro! 🔥",
      "Mudei meu mindset depois que parei de ser farm de baleia e virei caçador."
    ]
  },
  validation: {
    experienced: [
      "Fica tranquilo, novato. O Stealth 7 faz abstração de hardware em Ring-0. O servidor nem te vê. ✅",
      "Confirmado. Acabei de rodar a auditoria de pacotes e a injeção tá 100% limpa.",
      "Pode confiar. Tô usando na minha conta principal desde a v4.1 e nunca tive nem aviso."
    ],
    influencer: [
      "É o que eu sempre digo nos vídeos: a elite não joga, a elite domina o sistema. 🚀",
      "Quem avisa amigo é: parem de queimar spins à toa e ativem o Oráculo logo.",
      "A prova tá aí nos prints da galera. Só não lucra quem tem medo de evoluir."
    ],
    beginner: [
      "Nossa, entendi! Obrigado por explicar, agora me sinto mais seguro. 🙌",
      "Valeu pela ajuda, vou tentar rodar aqui agora!",
      "Uau, o pessoal aqui entende muito de sistema. Vou focar nas dicas de vocês."
    ],
    skeptic: [
      "Hum... o argumento técnico faz sentido. Vou testar em uma conta secundária primeiro. 👀",
      "Os prints parecem reais, mas ainda vou monitorar o grupo mais uns dias.",
      "Beleza, se o bypass é via Kernel eu começo a acreditar. Vou dar o benefício da dúvida."
    ],
    enthusiast: [
      "É ISSO! O pessoal aqui é brabo demais! Bora pro topo! 🤩🚀",
      "Melhor suporte que já vi. Transparência total sobre a tecnologia.",
      "Aprovadíssimo! Quem tá na dúvida tá perdendo dinheiro de bobeira! 😍"
    ],
    pragmatic: [
      "Os números não mentem. Testado e validado em 3 sessões seguidas.",
      "Configuração finalizada. Eficiência de 98% no bypass de escudos.",
      "Foco no resultado. Já recuperei 200% do valor da licença hoje."
    ],
    friendly: [
      "Exatamente o que eu ia dizer! O pessoal aqui se ajuda muito. 😊",
      "Muito bem explicado. É bom ver a comunidade crescendo assim.",
      "Contem comigo para o que precisarem na instalação também!"
    ],
    curious: [
      "Entendi o processo de injeção. Realmente inovador o uso de TLS 1.3 aqui. ⚙️",
      "Interessante... então o spoofing de ID é randômico por sessão? Genial.",
      "Agora as peças se encaixaram. A lógica do RNG Forensic é muito sólida."
    ]
  }
};

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateLocalBots = (quantity: number, archetype: BotArchetype, wisdomLevel: number): Bot[] => {
  const bots: Bot[] = [];
  for (let i = 0; i < quantity; i++) {
    const name = `${getRandom(FIRST_NAMES)} ${getRandom(LAST_NAMES)}`;
    bots.push({
      id: `bot-local-${generateId()}`,
      name,
      avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${name}&backgroundColor=e5e7eb`,
      color: 'bg-blue-500',
      archetype,
      wisdomLevel: Math.max(10, Math.min(100, wisdomLevel + (Math.random() * 20 - 10))),
      description: `Membro ${archetype === 'experienced' ? 'Veterano' : 'Ativo'}.`
    });
  }
  return bots;
};

export const generateLocalTimeline = (theme: string, bots: Bot[], durationSeconds: number): TimelineMessage[] => {
  const messages: TimelineMessage[] = [];
  const msgCount = Math.floor(durationSeconds / 6);
  if (bots.length === 0) return [];

  let lastBotId = '';

  for (let i = 0; i < msgCount; i++) {
    let bot: Bot;
    // Seleção lógica: Se for a primeira mensagem, prioriza um novato perguntando ou um veterano anunciando
    if (i === 0) {
      const initialArchetypes: BotArchetype[] = ['beginner', 'experienced', 'skeptic', 'enthusiast'];
      const filtered = bots.filter(b => initialArchetypes.includes(b.archetype));
      bot = filtered.length > 0 ? getRandom(filtered) : getRandom(bots);
    } else {
      bot = getRandom(bots);
      if (bots.length > 1) while(bot.id === lastBotId) bot = getRandom(bots);
    }
    
    lastBotId = bot.id;
    const category = i === 0 ? 'opener' : 'validation';
    const phrases = PHRASE_BANK[category][bot.archetype] || PHRASE_BANK[category]['friendly'];
    const text = getRandom(phrases).replace('{topic}', theme || 'produto');

    messages.push({
      id: `msg-local-${Date.now()}-${i}`,
      botId: bot.id,
      text,
      delayAfter: Math.floor(Math.random() * 3) + 3,
      timestamp: Date.now()
    });
  }
  return messages;
};
