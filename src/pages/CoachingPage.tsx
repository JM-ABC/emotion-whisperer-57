import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Sparkles } from 'lucide-react';

const CoachingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-semibold text-foreground">AI 코칭</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-12">
        <motion.div
          className="flex flex-col items-center text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="text-primary-foreground" size={36} />
          </motion.div>

          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              AI 감정 코칭
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              당신의 감정 패턴을 분석하고<br />
              맞춤형 코칭을 제공합니다
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg">💬</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">공감 메시지</p>
                <p className="text-xs text-muted-foreground">당신의 감정에 공감하는 AI 메시지</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">패턴 분석</p>
                <p className="text-xs text-muted-foreground">반복되는 감정 패턴을 발견합니다</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-island-hope/10 flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">액션 팁</p>
                <p className="text-xs text-muted-foreground">감정 관리를 위한 실천 가이드</p>
              </div>
            </div>
          </div>

          <motion.button
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent to-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Lock size={16} />
            Premium으로 잠금 해제
          </motion.button>

          <p className="text-xs text-muted-foreground">
            7일 무료 체험 포함
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CoachingPage;
