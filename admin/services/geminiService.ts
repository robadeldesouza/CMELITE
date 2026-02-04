import { Bot, TimelineMessage, BotArchetype } from "../types";
import { GoogleGenAI } from "@google/genai";

/**
 * UTILS: Limpeza de JSON vindo de LLMs
 */
const cleanJsonString = (str: string): string => {
  let cleaned = str.trim();
  // Remove markdown code blocks
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/, '').replace(/```$/, '');
  }
  return cleaned.trim();
};

const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomColor = () => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
    'bg-teal-500', 'bg-cyan-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateAvatarUrl = (seed: string) => `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=e5e7eb`;

/**
 * 1. CONSTRUTOR DE PROMPT PARA BOTS (BATCH MISTO)
 */
export const buildBotBatchPrompt = (
  distribution: Partial<Record<BotArchetype, number>>,
  wisdomLevel: number,
  context: string
): string => {
  // Cria uma string descritiva: "5 Entusiastas, 2 Céticos"
  // FILTRO: Ignora tipos com 0 bots
  const distributionText = Object.entries(distribution)
    .filter(([_, count]) => (count || 0) > 0)
    .map(([type, count]) => `${count} bots do tipo '${type}'`)
    .join(', ');

  const total = Object.values(distribution).reduce((a, b) => a + (b || 0), 0);

  return `
ATUE COMO UM GERADOR DE PERSONAS PARA PROVA SOCIAL.
Crie um array JSON com exatos ${total} perfis de usuários fictícios, distribuídos da seguinte forma:
${distributionText}.

CONTEXTO: ${context || "Usuários gerais de internet"}
NÍVEL DE EXPERIÊNCIA/SABEDORIA MÉDIO: ${wisdomLevel}/100

REGRAS ESTRITAS DE FORMATO:
1. Retorne APENAS o JSON cru. Sem introduções, sem markdown.
2. O JSON deve ser um array de objetos.
3. O campo "archetype" deve ser estritamente um destes valores (em inglês, minúsculo): enthusiast, skeptic, friendly, pragmatic, curious, influencer, experienced, beginner.

ESTRUTURA DO OBJETO JSON:
{
  "name": "Nome Sobrenome (Brasileiro)",
  "description": "Uma frase curta descrevendo quem é",
  "archetype": "tipo_escolhido_acima",
  "wisdomLevel": ${wisdomLevel}
}

Gere agora.
`.trim();
};

/**
 * 2. PROCESSADOR DE RESPOSTA DE BOTS
 */
export const parseBotResponse = (jsonString: string): Bot[] => {
  try {
    const cleaned = cleanJsonString(jsonString);
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) throw new Error("O JSON não é uma lista.");

    return parsed.map((p: any) => ({
      id: `bot-${generateId()}`,
      name: p.name || "Usuário Anônimo",
      description: p.description || "",
      archetype: p.archetype || "beginner",
      wisdomLevel: Number(p.wisdomLevel) || 50,
      avatar: generateAvatarUrl(p.name || generateId()),
      color: getRandomColor()
    }));
  } catch (e) {
    console.error("Erro ao processar JSON de bots:", e);
    throw new Error("O texto colado não é um JSON válido ou está mal formatado.");
  }
};

/**
 * 3. GERAÇÃO AUTOMÁTICA DE BOTS (DIRECT API)
 */
export const generateBotsWithAI = async (
  distribution: Partial<Record<BotArchetype, number>>,
  wisdomLevel: number,
  context: string
): Promise<Bot[]> => {
  // Initialize AI Client inside function to ensure latest API key access
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = buildBotBatchPrompt(distribution, wisdomLevel, context);

  try {
    // Fixed: Using gemini-3-flash-preview for text generation tasks as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou texto.");

    return parseBotResponse(text);
  } catch (error) {
    console.error("GenAI Error:", error);
    throw new Error("Falha na geração automática. Verifique sua API Key ou tente o modo manual.");
  }
};

/**
 * 4. CONSTRUTOR DE PROMPT PARA CONVERSAS (TIMELINE)
 */
export const buildConversationPrompt = (
  theme: string,
  objective: string,
  tone: string,
  participatingBots: Bot[],
  durationSeconds: number
): string => {
  const botsList = participatingBots.map(b => 
    `- ${b.name} (${b.archetype}, Nível ${b.wisdomLevel}%): ${b.description || 'Personalidade padrão.'}`
  ).join('\n');

  const estimatedMessages = Math.floor(durationSeconds / 5);

  return `
ATUE COMO UM ROTEIRISTA DE CHATBOT PARA PROVA SOCIAL.
Crie uma conversa simulada natural entre os seguintes bots:

${botsList}

TEMA DA CONVERSA: "${theme}"
OBJETIVO: "${objective}"
TOM: "${tone}"
DURAÇÃO ESTIMADA: ${durationSeconds} segundos (Aprox. ${estimatedMessages} mensagens)

REGRAS DE COMPORTAMENTO:
1. Mantenha a personalidade de cada bot baseada no arquétipo.
2. Use gírias brasileiras leves e emojis quando apropriado para o arquétipo.
3. A conversa deve ter início, meio e fim (conclusão/call to action implícito).
4. O campo 'delayAfter' é quantos segundos esperar APÓS a mensagem ser lida. Variar entre 2 e 6.

REGRAS ESTRITAS DE FORMATO:
1. Retorne APENAS o JSON cru. Sem markdown, sem texto antes ou depois.
2. O JSON deve ser um array de objetos.

ESTRUTURA DO OBJETO JSON:
[
  {
    "botName": "Nome exato do bot que está falando",
    "text": "O conteúdo da mensagem",
    "delayAfter": 3
  }
]

Gere a conversa agora.
`.trim();
};

/**
 * 5. PROCESSADOR DE RESPOSTA DE CONVERSA
 */
export const parseConversationResponse = (jsonString: string, availableBots: Bot[]): TimelineMessage[] => {
  try {
    const cleaned = cleanJsonString(jsonString);
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) throw new Error("O JSON não é uma lista.");

    return parsed.map((msg: any, index: number) => {
      const targetName = (msg.botName || "").toLowerCase().trim();
      const bot = availableBots.find(b => {
         const bName = b.name.toLowerCase().trim();
         return bName === targetName || bName.includes(targetName) || targetName.includes(bName);
      });

      return {
        id: `msg-${Date.now()}-${index}`,
        botId: bot ? bot.id : availableBots[0]?.id, 
        text: msg.text || "...",
        delayAfter: Number(msg.delayAfter) || 3,
        // Add comment above the fix: Satisfy TimelineMessage requirement for timestamp
        timestamp: Date.now()
      };
    });
  } catch (e) {
    console.error("Erro ao processar JSON da conversa:", e);
    throw new Error("O texto colado não é um JSON válido.");
  }
};