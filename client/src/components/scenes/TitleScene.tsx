/**
 * Title Scene — The gateway into the journey
 * Design: Dark Alchemical Manuscript — ancient, ritualistic, foreboding
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import SceneBackground from '../SceneBackground';
import Particles from '../Particles';
import { SCENE_IMAGES } from '@/lib/gameStore';

interface TitleSceneProps {
  onStart: () => void;
  onUnlockAudio?: () => void;
}

export default function TitleScene({ onStart, onUnlockAudio }: TitleSceneProps) {
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const handleUnlockAudio = () => {
    if (audioUnlocked) return;
    onUnlockAudio?.();
    setAudioUnlocked(true);
  };

  return (
    <div className="fixed inset-0" onClick={handleUnlockAudio} role="presentation" style={{ cursor: audioUnlocked ? undefined : 'pointer' }}>
      <SceneBackground imageUrl={SCENE_IMAGES.desert} overlay="rgba(0,0,0,0.7)" />
      <Particles type="sand" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-full w-full px-4 sm:px-6 box-border">
        {/* Alchemical symbol decoration — 小屏缩小以保持居中 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute pointer-events-none w-[min(400px,85vw)] h-[min(400px,85vw)]"
          style={{
            border: '1px solid #C4A35A',
            borderRadius: '50%',
          }}
        >
          <div className="absolute inset-4 border border-[#C4A35A]/30 rounded-full" />
          <div className="absolute inset-8 border border-[#C4A35A]/20 rounded-full" />
          {/* Cross */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#C4A35A]/20" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#C4A35A]/20" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="text-5xl md:text-7xl font-bold tracking-wider mb-4 text-center"
          style={{
            fontFamily: 'Cinzel, serif',
            color: '#C4A35A',
            textShadow: '0 0 40px rgba(196, 163, 90, 0.3)',
          }}
        >
          自性化之旅
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="text-lg md:text-xl tracking-[0.3em] mb-2"
          style={{
            fontFamily: 'Cinzel, serif',
            color: '#C4A35A',
          }}
        >
          INDIVIDUATION JOURNEY
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 0.4, scaleX: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
          className="w-48 h-px my-6"
          style={{ background: 'linear-gradient(90deg, transparent, #C4A35A, transparent)' }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, delay: 2.5 }}
          className="text-sm md:text-base italic max-w-lg text-center leading-relaxed"
          style={{
            fontFamily: 'EB Garamond, serif',
            color: '#d4c5a0',
          }}
        >
          "与其做个好人，不如做一个完整的人。"
          <br />
          <span className="text-xs not-italic opacity-60">—— 卡尔·荣格</span>
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3.5 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(196, 163, 90, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => { e.stopPropagation(); onStart(); }}
          className="mt-12 px-10 py-3 text-sm tracking-[0.2em] uppercase transition-all cursor-pointer relative z-20"
          style={{
            fontFamily: 'Cinzel, serif',
            color: '#C4A35A',
            border: '1px solid rgba(196, 163, 90, 0.4)',
            background: 'rgba(196, 163, 90, 0.08)',
            pointerEvents: 'auto',
          }}
        >
          踏入旅途
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 4 }}
          className="absolute bottom-8 text-xs tracking-widest"
          style={{ fontFamily: 'Cinzel, serif', color: '#C4A35A' }}
        >
          ✦ 基于荣格分析心理学 ✦
        </motion.p>
      </div>
    </div>
  );
}
