import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { type EmotionInsight, ISLANDS } from '@/lib/emotions';

interface PatternReportProps {
  insights: EmotionInsight[];
  totalCount: number;
}

const PatternReport = ({ insights, totalCount }: PatternReportProps) => {
  const sorted = [...insights].sort((a, b) => b.count - a.count);
  const top = sorted[0];
  const topIsland = ISLANDS.find((i) => i.id === top?.island);

  if (totalCount === 0) {
    return (
      <div className="bg-card rounded-2xl p-5 border border-border text-center">
        <p className="text-sm text-muted-foreground">
          아직 기록이 충분하지 않아요. 기억을 쌓으면 패턴을 분석해드릴게요!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-card rounded-2xl p-5 border border-border space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">주간 감정 패턴</h3>
      </div>

      {topIsland && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          이번 주에는 <span className="text-foreground font-medium">{topIsland.emoji} {topIsland.label}</span>의 감정이{' '}
          <span className="text-foreground font-medium">{top.percentage}%</span>로 가장 많았어요.
        </p>
      )}

      {/* Mini bars */}
      <div className="space-y-2">
        {sorted.filter((s) => s.count > 0).slice(0, 4).map((insight) => {
          const island = ISLANDS.find((i) => i.id === insight.island)!;
          return (
            <div key={insight.island} className="flex items-center gap-2">
              <span className="text-sm w-6 text-center">{island.emoji}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `hsl(var(--island-${insight.island}))` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${insight.percentage}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground w-8 text-right">{insight.percentage}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PatternReport;
