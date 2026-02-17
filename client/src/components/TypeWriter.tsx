/**
 * TypeWriter Component
 * Design: Dark Alchemical Manuscript — text appears as if written by invisible ink
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playSfx } from '@/lib/bgmSfx';

interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

export default function TypeWriter({ text, speed = 60, delay = 0, className = '', style, onComplete }: TypeWriterProps) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setStarted(false);
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [text, delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => {
      const nextLen = displayed.length + 1;
      setDisplayed(text.slice(0, nextLen));
      // 打字音效：每 2 字触发一次，避免过于密集
      if (nextLen % 2 === 0) playSfx('sfx-typing');
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, started, text, speed, onComplete]);

  return (
    <motion.p
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayed}
      {displayed.length < text.length && started && (
        <span className="animate-flicker inline-block ml-0.5 w-0.5 h-5 bg-current align-middle" />
      )}
    </motion.p>
  );
}
