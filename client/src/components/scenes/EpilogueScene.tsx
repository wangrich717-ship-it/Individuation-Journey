/**
 * Epilogue Scene — The Self + 知识卡片 2D 水平轮播
 * Design: 页面中心水平轮播，卡片始终正向、等宽，左右滑动旁边移入居中，点击放大
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneBackground from '../SceneBackground';
import Particles from '../Particles';
import TypeWriter from '../TypeWriter';
import { SCENE_IMAGES } from '@/lib/gameStore';
import { KNOWLEDGE_CARDS, type KnowledgeCard } from '@/lib/questions';

interface EpilogueSceneProps {
  inventory: string[];
  knowledge: string[];
  knowledgeCards: string[];
  shadowName: string;
  shadowNames?: string[];
  emotionName?: string;
  onRestart: () => void;
}

const CARD_WIDTH = 168;
const CARD_HEIGHT = 200;
const CARD_GAP = 20;
const VISIBLE_COUNT = 3;
const VIEWPORT_WIDTH = VISIBLE_COUNT * CARD_WIDTH + (VISIBLE_COUNT - 1) * CARD_GAP;
const AUTO_SCROLL_INTERVAL_MS = 1500;

/** Banner 轮播：默认显示 3 张，1.5s 自动从右往左依次滚动，无缝循环，支持左右拖拽，点击卡片放大 */
function KnowledgeCardsCarousel({ cardIds, onCardClick }: { cardIds: string[]; onCardClick: (card: KnowledgeCard) => void }) {
  const cards = cardIds
    .map((id) => KNOWLEDGE_CARDS[id])
    .filter(Boolean) as KnowledgeCard[];
  const n = cards.length;
  const useLoop = n > VISIBLE_COUNT;
  const strip = useLoop ? [...cards, cards[0], cards[1], cards[2]] : cards;
  const stripLen = strip.length;

  const [startIndex, setStartIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [transitionDisabled, setTransitionDisabled] = useState(false);
  const dragRef = useRef({ startX: 0, didMove: false, cardIndex: null as number | null, isDown: false });
  const ignoreClickRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState(VIEWPORT_WIDTH);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setViewportWidth(el.offsetWidth || VIEWPORT_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const step = CARD_WIDTH + CARD_GAP;
  const maxStart = Math.max(0, n - VISIBLE_COUNT);
  const loopEndIndex = useLoop ? n : maxStart;
  const centerStripIndex = startIndex + 1;
  const centerOffset = viewportWidth > 0 ? viewportWidth / 2 - (step + CARD_WIDTH / 2) : 0;
  const translateX = -startIndex * step - dragX + centerOffset;

  useEffect(() => {
    if (!useLoop) return;
    const id = setInterval(() => {
      setStartIndex((i) => {
        if (i >= loopEndIndex) {
          setTransitionDisabled(true);
          ignoreClickRef.current = Date.now() + 120;
          return 0;
        }
        return i + 1;
      });
    }, AUTO_SCROLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [useLoop, loopEndIndex]);

  useEffect(() => {
    if (!transitionDisabled) return;
    const id = requestAnimationFrame(() => setTransitionDisabled(false));
    return () => cancelAnimationFrame(id);
  }, [transitionDisabled]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    const cardEl = target.closest('[data-card-index]');
    dragRef.current = {
      startX: e.clientX,
      didMove: false,
      cardIndex: cardEl ? parseInt(cardEl.getAttribute('data-card-index')!, 10) : null,
      isDown: true,
    };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.isDown) return;
    const delta = e.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 6) dragRef.current.didMove = true;
    setDragX(delta);
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const dx = dragX;
    const { didMove, cardIndex, isDown: wasDown } = dragRef.current;
    dragRef.current.isDown = false;
    setDragX(0);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (wasDown && !didMove && cardIndex != null && cardIndex >= 0 && cardIndex < n) {
      if (Date.now() < ignoreClickRef.current) return;
      onCardClick(cards[cardIndex]);
      return;
    }
    if (!didMove) return;
    if (dx > 35 && startIndex < maxStart) setStartIndex((i) => i + 1);
    else if (dx < -35 && startIndex > 0) setStartIndex((i) => i - 1);
  }, [dragX, startIndex, maxStart, n, cards, onCardClick]);

  const logicalCardIndex = (stripIndex: number) => (stripIndex < n ? stripIndex : stripIndex - n);

  if (cards.length === 0) {
    return <div className="min-h-[240px] w-full" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full flex flex-col items-center justify-center my-6 px-2"
    >
      <div
        ref={viewportRef}
        className="relative overflow-hidden select-none touch-none mx-auto"
        style={{
          width: VIEWPORT_WIDTH,
          maxWidth: '100%',
          height: Math.ceil(CARD_HEIGHT * 1.12) + 16,
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 48px, black calc(100% - 48px), transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 48px, black calc(100% - 48px), transparent 100%)',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className="flex items-center absolute"
          style={{
            left: 0,
            top: 0,
            height: Math.ceil(CARD_HEIGHT * 1.12) + 16,
            transform: `translateX(${translateX}px)`,
            transition: dragX === 0 && !transitionDisabled ? 'transform 0.3s ease-out' : 'none',
            gap: CARD_GAP,
          }}
        >
          {strip.map((card, i) => {
            const isCenter = i === centerStripIndex;
            const scale = isCenter ? 1.12 : 1;
            const logicalIndex = logicalCardIndex(i);
            return (
            <button
              key={`strip-${i}`}
              type="button"
              data-card-index={logicalIndex}
              className="flex-shrink-0 rounded-lg flex flex-col p-3 text-left cursor-pointer border focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                background: 'rgba(20, 15, 10, 0.95)',
                borderColor: 'rgba(255, 215, 0, 0.4)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,215,0,0.1)',
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                transition: transitionDisabled ? 'none' : 'transform 0.25s ease-out',
              }}
            >
              <div className="text-sm font-semibold mb-1 truncate" style={{ fontFamily: 'Cinzel, serif', color: '#C4A35A' }}>
                {card.title}
              </div>
              <div
                className="text-[11px] leading-tight line-clamp-4 flex-1"
                style={{ color: 'rgba(212, 197, 160, 0.95)', fontFamily: 'Noto Serif SC, serif' }}
              >
                {card.definition}
              </div>
              <div className="text-[10px] mt-1" style={{ color: 'rgba(255, 215, 0, 0.75)', fontFamily: 'Cinzel, serif' }}>
                点击查看
              </div>
            </button>
            );
          })}
        </div>
      </div>
      <p className="text-[10px] mt-3 uppercase tracking-widest" style={{ color: 'rgba(255, 215, 0, 0.6)', fontFamily: 'Cinzel, serif' }}>
        左右滑动 · 点击卡片放大
      </p>
    </motion.div>
  );
}

export default function EpilogueScene({
  inventory,
  knowledge,
  knowledgeCards = [],
  shadowName,
  shadowNames = [],
  emotionName = '',
  onRestart,
}: EpilogueSceneProps) {
  const [textPhase, setTextPhase] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<KnowledgeCard | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setTextPhase(1), 2000);
    const t2 = setTimeout(() => setShowCards(true), 3200);
    const t3 = setTimeout(() => setTextPhase(2), 5200);
    const t4 = setTimeout(() => setShowFinal(true), 7500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="fixed inset-0">
      <SceneBackground imageUrl={SCENE_IMAGES.starfield} overlay="rgba(0,0,0,0.35)" />
      <Particles type="stardust" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-full w-full px-4 sm:px-6 pt-14 pb-20 overflow-y-auto box-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-6 left-6"
        >
          <span className="text-xs uppercase tracking-[0.3em]" style={{ fontFamily: 'Cinzel, serif', color: '#FFD700' }}>
            终章
          </span>
        </motion.div>

        <div className="max-w-2xl w-full text-center pt-2">
          {textPhase >= 0 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
              className="text-base md:text-lg leading-loose mb-4"
              style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
            >
              荒漠的风沙、意象之海的波光、阴影中的回响、森林的声音、曼陀罗的绽开。
            </motion.p>
          )}

          {textPhase >= 1 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
              className="text-base md:text-lg leading-loose mb-4"
              style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
            >
              你在星空下看清了自己的全貌——不是完美的，而是完整的。
            </motion.p>
          )}

          {/* 页面中心：3D 环绕知识卡片 */}
          {showCards && (
            <KnowledgeCardsCarousel cardIds={knowledgeCards} onCardClick={setSelectedCard} />
          )}

          {showFinal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="pb-4"
            >
              <div
                className="w-48 h-px mx-auto my-4"
                style={{ background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }}
              />

              <TypeWriter
                text="旅程并未结束，你只是带回了种子。现在，回到那个时代中去，做一个觉醒的人。"
                speed={80}
                className="text-base md:text-lg leading-loose mb-5"
                style={{ fontFamily: 'Noto Serif SC, serif', color: '#FFD700' }}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="flex justify-center mb-6"
              >
                <button
                  onClick={onRestart}
                  className="px-8 py-3 text-sm transition-all hover:bg-[#C4A35A]/10 rounded-sm"
                  style={{
                    fontFamily: 'Noto Serif SC, serif',
                    color: '#C4A35A',
                    border: '1px solid rgba(196, 163, 90, 0.3)',
                  }}
                >
                  重新开始旅程
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 知识卡片详情弹窗 */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            style={{ background: 'rgba(0, 0, 0, 0.82)' }}
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-lg w-full max-h-[85vh] overflow-y-auto rounded-lg p-4 sm:p-6"
              style={{
                background: 'rgba(20, 15, 10, 0.96)',
                border: '1px solid rgba(255, 215, 0, 0.35)',
                boxShadow: '0 0 60px rgba(196, 163, 90, 0.15)',
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
                className="mt-4 px-4 py-2 text-xs transition-all hover:bg-[#C4A35A]/10 rounded"
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
    </div>
  );
}
