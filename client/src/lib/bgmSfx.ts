/**
 * BGM 与 SFX 管理
 * 音效文件放在 public/audio/ 下，按以下命名即可被加载：
 * BGM: bgm-title, bgm-prologue, bgm-chapter1, bgm-chapter2, bgm-chapter3, bgm-alchemy, bgm-jitan, bgm-epilogue
 * SFX: sfx-typing, sfx-choice, sfx-drag, sfx-item, sfx-knowledge
 */
import type { GamePhase } from './gameStore';

const AUDIO_BASE = '/audio';

const BGM_BY_PHASE: Record<string, string> = {
  title: 'bgm-title',
  prologue: 'bgm-prologue',
  'prologue-masks-show': 'bgm-prologue',
  'prologue-questions': 'bgm-prologue',
  'prologue-quest': 'bgm-prologue',
  'prologue-choice': 'bgm-prologue',
  'chapter1-intro': 'bgm-chapter1',
  'chapter1-shadow-naming-1': 'bgm-chapter1',
  'chapter1-shadow-naming-2': 'bgm-chapter1',
  'chapter1-shadow-naming-3': 'bgm-chapter1',
  'chapter1-shadow-questions': 'bgm-chapter1',
  'chapter1-emotion-naming': 'bgm-chapter1',
  'chapter1-emotion-questions': 'bgm-chapter1',
  'chapter1-integration': 'bgm-chapter1',
  'chapter1-choice': 'bgm-chapter1',
  'chapter2-intro': 'bgm-chapter2',
  'chapter2-listening': 'bgm-chapter2',
  'chapter2-listening-q1': 'bgm-chapter2',
  'chapter2-listening-q2': 'bgm-chapter2',
  'chapter2-listening-q3': 'bgm-chapter2',
  'chapter2-echo-poem': 'bgm-chapter2',
  'chapter2-understanding-q1': 'bgm-chapter2',
  'chapter2-understanding-q2': 'bgm-chapter2',
  'chapter2-understanding-q3': 'bgm-chapter2',
  'chapter2-imprint': 'bgm-chapter2',
  'chapter2-questions-1': 'bgm-chapter2',
  'chapter2-task-1': 'bgm-chapter2',
  'chapter2-questions-2': 'bgm-chapter2',
  'chapter2-quest': 'bgm-chapter2',
  'chapter2-choice': 'bgm-chapter2',
  'chapter3-intro': 'bgm-chapter3',
  'chapter3-imagery-sea': 'bgm-chapter3',
  'chapter3-resonance-q': 'bgm-chapter3',
  'chapter3-opposite-q': 'bgm-chapter3',
  'chapter3-transcendence-q': 'bgm-chapter3',
  'chapter3-symbol-triangle': 'bgm-chapter3',
  'chapter3-root-q': 'bgm-chapter3',
  'chapter3-challenge-q': 'bgm-chapter3',
  'chapter3-integration-q': 'bgm-chapter3',
  'chapter3-imagery-map': 'bgm-chapter3',
  'chapter3-choice': 'bgm-chapter3',
  'alchemy-altar': 'bgm-jitan',     // 第四章祭坛页（放置+选曼陀罗）；涂色时由场景内切换为 bgm-alchemy
  'chapter4-individuation': 'bgm-jitan', // 第四章 自性化
  epilogue: 'bgm-epilogue',
};

/** 部分 BGM 使用 .wav，其余默认 .mp3 */
const BGM_EXT: Record<string, string> = {
  'bgm-jitan': '.wav',
};

/** 内在声音中「聆听」阶段：这些 phase 下暂停 BGM */
const LISTENING_PHASES: Set<string> = new Set([
  'chapter2-listening',
  'chapter2-listening-q1',
  'chapter2-listening-q2',
  'chapter2-listening-q3',
  'chapter2-echo-poem',
  'chapter2-understanding-q1',
  'chapter2-understanding-q2',
  'chapter2-understanding-q3',
]);

let bgmAudio: HTMLAudioElement | null = null;
let currentBgmKey: string | null = null;
let bgmPausedForListening = false;

function getBgmKey(phase: GamePhase): string | null {
  return BGM_BY_PHASE[phase] ?? null;
}

export function isListeningPhase(phase: GamePhase): boolean {
  return LISTENING_PHASES.has(phase);
}

export function playBgmForPhase(phase: GamePhase): void {
  const key = getBgmKey(phase);
  if (!key) {
    stopBgm();
    return;
  }
  if (currentBgmKey === key && bgmAudio && !bgmPausedForListening) {
    return;
  }
  if (isListeningPhase(phase)) {
    if (bgmAudio) {
      bgmAudio.pause();
      bgmPausedForListening = true;
    }
    return;
  }
  bgmPausedForListening = false;
  if (currentBgmKey === key && bgmAudio) {
    bgmAudio.play().catch(() => {});
    return;
  }
  stopBgm();
  playBgmForKey(key);
}

/** 直接按 BGM 键播放（供场景内切换，如祭坛进入曼陀罗涂色时切到 bgm-alchemy） */
export function playBgmForKey(key: string): void {
  if (currentBgmKey === key && bgmAudio && !bgmPausedForListening) return;
  bgmPausedForListening = false;
  if (currentBgmKey === key && bgmAudio) {
    bgmAudio.play().catch(() => {});
    return;
  }
  stopBgm();
  const ext = BGM_EXT[key] ?? '.mp3';
  const src = `${AUDIO_BASE}/${key}${ext}`;
  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = 0.6;
  audio.addEventListener('error', () => {
    console.warn('[BGM] 加载失败:', src, '(请确认文件在 public/audio/ 下)');
  });
  audio.play().catch((e) => {
    if (e?.name !== 'NotAllowedError') console.warn('[BGM] 播放失败:', e);
  });
  bgmAudio = audio;
  currentBgmKey = key;
}

export function pauseBgm(): void {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmPausedForListening = true;
  }
}

export function resumeBgm(): void {
  if (bgmAudio && bgmPausedForListening) {
    bgmPausedForListening = false;
    bgmAudio.play().catch(() => {});
  }
}

export function stopBgm(): void {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.src = '';
    bgmAudio = null;
  }
  currentBgmKey = null;
  bgmPausedForListening = false;
}

const sfxCache: Record<string, HTMLAudioElement> = {};
const SFX_KEYS = ['sfx-typing', 'sfx-choice', 'sfx-drag', 'sfx-item', 'sfx-knowledge'] as const;
export type SfxType = (typeof SFX_KEYS)[number];

function getSfxAudio(type: SfxType): HTMLAudioElement | null {
  const key = type;
  if (sfxCache[key]) return sfxCache[key];
  const src = `${AUDIO_BASE}/${key}.mp3`;
  const audio = new Audio(src);
  audio.volume = 0.5;
  audio.addEventListener('error', () => {
    console.warn('[SFX] 加载失败:', src);
  });
  sfxCache[key] = audio;
  return audio;
}

export function playSfx(type: SfxType): void {
  const audio = getSfxAudio(type);
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch((e) => {
    if (import.meta.env.DEV) console.warn('[SFX] 播放被阻止:', type, e);
  });
}
