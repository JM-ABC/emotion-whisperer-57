import { motion } from 'framer-motion';
import { type Island } from '@/lib/emotions';

const ISLAND_COLORS: Record<Island, { main: string; glow: string; light: string }> = {
  joy: { main: 'hsl(45, 90%, 60%)', glow: 'hsl(45, 90%, 70%)', light: 'hsl(45, 90%, 85%)' },
  peace: { main: 'hsl(180, 50%, 55%)', glow: 'hsl(180, 50%, 65%)', light: 'hsl(180, 50%, 80%)' },
  love: { main: 'hsl(340, 70%, 60%)', glow: 'hsl(340, 70%, 70%)', light: 'hsl(340, 70%, 85%)' },
  hope: { main: 'hsl(160, 55%, 50%)', glow: 'hsl(160, 55%, 60%)', light: 'hsl(160, 55%, 80%)' },
  sadness: { main: 'hsl(220, 50%, 55%)', glow: 'hsl(220, 50%, 65%)', light: 'hsl(220, 50%, 80%)' },
  anger: { main: 'hsl(10, 75%, 55%)', glow: 'hsl(10, 75%, 65%)', light: 'hsl(10, 75%, 80%)' },
  fear: { main: 'hsl(270, 45%, 55%)', glow: 'hsl(270, 45%, 65%)', light: 'hsl(270, 45%, 80%)' },
  fatigue: { main: 'hsl(230, 20%, 50%)', glow: 'hsl(230, 20%, 60%)', light: 'hsl(230, 20%, 75%)' },
};

interface MemoryOrbProps {
  island: Island;
  size?: number;
  onClick?: () => void;
  className?: string;
  animate?: boolean;
}

const MemoryOrb = ({ island, size = 48, onClick, className = '', animate = true }: MemoryOrbProps) => {
  const colors = ISLAND_COLORS[island];

  return (
    <motion.div
      className={`relative rounded-full cursor-pointer flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${colors.light}, ${colors.main} 50%, ${colors.glow} 100%)`,
        boxShadow: `
          0 0 ${size * 0.3}px ${colors.glow},
          0 0 ${size * 0.6}px ${colors.main}40,
          inset 0 -${size * 0.08}px ${size * 0.15}px ${colors.main}80
        `,
      }}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.15 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      {...(animate ? {
        animate: {
          boxShadow: [
            `0 0 ${size * 0.3}px ${colors.glow}, 0 0 ${size * 0.6}px ${colors.main}40, inset 0 -${size * 0.08}px ${size * 0.15}px ${colors.main}80`,
            `0 0 ${size * 0.5}px ${colors.glow}, 0 0 ${size * 0.8}px ${colors.main}60, inset 0 -${size * 0.08}px ${size * 0.15}px ${colors.main}80`,
            `0 0 ${size * 0.3}px ${colors.glow}, 0 0 ${size * 0.6}px ${colors.main}40, inset 0 -${size * 0.08}px ${size * 0.15}px ${colors.main}80`,
          ],
        },
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      } : {})}
    >
      {/* Highlight reflection */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.35,
          height: size * 0.2,
          top: size * 0.12,
          left: size * 0.18,
          background: `radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)`,
        }}
      />
      {/* Secondary small reflection */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.1,
          height: size * 0.1,
          bottom: size * 0.2,
          right: size * 0.22,
          background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
};

export default MemoryOrb;
