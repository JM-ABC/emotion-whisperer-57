import { motion } from 'framer-motion';
import { Island } from '@/lib/emotions';

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

const ISLAND_POSITIONS = [
  { x: '15%', y: '20%' },
  { x: '55%', y: '12%' },
  { x: '75%', y: '35%' },
  { x: '25%', y: '45%' },
  { x: '60%', y: '55%' },
  { x: '10%', y: '68%' },
  { x: '45%', y: '75%' },
  { x: '78%', y: '72%' },
];

const IslandNode = ({ island, count, index, onClick }: IslandNodeProps) => {
  const pos = ISLAND_POSITIONS[index];
  const size = Math.max(80, Math.min(130, 80 + count * 10));
  const delay = index * 0.15;

  return (
    <motion.button
      onClick={onClick}
      className="absolute group cursor-pointer focus:outline-none"
      style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
      initial={{ opacity: 0, scale: 0, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: 'spring', stiffness: 120 }}
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 rounded-full bg-island-${island.id} opacity-20 blur-xl animate-glow-pulse group-hover:opacity-40 transition-opacity`}
        style={{ width: size + 30, height: size + 30, left: -15, top: -15 }}
      />

      {/* Island body */}
      <motion.div
        className={`relative rounded-full bg-gradient-to-br from-island-${island.id} to-island-glow-${island.id} flex flex-col items-center justify-center shadow-lg border border-foreground/5`}
        style={{ width: size, height: size }}
        animate={{ y: [0, index % 2 === 0 ? -10 : -7, 0] }}
        transition={{ duration: index % 2 === 0 ? 5 : 7, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl md:text-3xl">{island.emoji}</span>
        {count > 0 && (
          <span className="text-xs font-semibold text-primary-foreground/90 mt-0.5">
            {count}
          </span>
        )}
      </motion.div>

      {/* Label */}
      <motion.div
        className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap"
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
