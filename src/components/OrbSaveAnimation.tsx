import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryOrb from './MemoryOrb';
import OrbJar from './OrbJar';
import { type Island, type CoreMemory, type EmotionInfo } from '@/lib/emotions';
import { loadMemories } from '@/lib/memory-store';

interface OrbSaveAnimationProps {
  island: Island;
  emotionInfo: EmotionInfo | null;
  onComplete: () => void;
}

const OrbSaveAnimation = ({ island, emotionInfo, onComplete }: OrbSaveAnimationProps) => {
  const [phase, setPhase] = useState<'spawn' | 'fall' | 'landed'>('spawn');
  const pastMemories = loadMemories().slice(1); // exclude the one just saved

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fall'), 300);
    const t2 = setTimeout(() => setPhase('landed'), 1200);
    const t3 = setTimeout(onComplete, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center mt-16 px-6 relative">
      {/* The falling orb */}
      <div className="relative h-[280px] w-full flex flex-col items-center">
        <AnimatePresence>
          {phase === 'spawn' && (
            <motion.div
              key="spawn"
              className="absolute top-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <MemoryOrb island={island} size={56} animate={false} />
            </motion.div>
          )}
        </AnimatePresence>

        {(phase === 'fall' || phase === 'landed') && (
          <motion.div
            className="absolute"
            initial={{ top: 0, scale: 1 }}
            animate={{
              top: phase === 'landed' ? 160 : 160,
              scale: phase === 'landed' ? [1, 1.15, 0.9, 1] : 1,
              x: [0, 15, -10, 5, 0],
            }}
            transition={{
              top: { duration: 0.7, ease: [0.45, 0, 0.55, 1] },
              scale: { duration: 0.4, delay: 0.6, times: [0, 0.3, 0.6, 1] },
              x: { duration: 0.7, ease: 'easeInOut' },
            }}
          >
            <MemoryOrb island={island} size={56} />
          </motion.div>
        )}

        {/* Jar positioned below */}
        <motion.div
          className="absolute bottom-0 w-full flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <OrbJar memories={pastMemories} maxDisplay={8} />
        </motion.div>
      </div>

      {/* Completion text */}
      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: phase === 'landed' ? 1 : 0, y: phase === 'landed' ? 0 : 10 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className="text-lg font-semibold text-foreground">기억 구슬이 저장되었어요</p>
        <p className="text-sm text-muted-foreground mt-1">
          {emotionInfo?.emoji} {emotionInfo?.label}의 기억이 구슬통에 담겼습니다
        </p>
      </motion.div>
    </div>
  );
};

export default OrbSaveAnimation;
