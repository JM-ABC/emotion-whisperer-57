import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { loadMemories, getInsights } from '@/lib/memory-store';
import { ISLANDS, type Island } from '@/lib/emotions';
import EmotionCalendar from '@/components/EmotionCalendar';
import { useToast } from '@/hooks/use-toast';
import { track } from '@/hooks/useAmplitude';

type Period = 'daily' | 'weekly' | 'monthly';
type Tab = 'chart' | 'calendar';

const InsightPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [period, setPeriod] = useState<Period>('weekly');
  const [tab, setTab] = useState<Tab>('chart');
  const allMemories = loadMemories();

  const filteredMemories = useMemo(() => {
    const now = new Date();
    return allMemories.filter((m) => {
      const diff = now.getTime() - m.createdAt.getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      if (period === 'daily') return days < 1;
      if (period === 'weekly') return days < 7;
      return days < 30;
    });
  }, [allMemories, period]);

  const insights = getInsights(filteredMemories);
  const maxCount = Math.max(...insights.map(i => i.count), 1);

  const PERIOD_LABELS: Record<Period, string> = {
    daily: '오늘',
    weekly: '이번 주',
    monthly: '이번 달',
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-semibold text-foreground">감정 인사이트</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        {/* Tab selector: Chart vs Calendar */}
        <div className="flex bg-card rounded-xl p-1 border border-border">
           <button
            onClick={() => { setTab('chart'); track('insight_tab_changed', { tab: 'chart' }); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === 'chart' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            📊 분포
          </button>
           <button
            onClick={() => { setTab('calendar'); track('insight_tab_changed', { tab: 'calendar' }); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === 'calendar' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            📅 캘린더
          </button>
        </div>

        {tab === 'calendar' ? (
          /* Calendar Heatmap */
          <div className="bg-card rounded-2xl p-4 border border-border">
            <EmotionCalendar
              memories={allMemories}
              onDayClick={(memory) => {
                const island = ISLANDS.find((i) => i.id === memory.island)!;
                track('memory_detail_viewed', { emotion: memory.emotion, island: memory.island });
                toast({
                  title: `${island.emoji} ${island.label}`,
                  description: memory.content,
                });
              }}
            />
          </div>
        ) : (
          <>
            {/* Period Tabs */}
            <div className="flex bg-card rounded-xl p-1 border border-border">
              {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPeriod(p); track('insight_period_changed', { period: p }); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    period === p
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {PERIOD_LABELS[p]}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-card rounded-2xl p-5 border border-border">
              <p className="text-sm text-muted-foreground mb-1">
                {PERIOD_LABELS[period]} 기록된 기억
              </p>
              <p className="text-3xl font-bold text-foreground">
                {filteredMemories.length}
                <span className="text-sm font-normal text-muted-foreground ml-1">개</span>
              </p>
            </div>

            {/* Island Bars */}
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">섬별 감정 분포</h2>
              {insights.map((insight, idx) => {
                const island = ISLANDS.find(i => i.id === insight.island)!;
                const width = (insight.count / maxCount) * 100;
                return (
                  <motion.div
                    key={insight.island}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <span className="text-lg w-8 text-center">{island.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-secondary-foreground">
                          {island.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {insight.count}회 ({insight.percentage}%)
                        </span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-island-${insight.island}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ delay: idx * 0.05 + 0.2, duration: 0.6 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent memories */}
            {filteredMemories.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">최근 기억</h2>
                {filteredMemories.slice(0, 5).map((memory) => {
                  const island = ISLANDS.find(i => i.id === memory.island)!;
                  return (
                    <motion.div
                      key={memory.id}
                      className="bg-card rounded-xl p-4 border border-border"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">{island.emoji}</span>
                        <span className="text-xs text-muted-foreground">
                          {memory.createdAt.toLocaleDateString('ko-KR', {
                            month: 'short', day: 'numeric', weekday: 'short',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-2">{memory.content}</p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {filteredMemories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🏝️</p>
                <p className="text-sm text-muted-foreground">
                  {PERIOD_LABELS[period]}은 아직 기록된 기억이 없어요
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InsightPage;
