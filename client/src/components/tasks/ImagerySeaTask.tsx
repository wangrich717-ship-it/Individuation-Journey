/**
 * Imagery Sea Task Component
 * 第一阶段：漫游意象之海
 */
import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGERY_SYMBOLS, type ImagerySymbol } from '@/lib/imageryData';
import ImageryIcon from './ImageryIcon';
import { playSfx } from '@/lib/bgmSfx';

/** 意象名称 → 弹窗图片路径（对应 client/public/imagery/ 下的 名称.webp，由 意象之海 文件夹复制） */
function getImageryImageSrc(symbolName: string): string {
  return `/imagery/${encodeURIComponent(symbolName)}.webp`;
}

interface ImagerySeaTaskProps {
  onExplored: (exploredCount: number) => void;
  onContinue: () => void;
}

export default function ImagerySeaTask({ onExplored, onContinue }: ImagerySeaTaskProps) {
  const [exploredSymbols, setExploredSymbols] = useState<Set<string>>(new Set());
  const [selectedSymbol, setSelectedSymbol] = useState<ImagerySymbol | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [imageryImageError, setImageryImageError] = useState(false);

  const handleSymbolClick = (symbol: ImagerySymbol) => {
    playSfx('sfx-choice');
    setImageryImageError(false);
    if (exploredSymbols.has(symbol.id)) {
      // 重新查看已探索的符号
      setSelectedSymbol(symbol);
      setShowDescription(true);
    } else {
      // 首次探索
      const newExplored = new Set(exploredSymbols);
      newExplored.add(symbol.id);
      setExploredSymbols(newExplored);
      setSelectedSymbol(symbol);
      setShowDescription(true);
      onExplored(newExplored.size);
    }
  };

  const handleCloseDescription = () => {
    setShowDescription(false);
    setImageryImageError(false);
    setTimeout(() => setSelectedSymbol(null), 300);
  };

  const canContinue = exploredSymbols.size >= 3;

  // 小屏自适应：测量容器宽度，对 460px 的意象圈做整体缩放
  const clusterRef = useRef<HTMLDivElement>(null);
  const [clusterScale, setClusterScale] = useState(1);
  useEffect(() => {
    const el = clusterRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      setClusterScale(w < 460 ? Math.max(0.5, w / 460) : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 固定布局：中心 4 个（内圈），外围 8 个（外圈）；小圈/大圈缩小以免超出屏幕
  const LAYOUT = useMemo(() => {
    const center = 230; // 与 460 容器居中
    const ballHalf = 39; // 单个意象圆直径 78px
    const innerR = 72;  // 内圈半径（围成的小圈）
    const outerR = 180; // 外圈半径（围成的大圈，避免重叠）
    const positions: { left: number; top: number; floatX: number[]; floatY: number[]; duration: number }[] = [];
    // 内圈 4 个
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
      positions.push({
        left: center + innerR * Math.cos(angle) - ballHalf,
        top: center + innerR * Math.sin(angle) - ballHalf,
        floatX: [0, 5, -4, 0],
        floatY: [0, -4, 3, 0],
        duration: 11 + i * 0.6,
      });
    }
    // 外圈 8 个
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      positions.push({
        left: center + outerR * Math.cos(angle) - ballHalf,
        top: center + outerR * Math.sin(angle) - ballHalf,
        floatX: [0, 4, -5, 0],
        floatY: [0, 3, -4, 0],
        duration: 13 + i * 0.4,
      });
    }
    return positions;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="max-w-6xl mx-auto text-center relative px-4 sm:px-6"
      style={{ minHeight: '80vh' }}
    >
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4"
        style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}
      >
        第一阶段：漫游意象之海
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.2 }}
        className="text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto"
        style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
      >
        你到达了心灵的意象之海。这里沉睡着来自集体无意识的古老符号。它们并非谜语，而是心灵的母语。让我们先漫游，去感受那些与你灵魂共振的意象。
      </motion.p>

      {/* 探索进度提示 */}
      {exploredSymbols.size > 0 && exploredSymbols.size < 3 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs mb-4 sm:mb-6"
          style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8' }}
        >
          已探索 {exploredSymbols.size}/3 个意象
        </motion.p>
      )}

      {/* 意象符号 - 固定布局：内圈 4 个，外圈 8 个；小屏时整体缩放，包裹层用缩放后尺寸保证居中 */}
      <div
        ref={clusterRef}
        className="flex justify-center items-center overflow-visible w-full mx-auto"
        style={{ minHeight: 'min(460px, 85vmin)', maxWidth: 460 }}
      >
        <div
          className="flex justify-center items-center overflow-visible"
          style={{ width: 460 * clusterScale, height: 460 * clusterScale }}
        >
          <div
            className="relative overflow-visible"
            style={{
              width: 460,
              height: 460,
              transform: `scale(${clusterScale})`,
              transformOrigin: 'top left',
            }}
          >
          {(!IMAGERY_SYMBOLS || IMAGERY_SYMBOLS.length === 0) ? (
            <p className="text-sm" style={{ color: '#8BA4B8' }}>加载意象中…</p>
          ) : null}
          {IMAGERY_SYMBOLS.map((symbol, index) => {
            const layout = LAYOUT[index];
            if (!layout) return null;
            const isExplored = exploredSymbols.has(symbol.id);
            return (
              <motion.button
                key={symbol.id}
                initial={{ opacity: 0.6, scale: 0.6 }}
                animate={{
                  opacity: isExplored ? 1 : 0.9,
                  scale: 1,
                  x: layout.floatX,
                  y: layout.floatY,
                }}
                transition={{
                  delay: index * 0.06,
                  opacity: { duration: 0.15 },
                  scale: { duration: 0.2 },
                  x: {
                    duration: layout.duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                  y: {
                    duration: layout.duration * 1.1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                onClick={() => handleSymbolClick(symbol)}
                className="absolute transition-all cursor-pointer flex items-center justify-center"
                style={{
                  left: layout.left,
                  top: layout.top,
                  width: 78,
                  height: 78,
                  borderRadius: '50%',
                  background: isExplored
                    ? `radial-gradient(circle at 35% 35%, ${symbol.color}dd, ${symbol.color}66)`
                    : `radial-gradient(circle at 35% 35%, ${symbol.color}99, ${symbol.color}44)`,
                  border: `2px solid ${symbol.color}${isExplored ? 'ee' : '88'}`,
                  boxShadow: isExplored
                    ? `0 0 24px ${symbol.color}99, 0 0 48px ${symbol.color}55, inset 0 0 16px ${symbol.color}33`
                    : `0 0 12px ${symbol.color}66, 0 0 24px ${symbol.color}44, inset 0 0 8px ${symbol.color}22`,
                  filter: isExplored ? 'brightness(1.2) saturate(1.05)' : 'brightness(1) saturate(1)',
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: `0 0 28px ${symbol.color}cc, 0 0 56px ${symbol.color}88`,
                  filter: 'brightness(1.25) saturate(1.1)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <ImageryIcon symbol={symbol} size={31} />
              </motion.button>
            );
          })}
          </div>
        </div>
      </div>

      {/* 符号描述弹窗 */}
      <AnimatePresence>
        {showDescription && selectedSymbol && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={handleCloseDescription}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full p-5 sm:p-8 rounded-lg max-h-[90vh] overflow-y-auto"
              style={{
                background: 'rgba(18, 22, 28, 0.96)',
                border: '1px solid rgba(139, 164, 184, 0.4)',
                boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
              }}
            >
              <h4 className="text-lg mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}>
                {selectedSymbol.name}
              </h4>
              {!imageryImageError && (
                <div className="flex justify-center mb-4 sm:mb-6">
                  <img
                    src={getImageryImageSrc(selectedSymbol.name)}
                    alt={selectedSymbol.name}
                    className="max-h-36 sm:max-h-48 w-auto object-contain rounded"
                    style={{ maxWidth: '100%' }}
                    onError={() => setImageryImageError(true)}
                  />
                </div>
              )}
              <p className="text-sm italic mb-6 leading-relaxed" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
                {selectedSymbol.atmosphere}
              </p>

              <p className="text-sm mb-6 leading-relaxed" style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8' }}>
                {selectedSymbol.question}
              </p>

              <button
                onClick={handleCloseDescription}
                className="px-6 py-2 text-sm rounded-lg border transition-all hover:bg-[#8BA4B8]/10"
                style={{
                  fontFamily: 'Noto Serif SC, serif',
                  color: '#8BA4B8',
                  borderColor: 'rgba(139, 164, 184, 0.5)',
                }}
              >
                继续探索
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 继续按钮 */}
      {canContinue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 sm:mt-8"
        >
          <motion.p
            className="text-xs sm:text-sm italic mb-3 sm:mb-4 px-2"
            style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8' }}
          >
            "在漫游之后，有些意象的微光似乎更执着地为你停留。"
          </motion.p>
          <motion.button
            onClick={onContinue}
            className="px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm rounded-lg border transition-all hover:bg-[#8BA4B8]/10"
            style={{
              fontFamily: 'Noto Serif SC, serif',
              color: '#8BA4B8',
              borderColor: 'rgba(139, 164, 184, 0.5)',
            }}
          >
            继续
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
