import type { Island } from './emotions';

import joyImg from '@/assets/islands/joy.png';
import peaceImg from '@/assets/islands/peace.png';
import loveImg from '@/assets/islands/love.png';
import hopeImg from '@/assets/islands/hope.png';
import sadnessImg from '@/assets/islands/sadness.png';
import angerImg from '@/assets/islands/anger.png';
import fearImg from '@/assets/islands/fear.png';
import fatigueImg from '@/assets/islands/fatigue.png';

export const ISLAND_IMAGES: Record<Island, string> = {
  joy: joyImg,
  peace: peaceImg,
  love: loveImg,
  hope: hopeImg,
  sadness: sadnessImg,
  anger: angerImg,
  fear: fearImg,
  fatigue: fatigueImg,
};
