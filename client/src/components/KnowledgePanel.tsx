/**
 * Knowledge Panel Component
 * Design: Dark Alchemical Manuscript — wisdom revealed as golden inscriptions
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function KnowledgePanel({ knowledge }: { knowledge: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (knowledge.length === 0) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded text-xs transition-all"
        style={{
          background: 'rgba(20, 15, 10, 0.85)',
          border: '1px solid rgba(196, 163, 90, 0.3)',
          color: '#C4A35A',
          fontFamily: 'Cinzel, serif',
        }}
      >
        <span>✦</span>
        <span>领悟 ({knowledge.length})</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-2 w-72 rounded p-4"
            style={{
              background: 'rgba(20, 15, 10, 0.95)',
              border: '1px solid rgba(196, 163, 90, 0.2)',
              boxShadow: '0 0 30px rgba(0,0,0,0.5)',
            }}
          >
            <div className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: 'Cinzel, serif', color: '#C4A35A' }}>
              领悟之书
            </div>
            <div className="flex flex-col gap-3">
              {knowledge.map((k, i) => (
                <div key={i} className="text-sm leading-relaxed" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                  <span style={{ color: '#C4A35A' }}>「</span>
                  {k}
                  <span style={{ color: '#C4A35A' }}>」</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
