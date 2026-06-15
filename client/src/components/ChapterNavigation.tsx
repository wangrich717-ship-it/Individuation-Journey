/**
 * Chapter Navigation Component
 * 章节导航组件 - 显示在左上角
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GamePhase } from '@/lib/gameStore';
import { BookOpen, User, Moon, Sparkles, FlaskConical, Star, Lock, CircleDot } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ChapterNavigationProps {
  currentPhase: GamePhase;
  onNavigate: (phase: GamePhase) => void;
  gameState?: { phase: GamePhase; unlockedChapters?: GamePhase[] };
}

interface ChapterInfo {
  id: GamePhase;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

// 顺序：序章 → 第一章 → 第二章 → 第三章 → 第四章自性化 → 终章
const CHAPTERS: ChapterInfo[] = [
  { id: 'prologue', title: '序章', subtitle: '人格面具', icon: User },
  { id: 'chapter3-intro', title: '第一章', subtitle: '意象之海', icon: FlaskConical },
  { id: 'chapter1-intro', title: '第二章', subtitle: '阴影的邂逅', icon: Moon },
  { id: 'chapter2-intro', title: '第三章', subtitle: '内在声音', icon: Sparkles },
  { id: 'alchemy-altar', title: '第四章', subtitle: '自性化', icon: CircleDot },
  { id: 'epilogue', title: '终章', subtitle: '曼陀罗', icon: Star },
];

// 剧情顺序：序章 → 第一章(意象之海 chapter3) → 第二章(阴影 chapter1) → 第三章(内在声音 chapter2) → 第四章 → 终章（用于完成打勾判断）
const PHASE_ORDER: GamePhase[] = [
  'title',
  'prologue',
  'prologue-masks-show',
  'prologue-questions',
  'prologue-quest',
  'prologue-choice',
  'chapter3-intro',
  'chapter3-imagery-sea',
  'chapter3-resonance-q',
  'chapter3-opposite-q',
  'chapter3-transcendence-q',
  'chapter3-symbol-triangle',
  'chapter3-root-q',
  'chapter3-challenge-q',
  'chapter3-integration-q',
  'chapter3-imagery-map',
  'chapter3-choice',
  'chapter1-intro',
  'chapter1-shadow-naming-1',
  'chapter1-shadow-naming-2',
  'chapter1-shadow-naming-3',
  'chapter1-shadow-questions',
  'chapter1-emotion-naming',
  'chapter1-emotion-questions',
  'chapter1-integration',
  'chapter1-choice',
  'chapter2-intro',
  'chapter2-listening',
  'chapter2-listening-q1',
  'chapter2-listening-q2',
  'chapter2-listening-q3',
  'chapter2-echo-poem',
  'chapter2-understanding-q1',
  'chapter2-understanding-q2',
  'chapter2-understanding-q3',
  'chapter2-imprint',
  'chapter2-questions-1',
  'chapter2-task-1',
  'chapter2-questions-2',
  'chapter2-quest',
  'chapter2-choice',
  'alchemy-altar',
  'chapter4-individuation',
  'epilogue',
];

// 判断章节是否已完成
function isChapterCompleted(phase: GamePhase, currentPhase: GamePhase): boolean {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);
  let completionPhase: GamePhase;
  if (phase === 'prologue') {
    completionPhase = 'prologue-choice';
  } else if (phase === 'chapter3-intro') {
    completionPhase = 'chapter3-choice'; // 第一章 意象之海
  } else if (phase === 'chapter1-intro') {
    completionPhase = 'chapter1-choice'; // 第二章 阴影的邂逅
  } else if (phase === 'chapter2-intro') {
    completionPhase = 'chapter2-choice'; // 第三章 内在声音
  } else if (phase === 'alchemy-altar') {
    completionPhase = 'epilogue';
  } else if (phase === 'epilogue') {
    completionPhase = 'epilogue';
  } else {
    return false;
  }
  const completionIndex = PHASE_ORDER.indexOf(completionPhase);
  if (phase === 'alchemy-altar') return currentIndex >= completionIndex;
  return currentIndex > completionIndex;
}

// 判断章节是否已解锁（可以访问）
function isChapterUnlocked(
  phase: GamePhase,
  currentPhase: GamePhase,
  gameState?: { phase: GamePhase; unlockedChapters?: GamePhase[] }
): boolean {
  if (currentPhase === 'title') {
    return phase === 'prologue';
  }
  if (phase === 'prologue') return true;
  if (gameState?.unlockedChapters?.includes(phase)) return true;
  const currentIndex = PHASE_ORDER.indexOf(gameState?.phase ?? currentPhase);
  if (phase === 'chapter3-intro') {
    return currentIndex >= PHASE_ORDER.indexOf('prologue-choice');
  }
  if (phase === 'chapter1-intro') {
    return currentIndex >= PHASE_ORDER.indexOf('chapter3-choice');
  }
  if (phase === 'chapter2-intro') {
    return currentIndex >= PHASE_ORDER.indexOf('chapter1-choice');
  }
  if (phase === 'alchemy-altar') {
    return currentIndex >= PHASE_ORDER.indexOf('chapter2-choice');
  }
  if (phase === 'epilogue') {
    return currentIndex >= PHASE_ORDER.indexOf('chapter4-individuation');
  }
  return false;
}

export default function ChapterNavigation({ currentPhase, onNavigate, gameState }: ChapterNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChapterClick = (chapter: ChapterInfo) => {
    if (!isChapterUnlocked(chapter.id, currentPhase, gameState)) return;
    onNavigate(chapter.id);
    setIsOpen(false);
  };

  const getCurrentChapter = (): ChapterInfo | null => {
    if (currentPhase.startsWith('prologue')) {
      return CHAPTERS.find(c => c.id === 'prologue') || null;
    } else if (currentPhase.startsWith('chapter1')) {
      return CHAPTERS.find(c => c.id === 'chapter1-intro') || null;
    } else if (currentPhase.startsWith('chapter2')) {
      return CHAPTERS.find(c => c.id === 'chapter2-intro') || null;
    } else if (currentPhase.startsWith('chapter3')) {
      return CHAPTERS.find(c => c.id === 'chapter3-intro') || null;
    } else if (currentPhase === 'alchemy-altar' || currentPhase === 'chapter4-individuation') {
      return CHAPTERS.find(c => c.id === 'alchemy-altar') || null;
    } else if (currentPhase === 'epilogue') {
      return CHAPTERS.find(c => c.id === 'epilogue') || null;
    }
    return null;
  };

  const currentChapter = getCurrentChapter();

  return (
    <div className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 max-w-[45vw] sm:max-w-none">
      {/* 合并模块：显示章节名，点击展开导航；小屏缩小、截断避免与内容重叠 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 min-h-[2rem] sm:min-h-[2.25rem]"
        style={{
          fontFamily: 'Cinzel, serif',
          border: '1px solid rgba(196, 163, 90, 0.3)',
          background: 'rgba(20, 15, 10, 0.8)',
          backdropFilter: 'blur(4px)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="点击展开章节导航"
      >
        {currentChapter ? (
          <>
            {(() => {
              const IconComponent = currentChapter.icon;
              return <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: '#FF6B35' }} />;
            })()}
            <span className="flex items-baseline gap-1 sm:gap-2 min-w-0" style={{ lineHeight: 1 }}>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.3em] truncate" style={{ color: '#FF6B35', lineHeight: 1.25 }}>{currentChapter.title}</span>
              <span className="text-[10px] sm:text-xs truncate hidden sm:inline" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif', lineHeight: 1.25 }}>
                {currentChapter.subtitle}
              </span>
            </span>
          </>
        ) : (
          <>
            <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: '#d4c5a0' }} />
            <span className="leading-none align-middle" style={{ color: '#d4c5a0' }}>章节导航</span>
          </>
        )}
      </motion.button>

      {/* 章节列表 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 w-48"
            style={{
              background: 'rgba(20, 15, 10, 0.95)',
              border: '1px solid rgba(196, 163, 90, 0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {CHAPTERS.map((chapter, index) => {
              const unlocked = isChapterUnlocked(chapter.id, currentPhase, gameState);
              const completed = isChapterCompleted(chapter.id, currentPhase);
              
              // 判断是否是当前章节
              let isCurrent = false;
              if (chapter.id === 'prologue') {
                isCurrent = currentPhase.startsWith('prologue');
              } else if (chapter.id === 'chapter1-intro') {
                isCurrent = currentPhase.startsWith('chapter1');
              } else if (chapter.id === 'chapter2-intro') {
                isCurrent = currentPhase.startsWith('chapter2');
              } else if (chapter.id === 'chapter3-intro') {
                isCurrent = currentPhase.startsWith('chapter3');
              } else if (chapter.id === 'alchemy-altar') {
                isCurrent = currentPhase === 'alchemy-altar' || currentPhase === 'chapter4-individuation';
              } else if (chapter.id === 'epilogue') {
                isCurrent = currentPhase === 'epilogue';
              }

              return (
                <motion.button
                  key={chapter.id}
                  onClick={() => handleChapterClick(chapter)}
                  disabled={!unlocked}
                  className={`w-full px-4 py-3 text-left transition-all ${
                    !unlocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FF6B35]/10'
                  } ${isCurrent ? 'bg-[#FF6B35]/20' : ''}`}
                  style={{
                    fontFamily: 'Noto Serif SC, serif',
                    color: unlocked ? '#d4c5a0' : '#666',
                    borderTop: index > 0 ? '1px solid rgba(196, 163, 90, 0.1)' : 'none',
                  }}
                  whileHover={unlocked ? { x: 4 } : {}}
                  whileTap={unlocked ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {unlocked ? (() => {
                        const IconComponent = chapter.icon;
                        return <IconComponent className="w-5 h-5" style={{ color: '#FF6B35', flexShrink: 0 }} />;
                      })() : (
                        <Lock className="w-5 h-5" style={{ color: '#666', flexShrink: 0 }} />
                      )}
                      <div>
                        <div className="text-sm font-medium">{chapter.title}</div>
                        <div className="text-xs opacity-70">{chapter.subtitle}</div>
                      </div>
                    </div>
                    {completed && (
                      <span className="text-xs" style={{ color: '#FFD700' }}>
                        ✓
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-xs" style={{ color: '#FF6B35' }}>
                        →
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
