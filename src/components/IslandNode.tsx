import { motion } from 'framer-motion';
import { Island } from '@/lib/emotions';
import { ISLAND_IMAGES } from '@/lib/island-images';

interface IslandNodeProps {
  island: {
    id: Island;
    label: string;
    emoji: string;
    description: string;
  };
  count: number;
  index: number;
  onClick: () => void;
}

// Constellation layout – centered, well-spaced for ~140px icons
const ISLAND_POSITIONS = [
  { x: '22%', y: '18%' },
  { x: '58%', y: '10%' },
  { x: '82%', y: '28%' },
  { x: '12%', y: '48%' },
  { x: '50%', y: '42%' },
  { x: '80%', y: '58%' },
  { x: '25%', y: '76%' },
  { x: '62%', y: '78%' },
];

// Per-island glow color using CSS vars
const GLOW_COLORS: Record<Island, string> = {
  joy: 'var(--island-joy)',
  peace: 'var(--island-peace)',
  love: 'var(--island-love)',
  hope: 'var(--island-hope)',
  sadness: 'var(--island-sadness)',
  anger: 'var(--island-anger)',
  fear: 'var(--island-fear)',
  fatigue: 'var(--island-fatigue)',
};

// Varied float durations for organic feel
const FLOAT_CONFIGS = [
  { yRange: [-14, 0, -14], xRange: [0, 3, 0], duration: 5.5 },
  { yRange: [-10, 0, -10], xRange: [0, -2, 0], duration: 7 },
  { yRange: [-12, 0, -12], xRange: [0, 4, 0], duration: 6 },
  { yRange: [-8, 0, -8], xRange: [0, -3, 0], duration: 8 },
  { yRange: [-16, 0, -16], xRange: [0, 2, 0], duration: 5 },
  { yRange: [-10, 0, -10], xRange: [0, -4, 0], duration: 7.5 },
  { yRange: [-13, 0, -13], xRange: [0, 3, 0], duration: 6.5 },
  { yRange: [-9, 0, -9], xRange: [0, -2, 0], duration: 8.5 },
];

const IslandNode = ({ island, count, index, onClick }: IslandNodeProps) => {
  const pos = ISLAND_POSITIONS[index];
  const size = Math.max(120, Math.min(195, 120 + count * 15));
  const delay = index * 0.15;
  const floatCfg = FLOAT_CONFIGS[index % FLOAT_CONFIGS.length];
  const glowHsl = GLOW_COLORS[island.id];

  return (
    <motion.button
      onClick={onClick}
      className="absolute group cursor-pointer focus:outline-none"
      style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
      initial={{ opacity: 0, scale: 0, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: 'spring', stiffness: 120 }}
    >
      {/* Glow halo */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size + 50,
          height: size + 50,
          left: -25,
          top: -25,
          background: `radial-gradient(circle, hsl(${glowHsl} / 0.35) 0%, hsl(${glowHsl} / 0.1) 50%, transparent 70%)`,
          filter: 'blur(12px)',
        }}
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.06, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
      />

      {/* Floating island body */}
      <motion.div
        className="relative flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
        animate={{
          y: floatCfg.yRange,
          x: floatCfg.xRange,
        }}
        transition={{ duration: floatCfg.duration, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={ISLAND_IMAGES[island.id]}
          alt={island.label}
          className="w-full h-full object-contain drop-shadow-[0_0_20px_hsl(var(--island-joy)/0.4)]"
          style={{
            filter: `drop-shadow(0 0 18px hsl(${glowHsl} / 0.5))`,
          }}
        />
        {count > 0 && (
          <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[11px] font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
            {count}
          </span>
        )}
      </motion.div>

      {/* Label */}
      <motion.div
        className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {island.label}
        </span>
      </motion.div>
    </motion.button>
  );
};

export default IslandNode;
