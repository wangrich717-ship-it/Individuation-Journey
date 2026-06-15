/**
 * Understanding Questions Component
 * 理解我们的合奏 - 3个问题
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import ColorPicker from '../ColorPicker';
import { playSfx } from '@/lib/bgmSfx';

interface Option {
  id: string;
  text: string;
  feedback: string;
}

interface Question {
  id: string;
  text: string;
  questionNumber: number;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 'understanding-q1',
    text: '我们共同创造的这个"回响空间"，它更像一种什么感觉？',
    questionNumber: 1,
    options: [
      { id: 'a', text: '一个被照亮的瞬间。', feedback: '被照亮的瞬间是觉醒的时刻，是内在智慧的显现。' },
      { id: 'b', text: '一种被理解的宁静。', feedback: '被理解的宁静是共鸣的体现，是内在声音得到回应的满足。' },
      { id: 'c', text: '一股想要行动的动力。', feedback: '行动的动力是转化的开始，是内在声音转化为外在行动的桥梁。' },
    ],
  },
  {
    id: 'understanding-q2',
    text: '如果这个空间有一种颜色，那会是？',
    questionNumber: 2,
    options: [
      { id: 'a', text: '幽蓝', feedback: '幽蓝代表深度和神秘，是内在空间的颜色。' },
      { id: 'b', text: '暖金', feedback: '暖金代表智慧和光明，是觉醒的颜色。' },
      { id: 'c', text: '灰绿', feedback: '灰绿代表平衡和生长，是和谐的颜色。' },
    ],
  },
  {
    id: 'understanding-q3',
    text: '你愿意让这个"回响"，在你的生活中占据一席之地吗？',
    questionNumber: 3,
    options: [
      { id: 'a', text: '愿意，作为内心的避难所。', feedback: '内心的避难所是安全的港湾，是你在喧嚣世界中的宁静之地。' },
      { id: 'b', text: '愿意，作为行动的灯塔。', feedback: '行动的灯塔是方向的指引，是你在迷茫时的明灯。' },
      { id: 'c', text: '我需要一点时间来适应它。', feedback: '适应是过程，给时间让回响空间在你的生活中自然生长。' },
    ],
  },
];

interface UnderstandingQuestionsProps {
  questionId: string;
  onAnswer: (questionId: string, optionId: string, knowledgeCardId?: string) => void;
  selectedAnswer?: string;
}

export default function UnderstandingQuestions({ questionId, onAnswer, selectedAnswer }: UnderstandingQuestionsProps) {
  const question = QUESTIONS.find(q => q.id === questionId);
  if (!question) return null;
  const [selectedColor, setSelectedColor] = useState<string>('');

  const handleOptionClick = (optionId: string) => {
    if (selectedAnswer) return;
    playSfx('sfx-choice');
    // 根据问题生成知识卡片ID
    const knowledgeCardIdMap: Record<string, string> = {
      'understanding-q1': 'echo-space-feeling',
      'understanding-q2': 'echo-space-color',
      'understanding-q3': 'echo-space-integration',
    };
    onAnswer(questionId, optionId, knowledgeCardIdMap[questionId]);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    playSfx('sfx-choice');
    // 将颜色转换为选项ID（简化处理）
    const optionId = 'custom-color';
    onAnswer(questionId, optionId, 'echo-space-color');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-xs uppercase tracking-widest mb-4 text-center" style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}>
        问题 {question.questionNumber}/3
      </div>
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg md:text-xl mb-8 text-center"
        style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
      >
        {question.text}
      </motion.h3>

      {/* 颜色选择器（问题2） */}
      {questionId === 'understanding-q2' ? (
        <ColorPicker onColorSelect={handleColorSelect} selectedColor={selectedColor} />
      ) : (
        <div className="space-y-3">
          {question.options.map((option) => {
            return (
              <motion.button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                disabled={!!selectedAnswer}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  selectedAnswer === option.id
                    ? 'ring-2 ring-offset-2'
                    : selectedAnswer
                    ? 'opacity-50'
                    : 'hover:scale-[1.02]'
                }`}
                style={{
                  background: 'rgba(28, 35, 45, 0.42)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderColor: selectedAnswer === option.id ? '#8BA4B8' : 'rgba(139, 164, 184, 0.4)',
                }}
                whileHover={!selectedAnswer ? { scale: 1.02 } : {}}
                whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm flex-1"
                    style={{
                      fontFamily: 'Noto Serif SC, serif',
                      color: selectedAnswer === option.id ? '#8BA4B8' : '#8BA4B8',
                    }}
                  >
                    {option.text}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* 反馈 */}
      {selectedAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-lg text-center"
          style={{
            background: 'rgba(28, 35, 45, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(139, 164, 184, 0.35)',
          }}
        >
          <p className="text-sm italic mb-2" style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8' }}>
            {questionId === 'understanding-q2' && selectedColor
              ? `你选择的颜色反映了回响空间的本质。颜色是心灵的象征，每一种颜色都承载着不同的意义。`
              : question.options.find(o => o.id === selectedAnswer)?.feedback}
          </p>
          {/* 知识卡片提示 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs mt-2"
            style={{ fontFamily: 'Cinzel, serif', color: '#FFD700' }}
          >
            ✦ 获得知识卡片 ✦
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}
