/**
 * Listening Questions Component
 * 聆听任务的3个问题
 */
import { motion } from 'framer-motion';
import { playSfx } from '@/lib/bgmSfx';

interface Option {
  id: string;
  text: string;
  icon: React.ReactNode; // 纯色蓝色系图标
  isPositive: boolean;
  feedback: string; // 反馈文本
}

// 纯色蓝色系图标组件
const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#8BA4B8"/>
  </svg>
);

const BrainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 18.1 8.9 19 10 19H14C15.1 19 16 18.1 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2ZM14 17H10V15.58C10.59 15.79 11.28 15.9 12 15.9C12.72 15.9 13.41 15.79 14 15.58V17Z" fill="#8BA4B8"/>
  </svg>
);

const WaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12C2 12 5 8 8 8C11 8 13 12 16 12C19 12 22 8 22 8M2 16C2 16 5 12 8 12C11 12 13 16 16 16C19 16 22 12 22 12" stroke="#8BA4B8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ThroatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 18.1 8.9 19 10 19H14C15.1 19 16 18.1 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z" fill="#6B8BA4"/>
    <path d="M9 9H15M9 13H15" stroke="#6B8BA4" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ChestIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 18.1 8.9 19 10 19H14C15.1 19 16 18.1 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z" fill="#4A6B8C"/>
    <path d="M9 9H15M9 13H12" stroke="#4A6B8C" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const LightningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#4A6B8C"/>
  </svg>
);

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#8BA4B8"/>
  </svg>
);

const SwordIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.92 19.92L4 17L17.5 3.5L20.5 6.5L7 20L6.92 19.92ZM14.5 6.5L17.5 9.5" stroke="#8BA4B8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const DoveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 11C22 16.52 17.52 21 12 21C6.48 21 2 16.52 2 11C2 5.48 6.48 1 12 1C17.52 1 22 5.48 22 11Z" fill="#8BA4B8"/>
    <path d="M8 11L11 14L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 22H22L12 2Z" fill="#6B8BA4"/>
    <path d="M12 9V13M12 17H12.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#4A6B8C"/>
    <path d="M8 10C8.55 10 9 9.55 9 9C9 8.45 8.55 8 8 8C7.45 8 7 8.45 7 9C7 9.55 7.45 10 8 10ZM16 10C16.55 10 17 9.55 17 9C17 8.45 16.55 8 16 8C15.45 8 15 8.45 15 9C15 9.55 15.45 10 16 10ZM12 17.5C9.24 17.5 6.83 15.82 5.5 13.3L6.5 12.7C7.7 14.9 9.7 16.5 12 16.5C14.3 16.5 16.3 14.9 17.5 12.7L18.5 13.3C17.17 15.82 14.76 17.5 12 17.5Z" fill="#4A6B8C"/>
  </svg>
);

const QuestionIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#6B8BA4"/>
  </svg>
);

const BreathIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12C2 12 5 8 8 8C11 8 13 12 16 12C19 12 22 8 22 8" stroke="#8BA4B8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="#8BA4B8" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" stroke="#8BA4B8" strokeWidth="2"/>
  </svg>
);

const HandIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 11V6C18 4.9 17.1 4 16 4H15C13.9 4 13 4.9 13 6V11M18 11V16C18 17.1 17.1 18 16 18H8C6.9 18 6 17.1 6 16V11M18 11H6" stroke="#8BA4B8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

interface Question {
  id: string;
  text: string;
  questionNumber: number;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 'listening-q1',
    text: '如果这声音有形，它在你体内的何处振动？',
    questionNumber: 1,
    options: [
      { id: 'a', text: '心脏', icon: <HeartIcon />, isPositive: true, feedback: '心脏是情感的容器，声音在这里振动，意味着它与你的情感紧密相连。' },
      { id: 'b', text: '大脑', icon: <BrainIcon />, isPositive: true, feedback: '大脑是理性的居所，声音在这里振动，意味着它需要你的理解与思考。' },
      { id: 'c', text: '腹部', icon: <WaveIcon />, isPositive: true, feedback: '腹部是直觉的源泉，声音在这里振动，意味着它来自你最深层的感知。' },
      { id: 'd', text: '喉咙', icon: <ThroatIcon />, isPositive: false, feedback: '喉咙是表达的地方，声音在这里振动，意味着它渴望被说出。' },
      { id: 'e', text: '胸口', icon: <ChestIcon />, isPositive: false, feedback: '胸口是压抑的所在，声音在这里振动，意味着它被某种力量束缚。' },
      { id: 'f', text: '四肢', icon: <LightningIcon />, isPositive: false, feedback: '四肢是行动的载体，声音在这里振动，意味着它催促你行动。' },
    ],
  },
  {
    id: 'listening-q2',
    text: '若将这声音视为信使，它最想传递的是什么？',
    questionNumber: 2,
    options: [
      { id: 'a', text: '希望与可能', icon: <StarIcon />, isPositive: true, feedback: '希望是内在的指引，它告诉你前方有光。' },
      { id: 'b', text: '力量与勇气', icon: <SwordIcon />, isPositive: true, feedback: '力量来自内在，勇气是行动的起点。' },
      { id: 'c', text: '平静与接纳', icon: <DoveIcon />, isPositive: true, feedback: '平静是智慧的体现，接纳是成长的开始。' },
      { id: 'd', text: '警告与警惕', icon: <WarningIcon />, isPositive: false, feedback: '警告是保护，警惕是觉察，它们都在提醒你注意。' },
      { id: 'e', text: '痛苦与挣扎', icon: <PainIcon />, isPositive: false, feedback: '痛苦是信号，挣扎是过程，它们都在告诉你需要改变。' },
      { id: 'f', text: '怀疑与不安', icon: <QuestionIcon />, isPositive: false, feedback: '怀疑是思考的开始，不安是觉察的体现，它们都在引导你探索。' },
    ],
  },
  {
    id: 'listening-q3',
    text: '如果你能用一个动作回应这声音，你会？',
    questionNumber: 3,
    options: [
      { id: 'a', text: '深呼吸，让它流过。', icon: <BreathIcon />, isPositive: true, feedback: '接纳是第一步，让声音流过，意味着你愿意倾听。' },
      { id: 'b', text: '转身，直面它的来源。', icon: <EyeIcon />, isPositive: true, feedback: '直面是勇气，转身意味着你愿意正视内在的声音。' },
      { id: 'c', text: '伸手，试图触碰它。', icon: <HandIcon />, isPositive: true, feedback: '触碰是连接，伸手意味着你愿意与内在声音建立联系。' },
    ],
  },
];

interface ListeningQuestionsProps {
  questionId: string;
  onAnswer: (questionId: string, optionId: string, knowledgeCardId?: string) => void;
  selectedAnswer?: string;
}

export default function ListeningQuestions({ questionId, onAnswer, selectedAnswer }: ListeningQuestionsProps) {
  const question = QUESTIONS.find(q => q.id === questionId);
  if (!question) return null;

  const handleOptionClick = (optionId: string) => {
    if (selectedAnswer) return;
    playSfx('sfx-choice');
    // 根据问题生成知识卡片ID
    const knowledgeCardIdMap: Record<string, string> = {
      'listening-q1': 'inner-vibration',
      'listening-q2': 'inner-messenger',
      'listening-q3': 'inner-response',
    };
    onAnswer(questionId, optionId, knowledgeCardIdMap[questionId]);
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

      <div className="space-y-3">
        {question.options.map((option) => (
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
              background: option.isPositive
                ? 'rgba(28, 35, 45, 0.42)'
                : 'rgba(28, 28, 40, 0.42)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              borderColor: option.isPositive
                ? selectedAnswer === option.id
                  ? '#8BA4B8'
                  : 'rgba(139, 164, 184, 0.3)'
                : selectedAnswer === option.id
                ? '#6B4A8C'
                : 'rgba(107, 74, 140, 0.3)',
            }}
            whileHover={!selectedAnswer ? { scale: 1.02 } : {}}
            whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0" style={{ color: option.isPositive ? '#8BA4B8' : '#6B8BA4' }}>
                {option.icon}
              </div>
              <span
                className="text-sm flex-1"
                style={{
                  fontFamily: 'Noto Serif SC, serif',
                  color: option.isPositive ? '#8BA4B8' : '#9B7FB8',
                }}
              >
                {option.text}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

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
            {question.options.find(o => o.id === selectedAnswer)?.feedback}
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
