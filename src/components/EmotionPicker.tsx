import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ISLANDS, EMOTIONS, type Island, type Emotion, type EmotionInfo } from '@/lib/emotions';

interface EmotionPickerProps {
  onSelect: (emotion: Emotion) => void;
  selected?: Emotion;
}

const EmotionPicker = ({ onSelect, selected }: EmotionPickerProps) => {
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);

  const handleIslandClick = (island: Island) => {
    setSelectedIsland(island === selectedIsland ? null : island);
  };

  const handleEmotionClick = (emotion: Emotion) => {
    onSelect(emotion);
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Island Selection */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">
          {selectedIsland ? '감정을 선택하세요' : '어떤 섬의 감정인가요?'}
        </p>
        <div className="grid grid-cols-4 gap-3">
          {ISLANDS.map((island) => (
            <motion.button
              key={island.id}
              onClick={() => handleIslandClick(island.id)}
              className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                selectedIsland === island.id
                  ? `border-island-${island.id} bg-island-${island.id}/10`
                  : 'border-border bg-card hover:border-muted-foreground/30'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-xl">{island.emoji}</span>
              <span className="text-[11px] font-medium text-secondary-foreground">
                {island.label.replace('의 섬', '')}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Step 2: Emotion Selection */}
      <AnimatePresence>
        {selectedIsland && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-3">
              {ISLANDS.find(i => i.id === selectedIsland)?.emotions.map((emotion) => (
                <motion.button
                  key={emotion.id}
                  onClick={() => handleEmotionClick(emotion.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    selected === emotion.id
                      ? `border-island-${emotion.island} bg-island-${emotion.island}/15`
                      : 'border-border bg-card hover:border-muted-foreground/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-2xl">{emotion.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{emotion.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmotionPicker;
