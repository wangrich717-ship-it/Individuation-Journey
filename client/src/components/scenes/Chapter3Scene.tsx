/**
 * Chapter 3 — 意象之海：核心三问、象征三角、深化三问、意象海图
 */
import type { ReactNode } from 'react';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneBackground from '../SceneBackground';
import Particles from '../Particles';
import TypeWriter from '../TypeWriter';
import { SCENE_IMAGES } from '@/lib/gameStore';
import { playSfx } from '@/lib/bgmSfx';
import ImagerySeaTask from '../tasks/ImagerySeaTask';
import { IMAGERY_SYMBOLS, getOppositeOptions, getOppositeFeedback, getResonanceFeedback } from '@/lib/imageryData';
import ImageryIcon from '../tasks/ImageryIcon';

function PhasePlaceholder({
  title,
  text,
  buttonText,
  onNext,
}: {
  title: string;
  text: string;
  buttonText: string;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl text-center"
    >
      <h3 className="text-xs uppercase tracking-[0.3em] mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}>
        {title}
      </h3>
      <p className="text-sm mb-8 leading-relaxed" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
        {text}
      </p>
      <button
        onClick={onNext}
        className="px-8 py-3 text-sm transition-all hover:bg-[#8BA4B8]/10"
        style={{
          fontFamily: 'Noto Serif SC, serif',
          color: '#8BA4B8',
          border: '1px solid rgba(139, 164, 184, 0.5)',
        }}
      >
        {buttonText}
      </button>
    </motion.div>
  );
}

export type Chapter3SubPhase =
  | 'intro'
  | 'imagery-sea'
  | 'resonance-q'
  | 'opposite-q'
  | 'transcendence-q'
  | 'symbol-triangle'
  | 'root-q'
  | 'challenge-q'
  | 'integration-q'
  | 'imagery-map'
  | 'choice';

export interface Chapter3SceneProps {
  shadowName: string;
  questionAnswers?: Record<string, string>;
  onComplete: () => void;
  onQuestionAnswer: (questionId: string, optionId: string, knowledgeCardId?: string) => void;
  onInventoryAdd?: (item: string) => void;
  subPhase: Chapter3SubPhase;
  onSubPhaseChange: (phase: Chapter3SubPhase) => void;
}

// 意象之海首页首问：与序章/阴影/内在声音同调——情境句 + 两句第一人称回应（带引号），选「愿意先感受」才继续
const INTRO_GATE_QUESTION = {
  id: 'chapter3-intro-gate',
  narrative: '你站在岸边。波光里什么都在，又什么都说不清。',
  correctOptionId: 'b',
  options: [
    { id: 'a', text: '"我得先弄明白这些符号代表什么，再往里走。"', feedback: '这片海不会给你答案——它只会先把你浸透。' },
    { id: 'b', text: '"有些东西，或许只能先感受。让我进去。"', feedback: '波光轻轻托住了你。' },
  ],
};

const TRANSCENDENCE_FEEDBACK = '第三物在你心中浮现，它连接了两极，像一座桥。荣格说，超越功能便在这样的张力中诞生。';

// 调停问：12 个可供选择的「第三物」符号，用符文图标展示（内圈4+外圈8 围成圈）
const TRANSCENDENCE_SYMBOLS: { id: string; name: string }[] = [
  { id: 'light', name: '光' },
  { id: 'bridge', name: '桥' },
  { id: 'seed', name: '种子' },
  { id: 'mirror', name: '镜' },
  { id: 'door', name: '门' },
  { id: 'wind', name: '风' },
  { id: 'soil', name: '土壤' },
  { id: 'rainbow', name: '彩虹' },
  { id: 'crucible', name: '熔炉' },
  { id: 'path', name: '道路' },
  { id: 'key', name: '钥匙' },
  { id: 'steps', name: '阶梯' },
];

// 调停符号的象征性符文图标（简单几何/符文风 SVG）
function TranscendenceRuneIcon({ id, size = 32 }: { id: string; size?: number }) {
  const s = size;
  const h = s / 2;
  const stroke = Math.max(1.5, s * 0.08);
  const color = '#C4A35A';
  const runes: Record<string, ReactNode> = {
    light: <path d={`M ${h} 2 L ${h} ${s - 2} M 2 ${h} L ${s - 2} ${h} M ${h * 0.3} ${h * 0.3} L ${h * 1.7} ${h * 1.7} M ${h * 1.7} ${h * 0.3} L ${h * 0.3} ${h * 1.7}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />,
    bridge: <path d={`M 2 ${h} Q ${h} 2 ${s - 2} ${h} M 4 ${h + 4} L ${s - 4} ${h + 4}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />,
    seed: <ellipse cx={h} cy={h} rx={h * 0.5} ry={h * 0.7} fill="none" stroke={color} strokeWidth={stroke} />,
    mirror: <path d={`M ${h - 2} 2 L ${h - 2} ${s - 2} M ${h + 2} 2 L ${h + 2} ${s - 2} M ${h} ${h * 0.3} L ${h} ${h * 1.7}`} fill="none" stroke={color} strokeWidth={stroke} />,
    door: <path d={`M ${s * 0.2} 2 L ${s * 0.2} ${s - 2} L ${s * 0.8} ${s - 2} L ${s * 0.8} 2 Z M ${h} ${h * 0.5} m 0 ${h * 0.2} a ${h * 0.15} ${h * 0.15} 0 1 1 0 0`} fill="none" stroke={color} strokeWidth={stroke} />,
    wind: <path d={`M 2 ${h * 0.4} Q ${h * 0.5} ${h * 0.6} ${s - 2} ${h * 0.4} M 2 ${h} Q ${h} ${h * 1.2} ${s - 2} ${h} M 2 ${h * 1.6} Q ${h * 1.2} ${h * 1.4} ${s - 2} ${h * 1.6}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />,
    soil: <path d={`M ${h * 0.3} ${s * 0.7} L ${h * 0.6} ${s * 0.3} L ${h} ${s * 0.7} L ${h * 1.4} ${s * 0.3} L ${s * 0.8} ${s * 0.7}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />,
    rainbow: <path d={`M 2 ${h} A ${h * 0.9} ${h * 0.9} 0 0 1 ${s - 2} ${h}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />,
    crucible: <path d={`M ${h} 2 L ${h * 1.3} ${s - 2} L ${h * 0.7} ${s - 2} Z M ${h} ${h} v ${h * 0.5}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />,
    path: <path d={`M 2 ${s - 2} L ${h * 0.5} ${h} L ${s - 2} 2 L ${h} ${h * 0.5} Z`} fill="none" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />,
    key: <path d={`M ${h * 0.4} ${h} L ${h * 0.4} 4 L ${h * 0.8} 4 L ${h * 0.8} ${h} M ${h * 0.5} ${h} L ${h * 1.6} ${h} M ${h * 1.3} ${h * 0.5} L ${h * 1.3} ${h * 1.5}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" />,
    steps: <path d={`M 2 ${s - 2} h ${h} v -${h * 0.4} h ${h} v -${h * 0.4} h ${h} v -${h * 0.4}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />,
  };
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="flex-shrink-0">
      {runes[id] ?? <circle cx={h} cy={h} r={h * 0.4} fill="none" stroke={color} strokeWidth={stroke} />}
    </svg>
  );
}
const ROOT_FEEDBACK = '追溯意象的根须，便是与个人情结和古老原型的对话。这份记忆或梦境，正在为你保留线索。';
const ROOT_OPTIONS = [
  { id: 'root-clear', text: '有过，印象很清晰。' },
  { id: 'root-vague', text: '有过，但比较模糊。' },
  { id: 'root-none', text: '似乎没有，或想不起来。' },
  { id: 'root-unsure', text: '不确定。' },
];
const INTEGRATION_FEEDBACK = '你让象征智慧为现实困境提供隐喻——这正是积极想象的实践。无意识的馈赠，已悄然落入意识之网。';

// 与漫游意象之海相同的圆圈布局：内圈 4 个，外圈 8 个
function useResonanceCircleLayout() {
  return useMemo(() => {
    const center = 230;
    const ballHalf = 39;
    const innerR = 72;
    const outerR = 180;
    const positions: { left: number; top: number }[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
      positions.push({
        left: center + innerR * Math.cos(angle) - ballHalf,
        top: center + innerR * Math.sin(angle) - ballHalf,
      });
    }
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      positions.push({
        left: center + outerR * Math.cos(angle) - ballHalf,
        top: center + outerR * Math.sin(angle) - ballHalf,
      });
    }
    return positions;
  }, []);
}

export default function Chapter3Scene(props: Chapter3SceneProps) {
  const { shadowName: _shadowName, onComplete, onQuestionAnswer, onSubPhaseChange } = props;
  const questionAnswers = props.questionAnswers ?? {};
  const onInventoryAdd = props.onInventoryAdd;
  const subPhase = props.subPhase;
  const handlePhase = (p: Chapter3SubPhase) => {
    playSfx('sfx-choice');
    onSubPhaseChange(p);
  };
  const [introComplete, setIntroComplete] = useState(false);
  const [introQuestionPassed, setIntroQuestionPassed] = useState(false);
  const [gateSelected, setGateSelected] = useState<string | null>(null);

  // 核心三问 & 深化三问：选中后是否已显示反馈（点「继续」才进入下一阶段）
  const [resonanceSelected, setResonanceSelected] = useState<string | null>(null);
  const [resonanceShowFeedback, setResonanceShowFeedback] = useState(false);
  const [oppositeSelected, setOppositeSelected] = useState<string | null>(null);
  const [oppositeShowFeedback, setOppositeShowFeedback] = useState(false);
  const [transcendenceSelected, setTranscendenceSelected] = useState<string | null>(null);
  const [transcendenceSubmitted, setTranscendenceSubmitted] = useState(false);
  const [rootSelected, setRootSelected] = useState<string | null>(null);
  const [rootShowFeedback, setRootShowFeedback] = useState(false);
  const [challengeSelected, setChallengeSelected] = useState<string | null>(null);
  const [challengeShowFeedback, setChallengeShowFeedback] = useState(false);
  const [integrationText, setIntegrationText] = useState('');
  const [integrationSubmitted, setIntegrationSubmitted] = useState(false);

  // 象征三角：三个顶点上已放置的意象（'resonance' | 'opposite' | 'transcendence'），null 表示未放置
  const [trianglePlacements, setTrianglePlacements] = useState<{ top: string | null; left: string | null; right: string | null }>({ top: null, left: null, right: null });

  // 意象海图（静观三角）：contemplate=静观 / shrink=三角收缩动效 / compass=三象罗盘展示
  const [mapPhase, setMapPhase] = useState<'contemplate' | 'shrink' | 'compass'>('contemplate');

  const resonanceCircleLayout = useResonanceCircleLayout();

  // 切换阶段时重置当前问题的展示状态，避免从章节导航返回时还显示上次的反馈
  useEffect(() => {
    switch (subPhase) {
      case 'resonance-q':
        setResonanceShowFeedback(false);
        setResonanceSelected(null);
        break;
      case 'opposite-q':
        setOppositeShowFeedback(false);
        setOppositeSelected(null);
        break;
      case 'transcendence-q':
        setTranscendenceSubmitted(false);
        setTranscendenceSelected(null);
        break;
      case 'root-q':
        setRootShowFeedback(false);
        setRootSelected(null);
        break;
      case 'challenge-q':
        setChallengeShowFeedback(false);
        setChallengeSelected(null);
        break;
      case 'integration-q':
        setIntegrationSubmitted(false);
        setIntegrationText('');
        break;
      case 'symbol-triangle':
        setTrianglePlacements({ top: null, left: null, right: null });
        break;
      case 'imagery-map':
        setMapPhase('contemplate');
        break;
      default:
        break;
    }
  }, [subPhase]);

  // 根据阶段选择背景图 - 第三章所有阶段都使用意象之海背景
  const getBackgroundImage = () => {
    return SCENE_IMAGES.imagerySea;
  };

  // 根据阶段选择粒子效果 - 第三章所有阶段都使用星光粒子
  const getParticleType = (): 'embers' | 'stardust' | 'mist' => {
    return 'stardust';
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      <SceneBackground imageUrl={getBackgroundImage()} overlay="rgba(0,0,0,0.4)" />
      <Particles type={getParticleType()} count={52} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 w-full box-border">
        {/* Chapter header */}

        <AnimatePresence mode="wait">
          {/* INTRO */}
          {subPhase === 'intro' && (
            <motion.div
              key="ch3-intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl text-center"
            >
              <TypeWriter
                text="你来到了心灵的意象之海。这里沉睡着来自集体无意识的古老符号。它们并非谜语，而是心灵的母语。"
                speed={70}
                className="text-base md:text-lg leading-loose mb-8"
                style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
                onComplete={() => setIntroComplete(true)}
              />

              {introComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="max-w-xl mx-auto"
                >
                  {!introQuestionPassed ? (
                    <>
                      <p className="text-base md:text-lg italic mb-8 leading-relaxed" style={{ fontFamily: 'EB Garamond, serif', color: '#8BA4B8' }}>
                        {INTRO_GATE_QUESTION.narrative}
                      </p>
                      {gateSelected !== null && gateSelected !== INTRO_GATE_QUESTION.correctOptionId && (
                        <p className="text-sm italic mb-6 leading-relaxed" style={{ fontFamily: 'EB Garamond, serif', color: '#d4c5a0' }}>
                          这片海不会给你答案——它只会先把你浸透。
                        </p>
                      )}
                      <div className="flex flex-col gap-3 mb-6">
                        {INTRO_GATE_QUESTION.options.map((opt) => {
                          const isSelected = gateSelected === opt.id;
                          const isCorrect = opt.id === INTRO_GATE_QUESTION.correctOptionId;
                          const canClick = !introQuestionPassed;
                          return (
                            <motion.button
                              key={opt.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              onClick={() => {
                                if (!canClick) return;
                                playSfx('sfx-choice');
                                setGateSelected(opt.id);
                                onQuestionAnswer(INTRO_GATE_QUESTION.id, opt.id);
                                if (opt.id === INTRO_GATE_QUESTION.correctOptionId) {
                                  setIntroQuestionPassed(true);
                                  onSubPhaseChange('imagery-sea');
                                }
                              }}
                              disabled={!canClick}
                              className={`px-6 py-3 text-sm text-center transition-all rounded ${
                                isSelected ? (isCorrect ? 'bg-[#8BA4B8]/20 border-[#8BA4B8]' : 'bg-amber-900/20 border-amber-600/60') : 'border-[#8BA4B8]/30 hover:bg-[#8BA4B8]/10'
                              }`}
                              style={{
                                fontFamily: 'Noto Serif SC, serif',
                                color: isSelected ? (isCorrect ? '#8BA4B8' : '#d4c5a0') : '#d4c5a0',
                                border: `1px solid ${isSelected ? (isCorrect ? 'rgba(139, 164, 184, 0.7)' : 'rgba(180, 140, 80, 0.6)') : 'rgba(139, 164, 184, 0.3)'}`,
                                cursor: canClick ? 'pointer' : 'default',
                              }}
                            >
                              {opt.text}
                            </motion.button>
                          );
                        })}
                      </div>
                    </>
                  ) : null}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* IMAGERY SEA — First Task: Explore the Imagery Sea */}
          {subPhase === 'imagery-sea' && (
            <motion.div
              key="ch3-imagery-sea"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <ImagerySeaTask
                onExplored={(count) => {
                  // 可以在这里处理探索进度
                  console.log(`Explored ${count} symbols`);
                }}
                onContinue={() => handlePhase('resonance-q')}
              />
            </motion.div>
          )}

          {/* 共鸣 / 对立 / 调停 — 统一问题样式：问题 1/3、2/3、3/3，与其它章节一致 */}
          {subPhase === 'resonance-q' && (
            <motion.div
              key="resonance-q"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-xs uppercase tracking-[0.3em] mb-6 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#C4A35A' }}>
                问题 1/3
              </div>
              <h3 className="text-lg md:text-xl mb-8 leading-relaxed text-center" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
                在刚刚相遇的意象中，哪一个让你感到最深刻的触动、熟悉或吸引？
              </h3>
              {!resonanceShowFeedback ? (
                <div className="flex justify-center overflow-visible mb-6" style={{ minHeight: '460px' }}>
                  <div className="relative overflow-visible" style={{ width: 460, height: 460 }}>
                    {IMAGERY_SYMBOLS.map((sym, index) => {
                      const layout = resonanceCircleLayout[index];
                      if (!layout) return null;
                      return (
                        <motion.button
                          key={sym.id}
                          initial={{ opacity: 0.6, scale: 0.6 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            x: [0, 3, -2, 0],
                            y: [0, -2, 2, 0],
                          }}
                          transition={{
                            delay: index * 0.05,
                            opacity: { duration: 0.2 },
                            scale: { duration: 0.2 },
                            x: { duration: 3.5 + index * 0.2, repeat: Infinity, ease: 'easeInOut' },
                            y: { duration: 4 + index * 0.2, repeat: Infinity, ease: 'easeInOut' },
                          }}
                          onClick={() => {
                            playSfx('sfx-choice');
                            setResonanceSelected(sym.id);
                            setResonanceShowFeedback(true);
                            onQuestionAnswer('chapter3-resonance', sym.id, 'symbol-unconscious-language');
                          }}
                          className="absolute flex flex-col items-center justify-center rounded-full border-2 transition-all hover:scale-105 cursor-pointer pb-2"
                          style={{
                            left: layout.left,
                            top: layout.top,
                            width: 78,
                            height: 78,
                            fontFamily: 'Noto Serif SC, serif',
                            color: '#d4c5a0',
                            borderColor: 'rgba(230, 232, 240, 0.85)',
                            background: `radial-gradient(circle at 35% 35%, ${sym.color}99, ${sym.color}44)`,
                            boxShadow: `0 0 12px ${sym.color}55`,
                          }}
                        >
                          <ImageryIcon symbol={sym} size={28} />
                          <span className="text-xs mt-0.5">{sym.name}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-lg"
                  style={{ background: 'rgba(196, 163, 90, 0.1)', border: '1px solid rgba(196, 163, 90, 0.3)' }}
                >
                  <p className="text-sm italic mb-2" style={{ fontFamily: 'EB Garamond, serif', color: '#C4A35A' }}>
                    {resonanceSelected ? getResonanceFeedback(resonanceSelected) : ''}
                  </p>
                  <p className="text-xs mt-2 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#FFD700' }}>✦ 获得知识卡片 ✦</p>
                  <button
                    onClick={() => handlePhase('opposite-q')}
                    className="mt-4 w-full px-6 py-3 text-sm rounded-lg border transition-all hover:bg-[#C4A35A]/10"
                    style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4A35A', borderColor: 'rgba(196, 163, 90, 0.5)' }}
                  >
                    继续
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {subPhase === 'opposite-q' && (() => {
            const resonanceId = questionAnswers['chapter3-resonance'];
            const options = resonanceId ? getOppositeOptions(resonanceId) : [];
            const resonanceName = resonanceId ? IMAGERY_SYMBOLS.find(s => s.id === resonanceId)?.name : '';
            return (
              <motion.div
                key="opposite-q"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-xs uppercase tracking-[0.3em] mb-6 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#C4A35A' }}>
                  问题 2/3
                </div>
                <h3 className="text-lg md:text-xl mb-8 leading-relaxed text-center" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
                  每个核心意象往往呼唤着它的对立面，以维持心灵的平衡。你认为，与你选择的「{resonanceName || '共鸣意象'}」最构成互补或张力关系的意象是什么？
                </h3>
                {!oppositeShowFeedback ? (
                  <div className="flex justify-center gap-12 mb-6 flex-wrap">
                    {options.map((sym, index) => (
                      <motion.button
                        key={sym.id}
                        initial={{ opacity: 0.6, scale: 0.6 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: [0, 4, -3, 0],
                          y: [0, -3, 2, 0],
                        }}
                        transition={{
                          delay: index * 0.1,
                          opacity: { duration: 0.25 },
                          scale: { duration: 0.25 },
                          x: { duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut' },
                          y: { duration: 4.5 + index * 0.5, repeat: Infinity, ease: 'easeInOut' },
                        }}
                        onClick={() => {
                          playSfx('sfx-choice');
                          setOppositeSelected(sym.id);
                          setOppositeShowFeedback(true);
                          onQuestionAnswer('chapter3-opposite', sym.id, 'opposites-tension');
                        }}
                        className="flex flex-col items-center justify-center rounded-full border-2 transition-all hover:scale-110 cursor-pointer pb-2"
                        style={{
                          width: 88,
                          height: 88,
                          fontFamily: 'Noto Serif SC, serif',
                          color: '#d4c5a0',
                          borderColor: 'rgba(196, 163, 90, 0.85)',
                          background: 'radial-gradient(circle at 35% 35%, rgba(220,224,238,0.6), rgba(200,204,220,0.35))',
                          boxShadow: '0 0 14px rgba(220,224,240,0.5), 0 0 28px rgba(200,204,225,0.25), inset 0 0 12px rgba(235,238,248,0.2)',
                        }}
                      >
                        <ImageryIcon symbol={sym} size={36} />
                        <span className="text-xs mt-0.5">{sym.name}</span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(196, 163, 90, 0.1)', border: '1px solid rgba(196, 163, 90, 0.3)' }}>
                    <p className="text-sm italic mb-2" style={{ fontFamily: 'EB Garamond, serif', color: '#C4A35A' }}>
                      {resonanceId && oppositeSelected ? getOppositeFeedback(resonanceId, oppositeSelected) : ''}
                    </p>
                    <p className="text-xs mt-2 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#FFD700' }}>✦ 获得知识卡片 ✦</p>
                    <button
                      onClick={() => handlePhase('transcendence-q')}
                      className="mt-4 w-full px-6 py-3 text-sm rounded-lg border transition-all hover:bg-[#C4A35A]/10"
                      style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4A35A', borderColor: 'rgba(196, 163, 90, 0.5)' }}
                    >
                      继续
                    </button>
                  </motion.div>
                )}
              </motion.div>
            );
          })()}

          {subPhase === 'transcendence-q' && (
            <motion.div
              key="transcendence-q"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-xs uppercase tracking-[0.3em] mb-6 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#C4A35A' }}>
                问题 3/3
              </div>
              <h3 className="text-lg md:text-xl mb-8 leading-relaxed text-center" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
                现在，想象一个能连接或调和前两个意象的「第三物」。请从下列符号中选择一个最能代表它的。
              </h3>
              {!transcendenceSubmitted ? (
                <div className="flex justify-center overflow-visible mb-6" style={{ minHeight: '460px' }}>
                  <div className="relative overflow-visible" style={{ width: 460, height: 460 }}>
                    {TRANSCENDENCE_SYMBOLS.map((sym, index) => {
                      const layout = resonanceCircleLayout[index];
                      if (!layout) return null;
                      return (
                        <motion.button
                          key={sym.id}
                          initial={{ opacity: 0.6, scale: 0.6 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            x: [0, 3, -2, 0],
                            y: [0, -2, 2, 0],
                          }}
                          transition={{
                            delay: index * 0.05,
                            opacity: { duration: 0.2 },
                            scale: { duration: 0.2 },
                            x: { duration: 3.5 + index * 0.2, repeat: Infinity, ease: 'easeInOut' },
                            y: { duration: 4 + index * 0.2, repeat: Infinity, ease: 'easeInOut' },
                          }}
                          onClick={() => {
                            playSfx('sfx-choice');
                            setTranscendenceSelected(sym.id);
                            setTranscendenceSubmitted(true);
                            onQuestionAnswer('chapter3-transcendence', sym.id, 'transcendence-function');
                          }}
                          title={sym.name}
                          className="absolute flex items-center justify-center rounded-full border-2 transition-all hover:scale-105 cursor-pointer"
                          style={{
                            left: layout.left,
                            top: layout.top,
                            width: 78,
                            height: 78,
                            borderColor: 'rgba(196, 163, 90, 0.85)',
                            background: 'radial-gradient(circle at 35% 35%, rgba(196,163,90,0.45), rgba(196,163,90,0.18))',
                            boxShadow: '0 0 14px rgba(196,163,90,0.45), 0 0 24px rgba(196,163,90,0.2)',
                          }}
                        >
                          <TranscendenceRuneIcon id={sym.id} size={36} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(196, 163, 90, 0.1)', border: '1px solid rgba(196, 163, 90, 0.3)' }}>
                  <p className="text-sm italic mb-2" style={{ fontFamily: 'EB Garamond, serif', color: '#C4A35A' }}>
                    你选择了「{TRANSCENDENCE_SYMBOLS.find(s => s.id === transcendenceSelected)?.name ?? transcendenceSelected}」。{TRANSCENDENCE_FEEDBACK}
                  </p>
                  <p className="text-xs mt-2 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#FFD700' }}>✦ 获得知识卡片 ✦</p>
                  <button
                    onClick={() => handlePhase('symbol-triangle')}
                    className="mt-4 w-full px-6 py-3 text-sm rounded-lg border transition-all hover:bg-[#C4A35A]/10"
                    style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4A35A', borderColor: 'rgba(196, 163, 90, 0.5)' }}
                  >
                    继续
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
          {subPhase === 'symbol-triangle' && (() => {
            const resonanceId = questionAnswers['chapter3-resonance'];
            const oppositeId = questionAnswers['chapter3-opposite'];
            const transcendenceId = questionAnswers['chapter3-transcendence'] || '';
            const resSym = IMAGERY_SYMBOLS.find(s => s.id === resonanceId);
            const oppSym = IMAGERY_SYMBOLS.find(s => s.id === oppositeId);
            const transcendenceName = transcendenceId ? (TRANSCENDENCE_SYMBOLS.find(s => s.id === transcendenceId)?.name ?? '') : '';
            const allPlaced = trianglePlacements.top && trianglePlacements.left && trianglePlacements.right;

            const handleDrop = (vertex: 'top' | 'left' | 'right') => (e: React.DragEvent) => {
              e.preventDefault();
              const key = e.dataTransfer.getData('text/plain');
              if (key && ['resonance', 'opposite', 'transcendence'].includes(key)) {
                setTrianglePlacements(prev => ({ ...prev, [vertex]: key }));
              }
            };

            const renderVertex = (vertex: 'top' | 'left' | 'right') => {
              const key = trianglePlacements[vertex];
              return (
                <div
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                  onDrop={handleDrop(vertex)}
                  className={`absolute flex flex-col items-center justify-center rounded-full border-2 transition-all pb-1 ${!key ? 'border-dashed hover:border-amber-400/50' : ''}`}
                  style={{
                    width: 56,
                    height: 56,
                    borderColor: key ? 'rgba(139,164,184,0.6)' : 'rgba(139,164,184,0.3)',
                    background: key ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)',
                  }}
                  title={!key ? '拖拽光球到此处' : ''}
                >
                  {key === 'resonance' && resSym && <><ImageryIcon symbol={resSym} size={24} /><span className="text-[10px] mt-0.5" style={{ color: '#d4c5a0' }}>{resSym.name}</span></>}
                  {key === 'opposite' && oppSym && <><ImageryIcon symbol={oppSym} size={24} /><span className="text-[10px] mt-0.5" style={{ color: '#d4c5a0' }}>{oppSym.name}</span></>}
                  {key === 'transcendence' && <TranscendenceRuneIcon id={transcendenceId} size={24} />}
                  {!key && <span className="text-[10px]" style={{ color: 'rgba(212,197,160,0.5)' }}>拖放至此</span>}
                </div>
              );
            };

            const spheres: { key: string; label: string; placed: boolean; node: ReactNode }[] = [
              { key: 'resonance', label: '共鸣', placed: [trianglePlacements.top, trianglePlacements.left, trianglePlacements.right].includes('resonance'), node: resSym ? <><ImageryIcon symbol={resSym} size={28} /><span className="text-xs mt-0.5">{resSym.name}</span></> : null },
              { key: 'opposite', label: '对立', placed: [trianglePlacements.top, trianglePlacements.left, trianglePlacements.right].includes('opposite'), node: oppSym ? <><ImageryIcon symbol={oppSym} size={28} /><span className="text-xs mt-0.5">{oppSym.name}</span></> : null },
              { key: 'transcendence', label: '调和', placed: [trianglePlacements.top, trianglePlacements.left, trianglePlacements.right].includes('transcendence'), node: <TranscendenceRuneIcon id={transcendenceId} size={28} /> },
            ];

            return (
              <motion.div
                key="symbol-triangle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto text-center"
              >
                <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}>
                  中间任务：构筑象征三角
                </p>
                <h3 className="text-sm uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}>
                  象征三角
                </h3>
                <p className="text-sm mb-10 leading-relaxed" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
                  请将你选择的三个意象——共鸣之物、对立之影、调和之灵——拖拽到三角形的顶点上。
                </p>
                <div className="relative mx-auto mb-6" style={{ width: 280, height: 260 }}>
                  <svg viewBox="0 0 200 180" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 8px rgba(139,164,184,0.4))' }} preserveAspectRatio="xMidYMid meet">
                    <path d="M100 0 L20 135 L180 135 Z" fill="none" stroke="rgba(139,164,184,0.5)" strokeWidth="2" />
                  </svg>
                  {/* 三角重心与容器圆心 (140,130) 重合：viewBox 顶点 (100,0)/(20,135)/(180,135) → (140,4)/(28,193)/(252,193) */}
                  <div className="absolute flex flex-col items-center justify-center" style={{ left: 140, top: 4, width: 56, height: 56, transform: 'translate(-50%, -50%)' }}>
                    {renderVertex('top')}
                  </div>
                  <div className="absolute flex flex-col items-center justify-center" style={{ left: 28, top: 193, width: 56, height: 56, transform: 'translate(-50%, -50%)' }}>
                    {renderVertex('left')}
                  </div>
                  <div className="absolute flex flex-col items-center justify-center" style={{ left: 252, top: 193, width: 56, height: 56, transform: 'translate(-50%, -50%)' }}>
                    {renderVertex('right')}
                  </div>
                </div>
                {!allPlaced && (
                  <p className="text-xs mb-4" style={{ fontFamily: 'Noto Serif SC', color: '#8BA4B8' }}>
                    将光球拖拽到三角形顶点上
                  </p>
                )}
                <div className="flex justify-center gap-8 mb-6 flex-wrap mt-4">
                  {spheres.map(({ key, label, placed, node }) => (
                    <motion.div
                      key={key}
                      draggable={!placed}
                      onDragStart={(e) => {
                        if (placed) return;
                        e.dataTransfer.setData('text/plain', key);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      animate={{ opacity: placed ? 0.5 : 1, scale: placed ? 0.9 : 1 }}
                      className={`flex flex-col items-center justify-center rounded-full border-2 transition-all select-none pb-2 ${placed ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
                      style={{
                        width: 72,
                        height: 72,
                        borderColor: placed ? 'rgba(139,164,184,0.3)' : key === 'resonance' ? 'rgba(230,232,240,0.85)' : key === 'opposite' ? 'rgba(196,163,90,0.85)' : 'rgba(196,163,90,0.85)',
                        background: key === 'resonance' && resSym ? `radial-gradient(circle at 35% 35%, ${resSym.color}88, ${resSym.color}44)` : key === 'opposite' && oppSym ? 'radial-gradient(circle at 35% 35%, rgba(220,224,238,0.6), rgba(200,204,220,0.35))' : key === 'transcendence' ? 'radial-gradient(circle at 35% 35%, rgba(196,163,90,0.45), rgba(196,163,90,0.18))' : 'rgba(0,0,0,0.2)',
                        boxShadow: placed ? 'none' : key === 'transcendence' ? '0 0 12px rgba(196,163,90,0.45), 0 0 20px rgba(196,163,90,0.2)' : key === 'opposite' ? '0 0 12px rgba(220,224,240,0.45), 0 0 20px rgba(200,204,225,0.2)' : '0 0 10px rgba(200,200,210,0.35)',
                      }}
                      title={placed ? '已放置' : `拖拽「${label}」到顶点`}
                    >
                      {node}
                    </motion.div>
                  ))}
                </div>
                {allPlaced && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                    <p className="text-sm italic mb-4" style={{ fontFamily: 'EB Garamond, serif', color: '#d4c5a0' }}>
                      三角已稳固。它们在你内心构成了一个稳定的结构。
                    </p>
                    <button
                      onClick={() => handlePhase('root-q')}
                      className="px-6 py-3 text-sm rounded border transition-all hover:bg-[#8BA4B8]/10"
                      style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8', borderColor: 'rgba(139, 164, 184, 0.5)' }}
                    >
                      继续
                    </button>
                  </motion.div>
                )}
              </motion.div>
            );
          })()}

          {subPhase === 'root-q' && (
            <motion.div key="root-q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto text-center px-4 sm:px-6 w-full">
              <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}>问题 1/3</p>
              <p className="text-lg md:text-xl mb-6 leading-relaxed" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
                你的「共鸣意象」它的特质是否曾在你生命早期的某个梦境、记忆或痴迷的事物中出现过？
              </p>
              {!rootShowFeedback ? (
                <div className="flex flex-col gap-3 w-full">
                  {ROOT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        playSfx('sfx-choice');
                        setRootSelected(opt.id);
                        setRootShowFeedback(true);
                        onQuestionAnswer('chapter3-root', opt.id, 'archetype-complex');
                      }}
                      className="w-full px-6 py-3 text-sm rounded border text-left transition-all hover:bg-[#8BA4B8]/10"
                      style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0', borderColor: 'rgba(139, 164, 184, 0.4)' }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-left max-w-xl mx-auto">
                  <p className="text-sm italic mb-4 p-4 rounded" style={{ fontFamily: 'EB Garamond, serif', color: '#d4c5a0', background: 'rgba(139, 164, 184, 0.1)', border: '1px solid rgba(139, 164, 184, 0.3)' }}>{ROOT_FEEDBACK}</p>
                  <p className="text-xs mb-6 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#FFD700' }}>✦ 获得知识卡片：【原型与个人情结】</p>
                  <button onClick={() => handlePhase('challenge-q')} className="px-6 py-3 text-sm w-full rounded border transition-all hover:bg-[#8BA4B8]/10" style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8', borderColor: 'rgba(139, 164, 184, 0.5)' }}>继续</button>
                </motion.div>
              )}
            </motion.div>
          )}

          {subPhase === 'challenge-q' && (() => {
            const oppositeId = questionAnswers['chapter3-opposite'];
            const oppositeName = oppositeId ? IMAGERY_SYMBOLS.find(s => s.id === oppositeId)?.name : '对立意象';
            const options = [
              { id: 'at-ease', text: '自如运用，它是我力量的一部分。', feedback: '很好，这表明这对立面的张力在你内心是活跃且富有创造性的。' },
              { id: 'limited', text: '感到受限，它常与我作对或让我不适。', feedback: '这正指出了心灵成长的一个潜在方向。这个对立面可能携带着被你忽略的重要能量。' },
              { id: 'both', text: '两者之间，时好时坏。', feedback: '这表明你与它的关系正在动态变化中，是活生生的心理过程。' },
            ];
            return (
              <motion.div key="challenge-q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto text-center px-4 sm:px-6 w-full">
                <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}>问题 2/3</p>
                <p className="text-lg md:text-xl mb-6 leading-relaxed" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
                  那个「{oppositeName}」代表的能量或特质，目前在现实生活中是让你感到自如运用的，还是感到受限或冲突的？
                </p>
                {!challengeShowFeedback ? (
                  <div className="flex flex-col gap-3 w-full">
                    {options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          playSfx('sfx-choice');
                          setChallengeSelected(opt.id);
                          setChallengeShowFeedback(true);
                          onQuestionAnswer('chapter3-challenge', opt.id, 'shadow-gift');
                        }}
                        className="w-full px-6 py-3 text-sm rounded border text-left transition-all hover:bg-[#8BA4B8]/10"
                        style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0', borderColor: 'rgba(139, 164, 184, 0.4)' }}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-left max-w-xl mx-auto">
                    <p className="text-sm italic mb-4 p-4 rounded" style={{ fontFamily: 'EB Garamond, serif', color: '#d4c5a0', background: 'rgba(139, 164, 184, 0.1)', border: '1px solid rgba(139, 164, 184, 0.3)' }}>
                      {options.find(o => o.id === challengeSelected)?.feedback}
                    </p>
                    <p className="text-xs mb-6 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#FFD700' }}>✦ 获得知识卡片：【阴影的馈赠】</p>
                    <button onClick={() => handlePhase('integration-q')} className="px-6 py-3 text-sm w-full rounded border transition-all hover:bg-[#8BA4B8]/10" style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8', borderColor: 'rgba(139, 164, 184, 0.5)' }}>继续</button>
                  </motion.div>
                )}
              </motion.div>
            );
          })()}

          {subPhase === 'integration-q' && (
            <motion.div key="integration-q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto text-center px-4 sm:px-6 w-full">
              <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}>问题 3/3</p>
              <p className="text-lg md:text-xl mb-6 leading-relaxed" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
                如果请你的「调和意象」为当前生活中的一个真实挑战提供启示，它会给出怎样的一句隐喻或画面？
              </p>
              {!integrationSubmitted ? (
                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    value={integrationText}
                    onChange={(e) => setIntegrationText(e.target.value)}
                    placeholder="一句隐喻或画面"
                    className="w-full px-4 py-3 rounded border bg-black/30 text-left placeholder:opacity-60"
                    style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0', borderColor: 'rgba(139, 164, 184, 0.4)' }}
                  />
                  <button
                    onClick={() => {
                      if (integrationText.trim()) {
                        playSfx('sfx-choice');
                        onQuestionAnswer('chapter3-integration', integrationText.trim(), 'active-imagination');
                        setIntegrationSubmitted(true);
                      }
                    }}
                    disabled={!integrationText.trim()}
                    className="mt-4 px-6 py-3 text-sm w-full rounded border transition-all hover:bg-[#8BA4B8]/10 disabled:opacity-50"
                    style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8', borderColor: 'rgba(139, 164, 184, 0.5)' }}
                  >
                    提交
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-left max-w-xl mx-auto">
                  <p className="text-sm italic mb-4 p-4 rounded" style={{ fontFamily: 'EB Garamond, serif', color: '#d4c5a0', background: 'rgba(139, 164, 184, 0.1)', border: '1px solid rgba(139, 164, 184, 0.3)' }}>{INTEGRATION_FEEDBACK}</p>
                  <p className="text-xs mb-6 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#FFD700' }}>✦ 获得知识卡片：【积极想象】</p>
                  <button onClick={() => handlePhase('imagery-map')} className="px-6 py-3 text-sm w-full rounded border transition-all hover:bg-[#8BA4B8]/10" style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8', borderColor: 'rgba(139, 164, 184, 0.5)' }}>继续</button>
                </motion.div>
              )}
            </motion.div>
          )}

          {subPhase === 'imagery-map' && (() => {
            const resonanceId = questionAnswers['chapter3-resonance'];
            const oppositeId = questionAnswers['chapter3-opposite'];
            const transcendenceId = questionAnswers['chapter3-transcendence'] || '';
            const resSym = IMAGERY_SYMBOLS.find(s => s.id === resonanceId);
            const oppSym = IMAGERY_SYMBOLS.find(s => s.id === oppositeId);

            const handleReady = () => {
              setMapPhase('shrink');
              setTimeout(() => setMapPhase('compass'), 3000);
            };

            return (
              <motion.div key="imagery-map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto text-center">
                {mapPhase === 'contemplate' && (
                  <>
                    <p className="text-base mb-10 leading-relaxed" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
                      在这片意象之海中，静观你的三角片刻。当你准备好，就让它凝聚成罗盘。
                    </p>
                    <div className="relative flex items-center justify-center my-12 overflow-visible" style={{ minHeight: 280 }}>
                      <motion.div
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(139,164,184,0.3), 0 0 40px rgba(196,163,90,0.15)',
                            '0 0 32px rgba(139,164,184,0.5), 0 0 60px rgba(196,163,90,0.25)',
                            '0 0 20px rgba(139,164,184,0.3), 0 0 40px rgba(196,163,90,0.15)',
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute rounded-full pointer-events-none"
                        style={{ width: 220, height: 220 }}
                      />
                      <div className="relative overflow-visible" style={{ width: 140, height: 126 }}>
                        <svg viewBox="0 0 100 90" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 12px rgba(139,164,184,0.6))' }}>
                          <path d="M50 0 L8 67.5 L92 67.5 Z" fill="none" stroke="rgba(139,164,184,0.7)" strokeWidth="2" />
                        </svg>
                        {/* 三角重心与圆心重合：viewBox 顶点 (50,0)/(8,67.5)/(92,67.5) → 容器 140x126 下 (70,0)/(11.2,94.5)/(128.8,94.5)，球 r=22 */}
                        <div className="absolute flex items-center justify-center rounded-full border-2 flex-col pb-0.5" style={{ width: 44, height: 44, left: 70 - 22, top: 0 - 22, borderColor: 'rgba(230,232,240,0.85)', background: resSym ? `radial-gradient(circle at 35% 35%, ${resSym.color}99, ${resSym.color}44)` : 'rgba(0,0,0,0.2)', boxShadow: resSym ? `0 0 12px ${resSym.color}55` : 'none' }}>
                          {resSym && <ImageryIcon symbol={resSym} size={22} />}
                        </div>
                        <div className="absolute flex items-center justify-center rounded-full border-2 flex-col pb-0.5" style={{ width: 44, height: 44, left: 11.2 - 22, top: 94.5 - 22, borderColor: 'rgba(196,163,90,0.85)', background: 'radial-gradient(circle at 35% 35%, rgba(220,224,238,0.6), rgba(200,204,220,0.35))', boxShadow: '0 0 12px rgba(220,224,240,0.45)' }}>
                          {oppSym && <ImageryIcon symbol={oppSym} size={22} />}
                        </div>
                        <div className="absolute flex items-center justify-center rounded-full border-2" style={{ width: 44, height: 44, left: 128.8 - 22, top: 94.5 - 22, borderColor: 'rgba(196,163,90,0.85)', background: 'radial-gradient(circle at 35% 35%, rgba(196,163,90,0.45), rgba(196,163,90,0.18))', boxShadow: '0 0 14px rgba(196,163,90,0.45)' }}>
                          <TranscendenceRuneIcon id={transcendenceId} size={22} />
                        </div>
                      </div>
                    </div>
                    <motion.button
                      initial={{ opacity: 0.8 }}
                      whileHover={{ scale: 1.05, opacity: 1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReady}
                      className="px-10 py-4 text-sm rounded border transition-all"
                      style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4A35A', borderColor: 'rgba(196,163,90,0.6)', boxShadow: '0 0 20px rgba(196,163,90,0.2)' }}
                    >
                      我准备好了
                    </motion.button>
                  </>
                )}

                {mapPhase === 'shrink' && (
                  <div className="relative flex items-center justify-center my-8" style={{ minHeight: 340 }}>
                    {/* 外层光晕扩散 */}
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      initial={{ width: 180, height: 180, opacity: 0.5 }}
                      animate={{ width: 420, height: 420, opacity: 0 }}
                      transition={{ duration: 1.4, ease: 'easeOut' }}
                      style={{
                        border: '2px solid rgba(255,215,0,0.7)',
                        boxShadow: '0 0 80px rgba(255,215,0,0.5), inset 0 0 40px rgba(255,215,0,0.1)',
                      }}
                    />
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      initial={{ width: 240, height: 240, opacity: 0.5 }}
                      animate={{ width: 400, height: 400, opacity: 0 }}
                      transition={{ duration: 1.8, ease: 'easeOut' }}
                      style={{
                        boxShadow: '0 0 100px rgba(196,163,90,0.6), 0 0 160px rgba(255,215,0,0.25)',
                      }}
                    />
                    {/* 三角：scale 收缩 + 发光增强 + 淡出 */}
                    <motion.div
                      className="relative flex items-center justify-center"
                      style={{ width: 140, height: 126 }}
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{
                        scale: 0.15,
                        opacity: [1, 1, 1, 0],
                      }}
                      transition={{
                        scale: { duration: 2, ease: [0.25, 0.46, 0.45, 0.94] },
                        opacity: { duration: 0.25, delay: 1.85 },
                      }}
                    >
                      <motion.div
                        className="w-full h-full"
                        animate={{
                          filter: [
                            'drop-shadow(0 0 12px rgba(139,164,184,0.6)) drop-shadow(0 0 28px rgba(255,215,0,0.2))',
                            'drop-shadow(0 0 28px rgba(255,215,0,0.7)) drop-shadow(0 0 56px rgba(255,215,0,0.4))',
                            'drop-shadow(0 0 48px rgba(255,255,255,0.8)) drop-shadow(0 0 90px rgba(255,215,0,0.7))',
                          ],
                        }}
                        transition={{ duration: 1.9, ease: 'easeInOut' }}
                      >
                        <svg viewBox="0 0 100 90" className="w-full h-full">
                          <motion.path
                            d="M50 8 L92 82 L8 82 Z"
                            fill="none"
                            strokeWidth={2.5}
                            initial={{ stroke: 'rgba(139,164,184,0.75)' }}
                            animate={{ stroke: 'rgba(255,215,0,1)' }}
                            transition={{ duration: 1, ease: 'easeInOut' }}
                          />
                        </svg>
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute flex items-center justify-center rounded-full border-2" style={{ width: 44, height: 44, left: 70 - 22, top: 11.2 - 22, borderColor: 'rgba(230,232,240,0.85)', background: resSym ? `radial-gradient(circle at 35% 35%, ${resSym.color}99, ${resSym.color}44)` : 'transparent', boxShadow: resSym ? `0 0 10px ${resSym.color}66` : 'none' }}>
                            {resSym && <ImageryIcon symbol={resSym} size={22} />}
                          </div>
                          <div className="absolute flex items-center justify-center rounded-full border-2" style={{ width: 44, height: 44, left: 11.2 - 22, top: 114.8 - 22, borderColor: 'rgba(196,163,90,0.85)', background: 'radial-gradient(circle at 35% 35%, rgba(220,224,238,0.6), rgba(200,204,220,0.35))', boxShadow: '0 0 10px rgba(220,224,240,0.5)' }}>
                            {oppSym && <ImageryIcon symbol={oppSym} size={22} />}
                          </div>
                          <div className="absolute flex items-center justify-center rounded-full border-2" style={{ width: 44, height: 44, left: 128.8 - 22, top: 114.8 - 22, borderColor: 'rgba(196,163,90,0.85)', background: 'radial-gradient(circle at 35% 35%, rgba(196,163,90,0.45), rgba(196,163,90,0.18))', boxShadow: '0 0 12px rgba(196,163,90,0.5)' }}>
                            <TranscendenceRuneIcon id={transcendenceId} size={22} />
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                    {/* 收缩完成瞬间的闪白：放慢，先亮起再缓缓淡出 */}
                    <motion.div
                      className="absolute rounded-full pointer-events-none"
                      initial={{ width: 0, height: 0, opacity: 0 }}
                      animate={{
                        width: [0, 220, 380, 520],
                        height: [0, 220, 380, 520],
                        opacity: [0, 0.75, 0.7, 0],
                      }}
                      transition={{
                        duration: 1.2,
                        delay: 1.65,
                        ease: 'easeOut',
                        times: [0, 0.25, 0.6, 1],
                      }}
                      style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.92) 0%, rgba(255,215,0,0.45) 38%, transparent 68%)',
                        boxShadow: '0 0 120px rgba(255,255,255,0.5)',
                      }}
                    />
                  </div>
                )}

                {mapPhase === 'compass' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="mb-6"
                  >
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.45, ease: 'easeOut' }}
                      className="text-sm mb-4"
                      style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
                    >
                      三角发出微光，收缩凝聚成古朴的「三象罗盘」。
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
                      className="relative mx-auto rounded-full border-2 overflow-visible"
                      style={{
                        width: 200,
                        height: 200,
                        borderColor: 'rgba(196,163,90,0.75)',
                        background: 'radial-gradient(circle at 50% 50%, rgba(25,30,45,0.98), rgba(8,10,18,0.99))',
                        boxShadow: '0 0 0 1px rgba(255,215,0,0.2), 0 0 40px rgba(196,163,90,0.4), 0 0 80px rgba(196,163,90,0.15), inset 0 0 30px rgba(0,0,0,0.5)',
                      }}
                    >
                      {/* 刻度：24 格，每 15° 一道短线；圆中心 100,100 半径 98 */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="98" fill="none" stroke="rgba(196,163,90,0.5)" strokeWidth="1.5" />
                        <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(196,163,90,0.2)" strokeWidth="0.5" />
                        {[...Array(24)].map((_, i) => {
                          const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
                          const isMajor = i % 6 === 0;
                          const r1 = 98 - (isMajor ? 12 : 6);
                          const r2 = 98;
                          const x1 = 100 + Math.cos(a) * r1;
                          const y1 = 100 + Math.sin(a) * r1;
                          const x2 = 100 + Math.cos(a) * r2;
                          const y2 = 100 + Math.sin(a) * r2;
                          return (
                            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(196,163,90,0.6)" strokeWidth={isMajor ? 2 : 1} strokeLinecap="round" />
                          );
                        })}
                        {/* 内圈等边三角形：重心 (100,100)，外接圆半径 52，顶点 (100,48)/(55,126)/(145,126)，边长 90 */}
                        <path
                          d="M100 48 L55 126 L145 126 Z"
                          fill="none"
                          stroke="rgba(139,164,184,0.45)"
                          strokeWidth="1.2"
                        />
                      </svg>
                      {/* 三角顶点光球，圆心与顶点重合。顶点 (100,48)/(55,126)/(145,126)，球 r=18 */}
                      <div className="absolute flex items-center justify-center rounded-full border-2 flex-col pb-0.5" style={{ width: 36, height: 36, left: 100 - 18, top: 48 - 18, borderColor: 'rgba(230,232,240,0.85)', background: resSym ? `radial-gradient(circle at 35% 35%, ${resSym.color}99, ${resSym.color}44)` : 'rgba(0,0,0,0.2)', boxShadow: resSym ? `0 0 10px ${resSym.color}55` : 'none' }}>
                        {resSym && <ImageryIcon symbol={resSym} size={20} />}
                      </div>
                      <div className="absolute flex items-center justify-center rounded-full border-2 flex-col pb-0.5" style={{ width: 36, height: 36, left: 55 - 18, top: 126 - 18, borderColor: 'rgba(196,163,90,0.85)', background: 'radial-gradient(circle at 35% 35%, rgba(220,224,238,0.6), rgba(200,204,220,0.35))', boxShadow: '0 0 10px rgba(220,224,240,0.45)' }}>
                        {oppSym && <ImageryIcon symbol={oppSym} size={20} />}
                      </div>
                      <div className="absolute flex items-center justify-center rounded-full border-2" style={{ width: 36, height: 36, left: 145 - 18, top: 126 - 18, borderColor: 'rgba(196,163,90,0.85)', background: 'radial-gradient(circle at 35% 35%, rgba(196,163,90,0.45), rgba(196,163,90,0.18))', boxShadow: '0 0 12px rgba(196,163,90,0.45)' }}>
                        <TranscendenceRuneIcon id={transcendenceId} size={20} />
                      </div>
                      {/* 指针在等边三角形中心 (100,100) 旋转 */}
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          width: 2,
                          height: 26,
                          left: 99,
                          top: 74,
                          background: 'linear-gradient(to top, rgba(255,215,0,0.95), rgba(196,163,90,0.5))',
                          transformOrigin: 'center 26px',
                          boxShadow: '0 0 8px rgba(255,215,0,0.6)',
                        }}
                      />
                      <motion.div
                        className="absolute rounded-full pointer-events-none"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 0.12 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          width: '100%',
                          height: '100%',
                          left: 0,
                          top: 0,
                          border: '1px solid rgba(255,215,0,0.4)',
                          borderRadius: '50%',
                          boxShadow: 'inset 0 0 25px rgba(255,215,0,0.08)',
                        }}
                      />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.65, duration: 0.4, ease: 'easeOut' }}
                      className="text-sm italic mt-5 mb-3"
                      style={{ fontFamily: 'EB Garamond, serif', color: '#8BA4B8' }}
                    >
                      罗盘中央刻着你的三个意象，指针在它们之间缓缓旋转。
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.85, duration: 0.4, ease: 'easeOut' }}
                      className="text-sm mb-5 leading-relaxed"
                      style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
                    >
                      当你在未来的旅程中感到迷失时，可以取出罗盘，静观其指向，从象征的维度重新审视处境。
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.05, duration: 0.4, ease: 'easeOut' }}
                      onClick={() => handlePhase('choice')}
                      className="px-8 py-3 text-sm rounded border transition-all hover:bg-[#8BA4B8]/10"
                      style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8', borderColor: 'rgba(139, 164, 184, 0.5)' }}
                    >
                      继续
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            );
          })()}

          {subPhase === 'choice' && (
            <motion.div
              key="ch3-choice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl text-center"
            >
              <p className="text-sm italic mb-4" style={{ fontFamily: 'EB Garamond, serif', color: '#8BA4B8' }}>
                收好罗盘。你从意象之海中缓缓回到现实。
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <p className="text-lg leading-relaxed" style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8' }}>
                  眼前有一条阶梯，通向地下室的深处。
                </p>
              </motion.div>
              <button
                onClick={() => {
                  onInventoryAdd?.('遗失的罗盘');
                  onComplete();
                }}
                className="px-8 py-3 text-sm transition-all hover:bg-[#8BA4B8]/10"
                style={{
                  fontFamily: 'Noto Serif SC, serif',
                  color: '#8BA4B8',
                  border: '1px solid rgba(139, 164, 184, 0.5)',
                }}
              >
                走向阶梯
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
