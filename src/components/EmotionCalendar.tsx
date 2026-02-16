import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { type CoreMemory, getEmotionById, ISLANDS } from '@/lib/emotions';

interface EmotionCalendarProps {
  memories: CoreMemory[];
  onDayClick?: (memory: CoreMemory) => void;
}

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

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const EmotionCalendar = ({ memories, onDayClick }: EmotionCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedMemory, setSelectedMemory] = useState<CoreMemory | null>(null);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const memoryMap = useMemo(() => {
    const map = new Map<string, CoreMemory>();
    memories.forEach((m) => {
      map.set(m.createdAt.toDateString(), m);
    });
    return map;
  }, [memories]);

  const handleDayClick = (day: Date) => {
    const memory = memoryMap.get(day.toDateString());
    if (memory) {
      setSelectedMemory(memory);
      onDayClick?.(memory);
    }
  };

  return (
    <div className="space-y-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="text-sm font-semibold text-foreground">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const memory = memoryMap.get(day.toDateString());
          const inMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedMemory && isSameDay(day, selectedMemory.createdAt);

          return (
            <motion.button
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors ${
                !inMonth ? 'opacity-20' : ''
              } ${isSelected ? 'ring-1 ring-primary' : ''} ${
                isToday ? 'bg-card' : ''
              }`}
              whileTap={memory ? { scale: 0.9 } : {}}
            >
              <span className={`${memory ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {format(day, 'd')}
              </span>
              {memory && (
                <motion.div
                  className="w-2.5 h-2.5 rounded-full mt-0.5"
                  style={{ background: `hsl(${ISLAND_HSL[memory.island]})` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  layoutId={`dot-${day.toDateString()}`}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected memory detail */}
      <AnimatePresence mode="wait">
        {selectedMemory && (
          <motion.div
            key={selectedMemory.id}
            className="bg-card rounded-xl p-4 border border-border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: `hsl(${ISLAND_HSL[selectedMemory.island]})` }}
              />
              <span className="text-xs text-muted-foreground">
                {format(selectedMemory.createdAt, 'M월 d일 (EEEE)', { locale: ko })}
              </span>
              <span className="text-sm">
                {getEmotionById(selectedMemory.emotion).emoji}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {selectedMemory.content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center pt-2">
        {ISLANDS.map((island) => (
          <div key={island.id} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: `hsl(${ISLAND_HSL[island.id]})` }}
            />
            <span className="text-[10px] text-muted-foreground">{island.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionCalendar;
