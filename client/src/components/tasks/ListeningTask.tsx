/**
 * Listening Task Component
 * 任务：聆听 - 选择内心声音
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAudioSystem } from '@/lib/audioSystem';
import { playSfx } from '@/lib/bgmSfx';
import { Play, Volume2 } from 'lucide-react';

interface SoundOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode; // 纯色蓝色系图标
  isPositive: boolean;
}

// 银白系图标（继承父级 currentColor）
const HopeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const CourageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 7V12C4 16.55 7.36 20.74 12 22C16.64 20.74 20 16.55 20 12V7L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const PeaceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DoubtIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
  </svg>
);

const FearIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="9" cy="10" rx="3" ry="4" fill="currentColor" opacity="0.4"/>
    <ellipse cx="15" cy="10" rx="3" ry="4" fill="currentColor" opacity="0.4"/>
    <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
    <path d="M6 16L8 18L10 16L12 18L14 16L16 18L18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

// 愤怒 - 火焰图标（激烈而灼热）
// 愤怒 - 火焰图标
const AngerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 23c-1.8 0-3.4-1-4.2-2.6-.2-.4 0-.9.4-1.1.4-.2.9 0 1.1.4.6 1.2 1.8 1.9 3 1.9s2.4-.7 3-1.9c.2-.4.7-.6 1.1-.4.4.2.6.7.4 1.1-.8 1.6-2.4 2.6-4.2 2.6zM12 3C8.5 3 6 6.2 6 9.5c0 2.5 1.5 4.5 3.5 5.5.5.3.6.9.3 1.4-.3.5-.9.6-1.4.3C6.5 14.8 4.5 12.3 4.5 9.5 4.5 5.4 7.8 2 12 2s7.5 3.4 7.5 7.5c0 2.8-2 5.3-4.9 6.2-.5.2-1.1 0-1.4-.3-.3-.5-.2-1.1.3-1.4 2-1 3.5-3 3.5-5.5C18 6.2 15.5 3 12 3z" fill="currentColor"/>
  </svg>
);

const SOUND_OPTIONS: SoundOption[] = [
  // 积极的声音
  { id: 'hope', name: '希望的低语', description: '轻柔而坚定，如晨光初现', icon: <HopeIcon />, isPositive: true },
  { id: 'courage', name: '勇气的回响', description: '深沉有力，如大地震动', icon: <CourageIcon />, isPositive: true },
  { id: 'peace', name: '宁静的呼吸', description: '平缓而深远，如湖面无波', icon: <PeaceIcon />, isPositive: true },
  // 消极的声音
  { id: 'doubt', name: '怀疑的絮语', description: '细碎而反复，如阴云密布', icon: <DoubtIcon />, isPositive: false },
  { id: 'fear', name: '恐惧的嘶鸣', description: '尖锐而急促，如夜风呼啸', icon: <FearIcon />, isPositive: false },
  { id: 'anger', name: '愤怒的咆哮', description: '激烈而灼热，如烈火燃烧', icon: <AngerIcon />, isPositive: false },
];

interface ListeningTaskProps {
  onSoundSelect: (soundId: string) => void;
  onContinue?: () => void;
  selectedSound: string | null;
}

export default function ListeningTask({ onSoundSelect, onContinue, selectedSound }: ListeningTaskProps) {
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [previewingSound, setPreviewingSound] = useState<string | null>(null);
  const audioSystem = getAudioSystem();

  const handlePreview = (soundId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewingSound(soundId);
    audioSystem.playInnerSound(soundId, 1000);
    setTimeout(() => {
      setPreviewingSound(null);
    }, 1000);
  };

  const handleSoundClick = (soundId: string) => {
    playSfx('sfx-choice');
    if (selectedSound === soundId) {
      onSoundSelect('');
    } else {
      onSoundSelect(soundId);
    }
  };

  const handleContinue = () => {
    if (selectedSound) {
      // 继续按钮的处理在父组件中
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto text-center"
    >
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg md:text-xl mb-4"
        style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}
      >
        任务：聆听
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-base md:text-lg italic mb-8 leading-relaxed"
        style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
      >
        "你最常听到的内心声音是怎样的？用直觉选一个。"
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {SOUND_OPTIONS.map((sound) => (
          <motion.button
            key={sound.id}
            onClick={() => handleSoundClick(sound.id)}
            className={`relative p-6 rounded-lg border transition-all ${
              selectedSound === sound.id
                ? 'ring-2 ring-offset-2 ring-[#E0E8F0]'
                : 'hover:scale-105'
            }`}
            style={{
              background: 'rgba(28, 36, 48, 0.48)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderColor: selectedSound === sound.id ? 'rgba(224, 232, 240, 0.75)' : 'rgba(192, 200, 212, 0.4)',
              boxShadow: selectedSound === sound.id
                ? '0 0 20px rgba(224, 232, 240, 0.4), 0 0 40px rgba(200, 210, 225, 0.2)'
                : '0 0 12px rgba(200, 210, 225, 0.15)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center mb-2" style={{ color: '#C8D4E0' }}>
              {sound.icon}
            </div>
            {/* 播放按钮 - 移到下面 */}
            <button
              onClick={(e) => handlePreview(sound.id, e)}
              className="mt-2 mx-auto p-1.5 rounded-full hover:bg-[#E0E8F0]/20 transition-all flex items-center gap-1"
              style={{ color: '#E0E8F0' }}
            >
              <Play className="w-3 h-3" />
              <span className="text-xs">试听</span>
            </button>
          </motion.button>
        ))}
      </div>

      {selectedSound && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <motion.p
            className="mb-4 text-base italic"
            style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8' }}
          >
            "很好。这是你意识的地平线，是我们对话的起点。"
          </motion.p>
          {onContinue && (
            <motion.button
              onClick={onContinue}
              className="px-8 py-3 text-sm transition-all hover:bg-[#8BA4B8]/10"
              style={{
                fontFamily: 'Noto Serif SC, serif',
                color: '#8BA4B8',
                border: '1px solid rgba(139, 164, 184, 0.5)',
              }}
            >
              继续
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
