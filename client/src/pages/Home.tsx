/**
 * Home Page — Main Game Controller
 * Design: Dark Alchemical Manuscript
 * Orchestrates all scenes and manages game state transitions
 */
import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type GameState, type GamePhase, initialGameState } from '@/lib/gameStore';
import TitleScene from '@/components/scenes/TitleScene';
import PrologueScene from '@/components/scenes/PrologueScene';
import Chapter1Scene from '@/components/scenes/Chapter1Scene';
import Chapter2Scene from '@/components/scenes/Chapter2Scene';
import Chapter3Scene, { type Chapter3SubPhase, type Chapter3SceneProps } from '@/components/scenes/Chapter3Scene';
import AlchemyAltarScene from '@/components/scenes/AlchemyAltarScene';
import Chapter4Scene from '@/components/scenes/Chapter4Scene';
import EpilogueScene from '@/components/scenes/EpilogueScene';
import Inventory from '@/components/Inventory';
import KnowledgeCardPanel from '@/components/KnowledgeCardPanel';
import ChapterNavigation from '@/components/ChapterNavigation';
import { playBgmForPhase, playSfx } from '@/lib/bgmSfx';

// 临时测试：随意跳转章节的入口（方便开发调试）
const TEST_JUMP_OPTIONS: { group: string; options: { label: string; phase: GamePhase }[] }[] = [
  { group: '标题', options: [{ label: '标题', phase: 'title' }] },
  {
    group: '序章',
    options: [
      { label: '开场', phase: 'prologue' },
      { label: '面具展示', phase: 'prologue-masks-show' },
      { label: '问题', phase: 'prologue-questions' },
      { label: '任务', phase: 'prologue-quest' },
      { label: '选择', phase: 'prologue-choice' },
    ],
  },
  {
    group: '第一章 意象之海',
    options: [
      { label: '开场', phase: 'chapter3-intro' },
      { label: '意象之海', phase: 'chapter3-imagery-sea' },
      { label: '共鸣问', phase: 'chapter3-resonance-q' },
      { label: '对立问', phase: 'chapter3-opposite-q' },
      { label: '调停问', phase: 'chapter3-transcendence-q' },
      { label: '象征三角', phase: 'chapter3-symbol-triangle' },
      { label: '根源问', phase: 'chapter3-root-q' },
      { label: '挑战问', phase: 'chapter3-challenge-q' },
      { label: '整合问', phase: 'chapter3-integration-q' },
      { label: '意象海图', phase: 'chapter3-imagery-map' },
      { label: '选择', phase: 'chapter3-choice' },
    ],
  },
  {
    group: '第二章 阴影的邂逅',
    options: [
      { label: '开场', phase: 'chapter1-intro' },
      { label: '阴影命名1', phase: 'chapter1-shadow-naming-1' },
      { label: '阴影命名2', phase: 'chapter1-shadow-naming-2' },
      { label: '阴影命名3', phase: 'chapter1-shadow-naming-3' },
      { label: '阴影问题', phase: 'chapter1-shadow-questions' },
      { label: '情绪命名', phase: 'chapter1-emotion-naming' },
      { label: '情绪问题', phase: 'chapter1-emotion-questions' },
      { label: '整合', phase: 'chapter1-integration' },
      { label: '选择', phase: 'chapter1-choice' },
    ],
  },
  {
    group: '第三章 内在声音',
    options: [
      { label: '开场', phase: 'chapter2-intro' },
      { label: '倾听', phase: 'chapter2-listening' },
      { label: '倾听Q1', phase: 'chapter2-listening-q1' },
      { label: '回响诗', phase: 'chapter2-echo-poem' },
      { label: '理解Q1', phase: 'chapter2-understanding-q1' },
      { label: '印记', phase: 'chapter2-imprint' },
      { label: '问题1', phase: 'chapter2-questions-1' },
      { label: '任务1', phase: 'chapter2-task-1' },
      { label: '任务', phase: 'chapter2-quest' },
      { label: '选择', phase: 'chapter2-choice' },
    ],
  },
  {
    group: '第四章 自性化',
    options: [
      { label: '炼金术祭坛', phase: 'alchemy-altar' },
      { label: '第四章', phase: 'chapter4-individuation' },
    ],
  },
  { group: '终章', options: [{ label: '终章', phase: 'epilogue' }] },
];

const ALL_UNLOCKED: GamePhase[] = ['prologue', 'chapter1-intro', 'chapter2-intro', 'chapter3-intro', 'alchemy-altar', 'chapter4-individuation', 'epilogue'];

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({ ...initialGameState });
  const [testPanelOpen, setTestPanelOpen] = useState(false);
  const [obtainToastItem, setObtainToastItem] = useState<string | null>(null);

  useEffect(() => {
    if (!obtainToastItem) return;
    const t = setTimeout(() => setObtainToastItem(null), 1500);
    return () => clearTimeout(t);
  }, [obtainToastItem]);

  // 按章节播放 BGM（循环）；内在声音聆听阶段自动暂停
  useEffect(() => {
    if (gameState.phase === 'title') return;
    playBgmForPhase(gameState.phase);
  }, [gameState.phase]);

  // 标题页：首次点击页面任意处时开始播标题 BGM（浏览器要求「用户先交互」才能播声音）
  useEffect(() => {
    if (gameState.phase !== 'title') return;
    const onFirstInteraction = () => {
      playBgmForPhase('title');
      document.removeEventListener('click', onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
    };
    document.addEventListener('click', onFirstInteraction, { once: true });
    document.addEventListener('touchstart', onFirstInteraction, { once: true });
    return () => {
      document.removeEventListener('click', onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
    };
  }, [gameState.phase]);

  const setPhase = useCallback((phase: GamePhase) => {
    setGameState(prev => ({ ...prev, phase }));
  }, []);

  const addInventory = useCallback((item: string) => {
    setGameState(prev => ({
      ...prev,
      inventory: prev.inventory.includes(item) ? prev.inventory : [...prev.inventory, item],
    }));
    setObtainToastItem(item);
    playSfx('sfx-item');
  }, []);

  const removeInventory = useCallback((item: string) => {
    setGameState(prev => ({
      ...prev,
      inventory: prev.inventory.filter(i => i !== item),
    }));
  }, []);

  const addKnowledge = useCallback((text: string) => {
    setGameState(prev => ({
      ...prev,
      knowledge: prev.knowledge.includes(text) ? prev.knowledge : [...prev.knowledge, text],
    }));
    playSfx('sfx-knowledge');
  }, []);

  // 处理问答答案
  const handleQuestionAnswer = useCallback((questionId: string, optionId: string, knowledgeCardId?: string) => {
    setGameState(prev => ({
      ...prev,
      questionAnswers: {
        ...prev.questionAnswers,
        [questionId]: optionId,
      },
      knowledgeCards: knowledgeCardId && !prev.knowledgeCards.includes(knowledgeCardId)
        ? [...prev.knowledgeCards, knowledgeCardId]
        : prev.knowledgeCards,
    }));
  }, []);

  // 完成任务
  const handleTaskComplete = useCallback((taskId: string) => {
    setGameState(prev => ({
      ...prev,
      taskCompletions: {
        ...prev.taskCompletions,
        [taskId]: true,
      },
    }));
  }, []);

  // Title -> Prologue（在用户点击的同一调用栈里启动 BGM，否则会被浏览器自动播放策略拦截）
  const handleStart = useCallback(() => {
    playSfx('sfx-choice');
    setPhase('prologue');
    playBgmForPhase('prologue');
  }, [setPhase]);

  // Prologue choice handler
  const handlePrologueChoice = useCallback((choice: 'A' | 'B') => {
    playSfx('sfx-choice');
    if (choice === 'A') {
      // Loop back with fading text
      setGameState(prev => ({
        ...prev,
        loopCount: prev.loopCount + 1,
        textOpacity: Math.max(0.3, prev.textOpacity - 0.15),
        phase: 'prologue', // stay in prologue intro
      }));
    } else {
      // Proceed to masks show, then questions
      setPhase('prologue-masks-show');
    }
  }, [setPhase]);

  // Prologue masks show complete -> questions
  const handlePrologueMasksShowComplete = useCallback(() => {
    playSfx('sfx-choice');
    setPhase('prologue-questions');
  }, [setPhase]);

  // Prologue questions complete -> quest
  const handlePrologueQuestionsComplete = useCallback(() => {
    playSfx('sfx-choice');
    setPhase('prologue-quest');
  }, [setPhase]);

  // Prologue quest complete -> choice to enter 第一章 意象之海
  const handlePrologueQuestComplete = useCallback(() => {
    playSfx('sfx-choice');
    addInventory('人格面具');
    setGameState(prev => ({
      ...prev,
      unlockedChapters: [...(prev.unlockedChapters || []), 'chapter3-intro' as GamePhase].filter((v, i, a) => a.indexOf(v) === i),
    }));
    setPhase('prologue-choice');
  }, [setPhase, addInventory]);

  // 序章选择后进入第一章（意象之海）
  const handleEnterChapter1 = useCallback(() => {
    setPhase('chapter3-intro');
  }, [setPhase]);

  // 第二章 阴影的邂逅 完成 → 进入第三章 内在声音
  const handleChapter1Complete = useCallback((shadowNames: string[]) => {
    playSfx('sfx-choice');
    setGameState(prev => ({ 
      ...prev, 
      shadowName: shadowNames[0] || '',
      shadowNames,
      unlockedChapters: [...(prev.unlockedChapters || []), 'chapter2-intro' as GamePhase].filter((v, i, a) => a.indexOf(v) === i),
    }));
    addInventory('三种原力');
    addKnowledge('与其做个好人，不如做一个完整的人。');
    setPhase('chapter2-intro');
  }, [setPhase, addInventory, addKnowledge]);

  // Chapter 1 shadow name add
  const handleChapter1ShadowNameAdd = useCallback((shadowName: string) => {
    setGameState(prev => ({ 
      ...prev, 
      shadowNames: [...prev.shadowNames, shadowName],
      shadowName: prev.shadowNames.length === 0 ? shadowName : prev.shadowName, // Set first shadow
    }));
  }, []);

  // Chapter 1 emotion name change
  const handleChapter1EmotionNameChange = useCallback((emotionName: string) => {
    setGameState(prev => ({ ...prev, emotionName }));
  }, []);

  // 第三章 内在声音 完成 → 炼金术祭坛（过渡）→ 画完曼陀罗 → 终章
  const handleChapter2Complete = useCallback(() => {
    playSfx('sfx-choice');
    setGameState(prev => ({
      ...prev,
      unlockedChapters: [...(prev.unlockedChapters || []), 'alchemy-altar' as GamePhase].filter((v, i, a) => a.indexOf(v) === i),
    }));
    addInventory('灵魂之乐');
    addInventory('纹章印记');
    addKnowledge('理性是你的工具，但灵魂是你的向导。');
    setPhase('alchemy-altar');
  }, [setPhase, addInventory, addKnowledge]);

  // 画完曼陀罗后直接进入终章，不再跳转第四章
  const handleAlchemyComplete = useCallback(() => {
    playSfx('sfx-choice');
    setGameState(prev => ({
      ...prev,
      unlockedChapters: [...(prev.unlockedChapters || []), 'epilogue' as GamePhase].filter((v, i, a) => a.indexOf(v) === i),
    }));
    setPhase('epilogue');
  }, [setPhase]);

  const handleChapter4Complete = useCallback(() => {
    playSfx('sfx-choice');
    setGameState(prev => ({
      ...prev,
      unlockedChapters: [...(prev.unlockedChapters || []), 'epilogue' as GamePhase].filter((v, i, a) => a.indexOf(v) === i),
    }));
    setPhase('epilogue');
  }, [setPhase]);

  // 第一章 意象之海 完成 → 进入第二章 阴影的邂逅
  const handleChapter3Complete = useCallback(() => {
    playSfx('sfx-choice');
    setGameState(prev => ({
      ...prev,
      unlockedChapters: [...(prev.unlockedChapters || []), 'chapter1-intro' as GamePhase].filter((v, i, a) => a.indexOf(v) === i),
    }));
    addKnowledge('对立面的结合（Coniunctio），才能催生真正的自我。');
    setPhase('chapter1-intro');
  }, [setPhase, addKnowledge]);

  // Restart
  const handleRestart = useCallback(() => {
    playSfx('sfx-choice');
    setGameState({ ...initialGameState });
  }, []);

  // Determine which sub-phase for prologue
  const getPrologueSubPhase = (): 'intro' | 'masks-show' | 'questions' | 'quest' | 'choice' => {
    if (gameState.phase === 'prologue-masks-show') return 'masks-show';
    if (gameState.phase === 'prologue-questions') return 'questions';
    if (gameState.phase === 'prologue-quest') return 'quest';
    if (gameState.phase === 'prologue-choice') return 'choice';
    return 'intro';
  };

  // Chapter 1 sub-phase
  const getChapter1SubPhase = (): 'intro' | 'shadow-naming-1' | 'shadow-naming-2' | 'shadow-naming-3' | 'shadow-questions' | 'emotion-naming' | 'emotion-questions' | 'integration' | 'choice' => {
    if (gameState.phase === 'chapter1-shadow-naming-1') return 'shadow-naming-1';
    if (gameState.phase === 'chapter1-shadow-naming-2') return 'shadow-naming-2';
    if (gameState.phase === 'chapter1-shadow-naming-3') return 'shadow-naming-3';
    if (gameState.phase === 'chapter1-shadow-questions') return 'shadow-questions';
    if (gameState.phase === 'chapter1-emotion-naming') return 'emotion-naming';
    if (gameState.phase === 'chapter1-emotion-questions') return 'emotion-questions';
    if (gameState.phase === 'chapter1-integration') return 'integration';
    if (gameState.phase === 'chapter1-choice') return 'choice';
    return 'intro';
  };

  // Chapter 2 sub-phase
  const getChapter2SubPhase = (): 'intro' | 'listening' | 'listening-q1' | 'listening-q2' | 'listening-q3' | 'echo-poem' | 'understanding-q1' | 'understanding-q2' | 'understanding-q3' | 'imprint' | 'questions-1' | 'task-1' | 'questions-2' | 'quest' | 'choice' => {
    if (gameState.phase === 'chapter2-listening') return 'listening';
    if (gameState.phase === 'chapter2-listening-q1') return 'listening-q1';
    if (gameState.phase === 'chapter2-listening-q2') return 'listening-q2';
    if (gameState.phase === 'chapter2-listening-q3') return 'listening-q3';
    if (gameState.phase === 'chapter2-echo-poem') return 'echo-poem';
    if (gameState.phase === 'chapter2-understanding-q1') return 'understanding-q1';
    if (gameState.phase === 'chapter2-understanding-q2') return 'understanding-q2';
    if (gameState.phase === 'chapter2-understanding-q3') return 'understanding-q3';
    if (gameState.phase === 'chapter2-imprint') return 'imprint';
    if (gameState.phase === 'chapter2-questions-1') return 'questions-1';
    if (gameState.phase === 'chapter2-task-1') return 'task-1';
    if (gameState.phase === 'chapter2-questions-2') return 'questions-2';
    if (gameState.phase === 'chapter2-quest') return 'quest';
    if (gameState.phase === 'chapter2-choice') return 'choice';
    return 'intro';
  };

  // Chapter 3 sub-phase
  const getChapter3SubPhase = (): Chapter3SubPhase => {
    if (gameState.phase === 'chapter3-imagery-sea') return 'imagery-sea';
    if (gameState.phase === 'chapter3-resonance-q') return 'resonance-q';
    if (gameState.phase === 'chapter3-opposite-q') return 'opposite-q';
    if (gameState.phase === 'chapter3-transcendence-q') return 'transcendence-q';
    if (gameState.phase === 'chapter3-symbol-triangle') return 'symbol-triangle';
    if (gameState.phase === 'chapter3-root-q') return 'root-q';
    if (gameState.phase === 'chapter3-challenge-q') return 'challenge-q';
    if (gameState.phase === 'chapter3-integration-q') return 'integration-q';
    if (gameState.phase === 'chapter3-imagery-map') return 'imagery-map';
    if (gameState.phase === 'chapter3-choice') return 'choice';
    return 'intro';
  };

  const isInGame = gameState.phase !== 'title';

  // 处理章节导航跳转
  const handleChapterNavigate = useCallback((phase: GamePhase) => {
    // 重置章节相关状态，但保留解锁状态
    if (phase === 'prologue') {
      setGameState(prev => ({
        ...prev,
        phase: 'prologue',
        loopCount: 0,
        textOpacity: 1,
        // 重置序章相关的问答和任务完成状态
        questionAnswers: Object.fromEntries(
          Object.entries(prev.questionAnswers).filter(([key]) => !key.startsWith('prologue-'))
        ),
        taskCompletions: Object.fromEntries(
          Object.entries(prev.taskCompletions).filter(([key]) => !key.startsWith('prologue-'))
        ),
        // 递增重置计数器以强制重新挂载组件
        chapterResetCounter: {
          ...prev.chapterResetCounter,
          prologue: (prev.chapterResetCounter?.prologue || 0) + 1,
        },
      }));
    } else if (phase === 'chapter1-intro') {
      setGameState(prev => ({
        ...prev,
        phase: 'chapter1-intro',
        shadowNames: [],
        shadowName: '',
        emotionName: '',
        // 重置第一章相关的问答和任务完成状态
        questionAnswers: Object.fromEntries(
          Object.entries(prev.questionAnswers).filter(([key]) => !key.startsWith('chapter1-'))
        ),
        taskCompletions: Object.fromEntries(
          Object.entries(prev.taskCompletions).filter(([key]) => !key.startsWith('chapter1-'))
        ),
        // 递增重置计数器以强制重新挂载组件
        chapterResetCounter: {
          ...prev.chapterResetCounter,
          'chapter1': (prev.chapterResetCounter?.['chapter1'] || 0) + 1,
        },
      }));
    } else if (phase === 'chapter2-intro') {
      setGameState(prev => ({
        ...prev,
        phase: 'chapter2-intro',
        // 重置第二章相关的问答和任务完成状态
        questionAnswers: Object.fromEntries(
          Object.entries(prev.questionAnswers).filter(([key]) => !key.startsWith('chapter2-') && !key.startsWith('listening-') && !key.startsWith('understanding-'))
        ),
        taskCompletions: Object.fromEntries(
          Object.entries(prev.taskCompletions).filter(([key]) => !key.startsWith('chapter2-'))
        ),
        // 递增重置计数器以强制重新挂载组件
        chapterResetCounter: {
          ...prev.chapterResetCounter,
          'chapter2': (prev.chapterResetCounter?.['chapter2'] || 0) + 1,
        },
      }));
    } else if (phase === 'chapter3-intro') {
      setGameState(prev => ({
        ...prev,
        phase: 'chapter3-intro',
        // 重置第三章相关的问答和任务完成状态
        questionAnswers: Object.fromEntries(
          Object.entries(prev.questionAnswers).filter(([key]) => !key.startsWith('chapter3-'))
        ),
        taskCompletions: Object.fromEntries(
          Object.entries(prev.taskCompletions).filter(([key]) => !key.startsWith('chapter3-'))
        ),
        // 递增重置计数器以强制重新挂载组件
        chapterResetCounter: {
          ...prev.chapterResetCounter,
          'chapter3': (prev.chapterResetCounter?.['chapter3'] || 0) + 1,
        },
      }));
    } else if (phase === 'alchemy-altar' || phase === 'chapter4-individuation' || phase === 'epilogue') {
      setPhase(phase);
    }
  }, [setPhase]);

  // 测试跳转：直接切到指定阶段并解锁全部章节
  const handleTestJump = useCallback((phase: GamePhase) => {
    setGameState(prev => ({
      ...prev,
      phase,
      unlockedChapters: ALL_UNLOCKED,
      // 跳转到章节内阶段时补一点基础状态，避免报错
      shadowName: prev.shadowName || (phase.startsWith('chapter1') || phase.startsWith('chapter2') || phase.startsWith('chapter3') ? '测试' : ''),
      shadowNames: prev.shadowNames?.length ? prev.shadowNames : (phase.startsWith('chapter1') ? ['测试'] : []),
      inventory: phase === 'title' ? [] : (prev.inventory.length ? prev.inventory : ['人格面具', '遗失的罗盘', '三种原力', '灵魂之乐', '纹章印记']),
    }));
    setTestPanelOpen(false);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#0a0808' }}>
      {/* 临时测试：跳转入口（已隐藏，需要时去掉 hidden 即可） */}
      <div className="fixed bottom-4 left-4 z-[100] hidden">
        <button
          type="button"
          onClick={() => setTestPanelOpen(v => !v)}
          className="px-3 py-1.5 text-xs rounded border bg-black/80 text-amber-200 border-amber-600/50 hover:bg-amber-900/30"
        >
          {testPanelOpen ? '关闭' : '测试跳转'}
        </button>
        {testPanelOpen && (
          <div
            className="absolute bottom-full left-0 mb-1 w-56 max-h-[70vh] overflow-y-auto rounded border border-amber-600/50 bg-black/95 text-amber-100 text-xs p-2"
            style={{ fontFamily: 'Noto Serif SC, serif' }}
          >
            {TEST_JUMP_OPTIONS.map(({ group, options }) => (
              <div key={group} className="mb-2">
                <div className="text-amber-400 font-medium mb-1">{group}</div>
                <div className="flex flex-wrap gap-1">
                  {options.map(({ label, phase }) => (
                    <button
                      key={phase}
                      type="button"
                      onClick={() => handleTestJump(phase)}
                      className={`px-2 py-1 rounded border truncate max-w-full ${
                        gameState.phase === phase
                          ? 'bg-amber-600/50 border-amber-500 text-white'
                          : 'bg-white/5 border-amber-700/50 hover:bg-amber-900/30'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chapter Navigation */}
      {isInGame && (
        <ChapterNavigation 
          currentPhase={gameState.phase} 
          onNavigate={handleChapterNavigate}
          gameState={gameState}
        />
      )}
      
      {/* Inventory & Knowledge panels */}
      {isInGame && gameState.inventory.length > 0 && (
        <Inventory items={gameState.inventory} />
      )}
      <AnimatePresence>
        {obtainToastItem && (
          <motion.div
            key={obtainToastItem}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-lg border shadow-lg pointer-events-none"
            style={{
              fontFamily: 'Noto Serif SC, serif',
              background: 'rgba(20, 15, 10, 0.92)',
              borderColor: 'rgba(196, 163, 90, 0.6)',
              boxShadow: '0 0 24px rgba(196, 163, 90, 0.25)',
              color: '#C4A35A',
            }}
          >
            <span className="text-amber-200/80 text-xs uppercase tracking-wider mr-2">获得</span>
            <span className="text-sm font-medium">{obtainToastItem}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {isInGame && gameState.knowledgeCards.length > 0 && (
        <KnowledgeCardPanel cardIds={gameState.knowledgeCards} />
      )}

      {/* 内容区：预留顶部与左右安全区；小屏内容整体居中，大屏保留侧边空间 */}
      <div
        className={`absolute inset-0 overflow-auto flex flex-col items-center ${isInGame ? 'pt-[5rem] sm:pt-24 pl-12 pr-4 sm:pl-52 sm:pr-28' : ''}`}
      >
      <div className={`w-full flex-1 flex flex-col items-center justify-center min-h-full ${isInGame ? 'max-w-5xl' : 'max-w-none'}`}>
      <AnimatePresence mode="wait">
        {/* TITLE */}
        {gameState.phase === 'title' && (
          <TitleScene key="title" onStart={handleStart} onUnlockAudio={() => playBgmForPhase('title')} />
        )}

        {/* PROLOGUE */}
        {(gameState.phase === 'prologue' || gameState.phase === 'prologue-masks-show' || gameState.phase === 'prologue-questions' || gameState.phase === 'prologue-quest' || gameState.phase === 'prologue-choice') && (
          <PrologueScene
            key={`prologue-${gameState.chapterResetCounter?.prologue || 0}`}
            titles={gameState.titles}
            textOpacity={gameState.textOpacity}
            loopCount={gameState.loopCount}
            subPhase={getPrologueSubPhase()}
            onChoice={(choice) => {
              playSfx('sfx-choice');
              if (gameState.phase === 'prologue-choice') {
                handleEnterChapter1();
              } else {
                handlePrologueChoice(choice);
              }
            }}
            onQuestComplete={handlePrologueQuestComplete}
            onQuestionAnswer={handleQuestionAnswer}
            onQuestionsComplete={handlePrologueMasksShowComplete}
            onQuestionsCompleteAfterMasks={handlePrologueQuestionsComplete}
          />
        )}

        {/* CHAPTER 1 */}
        {(gameState.phase === 'chapter1-intro' || gameState.phase === 'chapter1-shadow-naming-1' || gameState.phase === 'chapter1-shadow-naming-2' || gameState.phase === 'chapter1-shadow-naming-3' || gameState.phase === 'chapter1-shadow-questions' || gameState.phase === 'chapter1-emotion-naming' || gameState.phase === 'chapter1-emotion-questions' || gameState.phase === 'chapter1-integration' || gameState.phase === 'chapter1-choice') && (
          <Chapter1Scene
            key={`chapter1-${gameState.chapterResetCounter?.['chapter1'] || 0}`}
            subPhase={getChapter1SubPhase()}
            onSubPhaseChange={(sub) => setPhase(`chapter1-${sub}` as GamePhase)}
            onComplete={handleChapter1Complete}
            onQuestionAnswer={handleQuestionAnswer}
            shadowNames={gameState.shadowNames}
            emotionName={gameState.emotionName}
            onShadowNameAdd={handleChapter1ShadowNameAdd}
            onEmotionNameChange={handleChapter1EmotionNameChange}
          />
        )}

        {/* CHAPTER 2 */}
        {(gameState.phase === 'chapter2-intro' || gameState.phase === 'chapter2-listening' || gameState.phase === 'chapter2-listening-q1' || gameState.phase === 'chapter2-listening-q2' || gameState.phase === 'chapter2-listening-q3' || gameState.phase === 'chapter2-echo-poem' || gameState.phase === 'chapter2-understanding-q1' || gameState.phase === 'chapter2-understanding-q2' || gameState.phase === 'chapter2-understanding-q3' || gameState.phase === 'chapter2-imprint' || gameState.phase === 'chapter2-questions-1' || gameState.phase === 'chapter2-task-1' || gameState.phase === 'chapter2-questions-2' || gameState.phase === 'chapter2-quest' || gameState.phase === 'chapter2-choice') && (
          <Chapter2Scene
            key={`chapter2-${gameState.chapterResetCounter?.['chapter2'] || 0}`}
            subPhase={getChapter2SubPhase()}
            onSubPhaseChange={(sub) => setPhase(`chapter2-${sub}` as GamePhase)}
            onComplete={handleChapter2Complete}
            onQuestionAnswer={handleQuestionAnswer}
            onInventoryAdd={addInventory}
          />
        )}

        {/* CHAPTER 3 */}
        {(gameState.phase === 'chapter3-intro' || gameState.phase === 'chapter3-imagery-sea' || gameState.phase === 'chapter3-resonance-q' || gameState.phase === 'chapter3-opposite-q' || gameState.phase === 'chapter3-transcendence-q' || gameState.phase === 'chapter3-symbol-triangle' || gameState.phase === 'chapter3-root-q' || gameState.phase === 'chapter3-challenge-q' || gameState.phase === 'chapter3-integration-q' || gameState.phase === 'chapter3-imagery-map' || gameState.phase === 'chapter3-choice') && (() => {
          const ch3Props: Chapter3SceneProps = {
            shadowName: gameState.shadowName,
            questionAnswers: gameState.questionAnswers,
            subPhase: getChapter3SubPhase(),
            onSubPhaseChange: (sub: Chapter3SubPhase) => setPhase(`chapter3-${sub}` as GamePhase),
            onComplete: handleChapter3Complete,
            onQuestionAnswer: handleQuestionAnswer,
            onInventoryAdd: addInventory,
          };
          return <Chapter3Scene key={`chapter3-${gameState.chapterResetCounter?.['chapter3'] || 0}`} {...ch3Props} />;
        })()}

        {/* 炼金术祭坛（第三章→第四章过渡） */}
        {gameState.phase === 'alchemy-altar' && (
          <AlchemyAltarScene
            key="alchemy-altar"
            inventory={gameState.inventory}
            onPlaceItem={removeInventory}
            onReturnItem={addInventory}
            onComplete={handleAlchemyComplete}
          />
        )}

        {/* 第四章 自性化 */}
        {gameState.phase === 'chapter4-individuation' && (
          <Chapter4Scene key="chapter4" onComplete={handleChapter4Complete} />
        )}

        {/* 终章 */}
        {gameState.phase === 'epilogue' && (
          <EpilogueScene
            key="epilogue"
            inventory={gameState.inventory}
            knowledge={gameState.knowledge}
            knowledgeCards={gameState.knowledgeCards}
            shadowName={gameState.shadowName}
            shadowNames={gameState.shadowNames}
            emotionName={gameState.emotionName}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
      </div>
      </div>
    </div>
  );
}
