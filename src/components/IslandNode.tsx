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

const ISLAND_POSITIONS = [
  { x: '50%', y: '6%' },
  { x: '35%', y: '22%' },
  { x: '65%', y: '22%' },
  { x: '25%', y: '40%' },
  { x: '50%', y: '38%' },
  { x: '75%', y: '40%' },
  { x: '38%', y: '58%' },
  { x: '62%', y: '58%' },
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
        className="relative flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
        animate={{ y: [0, index % 2 === 0 ? -10 : -7, 0] }}
        transition={{ duration: index % 2 === 0 ? 5 : 7, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={ISLAND_IMAGES[island.id]}
          alt={island.label}
          className="w-full h-full object-contain"
          style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }}
        />
        {count > 0 && (
          <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
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
        <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground transition-colors" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
          {island.label}
        </span>
      </motion.div>
    </motion.button>
  );
};

export default IslandNode;
