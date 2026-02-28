import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import CoachingPersonaSelector, { type Persona, PERSONAS } from '@/components/CoachingPersonaSelector';
import PatternReport from '@/components/PatternReport';
import { loadMemories, getInsights } from '@/lib/memory-store';
import { ISLANDS } from '@/lib/emotions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { track, identify } from '@/hooks/useAmplitude';
import { recordCoachingSession } from '@/lib/user-stats';

interface CoachingResult {
  coaching_message: string;
  pattern_insight: string;
  action_tip: string;
}

const CoachingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoachingResult | null>(null);

  useEffect(() => {
    track('page_viewed', { page_name: 'coaching' });
  }, []);

  const memories = loadMemories();
  const weekMemories = useMemo(() => {
    const now = new Date();
    return memories.filter((m) => {
      const diff = now.getTime() - m.createdAt.getTime();
      return diff / (1000 * 60 * 60 * 24) < 7;
    });
  }, [memories]);

  const insights = getInsights(weekMemories);
  const sorted = [...insights].sort((a, b) => b.count - a.count);
  const topIsland = sorted[0];
  const topIslandInfo = ISLANDS.find((i) => i.id === topIsland?.island);

  const patternSummary = sorted
    .filter((s) => s.count > 0)
    .map((s) => {
      const island = ISLANDS.find((i) => i.id === s.island)!;
      return `${island.label}: ${s.percentage}% (${s.count}회)`;
    })
    .join(', ');

  const handleCoach = async (selectedPersona: Persona) => {
    track('coaching_persona_selected', { persona: selectedPersona });
    setPersona(selectedPersona);
    setLoading(true);
    setResult(null);

    try {
      const recentMemories = weekMemories.slice(0, 5).map((m) => ({
        emotion: m.emotion,
        content: m.content,
      }));

      const { data, error } = await supabase.functions.invoke('ai-coaching', {
        body: {
          persona: selectedPersona,
          memories: recentMemories,
          patternSummary: patternSummary || '아직 기록된 감정 데이터가 없습니다.',
        },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      setResult(data as CoachingResult);
      track('coaching_completed', { persona: selectedPersona, has_pattern_data: patternSummary.length > 0 });

      // Update coaching user properties
      const stats = recordCoachingSession(selectedPersona);
      identify({
        preferred_persona: stats.preferred_persona,
        total_coaching_sessions: stats.total_coaching_sessions,
      });
    } catch (e: any) {
      console.error('Coaching failed:', e);
      track('error_occurred', { error_type: 'coaching', error_message: e.message || 'unknown' });
      toast({
        title: '코칭을 불러오지 못했어요',
        description: e.message || '다시 시도해주세요',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const PERSONA_COLORS: Record<Persona, string> = {
    joy: 'var(--island-joy)',
    sadness: 'var(--island-sadness)',
    anger: 'var(--island-anger)',
    fear: 'var(--island-fear)',
    disgust: 'var(--island-peace)',
  };

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Color overlay */}
      <AnimatePresence>
        {persona && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: `radial-gradient(ellipse at 50% 30%, hsl(${PERSONA_COLORS[persona]}), transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-semibold text-foreground">AI 코칭</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6 relative z-10">
        {/* Pattern Report */}
        <PatternReport insights={insights} totalCount={weekMemories.length} />

        {/* Persona Selection */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">코칭 캐릭터 선택</h2>
          <CoachingPersonaSelector selected={persona} onSelect={handleCoach} />
        </div>

        {/* Loading */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              className="flex flex-col items-center gap-3 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {persona && (
                <img
                  src={PERSONAS.find(p => p.id === persona)?.image}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover animate-pulse"
                />
              )}
              <Loader2 size={24} className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {persona === 'joy' ? '기쁨이' : persona === 'sadness' ? '슬픔이' : persona === 'anger' ? '버럭이' : persona === 'fear' ? '소심이' : '까칠이'}가 생각하고 있어요...
              </p>
            </motion.div>
          )}

          {/* Result */}
          {result && !loading && (
            <motion.div
              key="result"
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Coaching message */}
              <div className="bg-card rounded-2xl p-5 border border-border space-y-3">
                <div className="flex items-center gap-2">
                  {persona && (
                    <img
                      src={PERSONAS.find(p => p.id === persona)?.image}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <MessageCircle size={16} className="text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">코칭 메시지</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {result.coaching_message}
                </p>
              </div>

              {/* Pattern insight */}
              <div className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📊</span>
                  <span className="text-xs font-medium text-muted-foreground">패턴 인사이트</span>
                </div>
                <p className="text-sm text-foreground">{result.pattern_insight}</p>
              </div>

              {/* Action tip */}
              <div className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎯</span>
                  <span className="text-xs font-medium text-muted-foreground">오늘의 액션 팁</span>
                </div>
                <p className="text-sm text-foreground">{result.action_tip}</p>
              </div>

              {/* Retry button */}
              <motion.button
                onClick={() => { if (persona) { track('coaching_retried', { persona }); handleCoach(persona); } }}
                className="w-full py-3 rounded-xl bg-card border border-border text-foreground text-sm font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Sparkles size={14} />
                다시 코칭 받기
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!persona && !loading && !result && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-3xl mb-3">🧠</p>
            <p className="text-sm text-muted-foreground">
              위에서 코칭 캐릭터를 선택하면<br />
              맞춤형 감정 코칭이 시작됩니다
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoachingPage;
