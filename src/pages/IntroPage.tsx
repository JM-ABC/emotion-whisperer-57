import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarField from '@/components/StarField';
import { useAppLogin } from '@/hooks/useAppLogin';

const ORBS = [
  { color: '#6d28d9', size: 36, x: 0,   y: 0,   delay: 0.0, duration: 3.2 },
  { color: '#d97706', size: 18, x: -52, y: -24, delay: 0.4, duration: 2.6 },
  { color: '#059669', size: 22, x: 44,  y: -20, delay: 0.8, duration: 3.8 },
  { color: '#dc2626', size: 14, x: -36, y: 28,  delay: 1.2, duration: 2.9 },
  { color: '#2563eb', size: 16, x: 48,  y: 30,  delay: 1.6, duration: 3.5 },
] as const;

export default function IntroPage() {
  const navigate = useNavigate();
  const { login, loading } = useAppLogin();

  async function handleStart() {
    const result = await login();
    if (result) {
      localStorage.setItem('intro_seen', '1');
      navigate('/', { replace: true });
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
      <StarField />

      {/* Floating memory orbs */}
      <div className="relative z-10 w-44 h-44 flex items-center justify-center mb-6">
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle at 35% 35%, ${orb.color}cc, ${orb.color})`,
              boxShadow: `0 0 ${Math.round(orb.size * 0.6)}px ${orb.color}99`,
              left: `calc(50% + ${orb.x}px - ${orb.size / 2}px)`,
              top:  `calc(50% + ${orb.y}px - ${orb.size / 2}px)`,
            }}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: orb.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-3 px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          코어 메모리
        </h1>
        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          감정 하나하나가<br />빛나는 기억이 됩니다
        </p>

        <motion.button
          onClick={handleStart}
          disabled={loading}
          className="mt-6 bg-gradient-to-r from-violet-700 to-indigo-600 text-white font-bold rounded-full px-10 py-3 text-sm disabled:opacity-50"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? '로그인 중...' : '시작하기'}
        </motion.button>
      </motion.div>
    </div>
  );
}
