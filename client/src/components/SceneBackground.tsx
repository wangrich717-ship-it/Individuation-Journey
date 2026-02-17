/**
 * Scene Background Component
 * Design: Dark Alchemical Manuscript — immersive full-screen backgrounds with overlay
 */
import { motion, AnimatePresence } from 'framer-motion';

interface SceneBackgroundProps {
  imageUrl: string;
  overlay?: string;
  children?: React.ReactNode;
}

export default function SceneBackground({ imageUrl, overlay = 'rgba(0,0,0,0.55)', children }: SceneBackgroundProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={imageUrl}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: overlay }}
        />
        {/* Vignette effect */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
