/**
 * Chapter 1 — The Shadow Encounter + Naming Quest
 * Design: Dark Alchemical Manuscript — wet stone, flickering torches, mirror
 * 
 * New Flow:
 * 1. Intro → Accept → Shadow Naming-1 (直接拼第一个阴影)
 * 2. Shadow Naming-2 (直接拼第二个阴影)
 * 3. Shadow Naming-3 (直接拼第三个阴影)
 * 4. Shadow Questions (3个基于三个阴影的问题)
 * 5. Emotion Naming (直接拼一个情绪)
 * 6. Emotion Questions (3个基于情绪的问题)
 * 7. Integration (整合三个阴影)
 * 8. Complete → Next Chapter
 */
import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneBackground from '../SceneBackground';
import Particles from '../Particles';
import TypeWriter from '../TypeWriter';
import QuestionSystem from '../systems/QuestionSystem';
import { SCENE_IMAGES, SHADOW_WORDS } from '@/lib/gameStore';
import { playSfx } from '@/lib/bgmSfx';
import { EMOTION_WORDS, SHADOW_INTENTIONS, getShadowQuestions, getEmotionQuestions } from '@/lib/chapter1Data';
import { drawCards, getCardImagePath } from '@/lib/shadowCards';
import { drawAnimalCards, getAnimalCardImagePath, TRANSFORMATION_POWERS } from '@/lib/animalCards';

interface Chapter1SceneProps {
  onComplete: (shadowNames: string[]) => void;
  onQuestionAnswer: (questionId: string, optionId: string, knowledgeCardId?: string) => void;
  shadowNames: string[]; // 已拼出的阴影名称列表
  emotionName: string; // 当前选择的情绪名称
  onShadowNameAdd: (name: string) => void;
  onEmotionNameChange: (name: string) => void;
  subPhase: 'intro' | 'shadow-naming-1' | 'shadow-naming-2' | 'shadow-naming-3' | 'shadow-questions' | 'emotion-naming' | 'emotion-questions' | 'integration' | 'choice';
  onSubPhaseChange: (phase: 'intro' | 'shadow-naming-1' | 'shadow-naming-2' | 'shadow-naming-3' | 'shadow-questions' | 'emotion-naming' | 'emotion-questions' | 'integration' | 'choice') => void;
}

export default function Chapter1Scene({ 
  onComplete, 
  onQuestionAnswer, 
  shadowNames,
  emotionName,
  onShadowNameAdd,
  onEmotionNameChange,
  subPhase, 
  onSubPhaseChange 
}: Chapter1SceneProps) {
  const [introComplete, setIntroComplete] = useState(false);
  const [choiceMade, setChoiceMade] = useState<'fight' | 'accept' | null>(null);
  const [shaking, setShaking] = useState(false);
  const [healingText, setHealingText] = useState('');

  // 当 subPhase 重置为 intro 时，重置所有本地状态
  useEffect(() => {
    if (subPhase === 'intro') {
      setIntroComplete(false);
      setChoiceMade(null);
      setShaking(false);
      setHealingText('');
      setDrawnCard(null);
      setShadowNameInput('');
      setShadowNamingComplete(false);
      setShowCard(false);
      setDrawnShadowCards([]);
      setDrawnAnimalCards([]);
      setSelectedPowers([]);
      setEmotionNamingComplete(false);
      setShowAnimalCards(false);
      setConnections([]);
      setIntegrationComplete(false);
      setCompletedIntegrations([]);
      setDraggedPowerIndex(null);
    }
  }, [subPhase]);

  // Shadow naming state (card drawing + input)
  const [drawnCard, setDrawnCard] = useState<number | null>(null); // 当前抽到的1张卡片编号
  const [shadowNameInput, setShadowNameInput] = useState<string>(''); // 用户输入的阴影名称
  const [shadowNamingComplete, setShadowNamingComplete] = useState(false);
  const [showCard, setShowCard] = useState(false); // 是否显示卡片
  const [drawnShadowCards, setDrawnShadowCards] = useState<number[]>([]); // 抽到的3张阴影卡（用于整合页面）

  // Emotion naming state (animal cards + transformation powers)
  const [drawnAnimalCards, setDrawnAnimalCards] = useState<number[]>([]); // 抽到的3张动物卡
  const [selectedPowers, setSelectedPowers] = useState<string[]>([]); // 选择的转化力量（最多3个）
  const [emotionNamingComplete, setEmotionNamingComplete] = useState(false);
  const [showAnimalCards, setShowAnimalCards] = useState(false); // 是否显示动物卡

  // Integration state
  const [connections, setConnections] = useState<Array<{ shadowIndex: number; powerIndex: number }>>([]); // 阴影和力量的连接
  const [integrationComplete, setIntegrationComplete] = useState(false);
  const [completedIntegrations, setCompletedIntegrations] = useState<number[]>([]); // 已完成的整合索引
  const [draggedPowerIndex, setDraggedPowerIndex] = useState<number | null>(null); // 当前拖拽的力量索引
  // Refs for positioning lines
  const shadowNameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const powerNameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [linePaths, setLinePaths] = useState<Array<{ d: string; key: string }>>([]);
  const [svgViewBox, setSvgViewBox] = useState<{ width: number; height: number } | null>(null);

  // Initialize shadow naming quest (draw 1 card)
  useEffect(() => {
    if ((subPhase === 'shadow-naming-1' || subPhase === 'shadow-naming-2' || subPhase === 'shadow-naming-3') && drawnCard === null) {
      // 抽取1张卡片
      const cards = drawCards(1);
      setDrawnCard(cards[0]);
      setShadowNameInput('');
      setShadowNamingComplete(false);
      setShowCard(false);
      // 延迟显示卡片，增加仪式感
      setTimeout(() => setShowCard(true), 500);
    }
  }, [subPhase, drawnCard]);

  // 重抽卡片函数
  const handleRedrawCard = useCallback(() => {
    const cards = drawCards(1);
    setDrawnCard(cards[0]);
    setShadowNameInput('');
    setShadowNamingComplete(false);
    setShowCard(false);
    setTimeout(() => setShowCard(true), 300);
  }, []);

  // Initialize emotion naming quest (draw 3 animal cards)
  useEffect(() => {
    if (subPhase === 'emotion-naming' && drawnAnimalCards.length === 0) {
      // 抽取3张动物卡
      const cards = drawAnimalCards(3);
      setDrawnAnimalCards(cards);
      setSelectedPowers([]);
      setEmotionNamingComplete(false);
      setShowAnimalCards(false);
      // 延迟显示卡片，增加仪式感
      setTimeout(() => setShowAnimalCards(true), 500);
    }
  }, [subPhase, drawnAnimalCards.length]);

  // Initialize integration phase - ensure we have shadow cards, animal cards and selected powers（含从导航跳转进入时的补全）
  useEffect(() => {
    if (subPhase === 'integration') {
      if (drawnShadowCards.length < 3) {
        const cards = drawCards(3);
        setDrawnShadowCards(cards);
      }
      if (drawnAnimalCards.length === 0) {
        const animalCards = drawAnimalCards(3);
        setDrawnAnimalCards(animalCards);
      }
      if (selectedPowers.length < 3) {
        setSelectedPowers(TRANSFORMATION_POWERS.slice(0, 3));
      }
    }
  }, [subPhase, drawnShadowCards.length, drawnAnimalCards.length, selectedPowers.length]);

  const handleFight = () => {
    setChoiceMade('fight');
    setShaking(true);
    setHealingText('你越是排斥，它便越是强壮。');
    setTimeout(() => {
      setShaking(false);
      setTimeout(() => {
        setChoiceMade(null);
        setHealingText('');
      }, 3000);
    }, 600);
  };

  const handleAccept = () => {
    playSfx('sfx-choice');
    setChoiceMade('accept');
    setHealingText('');
    setTimeout(() => onSubPhaseChange('shadow-naming-1'), 2000);
  };

  // Shadow naming handlers (card drawing + input)
  const handleShadowNameSubmit = useCallback(() => {
    const trimmedName = shadowNameInput.trim();
    if (!trimmedName) return;
    if (trimmedName.length > 5) {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      return;
    }
    if (shadowNames.includes(trimmedName)) {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      return;
    }
    setShadowNamingComplete(true);
    onShadowNameAdd(trimmedName);
  }, [shadowNameInput, shadowNames, onShadowNameAdd]);


  // Integration handlers - 连接动物卡和阴影
  const handleAnimalCardDragStart = useCallback((animalCardIndex: number) => {
    setDraggedPowerIndex(animalCardIndex);
  }, []);

  const handleAnimalCardDragEnd = useCallback(() => {
    setDraggedPowerIndex(null);
  }, []);

  const handleShadowDrop = useCallback((shadowIndex: number) => {
    if (draggedPowerIndex === null) return;
    
    // 检查是否已经连接过
    const existingConnection = connections.find(
      c => c.shadowIndex === shadowIndex || c.powerIndex === draggedPowerIndex
    );
    
    if (existingConnection) {
      // 如果已经连接过，移除旧连接
      setConnections(prev => prev.filter(
        c => !(c.shadowIndex === shadowIndex && c.powerIndex === draggedPowerIndex) &&
             !(c.shadowIndex === existingConnection.shadowIndex && c.powerIndex === existingConnection.powerIndex)
      ));
    }
    
    // 添加新连接
    const newConnections = [...connections.filter(
      c => c.shadowIndex !== shadowIndex && c.powerIndex !== draggedPowerIndex
    ), { shadowIndex, powerIndex: draggedPowerIndex }];
    
    setConnections(newConnections);
    
    // 如果这个阴影还没有完成整合，标记为完成
    if (!completedIntegrations.includes(shadowIndex)) {
      setCompletedIntegrations(prev => [...prev, shadowIndex]);
    }
    
    // 检查是否所有阴影都已连接
    if (newConnections.length === 3) {
      setTimeout(() => {
        setIntegrationComplete(true);
      }, 1000);
    }
    
    setDraggedPowerIndex(null);
  }, [draggedPowerIndex, connections, completedIntegrations]);

  // 更新连线路径 - 连接阴影名称和力量名称文本（只连接名称文本框，不连接卡片）
  useLayoutEffect(() => {
    if (connections.length === 0 || !containerRef.current) {
      setLinePaths([]);
      setSvgViewBox(null);
      return;
    }
    
    // 计算连线路径的函数
    const calculatePaths = () => {
      const containerEl = containerRef.current;
      if (!containerEl) return;
      
      const containerRect = containerEl.getBoundingClientRect();
      
      // 更新 SVG viewBox
      setSvgViewBox({
        width: containerRect.width,
        height: containerRect.height,
      });
      
      const paths = connections.map((conn) => {
        const shadowNameEl = shadowNameRefs.current[conn.shadowIndex];
        const powerNameEl = powerNameRefs.current[conn.powerIndex];
        
        // 确保两个元素都存在，特别是力量名称元素必须存在
        if (!shadowNameEl || !powerNameEl) {
          return null;
        }
        
        const shadowRect = shadowNameEl.getBoundingClientRect();
        const powerRect = powerNameEl.getBoundingClientRect();
        
        // 验证元素是否可见且有尺寸
        if (shadowRect.width === 0 || shadowRect.height === 0 || 
            powerRect.width === 0 || powerRect.height === 0) {
          return null;
        }
        
        // 计算相对于容器的位置（不使用滚动偏移，直接使用相对于容器的位置）
        const shadowX = shadowRect.left + shadowRect.width / 2 - containerRect.left;
        const shadowY = shadowRect.bottom - containerRect.top;
        
        const powerX = powerRect.left + powerRect.width / 2 - containerRect.left;
        const powerY = powerRect.top - containerRect.top;
        
        // 使用贝塞尔曲线连接
        const midY = (shadowY + powerY) / 2;
        const controlX1 = shadowX;
        const controlY1 = shadowY + (midY - shadowY) * 0.5;
        const controlX2 = powerX;
        const controlY2 = powerY - (powerY - midY) * 0.5;
        
        return {
          d: `M ${shadowX} ${shadowY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${powerX} ${powerY}`,
          key: `${conn.shadowIndex}-${conn.powerIndex}`,
        };
      }).filter((p): p is { d: string; key: string } => p !== null);
      
      setLinePaths(paths);
    };
    
    // 多次重算路径，避免布局/动画未稳定时连线错位约 1 秒
    const scheduleRecalc = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          calculatePaths();
          const delays = integrationComplete ? [100, 400, 900] : [100, 350, 700];
          delays.forEach((d) => setTimeout(calculatePaths, d));
        });
      });
    };
    scheduleRecalc();
  }, [connections, shadowNames, selectedPowers, completedIntegrations, integrationComplete]);

  // 通用的鼓励话语
  const ENCOURAGEMENTS = [
    '你勇敢地面对了它，这是整合的第一步。',
    '理解阴影，就是理解自己。',
    '每一个连接，都是内在的对话。',
    '阴影不再是敌人，而是你的伙伴。',
    '转化正在发生，你正在成为完整的自己。',
    '接纳是整合的开始，你已经迈出了重要的一步。',
  ];

  // 通用的转化之道
  const TRANSFORMATION_WISDOMS = [
    '转化不是消除，而是理解。当你理解阴影的意图，它就不再是威胁，而是资源。',
    '阴影需要被看见，而不是被压制。当你给予它空间，它也会给予你力量。',
    '整合是对话的过程。与阴影对话，就是与自己对话。在对话中，新的平衡会自然产生。',
  ];

  // Get next shadow naming phase
  const getNextShadowNamingPhase = () => {
    if (subPhase === 'shadow-naming-1') return 'shadow-naming-2';
    if (subPhase === 'shadow-naming-2') return 'shadow-naming-3';
    if (subPhase === 'shadow-naming-3') return 'shadow-questions';
    return 'shadow-questions';
  };

  return (
    <div className={`fixed inset-0 ${shaking ? 'animate-shake' : ''}`}>
      <SceneBackground imageUrl={SCENE_IMAGES.cave} overlay="rgba(0,0,0,0.45)" />
      <Particles type="embers" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-full w-full px-4 sm:px-6 overflow-y-auto box-border pt-16 sm:pt-20">

        <AnimatePresence mode="wait">
          {/* INTRO — 补偿顶部留白，使文案与选项在视口垂直居中（与其他章节一致） */}
          {subPhase === 'intro' && (
            <motion.div
              key="ch1-intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl text-center -mt-8 sm:-mt-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ duration: 2 }}
                className="text-6xl mb-8"
              >
                🪞
              </motion.div>

              <TypeWriter
                text="潮湿的石砖地，火把摇曳。镜子中倒映出一个扭曲的化身。它开口说话了——"
                speed={70}
                className="text-base md:text-lg leading-loose mb-6"
                style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
                onComplete={() => setIntroComplete(true)}
              />

              {introComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-base md:text-lg italic mb-8 leading-relaxed" style={{ fontFamily: 'Noto Serif SC, serif', color: '#FF6B35' }}>
                    "我是你最想烧掉的日记，是你深夜里不敢承认的卑微。你还要装作不认识我多久？"
                  </p>

                  {healingText && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      className="text-sm italic mb-6"
                      style={{ fontFamily: 'EB Garamond, serif', color: '#FF6B35' }}
                    >
                      {healingText}
                    </motion.p>
                  )}

                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      onClick={handleFight}
                      className="px-8 py-3 text-sm transition-all hover:bg-red-900/20"
                      style={{
                        fontFamily: 'Noto Serif SC, serif',
                        color: '#d4c5a0',
                        border: '1px solid rgba(139, 0, 0, 0.5)',
                      }}
                    >
                      "走开！你这污秽的怪物，我不可能是你。"
                    </button>
                    <button
                      onClick={handleAccept}
                      className="px-8 py-3 text-sm transition-all hover:bg-[#FF6B35]/10"
                      style={{
                        fontFamily: 'Noto Serif SC, serif',
                        color: '#FF6B35',
                        border: '1px solid rgba(255, 107, 53, 0.5)',
                      }}
                    >
                      "原来，我也曾如此胆怯、自私……进来吧，坐到火边来。"
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* SHADOW NAMING 1/2/3 — Card Drawing + Input；小屏自适应 */}
          {(subPhase === 'shadow-naming-1' || subPhase === 'shadow-naming-2' || subPhase === 'shadow-naming-3') && drawnCard !== null && (
            <motion.div
              key={`ch1-shadow-naming-${subPhase}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl w-full max-w-full text-center px-2 sm:px-4 pb-24 box-border"
            >
              <h3 className="text-xs uppercase tracking-[0.3em] mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#FF6B35' }}>
                任务：命名阴影 ({subPhase === 'shadow-naming-1' ? 1 : subPhase === 'shadow-naming-2' ? 2 : 3}/3)
              </h3>
              
              {!showCard ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 sm:mb-8"
                >
                  <p className="text-sm mb-4" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                    正在抽取卡片...
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* 显示一张卡片 — 小屏缩小 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 sm:mb-6"
                  >
                    <p className="text-sm mb-3 sm:mb-4" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                      邂逅阴影，指引你抽到了一张卡
                    </p>
                    <div className="flex justify-center mb-4 sm:mb-6">
                      <motion.div
                        key={drawnCard}
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative flex-shrink-0"
                      >
                        <img
                          src={getCardImagePath(drawnCard)}
                          alt={`卡片 ${drawnCard}`}
                          className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 object-cover rounded mx-auto"
                          style={{
                            border: '2px solid rgba(196, 163, 90, 0.4)',
                            boxShadow: '0 0 20px rgba(196, 163, 90, 0.3)',
                          }}
                        />
                      </motion.div>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-xs sm:text-sm italic mb-3 sm:mb-4 px-1"
                      style={{ fontFamily: 'EB Garamond, serif', color: '#FF6B35' }}
                    >
                      "如果这张卡片，代表的是你内心深处的阴影，那会是什么？"
                    </motion.p>
                    
                    {/* 重抽按钮 */}
                    {!shadowNamingComplete && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        onClick={handleRedrawCard}
                        className="px-4 sm:px-6 py-2 text-xs transition-all hover:bg-[#C4A35A]/10 mb-3 sm:mb-4"
                        style={{
                          fontFamily: 'Noto Serif SC, serif',
                          color: '#C4A35A',
                          border: '1px solid rgba(196, 163, 90, 0.3)',
                        }}
                      >
                        重新抽取
                      </motion.button>
                    )}
                  </motion.div>

                  {/* 输入框 — 小屏不溢出 */}
                  {!shadowNamingComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mb-4 sm:mb-6 w-full flex flex-col items-center"
                    >
                      <input
                        type="text"
                        value={shadowNameInput}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const charCount = Array.from(newValue).length;
                          if (charCount <= 8) {
                            setShadowNameInput(newValue);
                          } else {
                            const truncated = Array.from(newValue).slice(0, 8).join('');
                            setShadowNameInput(truncated);
                          }
                        }}
                        onKeyDown={(e) => {
                          const charCount = Array.from(shadowNameInput).length;
                          if (charCount >= 8 && 
                              e.key !== 'Backspace' && 
                              e.key !== 'Delete' && 
                              !e.key.startsWith('Arrow') && 
                              e.key !== 'Home' && 
                              e.key !== 'End' &&
                              e.key !== 'Tab' &&
                              !e.ctrlKey && 
                              !e.metaKey) {
                            e.preventDefault();
                          }
                          if (e.key === 'Enter' && shadowNameInput.trim()) {
                            handleShadowNameSubmit();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedText = e.clipboardData.getData('text');
                          const charCount = Array.from(shadowNameInput + pastedText).length;
                          if (charCount <= 8) {
                            setShadowNameInput(shadowNameInput + pastedText);
                          } else {
                            const remaining = 8 - Array.from(shadowNameInput).length;
                            if (remaining > 0) {
                              const truncated = Array.from(pastedText).slice(0, remaining).join('');
                              setShadowNameInput(shadowNameInput + truncated);
                            }
                          }
                        }}
                        placeholder="输入阴影的名称（最多8个字）"
                        maxLength={8}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-center bg-transparent border-2 rounded w-full max-w-[min(300px,90vw)] box-border"
                        style={{
                          fontFamily: 'Noto Serif SC, serif',
                          color: '#d4c5a0',
                          borderColor: 'rgba(196, 163, 90, 0.4)',
                        }}
                        autoFocus
                      />
                      <p className="text-xs mt-2" style={{ color: Array.from(shadowNameInput).length >= 8 ? '#FF6B35' : '#666', fontFamily: 'Noto Serif SC, serif' }}>
                        {Array.from(shadowNameInput).length}/8 {Array.from(shadowNameInput).length >= 8 ? '(最多8个字)' : ''}
                      </p>
                      {shadowNameInput.trim() && (
                        <button
                          onClick={handleShadowNameSubmit}
                          className="mt-3 sm:mt-4 px-6 sm:px-8 py-2.5 sm:py-3 text-sm transition-all hover:bg-[#FF6B35]/10"
                          style={{
                            fontFamily: 'Noto Serif SC, serif',
                            color: '#FF6B35',
                            border: '1px solid rgba(255, 107, 53, 0.5)',
                          }}
                        >
                          确认命名
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* 命名完成后的显示 */}
                  {shadowNamingComplete && shadowNameInput && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 sm:mt-6"
                    >
                      <p className="text-base sm:text-lg mb-3 sm:mb-4 px-1 break-words" style={{ fontFamily: 'Cinzel, serif', color: '#FF6B35' }}>
                        ✦ 阴影名称：{shadowNameInput} ✦
                      </p>
                      <p className="text-xs sm:text-sm mb-4 sm:mb-6 px-1" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                        你识别了这个阴影。它隐藏在你内心深处，等待被理解。
                      </p>
                      <button
                        onClick={() => {
                          if (drawnCard !== null) {
                            const currentIndex = subPhase === 'shadow-naming-1' ? 0 : subPhase === 'shadow-naming-2' ? 1 : 2;
                            setDrawnShadowCards(prev => {
                              const newCards = [...prev];
                              newCards[currentIndex] = drawnCard;
                              return newCards;
                            });
                          }
                          setDrawnCard(null);
                          setShadowNameInput('');
                          setShadowNamingComplete(false);
                          setShowCard(false);
                          const nextPhase = getNextShadowNamingPhase();
                          playSfx('sfx-choice');
                          onSubPhaseChange(nextPhase);
                        }}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm transition-all hover:bg-[#FF6B35]/10"
                        style={{
                          fontFamily: 'Noto Serif SC, serif',
                          color: '#FF6B35',
                          border: '1px solid rgba(255, 107, 53, 0.5)',
                        }}
                      >
                        {subPhase !== 'shadow-naming-3' ? '继续命名下一个阴影' : '继续探索'}
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* SHADOW QUESTIONS — Based on three shadows；跳转进入时若未命名满 3 个则用占位文案 */}
          {subPhase === 'shadow-questions' && (
            <motion.div
              key="ch1-shadow-questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl"
            >
              {shadowNames.length < 3 && (
                <p className="text-xs mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8' }}>
                  请先完成三个阴影的命名，或直接在此回答以下问题。
                </p>
              )}
              <QuestionSystem
                questions={getShadowQuestions(shadowNames.length >= 3 ? shadowNames.join('、') : '阴影一、阴影二、阴影三')}
                onAnswer={onQuestionAnswer}
                onComplete={() => onSubPhaseChange('emotion-naming')}
              />
            </motion.div>
          )}

          {/* EMOTION NAMING — Animal Cards + Transformation Powers */}
          {subPhase === 'emotion-naming' && drawnAnimalCards.length === 3 && (
            <motion.div
              key="ch1-emotion-naming"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl w-full max-w-full text-center px-2 sm:px-4 pb-24 box-border"
            >
              <h3 className="text-xs uppercase tracking-[0.3em] mb-2" style={{ fontFamily: 'Cinzel, serif', color: '#FF6B35' }}>
                任务：选择转化力量
              </h3>
              
              {!showAnimalCards ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-8"
                >
                  <p className="text-sm mb-4" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                    正在抽取动物卡...
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* 显示三张动物卡 — 小屏缩小、可换行 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 sm:mb-6"
                  >
                    <p className="text-sm mb-3 sm:mb-4" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                      你抽到了三张动物卡
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                      {drawnAnimalCards.map((cardNum, index) => (
                        <motion.div
                          key={cardNum}
                          initial={{ opacity: 0, scale: 0.8, rotate: -5 + index * 3 }}
                          animate={{ opacity: 1, scale: 1, rotate: -2 + index * 1 }}
                          transition={{ delay: index * 0.2, duration: 0.5 }}
                          className="relative flex-shrink-0"
                        >
                          <img
                            src={getAnimalCardImagePath(cardNum)}
                            alt={`动物卡 ${cardNum}`}
                            className="w-24 h-36 sm:w-40 sm:h-56 md:w-48 md:h-72 object-cover rounded mx-auto"
                            style={{
                              border: '2px solid rgba(196, 163, 90, 0.4)',
                              boxShadow: '0 0 20px rgba(196, 163, 90, 0.3)',
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-sm italic mb-6"
                      style={{ fontFamily: 'EB Garamond, serif', color: '#FF6B35' }}
                    >
                      "如果这三张卡是你的盟友，能够为你提供转化阴影的力量，那会是什么？"
                    </motion.p>
                  </motion.div>

                  {/* 转化力量选择 — 小屏更密、按钮更小 */}
                  {!emotionNamingComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="mb-6"
                    >
                      <p className="text-sm mb-3 sm:mb-4" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                        选择三种转化力量 ({selectedPowers.length}/3)
                      </p>
                      {selectedPowers.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-3 sm:mb-4"
                        >
                          <p className="text-xs mb-2 px-1 break-all" style={{ color: '#C4A35A', fontFamily: 'Noto Serif SC, serif' }}>
                            已选择：{selectedPowers.join('、')}
                          </p>
                        </motion.div>
                      )}
                      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2 sm:px-4 py-3 sm:py-4 min-w-0">
                        {TRANSFORMATION_POWERS.map((power) => {
                          const isSelected = selectedPowers.includes(power);
                          const isDisabled = !isSelected && selectedPowers.length >= 3;
                          
                          return (
                            <motion.button
                              key={power}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: isDisabled ? 0.4 : 1, scale: 1 }}
                              whileHover={!isDisabled ? { scale: 1.1, boxShadow: '0 0 20px rgba(196, 163, 90, 0.5)' } : {}}
                              whileTap={!isDisabled ? { scale: 0.95 } : {}}
                              onClick={() => {
                                if (isDisabled) return;
                                playSfx('sfx-choice');
                                if (isSelected) {
                                  const newPowers = selectedPowers.filter(p => p !== power);
                                  setSelectedPowers(newPowers);
                                } else {
                                  const newPowers = [...selectedPowers, power];
                                  setSelectedPowers(newPowers);
                                  if (newPowers.length === 3) {
                                    setEmotionNamingComplete(true);
                                    onEmotionNameChange(newPowers.join('、'));
                                  }
                                }
                              }}
                              disabled={isDisabled}
                              className={`px-3 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm transition-all ${
                                isSelected ? 'ring-2 ring-[#C4A35A]' : ''
                              } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                              style={{
                                fontFamily: 'Noto Serif SC, serif',
                                color: isSelected ? '#C4A35A' : '#d4c5a0',
                                background: isSelected
                                  ? 'radial-gradient(circle, rgba(196, 163, 90, 0.3) 0%, rgba(196, 163, 90, 0.1) 100%)'
                                  : 'radial-gradient(circle, rgba(196, 163, 90, 0.2) 0%, rgba(196, 163, 90, 0.05) 100%)',
                                border: `1px solid ${isSelected ? 'rgba(196, 163, 90, 0.6)' : 'rgba(196, 163, 90, 0.3)'}`,
                                boxShadow: isSelected
                                  ? '0 0 15px rgba(196, 163, 90, 0.4)'
                                  : '0 0 8px rgba(196, 163, 90, 0.2)',
                              }}
                            >
                              {power}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* 选择完成后的显示 */}
                  {emotionNamingComplete && selectedPowers.length === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <p className="text-lg mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#FF6B35' }}>
                        ✦ 转化力量：{selectedPowers.join('、')} ✦
                      </p>
                      <p className="text-sm mb-6" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                        你选择了这三种力量。它们将帮助你转化阴影，成为你内在的盟友。
                      </p>
                      <button
                        onClick={() => { playSfx('sfx-choice'); onSubPhaseChange('emotion-questions'); }}
                        className="px-8 py-3 text-sm transition-all hover:bg-[#FF6B35]/10"
                        style={{
                          fontFamily: 'Noto Serif SC, serif',
                          color: '#FF6B35',
                          border: '1px solid rgba(255, 107, 53, 0.5)',
                        }}
                      >
                        继续探索
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* EMOTION QUESTIONS — 选择转化力量后的问题；跳转进入时若无情绪名则用占位 */}
          {subPhase === 'emotion-questions' && (
            <motion.div
              key="ch1-emotion-questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl"
            >
              {!emotionName && (
                <p className="text-xs mb-4" style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8' }}>
                  请先完成转化力量选择，或直接在此回答以下问题。
                </p>
              )}
              <QuestionSystem
                questions={getEmotionQuestions(emotionName || '转化力量、接纳、对话')}
                onAnswer={onQuestionAnswer}
                onComplete={() => { playSfx('sfx-choice'); onSubPhaseChange('integration'); }}
              />
            </motion.div>
          )}

          {/* INTEGRATION — 整合阴影；进入时由 useEffect 补全 drawnShadowCards / drawnAnimalCards / selectedPowers */}
          {subPhase === 'integration' && drawnShadowCards.length === 3 && drawnAnimalCards.length === 3 && (
            <motion.div
              key="ch1-integration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl w-full max-w-full py-4 px-2 sm:px-4 pb-24 relative box-border"
              ref={containerRef}
            >
              <h3 className="text-xs uppercase tracking-[0.3em] mb-2 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#FF6B35' }}>
                任务：整合阴影
              </h3>
              <p className="text-xs mb-3 sm:mb-4 text-center" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
                将下方的动物卡拖拽到对应的阴影卡上，完成整合
              </p>

              {/* 上方：3张阴影卡 — 小屏缩小尺寸与间距 */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {(shadowNames.length >= 3 ? shadowNames.slice(-3) : ['阴影一', '阴影二', '阴影三']).map((shadowName, shadowIndex) => {
                  const connectedAnimalIndex = connections.find(c => c.shadowIndex === shadowIndex)?.powerIndex;
                  const isConnected = connectedAnimalIndex !== undefined;
                  
                  return (
                    <motion.div
                      key={shadowIndex}
                      className="flex flex-col items-center"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDrop={() => handleShadowDrop(shadowIndex)}
                    >
                      {/* 阴影卡 */}
                      {drawnShadowCards[shadowIndex] && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: shadowIndex * 0.1 }}
                          className="mb-2"
                        >
                          <img
                            src={getCardImagePath(drawnShadowCards[shadowIndex])}
                            alt={`阴影卡 ${drawnShadowCards[shadowIndex]}`}
                            className="w-16 h-24 sm:w-24 sm:h-36 object-cover rounded flex-shrink-0"
                            style={{
                              border: `2px solid ${isConnected ? 'rgba(196, 163, 90, 0.6)' : 'rgba(196, 163, 90, 0.3)'}`,
                              boxShadow: isConnected ? '0 0 15px rgba(196, 163, 90, 0.4)' : '0 0 8px rgba(196, 163, 90, 0.2)',
                            }}
                          />
                        </motion.div>
                      )}
                      
                      {/* 阴影名称 - 统一文字大小 */}
                      <motion.div
                        ref={(el) => { shadowNameRefs.current[shadowIndex] = el; }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + shadowIndex * 0.1 }}
                        className={`text-xs sm:text-base mb-1 px-2 sm:px-3 py-1 rounded transition-all ${
                          isConnected ? 'ring-2 ring-[#C4A35A]' : ''
                        }`}
                        style={{
                          fontFamily: 'Cinzel, serif',
                          color: isConnected ? '#C4A35A' : '#FF6B35',
                          background: isConnected ? 'rgba(196, 163, 90, 0.1)' : 'transparent',
                          minHeight: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {shadowName}
                      </motion.div>


                      {/* 鼓励话语和转化之道（当连接完成时） */}
                      {completedIntegrations.includes(shadowIndex) && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 p-1.5 sm:p-2 rounded text-center w-full min-w-0"
                          style={{
                            background: 'rgba(28, 26, 24, 0.75)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: '1px solid rgba(196, 163, 90, 0.4)',
                          }}
                        >
                          <p className="text-[10px] sm:text-xs mb-0.5 sm:mb-1 italic" style={{ fontFamily: 'EB Garamond, serif', color: '#C4A35A' }}>
                            {ENCOURAGEMENTS[shadowIndex % ENCOURAGEMENTS.length]}
                          </p>
                          <p className="text-[10px] sm:text-xs leading-tight break-words" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
                            {TRANSFORMATION_WISDOMS[shadowIndex % TRANSFORMATION_WISDOMS.length]}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>


              {/* SVG连线层 - 根据实际位置连接阴影名称和力量名称 */}
              {linePaths.length > 0 && svgViewBox && (
                <svg 
                  className="absolute inset-0 pointer-events-none" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    zIndex: 1,
                    overflow: 'visible',
                  }}
                  viewBox={`0 0 ${svgViewBox.width} ${svgViewBox.height}`}
                  preserveAspectRatio="none"
                >
                  {linePaths.map((path, idx) => (
                    <motion.path
                      key={path.key}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.6 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      d={path.d}
                      stroke="rgba(196, 163, 90, 0.6)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </svg>
              )}

              {/* 分隔线 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-px mb-3 sm:mb-4"
                style={{ background: 'linear-gradient(to right, transparent, rgba(196, 163, 90, 0.3), transparent)' }}
              />

              {/* 下方：3张动物卡 — 小屏缩小 */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {drawnAnimalCards.map((animalCardNum, animalIndex) => {
                  const connectedShadowIndex = connections.find(c => c.powerIndex === animalIndex)?.shadowIndex;
                  const isConnected = connectedShadowIndex !== undefined;
                  
                  return (
                    <motion.div
                      key={animalIndex}
                      draggable={!isConnected}
                      onDragStart={() => handleAnimalCardDragStart(animalIndex)}
                      onDragEnd={handleAnimalCardDragEnd}
                      className={`flex flex-col items-center cursor-${isConnected ? 'default' : 'grab'} active:cursor-grabbing`}
                      style={{
                        opacity: isConnected ? 0.6 : 1,
                      }}
                    >
                      {/* 显示选的力量 - 移到动物卡上方，统一文字大小和亮度，添加外框 */}
                      {/* 重要：力量名称必须始终渲染（即使不可见），以确保ref正确绑定 */}
                      {selectedPowers[animalIndex] ? (
                        <motion.div
                          ref={(el) => { 
                            powerNameRefs.current[animalIndex] = el;
                          }}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: isConnected ? 1 : 0.3, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`text-xs sm:text-base px-2 sm:px-3 py-1 rounded mb-1 transition-all ${
                            isConnected ? 'ring-2 ring-[#C4A35A]' : ''
                          }`}
                          style={{
                            fontFamily: 'Cinzel, serif',
                            color: '#FF6B35',
                            background: isConnected ? 'rgba(196, 163, 90, 0.1)' : 'transparent',
                            border: '1px solid rgba(196, 163, 90, 0.3)',
                            minHeight: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {selectedPowers[animalIndex]}
                        </motion.div>
                      ) : (
                        // 占位元素，确保ref数组长度正确，但保持相同高度
                        <div 
                          ref={(el) => { 
                            powerNameRefs.current[animalIndex] = null;
                          }}
                          style={{ 
                            display: 'block',
                            height: '32px',
                            visibility: 'hidden',
                          }}
                        />
                      )}
                      
                      {/* 动物卡 */}
                      <motion.div
                        whileHover={!isConnected ? { scale: 1.05 } : {}}
                        whileTap={!isConnected ? { scale: 0.95 } : {}}
                        className="relative"
                      >
                        <img
                          src={getAnimalCardImagePath(animalCardNum)}
                          alt={`动物卡 ${animalCardNum}`}
                          className={`w-16 h-24 sm:w-24 sm:h-36 object-cover rounded transition-all flex-shrink-0 ${
                            isConnected ? 'ring-2 ring-[#C4A35A]' : ''
                          }`}
                          style={{
                            border: `2px solid ${isConnected ? 'rgba(196, 163, 90, 0.6)' : 'rgba(196, 163, 90, 0.3)'}`,
                            boxShadow: isConnected
                              ? '0 0 15px rgba(196, 163, 90, 0.4)'
                              : '0 0 8px rgba(196, 163, 90, 0.2)',
                            cursor: isConnected ? 'default' : 'grab',
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* 完成按钮 — 留足底部空间避免被固定栏遮挡 */}
              {integrationComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center pb-8"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs sm:text-sm mb-4 italic px-2 break-words"
                    style={{ fontFamily: 'EB Garamond, serif', color: '#C4A35A' }}
                  >
                    "整合完成。阴影不再是你的敌人，而是你内在的盟友。"
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => { playSfx('sfx-choice'); onSubPhaseChange('choice'); }}
                    className="px-8 py-3 text-sm transition-all hover:bg-[#FF6B35]/10"
                    style={{
                      fontFamily: 'Noto Serif SC, serif',
                      color: '#FF6B35',
                      border: '1px solid rgba(255, 107, 53, 0.5)',
                    }}
                  >
                    继续前行
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* CHOICE — 选择进入第二章 */}
          {subPhase === 'choice' && (
            <motion.div
              key="ch1-choice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto text-center"
            >
              <p className="text-sm italic mb-4" style={{ fontFamily: 'EB Garamond, serif', color: '#d4c5a0' }}>
                阴影已与你同在；当遮蔽散去，内在的声音便清晰可闻。
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <p className="text-lg leading-relaxed" style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}>
                  前方，迷雾笼罩的森林在等你——步入其中，便能听见。
                </p>
              </motion.div>
              <motion.button
                onClick={() => { playSfx('sfx-choice'); onComplete(shadowNames.length >= 3 ? shadowNames.slice(-3) : ['阴影一', '阴影二', '阴影三']); }}
                className="px-8 py-3 text-sm rounded border transition-all hover:bg-[#FF6B35]/10"
                style={{
                  fontFamily: 'Noto Serif SC, serif',
                  color: '#FF6B35',
                  border: '1px solid rgba(255, 107, 53, 0.5)',
                }}
              >
                步入森林
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
