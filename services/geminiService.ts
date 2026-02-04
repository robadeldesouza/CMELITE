
import { Bot, TimelineMessage, BotArchetype } from "../types";
import { GoogleGenAI } from "@google/genai";

const cleanJsonString = (str: string): string => {
  let cleaned = str.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/, '').replace(/```$/, '');
  }
  return cleaned.trim();
};

const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomColor = () => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500', 'bg-teal-500', 'bg-cyan-500'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const generateAvatarUrl = (seed: string) => `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=e5e7eb`;

export const buildBotBatchPrompt = (distribution: Partial<Record<BotArchetype, number>>, wisdomLevel: number, context: string): string => {
  const distributionText = Object.entries(distribution)
    .filter(([_, count]) => (count || 0) > 0)
    .map(([type, count]) => `${count} bots do tipo '${type}'`)
    .join(', ');

  const total = Object.values(distribution).reduce((a, b) => a + (b || 0), 0);

  return `
ATUE COMO UM GERADOR DE PERSONAS PARA PROVA SOCIAL.
Crie um array JSON com exatos ${total} perfis de usuários fictícios: ${distributionText}.

REGRAS DE CONHECIMENTO (STRICT):
- experienced: Especialista técnico. Sabe termos como "Kernel", "Bypass", "RNG". Nunca faz perguntas.
- beginner: Leigo, inseguro, admirador dos veteranos. Faz as perguntas básicas (ban, como usar).
- skeptic: Analítico e desconfiado. Exige provas, prints e detalhes técnicos.
- enthusiast: Usa muitos emojis, focado em comemoração e lucro.

ESTRUTURA DO OBJETO JSON:
{
  "name": "Nome Sobrenome (Brasileiro)",
  "description": "Uma frase curta descrevendo quem é",
  "archetype": "tipo",
  "wisdomLevel": 0-100
}
Retorne apenas o JSON cru.
`.trim();
};

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
    throw new Error("JSON Inválido.");
  }
};

export const generateBotsWithAI = async (distribution: Partial<Record<BotArchetype, number>>, wisdomLevel: number, context: string): Promise<Bot[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = buildBotBatchPrompt(distribution, wisdomLevel, context);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return parseBotResponse(response.text);
  } catch (error) {
    throw new Error("Falha na IA.");
  }
};

export const buildConversationPrompt = (theme: string, objective: string, tone: string, participatingBots: Bot[], durationSeconds: number): string => {
  const botsList = participatingBots.map(b => 
    `- ${b.name} (${b.archetype}, Sabedoria ${b.wisdomLevel}%): ${b.description}`
  ).join('\n');

  return `
ATUE COMO ROTEIRISTA DE CHAT PARA PROVA SOCIAL.
Crie uma conversa simulada brasileira natural entre estes bots:
${botsList}

REGRAS DE OURO DA PERSONALIDADE:
1. CONSISTÊNCIA DE CONHECIMENTO: Um bot 'experienced' JAMAIS pergunta "como joga". Ele responde as dúvidas dos 'beginner'.
2. DINÂMICA DE GRUPO: O 'beginner' expressa medo de ban, o 'skeptic' exige provas, o 'experienced' explica a tecnologia e o 'enthusiast' comemora um lucro recente.
3. CONTEXTO: "${theme}". OBJETIVO: "${objective}".
4. FORMATO: JSON array de objetos { "botName": "Nome", "text": "Mensagem", "delayAfter": 2-6 }.

Retorne apenas o JSON cru. Sem markdown.
`.trim();
};

export const parseConversationResponse = (jsonString: string, availableBots: Bot[]): TimelineMessage[] => {
  try {
    const cleaned = cleanJsonString(jsonString);
    const parsed = JSON.parse(cleaned);
    return parsed.map((msg: any, index: number) => {
      const bot = availableBots.find(b => b.name.toLowerCase().includes(msg.botName.toLowerCase()));
      return {
        id: `msg-${Date.now()}-${index}`,
        botId: bot ? bot.id : availableBots[0]?.id, 
        text: msg.text || "...",
        delayAfter: Number(msg.delayAfter) || 3,
        timestamp: Date.now()
      };
    });
  } catch (e) {
    throw new Error("Erro no processamento da conversa.");
  }
};
