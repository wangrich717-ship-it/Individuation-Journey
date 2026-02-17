/**
 * Knowledge Card Panel Component
 * 知识卡片面板组件
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { KNOWLEDGE_CARDS, type KnowledgeCard } from '@/lib/questions';

interface KnowledgeCardPanelProps {
  cardIds: string[];
}

export default function KnowledgeCardPanel({ cardIds }: KnowledgeCardPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<KnowledgeCard | null>(null);

  if (cardIds.length === 0) return null;

  const cards = cardIds
    .map(id => KNOWLEDGE_CARDS[id])
    .filter(Boolean) as KnowledgeCard[];

  return (
    <motion.div
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 max-w-[calc(100vw-1.5rem)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded text-xs transition-all shrink-0"
        style={{
          background: 'rgba(20, 15, 10, 0.85)',
          border: '1px solid rgba(196, 163, 90, 0.3)',
          color: '#C4A35A',
          fontFamily: 'Cinzel, serif',
        }}
      >
        <BookOpen className="w-4 h-4" style={{ color: '#C4A35A' }} />
        <span>知识卡片 ({cards.length})</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-2 w-[min(20rem,calc(100vw-1.5rem))] max-h-96 overflow-y-auto rounded p-4"
            style={{
              background: 'rgba(20, 15, 10, 0.95)',
              border: '1px solid rgba(196, 163, 90, 0.2)',
              boxShadow: '0 0 30px rgba(0,0,0,0.5)',
            }}
          >
            <div className="text-xs uppercase tracking-widest mb-3" style={{ fontFamily: 'Cinzel, serif', color: '#C4A35A' }}>
              知识之书
            </div>
            <div className="flex flex-col gap-2">
              {cards.map((card) => (
                <motion.button
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className="text-left p-2 rounded transition-all hover:bg-[#C4A35A]/10"
                  style={{
                    border: `1px solid ${selectedCard?.id === card.id ? 'rgba(196, 163, 90, 0.5)' : 'rgba(196, 163, 90, 0.2)'}`,
                  }}
                >
                  <div className="text-sm font-semibold mb-1" style={{ color: '#C4A35A', fontFamily: 'Cinzel, serif' }}>
                    {card.title}
                  </div>
                  <div className="text-xs" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                    {card.definition}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 卡片详情弹窗 */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-lg w-full rounded p-6"
              style={{
                background: 'rgba(20, 15, 10, 0.95)',
                border: '1px solid rgba(196, 163, 90, 0.3)',
                boxShadow: '0 0 60px rgba(196, 163, 90, 0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#C4A35A' }}>
                {selectedCard.title}
              </h3>
              <div className="text-xs mb-4 italic" style={{ color: '#d4c5a0', fontFamily: 'EB Garamond, serif' }}>
                {selectedCard.definition}
              </div>
              <div className="text-sm mb-4 leading-relaxed" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                {selectedCard.content}
              </div>
              <div className="pt-4 border-t" style={{ borderColor: 'rgba(196, 163, 90, 0.2)' }}>
                <p className="text-sm italic" style={{ color: '#FFD700', fontFamily: 'EB Garamond, serif' }}>
                  "{selectedCard.jungQuote}"
                </p>
                <p className="text-xs mt-2" style={{ color: '#C4A35A', fontFamily: 'Cinzel, serif' }}>
                  —— 卡尔·荣格
                </p>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="mt-4 px-4 py-2 text-xs transition-all hover:bg-[#C4A35A]/10"
                style={{
                  fontFamily: 'Noto Serif SC, serif',
                  color: '#C4A35A',
                  border: '1px solid rgba(196, 163, 90, 0.3)',
                }}
              >
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
