import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { type Island } from '@/lib/emotions';
import { getRandomMission, type Mission } from '@/lib/missions';
import { track } from '@/hooks/useAmplitude';

interface EmotionMissionProps {
  island: Island;
  onDismiss: () => void;
}

const ISLAND_HSL: Record<Island, string> = {
  joy: 'var(--island-joy)',
  peace: 'var(--island-peace)',
  love: 'var(--island-love)',
  hope: 'var(--island-hope)',
  sadness: 'var(--island-sadness)',
  anger: 'var(--island-anger)',
  fear: 'var(--island-fear)',
  fatigue: 'var(--island-fatigue)',
};

const EmotionMission = ({ island, onDismiss }: EmotionMissionProps) => {
  const [mission] = useState<Mission>(() => getRandomMission(island));

  return (
    <motion.div
      className="max-w-lg mx-auto px-6 pt-16 flex flex-col items-center text-center space-y-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Glow background */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        style={{
          background: `radial-gradient(circle at 50% 40%, hsl(${ISLAND_HSL[island]}), transparent 70%)`,
        }}
      />

      <motion.div
        className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{ background: `hsl(${ISLAND_HSL[island]} / 0.2)` }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {mission.emoji}
      </motion.div>

      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
          <Sparkles size={14} />
          <p className="text-xs font-medium">오늘의 작은 미션</p>
        </div>
        <h2 className="text-xl font-bold text-foreground">{mission.text}</h2>
        <p className="text-sm text-muted-foreground">
          이 작은 행동이 감정을 다스리는 데 도움이 될 거예요
        </p>
      </div>

      <motion.button
        onClick={() => { track('mission_dismissed', { island }); onDismiss(); }}
        className="relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        홈으로 돌아가기
        <ArrowRight size={16} />
      </motion.button>
    </motion.div>
  );
};

export default EmotionMission;
