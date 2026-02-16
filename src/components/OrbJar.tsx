import { motion } from 'framer-motion';
import MemoryOrb from './MemoryOrb';
import { type CoreMemory, getEmotionById } from '@/lib/emotions';

interface OrbJarProps {
  memories: CoreMemory[];
  maxDisplay?: number;
  onOrbClick?: (memory: CoreMemory) => void;
}

const OrbJar = ({ memories, maxDisplay = 10, onOrbClick }: OrbJarProps) => {
  const displayMemories = memories.slice(0, maxDisplay);

  return (
    <div className="relative mx-auto" style={{ width: 220, minHeight: 160 }}>
      {/* Jar body - glass morphism */}
      <div
        className="relative overflow-hidden border border-white/10"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px 16px 40px 40px',
          padding: '16px 12px 24px',
          minHeight: 140,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -2px 8px rgba(0,0,0,0.2),
            0 4px 24px rgba(0,0,0,0.3)
          `,
        }}
      >
        {/* Glass shine on left edge */}
        <div
          className="absolute top-0 left-0 bottom-0 pointer-events-none"
          style={{
            width: 3,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 100%)',
            borderRadius: '16px 0 0 40px',
          }}
        />

        {/* Orbs inside jar */}
        <div className="flex flex-wrap justify-center gap-2 items-end">
          {displayMemories.map((memory, i) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <MemoryOrb
                island={memory.island}
                size={32}
                onClick={onOrbClick ? () => onOrbClick(memory) : undefined}
              />
            </motion.div>
          ))}
          {displayMemories.length === 0 && (
            <p className="text-xs text-muted-foreground py-6">아직 기억 구슬이 없어요</p>
          )}
        </div>
      </div>

      {/* Jar opening / rim */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2"
        style={{
          width: 160,
          height: 12,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px 8px 0 0',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      />
    </div>
  );
};

export default OrbJar;
