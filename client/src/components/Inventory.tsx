/**
 * Inventory Display Component
 * Design: Dark Alchemical Manuscript — items glow with inner light
 * Click item to view name + description in a modal.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconCompass, IconEmblem } from './ItemIcons';

const ITEM_INFO: Record<string, { icon: string; desc: string; color: string }> = {
  '人格面具': { icon: '🎭', desc: '你剥下的面具', color: '#C4A35A' },
  '遗失的罗盘': { icon: '🧭', desc: '指向内在方向的三象罗盘', color: '#8BA4B8' },
  '三种原力': { icon: '◇', desc: '共鸣、对立与调和的三角之力', color: '#C4A35A' },
  '灵魂之乐': { icon: '♪', desc: '理性是工具，灵魂是向导', color: '#FFD700' },
  '纹章印记': { icon: '🔮', desc: '你与内在声音的回响空间', color: '#8BA4B8' },
  // 兼容旧存档
  '赤裸的灵魂': { icon: '🎭', desc: '你剥下的面具（旧）', color: '#C4A35A' },
  '阴影之石': { icon: '🪨', desc: '它很重，但它是你的一部分', color: '#4A4A4A' },
  '金色羽毛': { icon: '🪶', desc: '直觉的馈赠', color: '#FFD700' },
  '曼陀罗花': { icon: '🌸', desc: '对立面的统一之花', color: '#FF69B4' },
  '共鸣纹章': { icon: '🔮', desc: '你与内在声音的回响空间', color: '#8BA4B8' },
};

export default function Inventory({ items }: { items: string[] }) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <motion.div
        className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex flex-col items-end gap-2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 收起时：只显示「道具」按钮 + 数量；小屏缩小避免与内容重叠 */}
        <motion.button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded border cursor-pointer hover:brightness-110 transition-[filter]"
          style={{
            background: 'rgba(20, 15, 10, 0.85)',
            borderColor: 'rgba(196, 163, 90, 0.5)',
            boxShadow: '0 0 12px rgba(196, 163, 90, 0.2)',
          }}
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-widest" style={{ fontFamily: 'Cinzel, serif', color: '#C4A35A' }}>
            道具
          </span>
          <span className="text-[9px] sm:text-[10px] min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] flex items-center justify-center rounded-full bg-amber-900/60 text-amber-200" style={{ fontFamily: 'Cinzel, serif' }}>
            {items.length}
          </span>
        </motion.button>

        {/* 展开时：显示完整列表 */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-2 overflow-hidden"
            >
              {items.map((item) => {
                const info = ITEM_INFO[item] || { icon: '✦', desc: item, color: '#C4A35A' };
                return (
                  <motion.button
                    key={item}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="group relative flex items-center gap-2 px-3 py-2 rounded border text-left cursor-pointer hover:brightness-110 transition-[filter] w-full"
                    style={{
                      background: 'rgba(20, 15, 10, 0.85)',
                      borderColor: info.color + '40',
                      boxShadow: `0 0 12px ${info.color}20`,
                    }}
                  >
                    {item === '遗失的罗盘' ? (
                      <IconCompass className="w-5 h-5 flex-shrink-0" color={info.color} />
                    ) : item === '纹章印记' ? (
                      <IconEmblem className="w-5 h-5 flex-shrink-0" color={info.color} />
                    ) : (
                      <span className="text-lg">{info.icon}</span>
                    )}
                    <span className="text-xs" style={{ color: info.color, fontFamily: 'Noto Serif SC, serif' }}>
                      {item}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedItem && (() => {
          const info = ITEM_INFO[selectedItem] || { icon: '✦', desc: selectedItem, color: '#C4A35A' };
          return (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] flex items-center justify-center p-4"
              onClick={() => setSelectedItem(null)}
            >
              <div
                className="absolute inset-0 bg-black/60"
                aria-hidden
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="relative rounded-lg border p-6 max-w-sm w-full shadow-xl"
                style={{
                  background: 'rgba(20, 15, 10, 0.95)',
                  borderColor: info.color + '50',
                  boxShadow: `0 0 32px ${info.color}25`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-3">
                  {selectedItem === '遗失的罗盘' ? (
                    <IconCompass className="w-8 h-8 flex-shrink-0" color={info.color} />
                  ) : selectedItem === '纹章印记' ? (
                    <IconEmblem className="w-8 h-8 flex-shrink-0" color={info.color} />
                  ) : (
                    <span className="text-2xl">{info.icon}</span>
                  )}
                  <h3 className="text-lg font-medium" style={{ color: info.color, fontFamily: 'Noto Serif SC, serif' }}>
                    {selectedItem}
                  </h3>
                </div>
                <p className="text-sm text-[#d4c5a0] leading-relaxed" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                  {info.desc}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="mt-4 w-full py-2 text-xs rounded border transition-colors"
                  style={{
                    borderColor: info.color + '50',
                    color: info.color,
                    fontFamily: 'Cinzel, serif',
                  }}
                >
                  关闭
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
