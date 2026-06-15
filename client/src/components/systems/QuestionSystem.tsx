/**
 * Question System Component
 * 问答系统组件
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '@/lib/questions';
import { playSfx } from '@/lib/bgmSfx';

interface QuestionSystemProps {
  questions: Question[];
  onAnswer: (questionId: string, optionId: string, knowledgeCardId?: string) => void;
  onComplete: () => void;
}

export default function QuestionSystem({ questions, onAnswer, onComplete }: QuestionSystemProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleOptionClick = (optionId: string, knowledgeCardId?: string) => {
    if (selectedOption) return; // 防止重复点击

    playSfx('sfx-choice');
    setSelectedOption(optionId);
    setShowFeedback(true);
    onAnswer(currentQuestion.id, optionId, knowledgeCardId);

    // 显示反馈后，延迟进入下一题或完成
    setTimeout(() => {
      if (isLastQuestion) {
        onComplete();
      } else {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      }
    }, 2000);
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* 问题进度 */}
          <div className="mb-6">
            <span className="text-xs uppercase tracking-[0.3em]" style={{ fontFamily: 'Cinzel, serif', color: '#C4A35A' }}>
              问题 {currentIndex + 1} / {questions.length}
            </span>
          </div>

          {/* 问题文本 */}
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl mb-8 leading-relaxed"
            style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
          >
            {currentQuestion.text}
          </motion.h3>

          {/* 选项 */}
          <div className="flex flex-col gap-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === option.id;
              const showKnowledgeCard = showFeedback && isSelected && option.knowledgeCardId;

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => handleOptionClick(option.id, option.knowledgeCardId)}
                  disabled={!!selectedOption}
                  className={`px-6 py-3 text-sm text-left transition-all ${
                    isSelected
                      ? 'bg-[#C4A35A]/20 border-[#C4A35A]'
                      : 'hover:bg-[#C4A35A]/10 border-[#C4A35A]/30'
                  }`}
                  style={{
                    fontFamily: 'Noto Serif SC, serif',
                    color: isSelected ? '#C4A35A' : '#d4c5a0',
                    border: `1px solid ${isSelected ? 'rgba(196, 163, 90, 0.8)' : 'rgba(196, 163, 90, 0.3)'}`,
                    opacity: selectedOption && !isSelected ? 0.5 : 1,
                    cursor: selectedOption ? 'not-allowed' : 'pointer',
                  }}
                >
                  {option.text}
                </motion.button>
              );
            })}
          </div>

          {/* 反馈 */}
          {showFeedback && selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded"
              style={{
                background: 'rgba(196, 163, 90, 0.1)',
                border: '1px solid rgba(196, 163, 90, 0.3)',
              }}
            >
              <p className="text-sm italic" style={{ fontFamily: 'EB Garamond, serif', color: '#C4A35A' }}>
                {currentQuestion.options.find(o => o.id === selectedOption)?.feedback}
              </p>
              {currentQuestion.options.find(o => o.id === selectedOption)?.knowledgeCardId && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs mt-2"
                  style={{ fontFamily: 'Cinzel, serif', color: '#FFD700' }}
                >
                  ✦ 获得知识卡片 ✦
                </motion.p>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
