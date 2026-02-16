import { motion } from 'framer-motion';

const COLORS = [
  'hsl(45, 100%, 60%)',   // joy
  'hsl(200, 80%, 65%)',   // peace
  'hsl(340, 80%, 65%)',   // love
  'hsl(140, 70%, 55%)',   // hope
  'hsl(220, 60%, 55%)',   // sadness
  'hsl(0, 75%, 55%)',     // anger
  'hsl(270, 50%, 55%)',   // fear
  'hsl(30, 40%, 50%)',    // fatigue
];

const AnalyzingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      {/* Rotating orb that cycles through emotion colors */}
      <div className="relative w-24 h-24">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), transparent 50%)`,
          }}
          animate={{
            boxShadow: COLORS.map(
              (c) => `0 0 30px 10px ${c}, inset 0 0 20px ${c}`
            ),
            background: COLORS.map(
              (c) =>
                `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.5), ${c} 70%, ${c})`
            ),
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Spinning highlight */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.3) 10%, transparent 20%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        {/* Glass reflection */}
        <div
          className="absolute rounded-full"
          style={{
            top: '12%',
            left: '20%',
            width: '35%',
            height: '25%',
            background:
              'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <motion.p
          className="text-base font-medium text-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          감정을 분석하고 있어요...
        </motion.p>
        <p className="text-sm text-muted-foreground">
          오늘 하루의 핵심 기억을 찾는 중
        </p>
      </div>
    </div>
  );
};

export default AnalyzingAnimation;
