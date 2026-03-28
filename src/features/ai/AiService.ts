import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  type ChatSession,
} from 'firebase/ai';

import { app } from '../../core/firebase/config';

const TOPIC_NAMES: Record<string, string> = {
  'core-js': 'основы JavaScript',
  closures: 'замыкания (closures) в JavaScript',
  asynchrony: 'асинхронное программирование в JavaScript',
  'data-structures': 'структуры данных и алгоритмы',
};

function buildSystemPrompt(topicId: string): string {
  const topicName = TOPIC_NAMES[topicId] ?? 'JavaScript';

  return `
  Ты — опытный технический интервьюер и ментор по JavaScript.
Твоя задача — помочь разработчику подготовиться к техническому интервью по теме: "${topicName}".

Правила поведения:
1. Задавай вопросы, которые реально встречаются на собеседованиях по теме "${topicName}"
2. Если человек отвечает неправильно — мягко поправь и объясни правильный ответ
3. Если ответ правильный — похвали и задай следующий вопрос или углуби тему
4. Давай примеры кода на JavaScript, когда это уместно (используй markdown с блоками \`\`\`js)
5. Говори на русском языке
6. Будь дружелюбным, поддерживающим, но профессиональным
7. Можешь объяснять сложные концепции простыми словами

Начни разговор с короткого приветствия и первого вопроса по теме "${topicName}".
  `.trim();
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export class AiService {
  private chatSession: ChatSession | null = null;

  private initialized = false;

  async init(topicId: string): Promise<void> {
    const ai = getAI(app, { backend: new GoogleAIBackend() });

    const model = getGenerativeModel(ai, {
      model: 'gemini-2.5-flash-lite',
      systemInstruction: buildSystemPrompt(topicId),
    });

    this.chatSession = model.startChat({ history: [] });
    this.initialized = true;
  }

  async sendMessage(userText: string): Promise<string> {
    if (!this.initialized || !this.chatSession) {
      throw new Error('AiService не инициализирован. Вызови init() сначала.');
    }

    const result = await this.chatSession.sendMessage(userText);

    const response = await result.response;
    return response.text();
  }

  reset(): void {
    this.chatSession = null;
    this.initialized = false;
  }
}

export const aiService = new AiService();
