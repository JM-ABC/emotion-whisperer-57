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
  className?: string;
  style?: React.CSSProperties;
}

const IslandNode = ({ island, count, index, onClick, className = '', style }: IslandNodeProps) => {
  const size = Math.max(90, Math.min(140, 90 + count * 12));
  const delay = index * 0.12;

  return (
    <motion.button
      onClick={onClick}
      className={`relative group cursor-pointer focus:outline-none flex flex-col items-center ${className}`}
      style={{ ...style, zIndex: count > 0 ? 50 : 1 }}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 120 }}
    >
      {/* Glow */}
      <div
        className={`absolute rounded-full bg-island-${island.id} opacity-20 blur-xl animate-glow-pulse group-hover:opacity-40 transition-opacity`}
        style={{ width: size + 20, height: size + 20, left: '50%', top: '50%', transform: 'translate(-50%, -60%)' }}
      />

      {/* Island body */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
        animate={{ y: [0, index % 2 === 0 ? -8 : -5, 0] }}
        transition={{ duration: index % 2 === 0 ? 5 : 7, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={ISLAND_IMAGES[island.id]}
          alt={island.label}
          className="w-full h-full object-contain"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
        />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 z-50 bg-primary text-primary-foreground text-[11px] font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg ring-2 ring-background">
            {count}
          </span>
        )}
      </motion.div>

      {/* Label - below image */}
      <motion.span
        className="mt-2 text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors bg-background/50 backdrop-blur-sm px-2 py-0.5 rounded whitespace-nowrap"
        style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        {island.label}
      </motion.span>
    </motion.button>
  );
};

export default IslandNode;
