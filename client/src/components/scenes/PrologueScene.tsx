/**
 * Prologue Scene — The Desert + Mask Removal Quest
 * Design: Dark Alchemical Manuscript — deep reds and ochre, wind sounds
 * Quest: Drag title cards off-screen to strip away the Persona
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneBackground from '../SceneBackground';
import Particles from '../Particles';
import TypeWriter from '../TypeWriter';
import QuestionSystem from '../systems/QuestionSystem';
import { SCENE_IMAGES } from '@/lib/gameStore';
import { PROLOGUE_QUESTIONS } from '@/lib/questions';

interface PrologueSceneProps {
  titles: string[];
  textOpacity: number;
  loopCount: number;
  onChoice: (choice: 'A' | 'B') => void;
  onQuestComplete: () => void;
  onQuestionAnswer: (questionId: string, optionId: string, knowledgeCardId?: string) => void;
  onQuestionsComplete: () => void; // Used for masks-show complete
  onQuestionsCompleteAfterMasks: () => void; // Used for questions complete after masks
  subPhase: 'intro' | 'masks-show' | 'questions' | 'quest' | 'choice';
}

// 下方 10 个格子的固定显示顺序（与 gameStore titles 一致）
const DEFAULT_MASK_ORDER = ['乖孩子', '好学生', '好青年', '优秀员工', '老好人', '优质伴侣', '好父母', '强者', '开心果', '完美主义'];

// 剥离任务：每次放下面具后框内显示的反馈文案（按放下次数依次展示）
const QUEST_DROP_FEEDBACKS = [
  '「这不是失去，而是解脱。」',
  '「你允许自己不必再扮演。」',
  '「又少了一层重量。」',
  '「继续吧，或就此前行。」',
  '「面具曾保护你，也曾囚禁你。」',
  '「每放下一个，就更接近自己。」',
  '「不必再为谁表演。」',
  '「真实的你，不需要那么多头衔。」',
  '「灵魂从角色中透出光来。」',
  '「你已足够。」',
];

export default function PrologueScene({ titles, textOpacity, loopCount, onChoice, onQuestComplete, onQuestionAnswer, onQuestionsComplete, onQuestionsCompleteAfterMasks, subPhase }: PrologueSceneProps) {
  const [remainingTitles, setRemainingTitles] = useState(titles);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [retainAttempts, setRetainAttempts] = useState<Record<string, number>>({});
  const [introComplete, setIntroComplete] = useState(false);
  const [narrationText, setNarrationText] = useState('');
  const [showNarration, setShowNarration] = useState(false);

  // 面具展示阶段：顶部可拖拽面具列表、下方 10 个放置格
  const [remainingMasks, setRemainingMasks] = useState<string[]>(() => [...titles]);
  const [slots, setSlots] = useState<(string | null)[]>(Array(10).fill(null));
  const [draggedMask, setDraggedMask] = useState<string | null>(null);
  const draggedMaskRef = useRef<string | null>(null);
  const predefinedOrder = titles.length === 10 ? titles : DEFAULT_MASK_ORDER;

  useEffect(() => {
    setRemainingTitles(titles);
  }, [titles]);

  useEffect(() => {
    if (subPhase === 'masks-show') {
      setRemainingMasks([...titles]);
      setSlots(Array(10).fill(null));
    }
  }, [subPhase, titles]);

  // 剥离任务：顶部剩余面具、已放入框中的面具（至少 3 个可继续前进）
  const [questRemainingMasks, setQuestRemainingMasks] = useState<string[]>(() => [...titles]);
  const [questDroppedMasks, setQuestDroppedMasks] = useState<string[]>([]);
  const questDraggedRef = useRef<string | null>(null);

  useEffect(() => {
    if (subPhase === 'quest') {
      setQuestRemainingMasks([...titles]);
      setQuestDroppedMasks([]);
    }
  }, [subPhase, titles]);

  const handleDragEnd = useCallback((_title: string, _info: any) => {
    setDraggedItem(null);
  }, []);

  const handleRetain = useCallback((_title: string) => {});

  const loopNarration = loopCount > 0
    ? "时代的精神在你耳边低语：'效率、逻辑、成功'。但脚下的沙子却越陷越深。"
    : '';

  return (
    <div className="fixed inset-0">
      <SceneBackground imageUrl={SCENE_IMAGES.desert} overlay="rgba(0,0,0,0.5)" />
      <Particles type="sand" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <AnimatePresence mode="wait">
          {/* INTRO PHASE */}
          {subPhase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl text-center"
            >
              {loopCount > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  className="text-sm italic mb-8 leading-relaxed"
                  style={{ fontFamily: 'EB Garamond, serif', color: '#d4c5a0' }}
                >
                  {loopNarration}
                </motion.p>
              )}

              <TypeWriter
                text="你在烈日下行走多年，身后是宏伟的城市与堆积的荣誉。但此刻，钟声停息，你发现自己站在一片无尽的荒漠。"
                speed={80}
                className="text-lg md:text-xl leading-loose"
                style={{ fontFamily: 'Noto Serif SC, serif', color: `rgba(212, 197, 160, ${textOpacity})` } as any}
                onComplete={() => setIntroComplete(true)}
              />

              {introComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="mt-12 flex flex-col gap-4"
                >
                  <button
                    onClick={() => onChoice('A')}
                    className="px-8 py-3 text-sm transition-all hover:bg-[#C4A35A]/10"
                    style={{
                      fontFamily: 'Noto Serif SC, serif',
                      color: '#d4c5a0',
                      border: '1px solid rgba(196, 163, 90, 0.3)',
                      opacity: textOpacity,
                    }}
                  >
                    "这只是暂时的疲惫，我应回到城里，继续我的伟业。"
                  </button>
                  <button
                    onClick={() => onChoice('B')}
                    className="px-8 py-3 text-sm transition-all hover:bg-[#C4A35A]/10"
                    style={{
                      fontFamily: 'Noto Serif SC, serif',
                      color: '#C4A35A',
                      border: '1px solid rgba(196, 163, 90, 0.5)',
                    }}
                  >
                    "为何这繁华之后竟是如此寂寥？我的灵魂，你在哪里？"
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* MASKS SHOW PHASE — 顶部可拖拽面具，下方 10 个放置格 */}
          {subPhase === 'masks-show' && (
            <motion.div
              key="masks-show"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-6xl px-4 sm:px-6 box-border"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <TypeWriter
                  text="你开始审视自己，那些曾经定义你的头衔，如同面具一般浮现在眼前..."
                  speed={70}
                  className="text-base md:text-lg leading-loose mb-6"
                  style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
                  onComplete={() => {}}
                />
              </motion.div>

              {/* 顶部：可拖拽的面具图标 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <div className="flex flex-wrap justify-center gap-4">
                  {remainingMasks.map((title, index) => (
                    <motion.div
                      key={title}
                      initial={{ opacity: 0, scale: 0.5, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.15, duration: 0.4 }}
                      draggable
                      onDragStart={(e) => {
                        const ev = e as unknown as React.DragEvent<HTMLDivElement>;
                        draggedMaskRef.current = title;
                        setDraggedMask(title);
                        ev.dataTransfer.effectAllowed = 'move';
                        ev.dataTransfer.setData('text/plain', title);
                        ev.dataTransfer.setData('application/json', JSON.stringify({ title }));
                        const el = ev.currentTarget;
                        const dragImage = el.cloneNode(true) as HTMLElement;
                        dragImage.style.opacity = '0.8';
                        dragImage.style.position = 'absolute';
                        dragImage.style.top = '-1000px';
                        document.body.appendChild(dragImage);
                        ev.dataTransfer.setDragImage(dragImage, 28, 28);
                        setTimeout(() => document.body.removeChild(dragImage), 0);
                        el.style.opacity = '0.5';
                        el.style.cursor = 'grabbing';
                      }}
                      onDragEnd={(e) => {
                        setTimeout(() => {
                          draggedMaskRef.current = null;
                          setDraggedMask(null);
                        }, 200);
                        if (e.currentTarget instanceof HTMLElement) {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.cursor = 'grab';
                        }
                      }}
                      className="cursor-grab active:cursor-grabbing select-none"
                      style={{ pointerEvents: 'auto', userSelect: 'none', WebkitUserSelect: 'none' }}
                    >
                      <div
                        className="w-14 h-14 flex items-center justify-center text-3xl transition-transform hover:scale-110"
                        style={{
                          border: '2px solid rgba(196, 163, 90, 0.5)',
                          background: 'rgba(20, 15, 10, 0.95)',
                          boxShadow: '0 0 20px rgba(196, 163, 90, 0.3)',
                          borderRadius: '50%',
                        }}
                      >
                        🎭
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="w-full h-px mb-8"
                style={{ background: 'linear-gradient(to right, transparent, rgba(196, 163, 90, 0.3), transparent)' }}
              />

              {/* 下方：10 个放置格 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mb-6 w-full flex flex-col items-center"
              >
                <p className="text-sm mb-4 text-center" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                  将面具拖放到下方位置中
                </p>
                <div className="w-full flex justify-center max-w-full">
                  <div className="grid grid-cols-5 gap-2 sm:gap-4 w-full max-w-[564px] min-w-0">
                    {slots.map((slotTitle, index) => {
                      const expectedTitle = predefinedOrder[index];
                      return (
                        <motion.div
                          key={index}
                          onDragOver={(e: React.DragEvent) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                          }}
                          onDragEnter={(e: React.DragEvent) => {
                            e.preventDefault();
                            if (!slotTitle) {
                              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196, 163, 90, 0.6)';
                              (e.currentTarget as HTMLElement).style.background = 'rgba(196, 163, 90, 0.1)';
                            }
                          }}
                          onDragLeave={(e: React.DragEvent) => {
                            e.preventDefault();
                            if (!slotTitle) {
                              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196, 163, 90, 0.2)';
                              (e.currentTarget as HTMLElement).style.background = 'transparent';
                            }
                          }}
                          onDrop={(e: React.DragEvent) => {
                            e.preventDefault();
                            if (slotTitle) return;
                            let droppedTitle: string | null = e.dataTransfer.getData('text/plain') || null;
                            if (!droppedTitle) {
                              try {
                                const jsonData = e.dataTransfer.getData('application/json');
                                if (jsonData) {
                                  const parsed = JSON.parse(jsonData) as { title: string };
                                  droppedTitle = parsed.title;
                                }
                              } catch (_) {}
                            }
                            if (!droppedTitle) droppedTitle = draggedMaskRef.current || draggedMask;
                            if (!droppedTitle || !remainingMasks.includes(droppedTitle)) {
                              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196, 163, 90, 0.2)';
                              (e.currentTarget as HTMLElement).style.background = 'transparent';
                              return;
                            }
                            const newSlots = [...slots];
                            newSlots[index] = droppedTitle;
                            setSlots(newSlots);
                            setRemainingMasks(prev => prev.filter(m => m !== droppedTitle));
                            setTimeout(() => {
                              setDraggedMask(null);
                              draggedMaskRef.current = null;
                            }, 50);
                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196, 163, 90, 0.6)';
                            (e.currentTarget as HTMLElement).style.background = 'rgba(196, 163, 90, 0.05)';
                          }}
                          className="relative rounded border-2 border-dashed flex flex-col items-center justify-center transition-all w-full min-w-0"
                          style={{
                            aspectRatio: '4/5',
                            minHeight: '72px',
                            minWidth: '48px',
                            borderColor: slotTitle ? 'rgba(196, 163, 90, 0.6)' : 'rgba(196, 163, 90, 0.2)',
                            background: slotTitle ? 'rgba(196, 163, 90, 0.05)' : 'transparent',
                            padding: '6px',
                          }}
                        >
                          {slotTitle ? (
                            <>
                              <div
                                className="w-8 h-8 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center text-xl sm:text-2xl mb-1 sm:mb-2"
                                style={{
                                  border: '2px solid rgba(196, 163, 90, 0.6)',
                                  background: 'rgba(20, 15, 10, 0.95)',
                                  borderRadius: '50%',
                                  aspectRatio: '1',
                                }}
                              >
                                🎭
                              </div>
                              <div
                                className="px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs text-center leading-tight min-w-[2.5rem] sm:min-w-[3rem] inline-block"
                                style={{
                                  fontFamily: 'Noto Serif SC, serif',
                                  color: '#C4A35A',
                                  background: 'rgba(196, 163, 90, 0.12)',
                                  border: '1px solid rgba(196, 163, 90, 0.35)',
                                }}
                              >
                                {expectedTitle}
                              </div>
                            </>
                          ) : (
                            <span className="text-sm" style={{ color: 'rgba(196, 163, 90, 0.3)' }}>{index + 1}</span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {slots.every(slot => slot !== null) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm italic mb-6"
                    style={{ fontFamily: 'EB Garamond, serif', color: '#C4A35A' }}
                  >
                    "这些面具曾保护你，也曾囚禁你。现在，是时候面对它们了。"
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onQuestionsComplete}
                    className="px-8 py-3 text-sm transition-all hover:bg-[#C4A35A]/10"
                    style={{
                      fontFamily: 'Noto Serif SC, serif',
                      color: '#C4A35A',
                      border: '1px solid rgba(196, 163, 90, 0.5)',
                    }}
                  >
                    继续探索
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* QUESTIONS PHASE */}
          {subPhase === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <QuestionSystem
                questions={PROLOGUE_QUESTIONS}
                onAnswer={onQuestionAnswer}
                onComplete={onQuestionsCompleteAfterMasks}
              />
            </motion.div>
          )}

          {/* QUEST PHASE — 将面具拖拽到下方框中放下（至少 3 个） */}
          {subPhase === 'quest' && (
            <motion.div
              key="quest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl px-4 sm:px-6 box-border"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <h2 className="text-xs uppercase tracking-[0.3em] mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#C4A35A' }}>
                  任务：剥离面具
                </h2>
                <p className="text-sm" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                  将面具拖拽到下方框中放下（至少 3 个）
                </p>
              </motion.div>

              {/* 顶部：可拖拽的面具（圆形图标 + 标签） */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {questRemainingMasks.map((title) => (
                  <motion.div
                    key={title}
                    draggable
                    onDragStart={(e) => {
                      const ev = e as unknown as React.DragEvent<HTMLDivElement>;
                      questDraggedRef.current = title;
                      ev.dataTransfer.effectAllowed = 'move';
                      ev.dataTransfer.setData('text/plain', title);
                      ev.dataTransfer.setData('application/json', JSON.stringify({ title }));
                      const el = ev.currentTarget;
                      const dragImage = el.cloneNode(true) as HTMLElement;
                      dragImage.style.opacity = '0.8';
                      dragImage.style.position = 'absolute';
                      dragImage.style.top = '-1000px';
                      document.body.appendChild(dragImage);
                      ev.dataTransfer.setDragImage(dragImage, 28, 28);
                      setTimeout(() => document.body.removeChild(dragImage), 0);
                      el.style.opacity = '0.5';
                      el.style.cursor = 'grabbing';
                    }}
                    onDragEnd={(e) => {
                      questDraggedRef.current = null;
                      if (e.currentTarget instanceof HTMLElement) {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.cursor = 'grab';
                      }
                    }}
                    className="cursor-grab active:cursor-grabbing select-none flex flex-col items-center"
                    style={{ pointerEvents: 'auto', userSelect: 'none' }}
                  >
                    <div
                      className="w-14 h-14 flex items-center justify-center text-3xl rounded-full flex-shrink-0"
                      style={{
                        border: '2px solid rgba(196, 163, 90, 0.5)',
                        background: 'rgba(20, 15, 10, 0.95)',
                        boxShadow: '0 0 20px rgba(196, 163, 90, 0.3)',
                      }}
                    >
                      🎭
                    </div>
                    <span
                      className="mt-1.5 inline-block px-2 py-0.5 rounded text-xs text-center min-w-[3.5rem]"
                      style={{
                        fontFamily: 'Noto Serif SC, serif',
                        color: '#C4A35A',
                        background: 'rgba(196, 163, 90, 0.12)',
                        border: '1px solid rgba(196, 163, 90, 0.35)',
                      }}
                    >
                      {title}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* 下方：拖放框（每次放下后反馈文案不同） */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onDragOver={(e: React.DragEvent) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196, 163, 90, 0.6)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(196, 163, 90, 0.08)';
                }}
                onDragLeave={(e: React.DragEvent) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196, 163, 90, 0.35)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
                onDrop={(e: React.DragEvent) => {
                  e.preventDefault();
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196, 163, 90, 0.35)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  let title: string | null = e.dataTransfer.getData('text/plain') || null;
                  if (!title && questDraggedRef.current) title = questDraggedRef.current;
                  if (!title) return;
                  if (!questRemainingMasks.includes(title)) return;
                  setQuestRemainingMasks(prev => prev.filter(m => m !== title));
                  setQuestDroppedMasks(prev => [...prev, title as string]);
                  questDraggedRef.current = null;
                }}
                className="rounded-lg border-2 border-dashed py-10 px-6 text-center transition-colors"
                style={{
                  borderColor: 'rgba(196, 163, 90, 0.35)',
                  background: 'transparent',
                }}
              >
                <p className="text-sm mb-2" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                  将面具拖到这里放下
                </p>
                {questDroppedMasks.length > 0 && (
                  <p className="text-sm italic" style={{ fontFamily: 'EB Garamond, serif', color: 'rgba(196, 163, 90, 0.9)' }}>
                    {QUEST_DROP_FEEDBACKS[Math.min(questDroppedMasks.length - 1, QUEST_DROP_FEEDBACKS.length - 1)]}
                  </p>
                )}
              </motion.div>

              {/* 底部按钮 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-4"
              >
                {questDroppedMasks.length >= 3 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={onQuestComplete}
                    className="px-8 py-3 text-sm transition-all hover:bg-[#C4A35A]/10"
                    style={{
                      fontFamily: 'Noto Serif SC, serif',
                      color: '#C4A35A',
                      border: '1px solid rgba(196, 163, 90, 0.5)',
                    }}
                  >
                    继续前进
                  </motion.button>
                )}
                {questDroppedMasks.length >= 3 && (
                  <span className="text-sm" style={{ color: 'rgba(212, 197, 160, 0.7)', fontFamily: 'Noto Serif SC, serif' }}>
                    或继续拖拽面具放下更多
                  </span>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* CHOICE PHASE — after quest */}
          {subPhase === 'choice' && (
            <motion.div
              key="choice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-sm italic mb-4" style={{ fontFamily: 'EB Garamond, serif', color: '#d4c5a0' }}>
                狂风骤止，地面出现一个向下的阶梯。
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <p className="text-lg mb-8" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
                  你望向那黑暗的入口，深呼一口气……
                </p>
                <button
                  onClick={() => onChoice('B')}
                  className="px-8 py-3 text-sm transition-all hover:bg-[#C4A35A]/10 animate-pulse-glow"
                  style={{
                    fontFamily: 'Noto Serif SC, serif',
                    color: '#C4A35A',
                    border: '1px solid rgba(196, 163, 90, 0.5)',
                  }}
                >
                  踏入阶梯，走向地下
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
