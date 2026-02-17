/**
 * Chapter 2 — The Syzygy + Echo Location Quest
 * Design: Dark Alchemical Manuscript — misty forest, moonlit lake, divine figure
 */
import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneBackground from '../SceneBackground';
import Particles from '../Particles';
import TypeWriter from '../TypeWriter';
import QuestionSystem from '../systems/QuestionSystem';
import ListeningTask from '../tasks/ListeningTask';
import ListeningQuestions from '../tasks/ListeningQuestions';
import EchoPoemTask from '../tasks/EchoPoemTask';
import UnderstandingQuestions from '../tasks/UnderstandingQuestions';
import ImprintTask from '../tasks/ImprintTask';
import { SCENE_IMAGES, LIGHT_ORBS } from '@/lib/gameStore';
import { CHAPTER2_QUESTIONS } from '@/lib/questions';
import { playSfx } from '@/lib/bgmSfx';

interface Chapter2SceneProps {
  onComplete: () => void;
  onQuestionAnswer: (questionId: string, optionId: string, knowledgeCardId?: string) => void;
  onInventoryAdd?: (item: string) => void;
  subPhase: 'intro' | 'listening' | 'listening-q1' | 'listening-q2' | 'listening-q3' | 'echo-poem' | 'understanding-q1' | 'understanding-q2' | 'understanding-q3' | 'imprint' | 'questions-1' | 'task-1' | 'questions-2' | 'quest' | 'choice';
  onSubPhaseChange: (phase: 'intro' | 'listening' | 'listening-q1' | 'listening-q2' | 'listening-q3' | 'echo-poem' | 'understanding-q1' | 'understanding-q2' | 'understanding-q3' | 'imprint' | 'questions-1' | 'task-1' | 'questions-2' | 'quest' | 'choice') => void;
}

export default function Chapter2Scene({ onComplete, onQuestionAnswer, onInventoryAdd, subPhase, onSubPhaseChange }: Chapter2SceneProps) {
  const [introComplete, setIntroComplete] = useState(false);
  const [choiceMade, setChoiceMade] = useState<'rational' | 'intuitive' | null>(null);
  const [fogDensity, setFogDensity] = useState(0.45);
  const [questStarted, setQuestStarted] = useState(false);
  const [screenDark, setScreenDark] = useState(false);
  const [selectedOrb, setSelectedOrb] = useState<number | null>(null);
  const [questResult, setQuestResult] = useState<'correct' | 'wrong' | null>(null);
  const [orbPositions, setOrbPositions] = useState<{x: number; y: number}[]>([]);
  
  // 新任务状态
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [listeningAnswers, setListeningAnswers] = useState<Record<string, string>>({});
  const [userMelody, setUserMelody] = useState<string[]>([]);
  const [responseMelody, setResponseMelody] = useState<string[]>([]);
  const [seedId, setSeedId] = useState<string>('');
  const [understandingAnswers, setUnderstandingAnswers] = useState<Record<string, string>>({});
  const [patternName, setPatternName] = useState<string>('');

  // 每次切到某子阶段时清空该处选择状态，切换到的界面一律需要重新选（用 useLayoutEffect 避免先绘出旧选项再清空）
  const listeningQuestionPhases = ['listening-q1', 'listening-q2', 'listening-q3'] as const;
  const understandingQuestionPhases = ['understanding-q1', 'understanding-q2', 'understanding-q3'] as const;
  useLayoutEffect(() => {
    if (subPhase === 'listening') {
      setSelectedSound(null);
    }
    if (listeningQuestionPhases.includes(subPhase as typeof listeningQuestionPhases[number])) {
      setListeningAnswers({});
    }
    if (understandingQuestionPhases.includes(subPhase as typeof understandingQuestionPhases[number])) {
      setUnderstandingAnswers({});
    }
  }, [subPhase]);

  // Generate random positions for orbs
  useEffect(() => {
    if (subPhase === 'quest') {
      const positions = LIGHT_ORBS.map(() => ({
        x: 15 + Math.random() * 70,
        y: 20 + Math.random() * 60,
      }));
      setOrbPositions(positions);
      setTimeout(() => {
        setQuestStarted(true);
        setScreenDark(true);
      }, 2000);
    }
  }, [subPhase]);

  const handleRational = () => {
    playSfx('sfx-choice');
    setChoiceMade('rational');
    setFogDensity(prev => Math.min(prev + 0.15, 0.85));
    setTimeout(() => setChoiceMade(null), 3000);
  };

  const handleIntuitive = () => {
    playSfx('sfx-choice');
    setChoiceMade('intuitive');
    setFogDensity(0.45);
    setTimeout(() => onSubPhaseChange('listening'), 2000);
  };

  const handleQuestions1Complete = () => {
    playSfx('sfx-choice');
    onSubPhaseChange('task-1');
  };

  const handleTask1Complete = () => {
    playSfx('sfx-choice');
    onSubPhaseChange('questions-2');
  };

  const handleQuestions2Complete = () => {
    playSfx('sfx-choice');
    onSubPhaseChange('quest');
  };

  const handleOrbSelect = useCallback((orbId: number) => {
    if (questResult) return;
    setSelectedOrb(orbId);
    const orb = LIGHT_ORBS.find(o => o.id === orbId);
    if (orb?.isCorrect) {
      setQuestResult('correct');
      setScreenDark(false);
    } else {
      setQuestResult('wrong');
      setTimeout(() => {
        setQuestResult(null);
        setSelectedOrb(null);
      }, 1500);
    }
  }, [questResult]);

  // 新任务处理函数
  const handleSoundSelect = (soundId: string) => {
    // 允许空字符串来取消选择
    setSelectedSound(soundId || null);
  };

  const handleListeningContinue = () => {
    if (selectedSound) {
      setTimeout(() => {
        onSubPhaseChange('listening-q1');
      }, 500);
    }
  };

  const handleListeningAnswer = (questionId: string, optionId: string, knowledgeCardId?: string) => {
    setListeningAnswers({ ...listeningAnswers, [questionId]: optionId });
    onQuestionAnswer(questionId, optionId, knowledgeCardId);
    
    // 根据问题ID决定下一步（延迟显示反馈）
    if (questionId === 'listening-q1') {
      setTimeout(() => onSubPhaseChange('listening-q2'), 2500);
    } else if (questionId === 'listening-q2') {
      setTimeout(() => onSubPhaseChange('listening-q3'), 2500);
    } else if (questionId === 'listening-q3') {
      setTimeout(() => onSubPhaseChange('echo-poem'), 2500);
    }
  };

  const handleEchoPoemComplete = (melody: string[], seed: string, response: string[]) => {
    setUserMelody(melody);
    setResponseMelody(response);
    setSeedId(seed);
    setTimeout(() => onSubPhaseChange('understanding-q1'), 1000);
  };

  const handleUnderstandingAnswer = (questionId: string, optionId: string, knowledgeCardId?: string) => {
    setUnderstandingAnswers({ ...understandingAnswers, [questionId]: optionId });
    onQuestionAnswer(questionId, optionId, knowledgeCardId);
    
    // 根据问题ID决定下一步（延迟显示反馈）
    if (questionId === 'understanding-q1') {
      setTimeout(() => onSubPhaseChange('understanding-q2'), 2500);
    } else if (questionId === 'understanding-q2') {
      setTimeout(() => onSubPhaseChange('understanding-q3'), 2500);
    } else if (questionId === 'understanding-q3') {
      setTimeout(() => onSubPhaseChange('imprint'), 2500);
    }
  };

  const handleImprintComplete = (name: string) => {
    setPatternName(name);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <div className="fixed inset-0">
      <SceneBackground
        imageUrl={SCENE_IMAGES.forest}
        overlay={`rgba(0,0,0,${fogDensity})`}
      />
      <Particles type="mist" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-full w-full px-4 sm:px-6 overflow-y-auto box-border pt-16 sm:pt-20">
        {/* Chapter header */}

        <AnimatePresence mode="wait">
          {/* LISTENING TASK */}
          {subPhase === 'listening' && (
            <motion.div
              key="ch2-listening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl"
            >
              <ListeningTask
                onSoundSelect={handleSoundSelect}
                onContinue={handleListeningContinue}
                selectedSound={selectedSound}
              />
            </motion.div>
          )}

          {/* LISTENING QUESTIONS */}
          {(subPhase === 'listening-q1' || subPhase === 'listening-q2' || subPhase === 'listening-q3') && (
            <motion.div
              key={`ch2-listening-${subPhase}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl -mt-8 sm:-mt-10"
            >
              <ListeningQuestions
                questionId={subPhase}
                onAnswer={handleListeningAnswer}
                selectedAnswer={listeningAnswers[subPhase]}
              />
            </motion.div>
          )}

          {/* ECHO POEM TASK */}
          {subPhase === 'echo-poem' && (
            <motion.div
              key="ch2-echo-poem"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl"
            >
              <EchoPoemTask onComplete={handleEchoPoemComplete} />
            </motion.div>
          )}

          {/* UNDERSTANDING QUESTIONS */}
          {(subPhase === 'understanding-q1' || subPhase === 'understanding-q2' || subPhase === 'understanding-q3') && (
            <motion.div
              key={`ch2-understanding-${subPhase}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl -mt-8 sm:-mt-10"
            >
              <UnderstandingQuestions
                questionId={subPhase}
                onAnswer={handleUnderstandingAnswer}
                selectedAnswer={understandingAnswers[subPhase]}
              />
            </motion.div>
          )}

          {/* IMPRINT TASK */}
          {subPhase === 'imprint' && (
            <motion.div
              key="ch2-imprint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl"
            >
              <ImprintTask
                onComplete={handleImprintComplete}
                userMelody={userMelody}
                responseMelody={responseMelody}
                seedId={seedId}
              />
            </motion.div>
          )}

          {/* INTRO */}
          {subPhase === 'intro' && (
            <motion.div
              key="ch2-intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl text-center"
            >
              <TypeWriter
                text="迷雾笼罩的静谧森林，湖边坐着一位充满神性的身影。月光如银纱般洒落，那身影缓缓转过头来。"
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
                >
                  {choiceMade === 'rational' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      className="text-sm italic mb-6"
                      style={{ fontFamily: 'EB Garamond, serif', color: '#8BA4B8' }}
                    >
                      迷雾变得更浓了……那身影似乎在微笑，但什么也没有说。
                    </motion.p>
                  )}

                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      onClick={handleRational}
                      className="px-8 py-3 text-sm transition-all hover:bg-[#8BA4B8]/10"
                      style={{
                        fontFamily: 'Noto Serif SC, serif',
                        color: '#d4c5a0',
                        border: '1px solid rgba(139, 164, 184, 0.3)',
                        opacity: fogDensity > 0.7 ? 0.4 : 0.8,
                      }}
                    >
                      "我需要证据和方向，请给出解释。"
                    </button>
                    <button
                      onClick={handleIntuitive}
                      className="px-8 py-3 text-sm transition-all hover:bg-[#C0C0C0]/10"
                      style={{
                        fontFamily: 'Noto Serif SC, serif',
                        color: '#C0C0C0',
                        border: '1px solid rgba(192, 192, 192, 0.5)',
                      }}
                    >
                      "我愿听从花开的声音，或者你眼里的沉默。"
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* QUESTIONS 1 — Rational vs Intuitive */}
          {subPhase === 'questions-1' && (
            <motion.div
              key="ch2-questions-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <QuestionSystem
                questions={CHAPTER2_QUESTIONS.slice(0, 3)}
                onAnswer={onQuestionAnswer}
                onComplete={handleQuestions1Complete}
              />
            </motion.div>
          )}

          {/* TASK 1 — Inner Voice Selection */}
          {subPhase === 'task-1' && (
            <motion.div
              key="ch2-task-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl text-center"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-base md:text-lg italic mb-8 leading-relaxed"
                style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8' }}
              >
                "现在，倾听你内在的声音。它们都在说话，但哪一个才是真正的向导？"
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm mb-8"
                style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}
              >
                你闭上眼睛，听到了不同的声音：逻辑、情感、直觉、恐惧...它们都在呼唤你。
              </motion.p>
              <button
                onClick={handleTask1Complete}
                className="px-8 py-3 text-sm transition-all hover:bg-[#8BA4B8]/10"
                style={{
                  fontFamily: 'Noto Serif SC, serif',
                  color: '#8BA4B8',
                  border: '1px solid rgba(139, 164, 184, 0.5)',
                }}
              >
                继续倾听
              </button>
            </motion.div>
          )}

          {/* QUESTIONS 2 — Anima Guidance */}
          {subPhase === 'questions-2' && (
            <motion.div
              key="ch2-questions-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <QuestionSystem
                questions={CHAPTER2_QUESTIONS.slice(3, 6)}
                onAnswer={onQuestionAnswer}
                onComplete={handleQuestions2Complete}
              />
            </motion.div>
          )}

          {/* QUEST — Echo Location */}
          {subPhase === 'quest' && (
            <motion.div
              key="ch2-quest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative"
            >
              {/* Dark overlay for "closing eyes" */}
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                animate={{
                  backgroundColor: screenDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)',
                }}
                transition={{ duration: 2 }}
              />

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-30">
                {!questStarted && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xs uppercase tracking-[0.3em] mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}>
                      任务：听辨神启
                    </h3>
                    <p className="text-sm" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                      闭上眼睛，凭光球微弱的跳动，选出最轻柔的频率
                    </p>
                  </motion.div>
                )}

                {questResult === 'correct' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="z-40"
                  >
                    <p className="text-base italic mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#C0C0C0' }}>
                      "你终于不再用耳朵听，而是用心在看。"
                    </p>
                    <p className="text-lg mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#FFD700' }}>
                      ✦ 获得道具：灵魂之乐 & 纹章印记 ✦
                    </p>
                    <p className="text-sm italic mb-8" style={{ fontFamily: 'Noto Serif SC, serif', color: '#C4A35A' }}>
                      「理性是你的工具，但灵魂是你的向导。」
                    </p>
                    <button
                      onClick={onComplete}
                      className="px-8 py-3 text-sm transition-all hover:bg-[#8BA4B8]/10 animate-pulse-glow"
                      style={{
                        fontFamily: 'Noto Serif SC, serif',
                        color: '#C0C0C0',
                        border: '1px solid rgba(192, 192, 192, 0.5)',
                      }}
                    >
                      继续前行
                    </button>
                  </motion.div>
                )}

                {questResult === 'wrong' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm z-40"
                    style={{ color: '#FF6B35' }}
                  >
                    那不是直觉的声音……再试一次。
                  </motion.p>
                )}
              </div>

              {/* Light orbs */}
              {questStarted && !questResult?.startsWith('correct') && orbPositions.length > 0 && (
                LIGHT_ORBS.map((orb, i) => (
                  <motion.button
                    key={orb.id}
                    className="absolute z-30 rounded-full"
                    style={{
                      left: `${orbPositions[i]?.x || 50}%`,
                      top: `${orbPositions[i]?.y || 50}%`,
                      width: '50px',
                      height: '50px',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: screenDark ? [0.3, 0.6, 0.3] : [0.5, 0.8, 0.5],
                      boxShadow: [
                        `0 0 10px ${orb.color}40`,
                        `0 0 25px ${orb.color}80`,
                        `0 0 10px ${orb.color}40`,
                      ],
                    }}
                    transition={{
                      duration: 1 / orb.frequency,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    onClick={() => handleOrbSelect(orb.id)}
                    whileHover={{ scale: 1.3 }}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${orb.color}, transparent)`,
                        border: selectedOrb === orb.id ? `2px solid ${orb.color}` : 'none',
                      }}
                    />
                  </motion.button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
