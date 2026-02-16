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

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [memories, setMemories] = useState(loadMemories());
  const [selectedOrb, setSelectedOrb] = useState<CoreMemory | null>(null);
  const insights = getInsights(memories);
  const todayMemory = getTodayMemory();

  useEffect(() => {
    setMemories(loadMemories());
  }, []);

  const getCount = (islandId: string) =>
    insights.find(i => i.island === islandId)?.count ?? 0;

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <StarField />

      {/* Header */}
      <motion.header
        className="relative z-10 pt-12 pb-6 px-6 text-center"
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

      {/* Islands Map */}
      <div className="relative z-10 mx-4 h-[60vh] min-h-[400px]">
        {ISLANDS.map((island, index) => (
          <IslandNode
            key={island.id}
            island={island}
            count={getCount(island.id)}
            index={index}
            onClick={() => navigate('/insight')}
          />
        ))}
      </div>

      {/* Memory Orb Jar */}
      {memories.length > 0 && (
        <motion.div
          className="relative z-10 mx-6 mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <p className="text-xs text-muted-foreground mb-3 text-center">나의 기억 구슬</p>
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
        className="relative z-10 mx-6 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        {todayMemory ? (
          <div className="bg-card/60 backdrop-blur-md rounded-2xl p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">오늘의 기억</p>
            <p className="text-sm text-foreground line-clamp-2">{todayMemory.content}</p>
          </div>
        ) : (
          <motion.button
            onClick={() => navigate('/write')}
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl p-4 flex items-center justify-center gap-2 font-medium shadow-lg"
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
        className="relative z-10 text-center text-xs text-muted-foreground mt-4 pb-4"
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
