import type { Island } from './emotions';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const ISLAND_IMAGES: Record<Island, string> = {
  joy: `${SUPABASE_URL}/storage/v1/object/public/island-images/joy.png`,
  peace: `${SUPABASE_URL}/storage/v1/object/public/island-images/peace.png`,
  love: `${SUPABASE_URL}/storage/v1/object/public/island-images/love.png`,
  hope: `${SUPABASE_URL}/storage/v1/object/public/island-images/hope.png`,
  sadness: `${SUPABASE_URL}/storage/v1/object/public/island-images/sadness.png`,
  anger: `${SUPABASE_URL}/storage/v1/object/public/island-images/anger.png`,
  fear: `${SUPABASE_URL}/storage/v1/object/public/island-images/fear.png`,
  fatigue: `${SUPABASE_URL}/storage/v1/object/public/island-images/fatigue.png`,
};
