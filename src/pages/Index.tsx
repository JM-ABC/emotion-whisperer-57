import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarField from '@/components/StarField';
import IslandNode from '@/components/IslandNode';
import OrbJar from '@/components/OrbJar';
import { ISLANDS, type CoreMemory, getEmotionById } from '@/lib/emotions';
import { loadMemories, getInsights, getTodayMemory } from '@/lib/memory-store';
import { PenLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ISLAND_HSL: Record<string, string> = {
  joy: 'var(--island-joy)',
  peace: 'var(--island-peace)',
  love: 'var(--island-love)',
  hope: 'var(--island-hope)',
  sadness: 'var(--island-sadness)',
  anger: 'var(--island-anger)',
  fear: 'var(--island-fear)',
  fatigue: 'var(--island-fatigue)',
};

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [memories, setMemories] = useState(loadMemories());
  const [selectedOrb, setSelectedOrb] = useState<CoreMemory | null>(null);
  const insights = getInsights(memories);
  const todayMemory = getTodayMemory();
  const todayEmotionInfo = todayMemory ? getEmotionById(todayMemory.emotion) : null;

  useEffect(() => {
    setMemories(loadMemories());
  }, []);

  const getCount = (islandId: string) =>
    insights.find(i => i.island === islandId)?.count ?? 0;

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <StarField />

      {/* Today's emotion color accent */}
      {todayMemory && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ duration: 1.5 }}
          style={{
            background: `radial-gradient(ellipse at 50% 0%, hsl(${ISLAND_HSL[todayMemory.island]}), transparent 60%)`,
          }}
        />
      )}

      {/* Header */}
      <motion.header
        className="relative z-10 pt-4 pb-1 px-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Core Memory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          나의 감정 섬들을 탐험해보세요
        </p>
      </motion.header>

      {/* Islands Map - Grid layout */}
      <div className="relative z-10 mx-auto max-w-sm px-4 py-0">
        <div className="grid grid-cols-3 gap-y-0 gap-x-2 place-items-center">
          {/* Row 1: center - 기쁨의 섬 */}
          <div className="col-start-2 mt-1" style={{ zIndex: getCount(ISLANDS[0].id) > 0 ? 20 : 10, marginLeft: 4 }}>
            <IslandNode island={ISLANDS[0]} count={getCount(ISLANDS[0].id)} index={0} onClick={() => navigate('/insight')} style={{ zIndex: getCount(ISLANDS[0].id) > 0 ? 20 : 10 }} />
          </div>
          {/* Row 2: left + right */}
          <div className="col-start-1 mt-1" style={{ zIndex: getCount(ISLANDS[1].id) > 0 ? 20 : 10, marginTop: -4, marginLeft: -6 }}>
            <IslandNode island={ISLANDS[1]} count={getCount(ISLANDS[1].id)} index={1} onClick={() => navigate('/insight')} style={{ zIndex: getCount(ISLANDS[1].id) > 0 ? 20 : 10 }} />
          </div>
          <div className="col-start-3 mt-1" style={{ zIndex: getCount(ISLANDS[2].id) > 0 ? 20 : 10, marginTop: 6, marginRight: -6 }}>
            <IslandNode island={ISLANDS[2]} count={getCount(ISLANDS[2].id)} index={2} onClick={() => navigate('/insight')} style={{ zIndex: getCount(ISLANDS[2].id) > 0 ? 20 : 10 }} />
          </div>
          {/* Row 3: 희망, 슬픔(아래로), 분노 */}
          <div className="mt-2" style={{ zIndex: getCount(ISLANDS[3].id) > 0 ? 20 : 10, marginLeft: -4 }}>
            <IslandNode island={ISLANDS[3]} count={getCount(ISLANDS[3].id)} index={3} onClick={() => navigate('/insight')} style={{ zIndex: getCount(ISLANDS[3].id) > 0 ? 20 : 10 }} />
          </div>
          <div className="mt-2" style={{ zIndex: getCount(ISLANDS[4].id) > 0 ? 20 : 10, marginTop: -3, marginLeft: 3 }}>
            <IslandNode island={ISLANDS[4]} count={getCount(ISLANDS[4].id)} index={4} onClick={() => navigate('/insight')} style={{ zIndex: getCount(ISLANDS[4].id) > 0 ? 20 : 10 }} />
          </div>
          <div className="mt-2" style={{ zIndex: getCount(ISLANDS[5].id) > 0 ? 20 : 10, marginRight: -4 }}>
            <IslandNode island={ISLANDS[5]} count={getCount(ISLANDS[5].id)} index={5} onClick={() => navigate('/insight')} style={{ zIndex: getCount(ISLANDS[5].id) > 0 ? 20 : 10 }} />
          </div>
          {/* Row 4: left-center + right-center */}
          <div className="col-start-1 col-span-1 justify-self-end mr-2 mt-1" style={{ zIndex: getCount(ISLANDS[6].id) > 0 ? 20 : 10, marginTop: 4, marginLeft: 5 }}>
            <IslandNode island={ISLANDS[6]} count={getCount(ISLANDS[6].id)} index={6} onClick={() => navigate('/insight')} style={{ zIndex: getCount(ISLANDS[6].id) > 0 ? 20 : 10 }} />
          </div>
          <div className="col-start-3 col-span-1 justify-self-start ml-2 mt-1" style={{ zIndex: getCount(ISLANDS[7].id) > 0 ? 20 : 10, marginTop: -2, marginRight: 5 }}>
            <IslandNode island={ISLANDS[7]} count={getCount(ISLANDS[7].id)} index={7} onClick={() => navigate('/insight')} style={{ zIndex: getCount(ISLANDS[7].id) > 0 ? 20 : 10 }} />
          </div>
        </div>
      </div>

      {/* Memory Orb Jar */}
      {memories.length > 0 && (
        <motion.div
          className="relative z-10 mx-6 mt-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <p className="text-sm text-foreground/70 font-medium mb-3 text-center" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>나의 기억 구슬</p>
          <OrbJar
            memories={memories}
            maxDisplay={10}
            onOrbClick={(memory) => {
              const info = getEmotionById(memory.emotion);
              toast({
                title: `${info.emoji} ${info.label}`,
                description: memory.content,
              });
            }}
          />
        </motion.div>
      )}

      {/* Today's Status */}
      <motion.div
        className="relative z-10 mx-6 mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        {todayMemory ? (
          <div
            className="relative overflow-hidden rounded-2xl p-4 border border-border"
            style={{
              background: `linear-gradient(135deg, hsl(${ISLAND_HSL[todayMemory.island]} / 0.1), hsl(var(--card)))`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              {todayEmotionInfo && <span className="text-sm">{todayEmotionInfo.emoji}</span>}
              <p className="text-xs text-muted-foreground">오늘의 기억</p>
            </div>
            <p className="text-sm text-foreground line-clamp-2">{todayMemory.content}</p>
          </div>
        ) : (
          <motion.button
            onClick={() => navigate('/write')}
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl p-3 flex items-center justify-center gap-2 font-medium shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PenLine size={18} />
            <span>오늘의 기억 기록하기</span>
          </motion.button>
        )}
      </motion.div>

      {/* Memory count */}
      <motion.p
        className="relative z-10 text-center text-sm text-foreground/70 font-medium mt-2 pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        총 {memories.length}개의 기억이 섬에 저장되어 있어요
      </motion.p>
    </div>
  );
};

export default Index;
