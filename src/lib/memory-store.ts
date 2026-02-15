import { CoreMemory, Emotion, Island, EmotionInsight, getEmotionById } from './emotions';

const STORAGE_KEY = 'core-memories';

export const loadMemories = (): CoreMemory[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw).map((m: any) => ({
    ...m,
    createdAt: new Date(m.createdAt),
    updatedAt: new Date(m.updatedAt),
  }));
};

export const saveMemory = (content: string, emotion: Emotion): CoreMemory => {
  const memories = loadMemories();
  const info = getEmotionById(emotion);
  const now = new Date();

  // Check for same-day entry
  const today = now.toDateString();
  const existing = memories.find(m => m.createdAt.toDateString() === today);
  
  if (existing) {
    existing.content = content;
    existing.emotion = emotion;
    existing.island = info.island;
    existing.updatedAt = now;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    return existing;
  }

  const memory: CoreMemory = {
    id: crypto.randomUUID(),
    content,
    emotion,
    island: info.island,
    createdAt: now,
    updatedAt: now,
  };
  memories.unshift(memory);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  return memory;
};

export const getInsights = (memories: CoreMemory[]): EmotionInsight[] => {
  const counts: Record<Island, number> = {
    joy: 0, peace: 0, love: 0, hope: 0,
    sadness: 0, anger: 0, fear: 0, fatigue: 0,
  };
  memories.forEach(m => { counts[m.island]++; });
  const total = memories.length || 1;
  return Object.entries(counts).map(([island, count]) => ({
    island: island as Island,
    count,
    percentage: Math.round((count / total) * 100),
  }));
};

export const getTodayMemory = (): CoreMemory | undefined => {
  const memories = loadMemories();
  const today = new Date().toDateString();
  return memories.find(m => m.createdAt.toDateString() === today);
};
