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
  desert: 'https://private-us-east-1.manuscdn.com/sessionFile/zGusMFyLtxIGRLqZFOq9Ga/sandbox/kHCkvFmbPS1fobJ2OpFxRh-img-1_1770805534000_na1fn_ZGVzZXJ0LXByb2xvZ3Vl.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvekd1c01GeUx0eElHUkxxWkZPcTlHYS9zYW5kYm94L2tIQ2t2Rm1iUFMxZm9iSjJPcEZ4UmgtaW1nLTFfMTc3MDgwNTUzNDAwMF9uYTFmbl9aR1Z6WlhKMExYQnliMnh2WjNWbC5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=rFT-OPqeTg6aa4Zx9AP-6-wrdNR1y51~Oo-PxqhoHTmXgmRPsoUtvFfOHwxZg31dgqqA3Z2iDlb2zwT0NxS6tl3IW8jAOFgQG2TxL~Sqaa39W-AQt1P9ALNu72Cgv34d2-hlWQT3e7ouXOoRXHRWaCkKdyeD5uDVkGuQjNDlgge1JXgQXapd7pvuX9pVmbCBZEU1nIYU73KoRYNWHvVJ9HpZH809UYCsprjC1FMnqX2GpHNf3aX27k6uMVEMihv38glsKtmd25vyOe4sy7tnwVB90EIz~vi6VFEAy8hgpRH6bQdWW3PK4EmvJzqqgTYe5CVXZ3KEZbLUA18KoSoN6g__',
  cave: 'https://private-us-east-1.manuscdn.com/sessionFile/zGusMFyLtxIGRLqZFOq9Ga/sandbox/kHCkvFmbPS1fobJ2OpFxRh-img-2_1770805533000_na1fn_c2hhZG93LWNhdmU.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvekd1c01GeUx0eElHUkxxWkZPcTlHYS9zYW5kYm94L2tIQ2t2Rm1iUFMxZm9iSjJPcEZ4UmgtaW1nLTJfMTc3MDgwNTUzMzAwMF9uYTFmbl9jMmhoWkc5M0xXTmhkbVUuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=C8u8mXAw2poNgfAhMhvUuJa6L6bNm3pmFjUblAVyx8FEk5XccvR3yfzBpQing~Nc-y6M7oUz4KnXOjMDDBfq7L2vucKutj0TG9Fhhp~ftdTSWn6wmZujoGJBkwJf~IHhs2pyaaFTl7PVFFwFuk0mW~aGYdto06mJYh0PULYL9KGrz2yo~nHwv9vTdHQvs7XCFm~rhkbgNcjWaHDqdmbC4r8pqf0FjjlPsA219ziiZGnE9lse1GJAZniYegh6EkRWnzB7kN7c8dDDY70Ac~VImOWRIOt~30B2qMYCHGVLDLWX-630PlxcHBGvzuQ5XtuUH2BUJmCqwSb94XHR8Bjefw__',
  forest: 'https://private-us-east-1.manuscdn.com/sessionFile/zGusMFyLtxIGRLqZFOq9Ga/sandbox/kHCkvFmbPS1fobJ2OpFxRh-img-3_1770805545000_na1fn_bXlzdGljLWZvcmVzdA.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvekd1c01GeUx0eElHUkxxWkZPcTlHYS9zYW5kYm94L2tIQ2t2Rm1iUFMxZm9iSjJPcEZ4UmgtaW1nLTNfMTc3MDgwNTU0NTAwMF9uYTFmbl9iWGx6ZEdsakxXWnZjbVZ6ZEEuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=b1N0-Z2UM18Mkb4hrupMtW08LeSoX8~F5ztLWxI1VvIj55QWwbL-2Dv2sA8cBofIy3NkMMTv5fnN5gAp6RYfmgTNmN3x2E-0Pc-TsjE6UDBf4vDv3WBte0opH5QVyXOux4lH5r6Ni4UiMmnmdhSpby1JCVsRBoO2g4PYxZnCUu1RXJaRQTUZfx9CNnMmv904SE5X0Qyd1Qk0YDpJIXnP6JvXC441scSM2iR6iv-qiji3QWme7P-FeEsK5R6b1bjFMFmFtRxg6NT8LLn05guyA-xoP9ZECuXvvpT9-FkG36qTT4Bt20kN7nZl51j5~PB0cGr5fyaixzjPV3rV5yFZng__',
  alchemy: 'https://private-us-east-1.manuscdn.com/sessionFile/zGusMFyLtxIGRLqZFOq9Ga/sandbox/kHCkvFmbPS1fobJ2OpFxRh-img-4_1770805546000_na1fn_YWxjaGVteS1sYWI.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvekd1c01GeUx0eElHUkxxWkZPcTlHYS9zYW5kYm94L2tIQ2t2Rm1iUFMxZm9iSjJPcEZ4UmgtaW1nLTRfMTc3MDgwNTU0NjAwMF9uYTFmbl9ZV3hqYUdWdGVTMXNZV0kuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ILjuu~UwNOAaFCBAACZgMs7lShIhvE-hjZsYGJOOzFsMYUnaCJuBwa4KoXcr2PC4AoXQZS3lI9AqMqk6qk8LYqj6-6EhWBi3lmRwRe~HOZ0ymcvRlqoY96AfDsZG0KgfhhSZh8FwP284asx84sVylj9Sd2dlXHwn~fajBRZZPQptRe742eW1ZxQXdNEis2PwInRX7LByx85FfaLAa3JlDVFqpFfhe5ImjZ9dkL-moAKLTIm5okGEtyczHRiOpER~zJwV0qi4TM7QFy5zqcylLOwShCRvHJCfUWXb32Fd6o~GyNFwgeDIWl45WMdGE3ebqTfp~FJmaKINJn1yl9bZbg__',
  starfield: 'https://private-us-east-1.manuscdn.com/sessionFile/zGusMFyLtxIGRLqZFOq9Ga/sandbox/kHCkvFmbPS1fobJ2OpFxRh-img-5_1770805529000_na1fn_c3RhcmZpZWxkLXNlbGY.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvekd1c01GeUx0eElHUkxxWkZPcTlHYS9zYW5kYm94L2tIQ2t2Rm1iUFMxZm9iSjJPcEZ4UmgtaW1nLTVfMTc3MDgwNTUyOTAwMF9uYTFmbl9jM1JoY21acFpXeGtMWE5sYkdZLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=gOTPSxvcOQfhv2kTiDn6gXRwFPCuJGfsd62B6xTGW~SLINjw8h-eX8WiIK~GXpEwZywULOfwEirypWcCh18q0iDJcDPQRGFCbEvFphGv4ezzEJpOgHf9nPFGJh2FqOCyJgbreOLNH-iCCXzuFfsQP9mVAQjlJ~tgfxkDFKUffR8MOe~WBY4nGDQFBBH~NNkuIiLLdQJZPO7caNaCHND9oMmw7NO3mi-v8Si8IGypSe4UpwTOUIKeQGB1I8O2h0xwjGZWDYtgIgUfRo~MY6diMggQjk06f1oYI-YlPAhJ~nEdkAiqde8J3rEOM~PmtC~UsHKfcwlOYpH5akXUjtABcQ__',
  // 第一章 意象之海：与其它背景图同样以 URL 字符串传入 SceneBackground（data URL 由 意象之海/ezgif.com-jpg-to-webp-converter.webp 生成）
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
