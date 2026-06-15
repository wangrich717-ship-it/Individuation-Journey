/**
 * Alchemy Altar Scene — 炼金术过渡：将灵魂碎片置于自性祭坛
 * 道具在上、祭坛在下；指针拖拽；放满后六种曼陀罗可选并自由涂色
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneBackground from '../SceneBackground';
import { IconCompass, IconEmblem } from '../ItemIcons';
import { playSfx, playBgmForKey } from '@/lib/bgmSfx';
import { SCENE_IMAGES } from '@/lib/gameStore';

function SlotIcon({ itemId, icon, className = 'text-xl' }: { itemId: string; icon: string; className?: string }) {
  if (itemId === '遗失的罗盘') return <IconCompass className={className} color="#C4A35A" />;
  if (itemId === '纹章印记') return <IconEmblem className={className} color="#C4A35A" />;
  return <span className={className}>{icon}</span>;
}

// 与道具栏一致：使用完整道具名；altItemIds 用于兼容旧存档（如序章道具曾为「赤裸的灵魂」）
const ALTAR_SLOTS: { id: string; itemId: string; label: string; icon: string; altItemIds?: string[] }[] = [
  { id: 'soul', itemId: '人格面具', label: '人格面具', icon: '🎭', altItemIds: ['赤裸的灵魂'] },
  { id: 'compass', itemId: '遗失的罗盘', label: '遗失的罗盘', icon: '🧭' },
  { id: 'force', itemId: '三种原力', label: '三种原力', icon: '◇' },
  { id: 'voice', itemId: '灵魂之乐', label: '灵魂之乐', icon: '♪' },
  { id: 'emblem', itemId: '纹章印记', label: '纹章印记', icon: '🔮' },
];

function getEffectiveItemId(slot: (typeof ALTAR_SLOTS)[0], inventory: string[]): string | null {
  if (inventory.includes(slot.itemId)) return slot.itemId;
  const alt = slot.altItemIds?.find((id) => inventory.includes(id));
  return alt ?? null;
}

function slotAcceptsItem(slot: (typeof ALTAR_SLOTS)[0], itemId: string): boolean {
  return slot.itemId === itemId || (slot.altItemIds?.includes(itemId) ?? false);
}

// 多环曼陀罗：每环可有不同瓣数；style 区分外观，避免六种看起来一样
export type MandalaRing = { petals: number; ratio: number };
export type MandalaPattern = {
  id: string;
  rings: MandalaRing[];
  /** 花瓣外凸程度（相对半径），越大越圆润 */
  bulge?: number;
  /** 最内环相对半径，越大中心圆越大 */
  innerRatio?: number;
  /** 缩略图用：描边/填充色调，让六种一眼能区分 */
  thumbStroke?: string;
  thumbFill?: string;
};

const MANDALA_PATTERNS: MandalaPattern[] = [
  // 1：柔和三环、花瓣状（外端敞开、内端弧线），风格靠拢 3/6
  { id: 'm1', rings: [{ petals: 8, ratio: 0.24 }, { petals: 16, ratio: 0.52 }, { petals: 32, ratio: 1 }], bulge: 0.075, innerRatio: 0.17, thumbStroke: 'rgba(200,170,100,0.58)', thumbFill: 'rgba(200,170,100,0.2)' },
  // 2：重做 — 花瓣感强、层数多
  { id: 'm2', rings: [{ petals: 8, ratio: 0.2 }, { petals: 16, ratio: 0.45 }, { petals: 24, ratio: 0.7 }, { petals: 36, ratio: 1 }], bulge: 0.07, innerRatio: 0.16, thumbStroke: 'rgba(180,140,90,0.65)', thumbFill: 'rgba(180,140,90,0.18)' },
  // 3：保持 — 好看
  { id: 'm3', rings: [{ petals: 8, ratio: 0.25 }, { petals: 16, ratio: 0.55 }, { petals: 32, ratio: 1 }], bulge: 0.07, innerRatio: 0.18, thumbStroke: 'rgba(210,175,110,0.55)', thumbFill: 'rgba(210,175,110,0.22)' },
  // 4：再换 — 三环花瓣、风格靠拢 3/6，内层少瓣外层密
  { id: 'm4', rings: [{ petals: 6, ratio: 0.22 }, { petals: 18, ratio: 0.55 }, { petals: 36, ratio: 1 }], bulge: 0.07, innerRatio: 0.18, thumbStroke: 'rgba(165,130,80,0.6)', thumbFill: 'rgba(165,130,80,0.22)' },
  // 5：再换 — 三环、瓣数递进明显，圆润花瓣
  { id: 'm5', rings: [{ petals: 9, ratio: 0.28 }, { petals: 21, ratio: 0.6 }, { petals: 42, ratio: 1 }], bulge: 0.068, innerRatio: 0.16, thumbStroke: 'rgba(200,165,95,0.58)', thumbFill: 'rgba(200,165,95,0.2)' },
  // 6：保持 — 好看
  { id: 'm6', rings: [{ petals: 12, ratio: 0.3 }, { petals: 24, ratio: 0.6 }, { petals: 48, ratio: 1 }], bulge: 0.06, innerRatio: 0.15, thumbStroke: 'rgba(220,190,130,0.55)', thumbFill: 'rgba(220,190,130,0.2)' },
];

// 曼陀罗涂色色板（已去掉第 4、5、6、8、9、13、25、28、29、36 个颜色）
const PALETTE = [
  '#C4A35A', '#8BA4B8', '#FFD700', '#4A4A4A', '#7EC8A3', '#C9A227', '#2E86AB', '#F5DEB3', '#556B2F', '#CD853F',
  '#47CACC', '#62BDD9', '#C8D8E4', '#E9CDCD', '#F1B5B8',
  '#F7768A', '#8668B2', '#6F5E90', '#96C5D2',
  '#3262D6', '#E3D2D4', '#8A67B6',
  '#BC527D', '#E89E6F', '#E7C95B', '#824AB2',
];

interface AlchemyAltarSceneProps {
  inventory: string[];
  onPlaceItem?: (itemId: string) => void;
  onReturnItem?: (itemId: string) => void;
  onComplete: () => void;
}

/** 松手时若指针与对应槽位中心距离小于此值则视为放入祭坛（不依赖精确拖到槽内） */
const DROP_NEAR_RADIUS_PX = 100;

/** 计算某槽位在容器内的中心像素偏移（与布局一致） */
function getSlotCenterOffset(index: number) {
  const angle = ((index * 360) / 5 - 90) * (Math.PI / 180);
  const r = 120;
  return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
}

export default function AlchemyAltarScene({ inventory, onPlaceItem, onReturnItem, onComplete }: AlchemyAltarSceneProps) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'altar' | 'choose' | 'color'>('altar');
  const [selectedMandala, setSelectedMandala] = useState<number | null>(null);
  const [regionColors, setRegionColors] = useState<Record<string, string>>({});
  const [pickedColor, setPickedColor] = useState(PALETTE[0]);

  const [drag, setDrag] = useState<{ itemId: string; icon: string; label: string; startX: number; startY: number } | null>(null);
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const mandalaContainerRef = useRef<HTMLDivElement | null>(null);
  const altarContainerRef = useRef<HTMLDivElement | null>(null);

  const allPlaced = Object.keys(placed).length === ALTAR_SLOTS.length;
  const [celebrating, setCelebrating] = useState(false);

  const goToMandalaChoice = useCallback(() => setStep('choose'), []);

  useEffect(() => {
    if (!allPlaced) return;
    setCelebrating(true);
    const t = setTimeout(() => {
      setStep('choose');
      setCelebrating(false);
    }, 2600);
    return () => clearTimeout(t);
  }, [allPlaced]);

  // 曼陀罗涂色步骤时切换为 bgm-alchemy，其余步骤为 bgm-jitan（由 phase 已设置）
  useEffect(() => {
    if (step === 'color') {
      playBgmForKey('bgm-alchemy');
    } else {
      playBgmForKey('bgm-jitan');
    }
  }, [step]);

  const handlePointerDown = useCallback((e: React.PointerEvent, slot: typeof ALTAR_SLOTS[0]) => {
    if (Object.values(placed).includes(slot.itemId)) return;
    if (!inventory.includes(slot.itemId)) return;
    playSfx('sfx-drag');
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDrag({
      itemId: slot.itemId,
      icon: slot.icon,
      label: slot.label,
      startX: e.clientX,
      startY: e.clientY,
    });
  }, [placed, inventory]);

  useEffect(() => {
    if (!drag) return;
    const onMove = (e: PointerEvent) => {
      setDrag(d => d ? { ...d, startX: e.clientX, startY: e.clientY } : null);
    };
    const onUp = (e: PointerEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      let dropped = false;
      const container = altarContainerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        for (let i = 0; i < ALTAR_SLOTS.length; i++) {
          const slot = ALTAR_SLOTS[i];
          if (!slotAcceptsItem(slot, drag.itemId)) continue;
          const off = getSlotCenterOffset(i);
          const slotCenterX = centerX + off.x;
          const slotCenterY = centerY + off.y;
          const dist = Math.hypot(clientX - slotCenterX, clientY - slotCenterY);
          if (dist <= DROP_NEAR_RADIUS_PX) {
            setPlaced(prev => ({ ...prev, [slot.id]: drag.itemId }));
            onPlaceItem?.(drag.itemId);
            playSfx('sfx-drag');
            dropped = true;
            break;
          }
        }
      }
      setDrag(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    const onCancel = () => setDrag(null);
    window.addEventListener('pointercancel', onCancel);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
    };
  }, [drag, onPlaceItem]);

  const removeFromSlot = useCallback((slotId: string) => {
    setPlaced(prev => {
      const itemId = prev[slotId];
      if (itemId) onReturnItem?.(itemId);
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  }, [onReturnItem]);

  const selectMandala = useCallback((index: number) => {
    playSfx('sfx-choice');
    setSelectedMandala(index);
    setStep('color');
    setRegionColors({});
  }, []);

  /** 每个楔形两块：s0=两瓣围成的区域（内），s1=花瓣（外） */
  const getRegionKey = (ring: number, petal: number, sub: number) => `r${ring}-p${petal}-s${sub}`;

  const handleMandalaRegionClick = useCallback((ring: number, petal: number, sub: number) => {
    const key = getRegionKey(ring, petal, sub);
    setRegionColors(prev => ({ ...prev, [key]: pickedColor }));
  }, [pickedColor]);

  /** 将当前曼陀罗 SVG 导出为 PNG 并触发下载 */
  const handleDownloadMandala = useCallback(() => {
    const container = mandalaContainerRef.current;
    const svg = container?.querySelector('svg');
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGElement;
    if (!clone.hasAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const size = 560;
    const scale = 2;
    const w = size * scale;
    const h = size * scale;
    clone.setAttribute('width', String(w));
    clone.setAttribute('height', String(h));
    clone.setAttribute('viewBox', `0 0 ${size} ${size}`);
    const svgString = new XMLSerializer().serializeToString(clone);
    const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = 'rgba(28,25,20,1)';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `mandala-${Date.now()}.png`;
      a.click();
    };
    img.onerror = () => {};
    img.src = dataUrl;
  }, []);

  if (step === 'choose') {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <SceneBackground imageUrl={SCENE_IMAGES.alchemy} overlay="rgba(0,0,0,0.5)" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-full w-full px-3 sm:px-4 py-6 sm:py-8">
          <p className="text-center max-w-xl mb-4 sm:mb-6 text-sm" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
            选择一种曼陀罗图形，然后为它涂上属于你的颜色。
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 w-full max-w-[420px] sm:max-w-[640px] justify-center">
            {MANDALA_PATTERNS.map((p, i) => (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => selectMandala(i)}
                className="rounded-xl border-2 overflow-hidden bg-black/50 hover:border-amber-500/80 transition-colors w-full aspect-square min-w-0"
                style={{ borderColor: 'rgba(196,163,90,0.5)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <MandalaThumbnail pattern={p} size={200} className="w-full h-full" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'color' && selectedMandala !== null) {
    const pat = MANDALA_PATTERNS[selectedMandala];
    return (
      <div className="fixed inset-0 flex flex-col">
        <SceneBackground imageUrl={SCENE_IMAGES.alchemy} overlay="rgba(0,0,0,0.5)" />
        {/* 顶部留出章节栏空间，避免遮挡；小屏可滚动 */}
        <div
          className="relative z-10 flex flex-col items-center min-h-full w-full px-3 py-4 sm:px-4 sm:py-6 overflow-y-auto"
          style={{
            paddingTop: 'max(3.5rem, env(safe-area-inset-top, 0px) + 2.5rem)',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
          }}
        >
          <p className="text-center mb-3 sm:mb-4 text-xs sm:text-sm flex-shrink-0" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
            点击曼陀罗上的区域即可涂色
          </p>
          <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-shrink-0 max-w-full">
            {PALETTE.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setPickedColor(c)}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-transform flex-shrink-0"
                style={{
                  background: c,
                  borderColor: pickedColor === c ? '#fff' : 'rgba(196,163,90,0.5)',
                  transform: pickedColor === c ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          <div ref={mandalaContainerRef} className="flex-1 flex items-center justify-center min-h-[260px] sm:min-h-[400px] w-full overflow-auto flex-shrink-0">
            <ColorableMandala
              pattern={pat}
              size={560}
              regionColors={regionColors}
              getColor={(ring, petal, sub) => regionColors[getRegionKey(ring, petal, sub)]}
              onRegionClick={handleMandalaRegionClick}
            />
          </div>
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 flex-shrink-0">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleDownloadMandala}
              type="button"
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded border text-xs sm:text-sm"
              style={{
                fontFamily: 'Cinzel, serif',
                color: '#8BA4B8',
                borderColor: 'rgba(139,164,184,0.6)',
              }}
            >
              下载曼陀罗
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onComplete}
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded border text-xs sm:text-sm"
              style={{
                fontFamily: 'Cinzel, serif',
                color: '#C4A35A',
                borderColor: 'rgba(196,163,90,0.7)',
              }}
            >
              完成，进入终章
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0">
      <SceneBackground imageUrl={SCENE_IMAGES.alchemy} overlay="rgba(0,0,0,0.5)" />

      <div className="relative z-10 flex flex-col min-h-full justify-center py-8">
        {/* 文案 */}
        <p
          className="text-center max-w-xl mx-auto pb-3 px-4 text-sm leading-relaxed"
          style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
        >
          你已收集了灵魂的碎片：那摘下的面具，那共鸣的意象，那整合的阴影，那聆听的声音。现在，是时候将它们置于自性的祭坛之上。
        </p>

        {/* 道具区：仅显示尚未投入祭坛的道具，投入后从栏中消失 */}
        <div className="flex flex-wrap justify-center gap-3 px-4 pb-4">
          {ALTAR_SLOTS.map(slot => {
            const effectiveId = getEffectiveItemId(slot, inventory);
            const used = placed[slot.id] != null;
            if (!effectiveId || used) return null;
            const displaySlot = { ...slot, itemId: effectiveId };
            return (
              <motion.div
                key={`${slot.id}-${effectiveId}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  handlePointerDown(e, displaySlot);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border select-none cursor-grab active:cursor-grabbing"
                style={{
                  background: 'rgba(20,15,10,0.85)',
                  borderColor: 'rgba(196,163,90,0.5)',
                  touchAction: 'none',
                }}
              >
                <SlotIcon itemId={displaySlot.itemId} icon={slot.icon} className="text-xl w-6 h-6 flex-shrink-0" />
                <span className="text-xs" style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4A35A' }}>
                  {displaySlot.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* 祭坛区：连线 + 光点 + 动效 */}
        <div className="flex flex-col items-center justify-center py-4 pb-8">
          <motion.div
            ref={altarContainerRef}
            className="relative flex items-center justify-center"
            style={{ width: 320, height: 320 }}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
          >
            {/* 中央祭坛圆：轻微光晕呼吸 */}
            <motion.div
              className="absolute rounded-full border-2"
              style={{
                width: 100,
                height: 100,
                background: 'radial-gradient(circle at 30% 30%, rgba(196,163,90,0.25), rgba(20,15,10,0.9))',
              }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(196,163,90,0.2), inset 0 0 20px rgba(196,163,90,0.05)',
                  '0 0 32px rgba(196,163,90,0.35), inset 0 0 24px rgba(196,163,90,0.08)',
                  '0 0 20px rgba(196,163,90,0.2), inset 0 0 20px rgba(196,163,90,0.05)',
                ],
                borderColor: ['rgba(196,163,90,0.5)', 'rgba(196,163,90,0.75)', 'rgba(196,163,90,0.5)'],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* 五个光圈：光晕呼吸 + 整体轻微浮动 */}
            {ALTAR_SLOTS.map((slot, i) => {
              const angle = (i * 360) / 5 - 90;
              const r = 120;
              const x = Math.cos((angle * Math.PI) / 180) * r;
              const y = Math.sin((angle * Math.PI) / 180) * r;
              const filled = placed[slot.id] === slot.itemId || (slot.altItemIds?.includes(placed[slot.id] ?? '') ?? false);
              const glowFrames = filled
                ? [
                    '0 0 24px rgba(196,163,90,0.5), 0 0 48px rgba(196,163,90,0.25)',
                    '0 0 36px rgba(196,163,90,0.7), 0 0 64px rgba(196,163,90,0.35)',
                    '0 0 24px rgba(196,163,90,0.5), 0 0 48px rgba(196,163,90,0.25)',
                  ]
                : [
                    '0 0 16px rgba(196,163,90,0.35), 0 0 32px rgba(196,163,90,0.15)',
                    '0 0 28px rgba(196,163,90,0.55), 0 0 48px rgba(196,163,90,0.25)',
                    '0 0 16px rgba(196,163,90,0.35), 0 0 32px rgba(196,163,90,0.15)',
                  ];
              const borderFrames = filled
                ? ['rgba(196,163,90,0.85)', 'rgba(220,190,140,1)', 'rgba(196,163,90,0.85)']
                : ['rgba(196,163,90,0.4)', 'rgba(196,163,90,0.7)', 'rgba(196,163,90,0.4)'];
              const floatOffset = (i % 2 === 0 ? 1 : -1) * 0.8;
              return (
                <motion.div
                  key={slot.id}
                  ref={el => { slotRefs.current[slot.id] = el; }}
                  className="absolute rounded-full border-2 flex items-center justify-center cursor-pointer"
                  style={{
                    left: `calc(50% + ${x}px - 36px)`,
                    top: `calc(50% + ${y}px - 36px)`,
                    width: 72,
                    height: 72,
                    background: filled ? 'rgba(196,163,90,0.25)' : 'rgba(20,15,10,0.6)',
                  }}
                  animate={{
                    boxShadow: glowFrames,
                    borderColor: borderFrames,
                    scale: filled ? [1, 1.04, 1] : [1, 1.02, 1],
                    x: [0, 2.5 * floatOffset, -2 * floatOffset, 0],
                    y: [0, -2 * floatOffset, 2.5 * floatOffset, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.4,
                  }}
                  onClick={() => filled && removeFromSlot(slot.id)}
                  title={filled ? `点击移除：${slot.label}` : `将「${slot.label}」拖入此处`}
                >
                  {filled ? (
                    <SlotIcon itemId={slot.itemId} icon={slot.icon} className="text-2xl w-8 h-8 flex-shrink-0" />
                  ) : (
                    <span className="text-xs opacity-60" style={{ color: '#C4A35A' }}>{slot.label}</span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* 全部放置完成：炫酷动效后自动进入曼陀罗选择 */}
          <AnimatePresence>
            {allPlaced && celebrating && (
              <motion.div
                className="absolute inset-0 pointer-events-none flex items-center justify-center z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* 中心爆发光球 */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: 160,
                    height: 160,
                    background: 'radial-gradient(circle, rgba(255,220,150,0.6) 0%, rgba(196,163,90,0.3) 40%, transparent 70%)',
                    boxShadow: '0 0 80px rgba(255,220,150,0.6), 0 0 120px rgba(196,163,90,0.3)',
                  }}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{
                    scale: [0.3, 1.8, 2.2],
                    opacity: [0, 1, 0.9, 0],
                  }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
                {/* 扩散光环 */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border-2"
                    style={{
                      width: 120,
                      height: 120,
                      borderColor: 'rgba(255,220,150,0.8)',
                      boxShadow: '0 0 40px rgba(255,220,150,0.5)',
                    }}
                    initial={{ scale: 0.5, opacity: 0.8 }}
                    animate={{
                      scale: [0.5, 2.5, 3],
                      opacity: [0.8, 0.4, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.25,
                      ease: 'easeOut',
                    }}
                  />
                ))}
                {/* 射线光效：从中心向外扩散 */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ width: 320, height: 320 }}>
                  {Array.from({ length: 16 }).map((_, i) => {
                    const deg = (i / 16) * 360;
                    return (
                      <motion.div
                        key={i}
                        className="absolute w-px origin-bottom"
                        style={{
                          height: 140,
                          background: 'linear-gradient(to top, rgba(255,220,150,0.9), transparent)',
                          transform: `rotate(${deg}deg)`,
                        }}
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{
                          scaleY: [0, 1, 1],
                          opacity: [0, 0.7, 0],
                        }}
                        transition={{ duration: 1.6, delay: 0.15 + i * 0.02, ease: 'easeOut' }}
                      />
                    );
                  })}
                </div>
                {/* 文案闪现 */}
                <motion.p
                  className="absolute text-center text-sm font-medium z-10"
                  style={{ fontFamily: 'Noto Serif SC, serif', color: 'rgba(255,235,200,0.95)', textShadow: '0 0 20px rgba(196,163,90,0.8)' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -8] }}
                  transition={{ duration: 2, delay: 0.5 }}
                >
                  灵魂已归位 · 唤醒曼陀罗
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 拖拽时的跟随幽灵 */}
      <AnimatePresence>
        {drag && (
          <motion.div
            className="fixed pointer-events-none z-50 flex items-center gap-2 px-4 py-2 rounded-lg border"
            style={{
              left: drag.startX - 60,
              top: drag.startY - 24,
              background: 'rgba(20,15,10,0.95)',
              borderColor: 'rgba(196,163,90,0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
            initial={{ scale: 0.9, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <SlotIcon itemId={drag.itemId} icon={drag.icon} className="text-xl w-6 h-6 flex-shrink-0" />
            <span className="text-xs" style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4A35A' }}>
              {drag.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 生成单瓣花瓣路径：两条径向边用二次曲线向瓣心方向外凸，中间宽、两端窄 */
function petalPath(
  a1: number, a2: number, innerR: number, outerR: number, bulge: number,
  ox: number, oy: number
) {
  const midR = (innerR + outerR) / 2;
  const x0 = ox + Math.cos(a1) * innerR;
  const y0 = oy + Math.sin(a1) * innerR;
  const x1 = ox + Math.cos(a1) * outerR;
  const y1 = oy + Math.sin(a1) * outerR;
  const x2 = ox + Math.cos(a2) * outerR;
  const y2 = oy + Math.sin(a2) * outerR;
  const x3 = ox + Math.cos(a2) * innerR;
  const y3 = oy + Math.sin(a2) * innerR;
  const midA = (a1 + a2) / 2;
  const k = bulge;
  const q1x = ox + Math.cos(a1) * midR + Math.sin(a1) * k;
  const q1y = oy + Math.sin(a1) * midR - Math.cos(a1) * k;
  const q2x = ox + Math.cos(a2) * midR - Math.sin(a2) * k;
  const q2y = oy + Math.sin(a2) * midR + Math.cos(a2) * k;
  return `M ${x0} ${y0} Q ${q1x} ${q1y} ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} Q ${q2x} ${q2y} ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x0} ${y0} Z`;
}

/** 花瓣状：外端不收口（沿外圆大弧线敞开），内端弧线收口，侧边大弧度；按参考图还原 */
function softPetalPath(
  a1: number, a2: number, innerR: number, outerR: number, bulge: number,
  ox: number, oy: number,
  _capRatio?: number,
  /** 内端弧度：>1 时内端用弧线收口（控制点在外侧） */
  innerCapRatio = 1.18
) {
  const midR = (innerR + outerR) / 2;
  const midA = (a1 + a2) / 2;
  const k = bulge;
  const x0 = ox + Math.cos(a1) * innerR;
  const y0 = oy + Math.sin(a1) * innerR;
  const x1 = ox + Math.cos(a1) * outerR;
  const y1 = oy + Math.sin(a1) * outerR;
  const x2 = ox + Math.cos(a2) * outerR;
  const y2 = oy + Math.sin(a2) * outerR;
  const x3 = ox + Math.cos(a2) * innerR;
  const y3 = oy + Math.sin(a2) * innerR;
  const q1x = ox + Math.cos(a1) * midR + Math.sin(a1) * k;
  const q1y = oy + Math.sin(a1) * midR - Math.cos(a1) * k;
  const q2x = ox + Math.cos(a2) * midR - Math.sin(a2) * k;
  const q2y = oy + Math.sin(a2) * midR + Math.cos(a2) * k;
  const innerCapR = innerR * innerCapRatio;
  const ix = ox + Math.cos(midA) * innerCapR;
  const iy = oy + Math.sin(midA) * innerCapR;
  return `M ${x0} ${y0} Q ${q1x} ${q1y} ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} Q ${q2x} ${q2y} ${x3} ${y3} Q ${ix} ${iy} ${x0} ${y0} Z`;
}

/** 瓣内中线：沿瓣角平分线从内到外一段线，增强花瓣感（对齐终章曼陀罗细节） */
function petalMidlinePath(a1: number, a2: number, innerR: number, outerR: number, ox: number, oy: number) {
  const midA = (a1 + a2) / 2;
  const r0 = innerR + (outerR - innerR) * 0.2;
  const r1 = innerR + (outerR - innerR) * 0.8;
  const x0 = ox + Math.cos(midA) * r0;
  const y0 = oy + Math.sin(midA) * r0;
  const x1 = ox + Math.cos(midA) * r1;
  const y1 = oy + Math.sin(midA) * r1;
  return `M ${x0} ${y0} L ${x1} ${y1}`;
}

/** 缩略图专用：终章式「一层包着一层」+ 圆头花瓣；外圈包住花瓣不超出 */
function MandalaThumbnail({ pattern, size, className }: { pattern: MandalaPattern; size: number; className?: string }) {
  const center = size / 2;
  const outlineR = center * 0.88;
  const maxR = outlineR * 0.92;
  const bulge = maxR * ((pattern.bulge ?? 0.04) * 2.4);
  const stroke = pattern.thumbStroke ?? 'rgba(196,163,90,0.5)';
  const fill = pattern.thumbFill ?? 'rgba(196,163,90,0.16)';
  const strokeLight = stroke.replace(/[\d.]+\)$/, '0.32)');
  const centerR = maxR * 0.045;
  const rings = pattern.rings;
  const strokeRound = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className={className} preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(${center},${center})`}>
        {/* 柔和花瓣：限制在 maxR 内，不超出外圈 */}
        {[...rings].reverse().map((ring, revIdx) => {
          const ri = rings.length - 1 - revIdx;
          const outerR = maxR * ring.ratio;
          const innerR = centerR;
          const ringStroke = ri === rings.length - 1 ? stroke : stroke.replace(/[\d.]+\)$/, `${0.45 + ri * 0.1})`);
          return (
            <g key={ri}>
              {Array.from({ length: ring.petals }).map((_, pi) => {
                const a1 = (2 * Math.PI * pi) / ring.petals;
                const a2 = (2 * Math.PI * (pi + 1)) / ring.petals;
                const path = softPetalPath(a1, a2, innerR, outerR, bulge, 0, 0, 0.68);
                return (
                  <path
                    key={pi}
                    d={path}
                    fill={fill}
                    stroke={ringStroke}
                    strokeWidth="1"
                    {...strokeRound}
                  />
                );
              })}
            </g>
          );
        })}
        {/* 瓣内中线（圆角描边更柔和） */}
        {rings.map((ring, ri) => {
          const outerR = maxR * ring.ratio;
          const innerR = centerR;
          return (
            <g key={`mid-${ri}`}>
              {Array.from({ length: ring.petals }).map((_, pi) => {
                const a1 = (2 * Math.PI * pi) / ring.petals;
                const a2 = (2 * Math.PI * (pi + 1)) / ring.petals;
                return (
                  <path
                    key={pi}
                    d={petalMidlinePath(a1, a2, innerR, outerR, 0, 0)}
                    fill="none"
                    stroke={strokeLight}
                    strokeWidth="0.55"
                    {...strokeRound}
                  />
                );
              })}
            </g>
          );
        })}
        {/* 每层一圈小点（略大一点更柔和） */}
        {rings.map((ring, ri) => {
          const outerR = maxR * ring.ratio;
          const dotR = centerR + (outerR - centerR) * 0.55;
          return (
            <g key={`dots-${ri}`}>
              {Array.from({ length: Math.min(ring.petals * 2, 32) }).map((_, di) => {
                const a = (2 * Math.PI * di) / Math.min(ring.petals * 2, 32);
                const x = Math.cos(a) * dotR;
                const y = Math.sin(a) * dotR;
                return (
                  <circle key={di} cx={x} cy={y} r="1.2" fill={strokeLight} />
                );
              })}
            </g>
          );
        })}
        {/* 中心小圆 */}
        <circle cx={0} cy={0} r={centerR} fill="rgba(255,215,0,0.28)" stroke="rgba(255,215,0,0.5)" strokeWidth="0.8" />
        {/* 外圈：包住花瓣，花瓣不超出圈外 */}
        <circle cx={0} cy={0} r={outlineR} fill="none" stroke="rgba(196,163,90,0.6)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/** 弧线路径：从角 a 到 a2、半径 r 的圆弧（用于分界线和弧边） */
function arcPath(ox: number, oy: number, r: number, a1: number, a2: number) {
  const x1 = ox + Math.cos(a1) * r;
  const y1 = oy + Math.sin(a1) * r;
  const x2 = ox + Math.cos(a2) * r;
  const y2 = oy + Math.sin(a2) * r;
  const large = a2 - a1 > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

/** 两瓣围成的区域：相邻两瓣在边界角 a 处的两条弧边围成的透镜形（与「整瓣」几何完全分离） */
function lensPath(
  a: number, innerR: number, outerR: number, bulge: number, ox: number, oy: number
) {
  const midR = (innerR + outerR) / 2;
  const k = bulge;
  const innerX = ox + Math.cos(a) * innerR;
  const innerY = oy + Math.sin(a) * innerR;
  const outerX = ox + Math.cos(a) * outerR;
  const outerY = oy + Math.sin(a) * outerR;
  const q1x = ox + Math.cos(a) * midR + Math.sin(a) * k;
  const q1y = oy + Math.sin(a) * midR - Math.cos(a) * k;
  const q2x = ox + Math.cos(a) * midR - Math.sin(a) * k;
  const q2y = oy + Math.sin(a) * midR + Math.cos(a) * k;
  return `M ${innerX} ${innerY} Q ${q1x} ${q1y} ${outerX} ${outerY} Q ${q2x} ${q2y} ${innerX} ${innerY} Z`;
}

/** 涂色：花瓣 = 柔和圆头瓣(与选择页一致)；外圈包住花瓣；两瓣围成的区域 = 透镜。 */
function ColorableMandala({
  pattern,
  size,
  regionColors,
  getColor,
  onRegionClick,
}: {
  pattern: MandalaPattern;
  size: number;
  regionColors: Record<string, string>;
  getColor: (ring: number, petal: number, sub: number) => string | undefined;
  onRegionClick: (ring: number, petal: number, sub: number) => void;
}) {
  const center = size / 2;
  const outlineR = center * 0.88;
  const maxR = outlineR * 0.92;
  const bulge = maxR * ((pattern.bulge ?? 0.045) * 1.6);
  const defaultInner = pattern.innerRatio ?? 0.12;
  const segments: { ring: number; petal: number; sub: number; path: string }[] = [];

  pattern.rings.forEach((ring, ri) => {
    const outerR = maxR * ring.ratio;
    const innerR = ri === 0 ? outerR * defaultInner : maxR * pattern.rings[ri - 1].ratio;
    const n = ring.petals;
    for (let pi = 0; pi < n; pi++) {
      const a1 = (2 * Math.PI * pi) / n;
      const a2 = (2 * Math.PI * (pi + 1)) / n;
      segments.push({
        ring: ri,
        petal: pi,
        sub: 0,
        path: lensPath(a2, innerR, outerR, bulge, center, center),
      });
      segments.push({
        ring: ri,
        petal: pi,
        sub: 1,
        path: softPetalPath(a1, a2, innerR, outerR, bulge, center, center, 0.72),
      });
    }
  });

  return (
    <svg width={size} height={size} className="cursor-crosshair flex-shrink-0" viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: '100%', height: 'auto' }} data-mandala-geo="lens-and-full-petal">
      {/* 1) 先画花瓣（柔和圆头瓣，与选择页一致），在下层 */}
      {segments.filter(s => s.sub === 1).map(({ ring, petal, path }) => {
        const fill = getColor(ring, petal, 1) || 'rgba(40,35,25,0.85)';
        return (
          <path
            key={`${ring}-${petal}-1`}
            d={path}
            fill={fill}
            stroke="rgba(196,163,90,0.5)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={() => onRegionClick(ring, petal, 1)}
            className="hover:opacity-90 transition-opacity"
          />
        );
      })}
      {/* 2) 再画两瓣围成的区域（透镜/缝），在上层，保证缝可单独点到 */}
      {segments.filter(s => s.sub === 0).map(({ ring, petal, path }) => {
        const fill = getColor(ring, petal, 0) || 'rgba(40,35,25,0.85)';
        return (
          <path
            key={`${ring}-${petal}-0`}
            d={path}
            fill={fill}
            stroke="rgba(196,163,90,0.55)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={(e) => { e.stopPropagation(); onRegionClick(ring, petal, 0); }}
            className="hover:opacity-90 transition-opacity"
            style={{ pointerEvents: 'auto' }}
          />
        );
      })}
      {/* 外圈：包住花瓣，花瓣不超出圈外 */}
      <circle cx={center} cy={center} r={outlineR} fill="none" stroke="rgba(196,163,90,0.6)" strokeWidth="2" />
    </svg>
  );
}
