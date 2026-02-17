/**
 * Audio System for Sound Effects
 * 声音系统 - 用于播放音效
 */

// 使用Web Audio API生成音调
export class AudioSystem {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;
  private melodyTimeouts: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    // 延迟初始化，避免浏览器自动播放策略问题
  }

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    this.isInitialized = true;
  }

  // 播放音调（频率Hz，持续时间ms）
  playTone(frequency: number, duration: number = 200, type: OscillatorType = 'sine'): void {
    this.playToneWithVolume(frequency, duration, type, 0.3);
  }

  // 播放音调（带音量控制）
  playToneWithVolume(frequency: number, duration: number = 200, type: OscillatorType = 'sine', volume: number = 0.3): void {
    if (!this.isInitialized) {
      this.initAudioContext();
    }
    
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    // 音量包络（淡入淡出）
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  // 音符到频率的映射（C大调）：低八度 1̣-7̣、中八度 1-7、高八度 1̇-7̇，共 21 个音符
  private static readonly NOTE_FREQUENCIES: Record<string, number> = {
    '1̣': 130.81, '2̣': 146.83, '3̣': 164.81, '4̣': 174.61, '5̣': 196.00, '6̣': 220.00, '7̣': 246.94,
    '1': 261.63, '2': 293.66, '3': 329.63, '4': 349.23, '5': 392.00, '6': 440.00, '7': 493.88,
    '1̇': 523.25, '2̇': 587.33, '3̇': 659.25, '4̇': 698.46, '5̇': 783.99, '6̇': 880.00, '7̇': 987.77,
    '1.': 523.25, '2.': 587.33, '3.': 659.25, '4.': 698.46, '5.': 783.99, '6.': 880.00, '7.': 987.77,
  };

  // 播放音符（支持 21 个音符：低八度 1̣-7̣、中 1-7、高八度 1̇-7̇）
  playNote(note: string, duration: number = 200, seedId?: string): void {
    const normalized = note.replace('.', '̇');
    const targetFrequency = AudioSystem.NOTE_FREQUENCIES[normalized] ?? AudioSystem.NOTE_FREQUENCIES['1'];
    this.playTone(targetFrequency, duration, 'sine');
  }

  /** 停止当前旋律播放（用于切换章节等） */
  stopMelody(): void {
    this.melodyTimeouts.forEach((id) => clearTimeout(id));
    this.melodyTimeouts = [];
  }

  // 播放旋律（音符数组）
  playMelody(notes: string[], noteDuration: number = 200, gapDuration: number = 50, seedId?: string): void {
    if (!this.isInitialized) {
      this.initAudioContext();
    }
    this.stopMelody();
    const step = noteDuration + gapDuration;
    notes.forEach((note, index) => {
      const id = setTimeout(() => {
        this.playNote(note, noteDuration, seedId);
      }, index * step);
      this.melodyTimeouts.push(id);
    });
  }

  // 播放内心声音的音效（根据声音ID）
  playInnerSound(soundId: string, duration: number = 1000): void {
    if (!this.isInitialized) {
      this.initAudioContext();
    }

    // 不同声音的音效映射
    const soundFrequencies: Record<string, { base: number; type: OscillatorType; harmonics?: number[]; volume?: number; tremolo?: boolean }> = {
      'hope': { base: 440, type: 'sine', volume: 0.3 }, // 希望 - 纯净的音调
      'courage': { base: 150, type: 'sine', harmonics: [1, 1.5, 2], volume: 0.5 }, // 勇气 - 坚韧厚重（降低频率，使用和声）
      'peace': { base: 330, type: 'sine', volume: 0.3 }, // 宁静 - 平缓
      'doubt': { base: 420, type: 'sine', volume: 0.2, tremolo: true }, // 怀疑 - 稍高频率，轻微颤音表达不确定感
      'fear': { base: 180, type: 'sine', harmonics: [1, 1.13], volume: 0.35 }, // 恐惧 - 阴森：中低持续音 + 不协和泛音，空洞不安（提高基频与音量以便听清）
      'anger': { base: 120, type: 'sawtooth', harmonics: [1, 1.2, 1.5], volume: 0.15 }, // 愤怒 - 低沉、激烈、有冲击力
    };

    const sound = soundFrequencies[soundId] || soundFrequencies['hope'];
    const volume = sound.volume || 0.3;
    
    // 播放主音调（带音量控制和颤音效果）
    if (sound.tremolo) {
      // 颤音效果：快速变化音量
      const tremoloSpeed = 10; // 颤音速度（Hz）
      const tremoloDepth = 0.3; // 颤音深度
      const stepDuration = 1000 / tremoloSpeed; // 每个步骤的时长（ms）
      const steps = Math.ceil(duration / stepDuration); // 向上取整确保覆盖整个 duration
      for (let i = 0; i < steps; i++) {
        const time = i * stepDuration;
        const remainingDuration = Math.min(stepDuration, duration - time); // 最后一个步骤可能较短
        if (remainingDuration > 0) {
          const tremoloVolume = volume * (1 + tremoloDepth * Math.sin(2 * Math.PI * tremoloSpeed * time / 1000));
          setTimeout(() => {
            this.playToneWithVolume(sound.base, remainingDuration, sound.type, tremoloVolume);
          }, time);
        }
      }
    } else {
      this.playToneWithVolume(sound.base, duration, sound.type, volume);
    }
    
    // 如果有和声，播放和声（与主音调同时播放，确保总时长不超过 duration）
    if (sound.harmonics) {
      sound.harmonics.forEach((harmonic, index) => {
        // 和声与主音调同时开始播放，时长与主音调一致
        this.playToneWithVolume(sound.base * harmonic, duration, sound.type, volume * 0.6);
      });
    }
  }

  // 播放声音种子的音效（使用纯净sine波，播放一个代表性的频率）
  playSoundSeed(seedId: string, duration: number = 800): void {
    if (!this.isInitialized) {
      this.initAudioContext();
    }

    // 每个音色种子使用一个代表性的频率（纯净sine波）
    const seedFrequencies: Record<string, number> = {
      'wind-chime': 523, // C5
      'stone': 220,      // A3
      'wood': 196,       // G3
      'water': 330,      // E4
      'crystal': 880,    // A5
    };

    const frequency = seedFrequencies[seedId] || seedFrequencies['wind-chime'];
    
    // 使用纯净sine波播放
    this.playTone(frequency, duration, 'sine');
  }
}

// 单例实例
let audioSystemInstance: AudioSystem | null = null;

export function getAudioSystem(): AudioSystem {
  if (!audioSystemInstance) {
    audioSystemInstance = new AudioSystem();
  }
  return audioSystemInstance;
}
