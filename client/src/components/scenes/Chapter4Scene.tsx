/**
 * Chapter 4 — 自性化
 * Design: Dark Alchemical Manuscript — 祭坛之后的自性化确认，进入终章
 */
import { motion } from 'framer-motion';
import SceneBackground from '../SceneBackground';
import Particles from '../Particles';
import { SCENE_IMAGES } from '@/lib/gameStore';

interface Chapter4SceneProps {
  onComplete: () => void;
}

export default function Chapter4Scene({ onComplete }: Chapter4SceneProps) {
  return (
    <div className="fixed inset-0">
      <SceneBackground imageUrl={SCENE_IMAGES.alchemy} overlay="rgba(0,0,0,0.55)" />
      <Particles type="mist" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-full w-full px-4 sm:px-6 box-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-lg"
        >
          <h2
            className="text-2xl md:text-3xl font-semibold mb-6"
            style={{ fontFamily: 'Cinzel, serif', color: '#C4A35A' }}
          >
            第四章 · 自性化
          </h2>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
          >
            灵魂的碎片已归于祭坛。面具、意象、阴影、声音与纹章，在此合而为一。你不再只是其中的某一面——你是那面镜子，也是镜中的全部。
          </p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={onComplete}
            className="px-8 py-3 rounded border text-sm transition-all hover:bg-amber-900/30"
            style={{
              fontFamily: 'Cinzel, serif',
              color: '#C4A35A',
              borderColor: 'rgba(196,163,90,0.7)',
            }}
          >
            进入终章
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
