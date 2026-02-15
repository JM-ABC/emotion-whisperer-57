import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import EmotionPicker from '@/components/EmotionPicker';
import { type Emotion, getEmotionById } from '@/lib/emotions';
import { saveMemory, getTodayMemory } from '@/lib/memory-store';
import { useToast } from '@/hooks/use-toast';

const WritePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const existing = getTodayMemory();
  const [emotion, setEmotion] = useState<Emotion | undefined>(existing?.emotion);
  const [content, setContent] = useState(existing?.content ?? '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!emotion) {
      toast({ title: '감정을 선택해주세요', variant: 'destructive' });
      return;
    }
    if (!content.trim()) {
      toast({ title: '기억을 작성해주세요', variant: 'destructive' });
      return;
    }
    saveMemory(content.trim(), emotion);
    setSaved(true);
    setTimeout(() => navigate('/'), 1500);
  };

  const emotionInfo = emotion ? getEmotionById(emotion) : null;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-semibold text-foreground">
            {existing ? '오늘의 기억 수정' : '오늘의 기억'}
          </h1>
          <div className="w-9" />
        </div>
      </header>

      <AnimatePresence mode="wait">
        {saved ? (
          <motion.div
            key="saved"
            className="flex flex-col items-center justify-center mt-32 px-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Check className="text-primary" size={32} />
            </motion.div>
            <p className="text-lg font-semibold text-foreground">기억이 저장되었어요</p>
            <p className="text-sm text-muted-foreground mt-1">
              {emotionInfo?.emoji} {emotionInfo?.label}의 기억이 섬에 도착했습니다
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className="max-w-lg mx-auto px-4 pt-6 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Emotion Picker */}
            <EmotionPicker onSelect={setEmotion} selected={emotion} />

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                오늘의 핵심 기억
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="오늘 가장 기억에 남는 순간을 적어주세요..."
                rows={5}
                className="w-full bg-card border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm leading-relaxed"
                maxLength={500}
              />
              <p className="text-right text-xs text-muted-foreground">
                {content.length}/500
              </p>
            </div>

            {/* Save */}
            <motion.button
              onClick={handleSave}
              className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all ${
                emotion && content.trim()
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              whileHover={emotion && content.trim() ? { scale: 1.01 } : {}}
              whileTap={emotion && content.trim() ? { scale: 0.99 } : {}}
            >
              기억 저장하기
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WritePage;
