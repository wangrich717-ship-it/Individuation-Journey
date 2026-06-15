/**
 * Game State Management for Individuation Journey
 * Design: Dark Alchemical Manuscript — all state transitions are ritualistic
 */
import { IMAGERY_SEA_DATA_URL } from './imagerySeaDataUrl';

export type GamePhase =
  | 'title'
  | 'prologue'
  | 'prologue-masks-show'
  | 'prologue-questions'
  | 'prologue-quest'
  | 'prologue-choice'
  | 'chapter1-intro'
  | 'chapter1-shadow-naming-1'
  | 'chapter1-shadow-naming-2'
  | 'chapter1-shadow-naming-3'
  | 'chapter1-shadow-questions'
  | 'chapter1-emotion-naming'
  | 'chapter1-emotion-questions'
  | 'chapter1-integration'
  | 'chapter1-choice'
  | 'chapter2-intro'
  | 'chapter2-listening'
  | 'chapter2-listening-q1'
  | 'chapter2-listening-q2'
  | 'chapter2-listening-q3'
  | 'chapter2-echo-poem'
  | 'chapter2-understanding-q1'
  | 'chapter2-understanding-q2'
  | 'chapter2-understanding-q3'
  | 'chapter2-imprint'
  | 'chapter2-questions-1'
  | 'chapter2-task-1'
  | 'chapter2-questions-2'
  | 'chapter2-quest'
  | 'chapter2-choice'
  | 'chapter3-intro'
  | 'chapter3-imagery-sea'
  | 'chapter3-resonance-q'
  | 'chapter3-opposite-q'
  | 'chapter3-transcendence-q'
  | 'chapter3-symbol-triangle'
  | 'chapter3-root-q'
  | 'chapter3-challenge-q'
  | 'chapter3-integration-q'
  | 'chapter3-imagery-map'
  | 'chapter3-choice'
  | 'alchemy-altar'
  | 'chapter4-individuation'
  | 'epilogue';

export interface GameState {
  phase: GamePhase;
  inventory: string[];
  titles: string[];
  shadowName: string;
  shadowNames: string[]; // 三个阴影名称
  emotionName: string; // 对阴影的情绪反应
  loopCount: number;
  textOpacity: number;
  knowledge: string[];
  balanceScore: number;
  mandalaColors: string[];
  knowledgeCards: string[]; // 已解锁的知识卡片ID
  questionAnswers: Record<string, string>; // 问题ID -> 答案选项ID
  taskCompletions: Record<string, boolean>; // 任务ID -> 是否完成
  unlockedChapters?: GamePhase[]; // 已解锁可跳转的章节
  chapterResetCounter?: Record<string, number>; // 章节重置计数，用于强制重新挂载
}

export const initialGameState: GameState = {
  phase: 'title',
  inventory: [],
  titles: ['乖孩子', '好学生', '好青年', '优秀员工', '老好人', '优质伴侣', '好父母', '强者', '开心果', '完美主义'],
  shadowName: '',
  shadowNames: [], // 三个阴影名称
  emotionName: '',
  loopCount: 0,
  textOpacity: 1,
  knowledge: [],
  balanceScore: 0,
  mandalaColors: [],
  knowledgeCards: [],
  questionAnswers: {},
  taskCompletions: {},
};

// Scene background images
export const SCENE_IMAGES = {
  desert: '/bg-desert.webp',
  cave: '/bg-cave.webp',
  forest: '/bg-forest.webp',
  alchemy: '/bg-alchemy.webp',
  starfield: '/bg-starfield.webp',
  imagerySea: IMAGERY_SEA_DATA_URL,
};

// Shadow name options for Chapter 1 quest (扩展至18个)
export const SHADOW_WORDS = [
  // 原有6个
  { word: '暴怒', fragments: ['暴', '怒'] },
  { word: '嫉妒', fragments: ['嫉', '妒'] },
  { word: '怯懦', fragments: ['怯', '懦'] },
  { word: '贪婪', fragments: ['贪', '婪'] },
  { word: '傲慢', fragments: ['傲', '慢'] },
  { word: '虚伪', fragments: ['虚', '伪'] },
  // 新增12个
  { word: '愤怒', fragments: ['愤', '怒'] },
  { word: '恐惧', fragments: ['恐', '惧'] },
  { word: '脆弱', fragments: ['脆', '弱'] },
  { word: '羞耻', fragments: ['羞', '耻'] },
  { word: '怨恨', fragments: ['怨', '恨'] },
  { word: '绝望', fragments: ['绝', '望'] },
  { word: '自卑', fragments: ['自', '卑'] },
  { word: '焦虑', fragments: ['焦', '虑'] },
  { word: '冷漠', fragments: ['冷', '漠'] },
  { word: '偏执', fragments: ['偏', '执'] },
  { word: '逃避', fragments: ['逃', '避'] },
  { word: '依赖', fragments: ['依', '赖'] },
];

// Light orb data for Chapter 2
export const LIGHT_ORBS = [
  { id: 1, name: '逻辑之声', color: '#4A90D9', frequency: 2.0, isCorrect: false },
  { id: 2, name: '愤怒之声', color: '#D94A4A', frequency: 3.5, isCorrect: false },
  { id: 3, name: '直觉之声', color: '#D4AF37', frequency: 0.8, isCorrect: true },
  { id: 4, name: '恐惧之声', color: '#6B4A8C', frequency: 2.8, isCorrect: false },
  { id: 5, name: '欲望之声', color: '#D97A4A', frequency: 1.5, isCorrect: false },
];
