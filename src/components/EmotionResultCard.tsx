import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Edit3 } from 'lucide-react';
import { type Emotion, type Island, getEmotionById, getIslandById } from '@/lib/emotions';
import EmotionPicker from './EmotionPicker';

interface EmotionResult {
  emotion: Emotion;
  island: Island;
  core_memory: string;
  empathy_message: string;
}

interface EmotionResultCardProps {
  result: EmotionResult;
  onSave: (emotion: Emotion, island: Island, coreMemory: string) => void;
}

const ISLAND_COLORS: Record<Island, string> = {
  joy: 'hsl(45, 100%, 60%)',
  peace: 'hsl(200, 80%, 65%)',
  love: 'hsl(340, 80%, 65%)',
  hope: 'hsl(140, 70%, 55%)',
  sadness: 'hsl(220, 60%, 55%)',
  anger: 'hsl(0, 75%, 55%)',
  fear: 'hsl(270, 50%, 55%)',
  fatigue: 'hsl(30, 40%, 50%)',
};

const EmotionResultCard = ({ result, onSave }: EmotionResultCardProps) => {
  const [editing, setEditing] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion>(result.emotion);

  const emotionInfo = getEmotionById(selectedEmotion);
  const islandInfo = getIslandById(emotionInfo.island);
  const color = ISLAND_COLORS[emotionInfo.island];

  const handleSave = () => {
    onSave(selectedEmotion, emotionInfo.island, result.core_memory);
  };

  return (
    <motion.div
      className="max-w-lg mx-auto px-4 pt-6 space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* AI empathy message */}
      <div className="flex items-start gap-2 px-1">
        <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {result.empathy_message}
        </p>
      </div>

      {/* Result card */}
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 space-y-4"
        style={{
          boxShadow: `0 0 30px -10px ${color}40`,
        }}
      >
        {/* Glow accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: color }}
        />

        {/* Island + Emotion */}
        <div className="flex items-center gap-3 pt-1">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ background: `${color}20`, boxShadow: `0 0 15px ${color}30` }}
          >
            {emotionInfo.emoji}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {islandInfo.emoji} {islandInfo.label}
            </p>
            <p className="text-lg font-semibold text-foreground">
              {emotionInfo.label}
            </p>
          </div>
        </div>

        {/* Core memory */}
        <div className="bg-background/50 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">핵심 기억</p>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            "{result.core_memory}"
          </p>
        </div>
      </motion.div>

      {/* Edit toggle */}
      {editing ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <EmotionPicker onSelect={setSelectedEmotion} selected={selectedEmotion} />
        </motion.div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <Edit3 size={14} />
          감정 수정하기
        </button>
      )}

      {/* Save button */}
      <motion.button
        onClick={handleSave}
        className="w-full py-3.5 rounded-xl font-medium text-sm bg-primary text-primary-foreground shadow-lg"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        이대로 저장하기
      </motion.button>
    </motion.div>
  );
};

export default EmotionResultCard;
