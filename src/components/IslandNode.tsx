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

// Balanced constellation layout centered in the container
const ISLAND_POSITIONS = [
  { x: '50%', y: '12%' },   // top center
  { x: '82%', y: '25%' },   // right upper
  { x: '18%', y: '25%' },   // left upper
  { x: '68%', y: '48%' },   // right middle
  { x: '32%', y: '48%' },   // left middle
  { x: '82%', y: '70%' },   // right lower
  { x: '18%', y: '70%' },   // left lower
  { x: '50%', y: '85%' },   // bottom center
];

const GLOW_COLORS: Record<string, string> = {
  joy: 'hsl(45 90% 60% / 0.35)',
  peace: 'hsl(180 50% 55% / 0.3)',
  love: 'hsl(340 70% 60% / 0.3)',
  hope: 'hsl(160 55% 50% / 0.3)',
  sadness: 'hsl(220 50% 55% / 0.3)',
  anger: 'hsl(10 75% 55% / 0.3)',
  fear: 'hsl(270 45% 55% / 0.3)',
  fatigue: 'hsl(230 20% 50% / 0.3)',
};

const IslandNode = ({ island, count, index, onClick }: IslandNodeProps) => {
  const pos = ISLAND_POSITIONS[index];
  const baseSize = Math.max(110, Math.min(180, 110 + count * 12));
  const delay = index * 0.15;
  const floatDuration = 5 + (index % 3) * 1.5;
  const floatAmount = index % 2 === 0 ? -14 : -10;

  return (
    <motion.button
      onClick={onClick}
      className="absolute group cursor-pointer focus:outline-none"
      style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
      initial={{ opacity: 0, scale: 0, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: 'spring', stiffness: 120 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: baseSize + 50,
          height: baseSize + 50,
          left: -25,
          top: -25,
          background: `radial-gradient(circle, ${GLOW_COLORS[island.id]}, transparent 70%)`,
        }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 3 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Island image with floating */}
      <motion.div
        className="relative flex flex-col items-center justify-center"
        style={{ width: baseSize, height: baseSize }}
        animate={{ y: [0, floatAmount, 0] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={ISLAND_IMAGES[island.id]}
          alt={island.label}
          className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          style={{ background: 'transparent' }}
        />
        {count > 0 && (
          <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
            {count}
          </span>
        )}
      </motion.div>

      {/* Label */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors drop-shadow-sm">
          {island.label}
        </span>
      </motion.div>
    </motion.button>
  );
};

export default IslandNode;
