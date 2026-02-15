// Emotion and Island type definitions for Core Memory

export type Island = 'joy' | 'peace' | 'love' | 'hope' | 'sadness' | 'anger' | 'fear' | 'fatigue';

export type Emotion =
  | 'happiness' | 'excitement'       // Joy
  | 'calm' | 'contentment'           // Peace
  | 'love' | 'gratitude'             // Love
  | 'hope' | 'inspiration'           // Hope
  | 'sadness' | 'loneliness'         // Sadness
  | 'anger' | 'frustration'          // Anger
  | 'anxiety' | 'fear'               // Fear
  | 'exhaustion' | 'boredom';        // Fatigue

export interface EmotionInfo {
  id: Emotion;
  label: string;
  island: Island;
  emoji: string;
}

export interface IslandInfo {
  id: Island;
  label: string;
  emoji: string;
  emotions: EmotionInfo[];
  description: string;
}

export interface CoreMemory {
  id: string;
  content: string;
  emotion: Emotion;
  island: Island;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmotionInsight {
  island: Island;
  count: number;
  percentage: number;
}

export const EMOTIONS: EmotionInfo[] = [
  { id: 'happiness', label: '행복', island: 'joy', emoji: '😊' },
  { id: 'excitement', label: '설렘', island: 'joy', emoji: '🤩' },
  { id: 'calm', label: '평온', island: 'peace', emoji: '😌' },
  { id: 'contentment', label: '만족', island: 'peace', emoji: '☺️' },
  { id: 'love', label: '사랑', island: 'love', emoji: '🥰' },
  { id: 'gratitude', label: '감사', island: 'love', emoji: '🙏' },
  { id: 'hope', label: '희망', island: 'hope', emoji: '🌟' },
  { id: 'inspiration', label: '영감', island: 'hope', emoji: '💡' },
  { id: 'sadness', label: '슬픔', island: 'sadness', emoji: '😢' },
  { id: 'loneliness', label: '외로움', island: 'sadness', emoji: '🥺' },
  { id: 'anger', label: '분노', island: 'anger', emoji: '😤' },
  { id: 'frustration', label: '짜증', island: 'anger', emoji: '😣' },
  { id: 'anxiety', label: '불안', island: 'fear', emoji: '😰' },
  { id: 'fear', label: '두려움', island: 'fear', emoji: '😨' },
  { id: 'exhaustion', label: '지침', island: 'fatigue', emoji: '😩' },
  { id: 'boredom', label: '무기력', island: 'fatigue', emoji: '😶' },
];

export const ISLANDS: IslandInfo[] = [
  {
    id: 'joy', label: '기쁨의 섬', emoji: '☀️',
    description: '빛나는 순간들이 모이는 곳',
    emotions: EMOTIONS.filter(e => e.island === 'joy'),
  },
  {
    id: 'peace', label: '평온의 섬', emoji: '🌊',
    description: '고요한 마음이 머무는 곳',
    emotions: EMOTIONS.filter(e => e.island === 'peace'),
  },
  {
    id: 'love', label: '사랑의 섬', emoji: '💗',
    description: '따뜻한 마음이 피어나는 곳',
    emotions: EMOTIONS.filter(e => e.island === 'love'),
  },
  {
    id: 'hope', label: '희망의 섬', emoji: '🌱',
    description: '새로운 가능성이 자라는 곳',
    emotions: EMOTIONS.filter(e => e.island === 'hope'),
  },
  {
    id: 'sadness', label: '슬픔의 섬', emoji: '🌧️',
    description: '비가 내리고 치유가 시작되는 곳',
    emotions: EMOTIONS.filter(e => e.island === 'sadness'),
  },
  {
    id: 'anger', label: '분노의 섬', emoji: '🌋',
    description: '뜨거운 감정이 분출되는 곳',
    emotions: EMOTIONS.filter(e => e.island === 'anger'),
  },
  {
    id: 'fear', label: '불안의 섬', emoji: '🌫️',
    description: '안개 속에서 길을 찾는 곳',
    emotions: EMOTIONS.filter(e => e.island === 'fear'),
  },
  {
    id: 'fatigue', label: '피로의 섬', emoji: '🌙',
    description: '지친 마음이 쉬어가는 곳',
    emotions: EMOTIONS.filter(e => e.island === 'fatigue'),
  },
];

export const getIslandById = (id: Island): IslandInfo =>
  ISLANDS.find(i => i.id === id)!;

export const getEmotionById = (id: Emotion): EmotionInfo =>
  EMOTIONS.find(e => e.id === id)!;
