import { motion } from 'framer-motion';
import joyImg from '@/assets/characters/joy.png';
import sadnessImg from '@/assets/characters/sadness.png';
import angerImg from '@/assets/characters/anger.png';
import fearImg from '@/assets/characters/fear.png';
import disgustImg from '@/assets/characters/disgust.png';

export type Persona = 'joy' | 'sadness' | 'anger' | 'fear' | 'disgust';

interface PersonaInfo {
  id: Persona;
  label: string;
  image: string;
  description: string;
  color: string;
}

const PERSONAS: PersonaInfo[] = [
  { id: 'joy', label: '기쁨이', image: joyImg, description: '밝고 에너지 넘치는 격려', color: 'var(--island-joy)' },
  { id: 'sadness', label: '슬픔이', image: sadnessImg, description: '조용하고 깊은 공감', color: 'var(--island-sadness)' },
  { id: 'anger', label: '버럭이', image: angerImg, description: '직설적이고 솔직한 조언', color: 'var(--island-anger)' },
  { id: 'fear', label: '소심이', image: fearImg, description: '조심스럽고 신중한 분석', color: 'var(--island-fear)' },
  { id: 'disgust', label: '까칠이', image: disgustImg, description: '냉철하고 날카로운 피드백', color: 'var(--island-peace)' },
];

interface CoachingPersonaSelectorProps {
  selected: Persona | null;
  onSelect: (persona: Persona) => void;
}

const CoachingPersonaSelector = ({ selected, onSelect }: CoachingPersonaSelectorProps) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {PERSONAS.map((p, idx) => {
        const isActive = selected === p.id;
        return (
          <motion.button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
              isActive
                ? 'border-primary bg-card shadow-md'
                : 'border-border bg-card/50 hover:bg-card'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={p.image}
              alt={p.label}
              className={`w-12 h-12 rounded-full object-cover transition-all ${
                isActive ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
            />
            <span className={`text-[10px] font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
              {p.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export { PERSONAS };
export default CoachingPersonaSelector;
