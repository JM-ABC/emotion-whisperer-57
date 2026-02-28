import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import AnalyzingAnimation from '@/components/AnalyzingAnimation';
import EmotionResultCard from '@/components/EmotionResultCard';
import OrbSaveAnimation from '@/components/OrbSaveAnimation';
import EmotionMission from '@/components/EmotionMission';
import { type Emotion, type Island, getEmotionById } from '@/lib/emotions';
import { saveMemory, loadMemories, getInsights } from '@/lib/memory-store';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { track, identify } from '@/hooks/useAmplitude';

type Phase = 'write' | 'analyzing' | 'confirm' | 'saved' | 'mission';

interface AIResult {
  emotion: Emotion;
  island: Island;
  core_memory: string;
  empathy_message: string;
}

const ISLAND_HSL: Record<Island, string> = {
  joy: 'var(--island-joy)',
  peace: 'var(--island-peace)',
  love: 'var(--island-love)',
  hope: 'var(--island-hope)',
  sadness: 'var(--island-sadness)',
  anger: 'var(--island-anger)',
  fear: 'var(--island-fear)',
  fatigue: 'var(--island-fatigue)',
};

const WritePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>('write');
  const [diary, setDiary] = useState('');
  const diaryStarted = useRef(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [savedEmotion, setSavedEmotion] = useState<Emotion | null>(null);
  const [savedIsland, setSavedIsland] = useState<Island | null>(null);

  const handleAnalyze = async () => {
    if (!diary.trim() || diary.trim().length < 5) {
      toast({ title: '오늘 있었던 일을 조금 더 적어주세요', variant: 'destructive' });
      return;
    }

    setPhase('analyzing');
    track('diary_submitted', { char_count: diary.trim().length, word_count: diary.trim().split(/\s+/).length });

    try {
      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: { diary: diary.trim() },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      const aiData = data as AIResult;
      setAiResult(aiData);
      track('emotion_analyzed', { emotion: aiData.emotion, island: aiData.island, core_memory_length: aiData.core_memory.length });
      setPhase('confirm');
    } catch (e: any) {
      console.error('AI analysis failed:', e);
      track('error_occurred', { error_type: 'analyze', error_message: e.message || 'unknown' });
      toast({
        title: '감정 분석에 실패했어요',
        description: e.message || '다시 시도해주세요',
        variant: 'destructive',
      });
      setPhase('write');
    }
  };

  const handleSave = (emotion: Emotion, island: Island, coreMemory: string) => {
    saveMemory(coreMemory, emotion);
    track('memory_saved', { emotion, island });

    // Update user properties
    const allMemories = loadMemories();
    const insights = getInsights(allMemories);
    const topIsland = [...insights].sort((a, b) => b.count - a.count)[0];
    identify({
      total_memories: allMemories.length,
      top_island: topIsland?.island || 'none',
      last_active_date: new Date().toISOString().slice(0, 10),
    });

    setSavedEmotion(emotion);
    setSavedIsland(island);
    setPhase('saved');
  };

  const handleOrbComplete = () => {
    track('mission_viewed', { island: savedIsland });
    setPhase('mission');
  };

  const emotionInfo = savedEmotion ? getEmotionById(savedEmotion) : null;
  const activeIsland = aiResult?.island || savedIsland;

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Emotion color overlay */}
      <AnimatePresence>
        {activeIsland && (phase === 'confirm' || phase === 'saved' || phase === 'mission') && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              background: `radial-gradient(ellipse at 50% 30%, hsl(${ISLAND_HSL[activeIsland]}), transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <button
            onClick={() => phase === 'write' ? navigate(-1) : setPhase('write')}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-semibold text-foreground">오늘의 기억</h1>
          <div className="w-9" />
        </div>
      </header>

      <AnimatePresence mode="wait">
        {phase === 'mission' && savedIsland ? (
          <motion.div
            key="mission"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmotionMission island={savedIsland} onDismiss={() => navigate('/')} />
          </motion.div>
        ) : phase === 'saved' && emotionInfo ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <OrbSaveAnimation
              island={emotionInfo.island}
              emotionInfo={emotionInfo}
              onComplete={handleOrbComplete}
            />
          </motion.div>
        ) : phase === 'analyzing' ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnalyzingAnimation />
          </motion.div>
        ) : phase === 'confirm' && aiResult ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmotionResultCard result={aiResult} onSave={handleSave} />
          </motion.div>
        ) : (
          <motion.div
            key="write"
            className="max-w-lg mx-auto px-4 pt-6 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                오늘 하루 어떠셨나요?
              </label>
              <textarea
                value={diary}
                onChange={(e) => {
                  if (!diaryStarted.current && e.target.value.length > 0) {
                    diaryStarted.current = true;
                    track('diary_started', { char_count: 0 });
                  }
                  setDiary(e.target.value);
                }}
                placeholder="오늘 있었던 일, 느꼈던 감정을 편하게 적어주세요..."
                rows={8}
                className="w-full bg-card border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm leading-relaxed"
                maxLength={1000}
              />
              <p className="text-right text-xs text-muted-foreground">
                {diary.length}/1000
              </p>
            </div>

            <motion.button
              onClick={handleAnalyze}
              className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                diary.trim().length >= 5
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              whileHover={diary.trim().length >= 5 ? { scale: 1.01 } : {}}
              whileTap={diary.trim().length >= 5 ? { scale: 0.99 } : {}}
              disabled={diary.trim().length < 5}
            >
              <Sparkles size={16} />
              AI에게 맡기기
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WritePage;
