/**
 * localStorage-based user statistics for Amplitude User Properties.
 */

const FIRST_USE_KEY = 'amp_first_use_date';
const COACHING_COUNTS_KEY = 'amp_coaching_persona_counts';
const COACHING_TOTAL_KEY = 'amp_coaching_total';
const STREAK_KEY = 'amp_streak';
const LAST_RECORD_KEY = 'amp_last_record_date';

// --- days_since_first_use ---

export function initFirstUseDate(): void {
  if (!localStorage.getItem(FIRST_USE_KEY)) {
    localStorage.setItem(FIRST_USE_KEY, new Date().toISOString().slice(0, 10));
  }
}

export function getDaysSinceFirstUse(): number {
  const first = localStorage.getItem(FIRST_USE_KEY);
  if (!first) return 0;
  const diff = Date.now() - new Date(first).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// --- preferred_persona & total_coaching_sessions ---

export function recordCoachingSession(persona: string): {
  preferred_persona: string;
  total_coaching_sessions: number;
} {
  // Increment per-persona count
  const raw = localStorage.getItem(COACHING_COUNTS_KEY);
  const counts: Record<string, number> = raw ? JSON.parse(raw) : {};
  counts[persona] = (counts[persona] || 0) + 1;
  localStorage.setItem(COACHING_COUNTS_KEY, JSON.stringify(counts));

  // Increment total
  const total = (parseInt(localStorage.getItem(COACHING_TOTAL_KEY) || '0', 10)) + 1;
  localStorage.setItem(COACHING_TOTAL_KEY, String(total));

  // Find preferred (most frequent)
  const preferred = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

  return { preferred_persona: preferred, total_coaching_sessions: total };
}

// --- streak_days ---

export function updateStreak(): number {
  const today = new Date().toISOString().slice(0, 10);
  const lastRecord = localStorage.getItem(LAST_RECORD_KEY);
  let streak = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10);

  if (lastRecord === today) {
    // Already recorded today — no change
    return streak;
  }

  if (lastRecord) {
    const lastDate = new Date(lastRecord);
    const todayDate = new Date(today);
    const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    streak = diffDays === 1 ? streak + 1 : 1;
  } else {
    streak = 1;
  }

  localStorage.setItem(STREAK_KEY, String(streak));
  localStorage.setItem(LAST_RECORD_KEY, today);
  return streak;
}
