/**
 * Imprint Task Component
 * 任务：压印成纹
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSfx } from '@/lib/bgmSfx';

interface ImprintTaskProps {
  onComplete: (patternName: string) => void;
  userMelody: string[];
  responseMelody: string[];
  seedId: string;
}

export default function ImprintTask({ onComplete, userMelody, responseMelody, seedId }: ImprintTaskProps) {
  const [patternVisible, setPatternVisible] = useState(false);
  const [canImprint, setCanImprint] = useState(false);
  const [isImprinting, setIsImprinting] = useState(false);
  const [patternName, setPatternName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 显示声波可视化
    setTimeout(() => {
      setPatternVisible(true);
      setTimeout(() => {
        setCanImprint(true);
      }, 2000);
    }, 1000);
  }, []);

  useEffect(() => {
    if (patternVisible && canvasRef.current) {
      drawPattern(canvasRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patternVisible, userMelody, responseMelody, seedId]);

  // 根据音符获取频率
  const getNoteFrequency = (note: string): number => {
    const noteFrequencies: Record<string, number> = {
      '1': 261.63,
      '2': 293.66,
      '3': 329.63,
      '4': 349.23,
      '5': 392.00,
      '6': 440.00,
      '7': 493.88,
      '1̇': 523.25,
      '1.': 523.25,
    };
    return noteFrequencies[note] || 261.63;
  };

  // 根据声音种子获取颜色和特性
  const getSeedProperties = (seed: string) => {
    const properties: Record<string, { color: string; waveType: 'sine' | 'sawtooth' | 'square'; thickness: number }> = {
      'wind-chime': { color: '#C0C0C0', waveType: 'sine', thickness: 1 },
      'stone': { color: '#8B7355', waveType: 'sawtooth', thickness: 3 },
      'wood': { color: '#D4A574', waveType: 'sine', thickness: 2 },
      'water': { color: '#4A90D9', waveType: 'sine', thickness: 1.5 },
      'crystal': { color: '#B8E6B8', waveType: 'square', thickness: 1 },
    };
    return properties[seed] || { color: '#8BA4B8', waveType: 'sine' as const, thickness: 2 };
  };

  const drawPattern = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (userMelody.length === 0) {
      // 如果没有旋律，绘制默认图案
      ctx.strokeStyle = '#8BA4B8';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      for (let i = 0; i < width; i++) {
        const x = i;
        const y = height / 2 + Math.sin((i / width) * Math.PI * 4 + Date.now() / 1000) * 30;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      return;
    }

    const seedProps = getSeedProperties(seedId);
    const time = Date.now() / 1000;

    // 绘制用户旋律的声波（根据实际音符）
    ctx.strokeStyle = seedProps.color;
    ctx.lineWidth = seedProps.thickness;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();

      const notesPerPixel = userMelody.length / width;
      for (let i = 0; i < width; i++) {
        const noteIndex = Math.floor(i * notesPerPixel);
        const note = userMelody[noteIndex] || userMelody[0];
        const frequency = getNoteFrequency(note);
        
        // 根据频率和音色类型生成不同的波形
        let y = height / 2;
        const normalizedFreq = (frequency - 200) / 400; // 归一化频率到0-1
        const amplitude = 20 + normalizedFreq * 40; // 振幅根据频率变化
        const phase = (i / width) * Math.PI * 8 + time * 2;

        if (seedProps.waveType === 'sine') {
          y += Math.sin(phase * normalizedFreq) * amplitude;
        } else if (seedProps.waveType === 'sawtooth') {
          y += ((phase % (Math.PI * 2)) / (Math.PI * 2) * 2 - 1) * amplitude;
        } else if (seedProps.waveType === 'square') {
          y += (Math.sin(phase * normalizedFreq) > 0 ? 1 : -1) * amplitude;
        }

        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

    // 绘制回应旋律的声波（如果有）
    if (responseMelody.length > 0) {
      ctx.strokeStyle = '#C0C0C0';
      ctx.lineWidth = seedProps.thickness * 0.8;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();

      const responseNotesPerPixel = responseMelody.length / width;
      for (let i = 0; i < width; i++) {
        const noteIndex = Math.floor(i * responseNotesPerPixel);
        const note = responseMelody[noteIndex] || responseMelody[0];
        const frequency = getNoteFrequency(note);
        
        const normalizedFreq = (frequency - 200) / 400;
        const amplitude = 20 + normalizedFreq * 40;
        const phase = (i / width) * Math.PI * 8 + time * 2 + Math.PI / 2; // 相位偏移

        let y = height / 2;
        if (seedProps.waveType === 'sine') {
          y += Math.cos(phase * normalizedFreq) * amplitude;
        } else if (seedProps.waveType === 'sawtooth') {
          y += ((phase % (Math.PI * 2)) / (Math.PI * 2) * 2 - 1) * amplitude;
        } else if (seedProps.waveType === 'square') {
          y += (Math.cos(phase * normalizedFreq) > 0 ? 1 : -1) * amplitude;
        }

        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();
    }

    // 如果已经压印，绘制静态图案
    if (isImprinting) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      // 绘制复杂的纹章图案（简化版）
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 3;

      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // 内部图案
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (patternVisible && !isImprinting) {
      const interval = setInterval(() => {
        if (canvasRef.current) {
          drawPattern(canvasRef.current);
        }
      }, 50);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patternVisible, isImprinting, userMelody, responseMelody, seedId]);

  const handleImprint = () => {
    setIsImprinting(true);
    setTimeout(() => {
      setShowNameInput(true);
    }, 1500);
  };

  const handleNameSubmit = () => {
    const charCount = Array.from(patternName.trim()).length;
    if (charCount > 0 && charCount <= 8) {
      playSfx('sfx-choice');
      setNameConfirmed(true);
      onComplete(patternName.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl w-full max-w-full mx-auto text-center px-2 sm:px-4 pb-24 box-border"
    >
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs uppercase tracking-[0.3em] mb-2"
        style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}
      >
        任务：压印成纹
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs sm:text-sm italic mb-6 sm:mb-8 leading-relaxed px-1"
        style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
      >
        "所有的声音都会消散，但共振的形状可以留存。请将我们的'合奏'——这独一无二的频率——压入水中，让它成为你可以携带的印记。"
      </motion.p>

      {/* 声波可视化 - 缩小高度到0.8倍 */}
      <div className="relative mb-8" style={{ height: '240px' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={240}
          className="w-full h-full rounded-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(139, 164, 184, 0.3)',
          }}
        />
        {canImprint && !isImprinting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.button
              onClick={handleImprint}
              className="px-8 py-4 rounded-lg border text-sm transition-all hover:scale-105"
              style={{
                background: 'rgba(139, 164, 184, 0.2)',
                borderColor: 'rgba(139, 164, 184, 0.5)',
                color: '#8BA4B8',
                fontFamily: 'Noto Serif SC, serif',
                boxShadow: '0 0 20px rgba(139, 164, 184, 0.5)',
              }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(139, 164, 184, 0.5)',
                  '0 0 30px rgba(139, 164, 184, 0.8)',
                  '0 0 20px rgba(139, 164, 184, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              请在图案最打动你的瞬间，按下
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* 命名输入 */}
      {showNameInput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg"
          style={{ background: 'rgba(139, 164, 184, 0.1)', border: '1px solid rgba(139, 164, 184, 0.3)' }}
        >
          <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: '#8BA4B8', fontFamily: 'Noto Serif SC, serif' }}>
            为这个属于你们的纹章，取一个名字吧。
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center">
            <input
              type="text"
              value={patternName}
              onChange={(e) => {
                const newValue = e.target.value;
                const charCount = Array.from(newValue).length;
                if (charCount <= 8) {
                  setPatternName(newValue);
                } else {
                  const truncated = Array.from(newValue).slice(0, 8).join('');
                  setPatternName(truncated);
                }
              }}
              onKeyDown={(e) => {
                const charCount = Array.from(patternName).length;
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
                if (e.key === 'Enter' && patternName.trim().length > 0) {
                  handleNameSubmit();
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData('text');
                const charCount = Array.from(patternName + pastedText).length;
                if (charCount <= 8) {
                  setPatternName(patternName + pastedText);
                } else {
                  const remaining = 8 - Array.from(patternName).length;
                  if (remaining > 0) {
                    const truncated = Array.from(pastedText).slice(0, remaining).join('');
                    setPatternName(patternName + truncated);
                  }
                }
              }}
              maxLength={8}
              placeholder="输入名字（1-8个字）"
              className="px-3 sm:px-4 py-2 rounded-lg border bg-transparent text-center w-full max-w-[200px] sm:max-w-none"
              style={{
                borderColor: 'rgba(139, 164, 184, 0.5)',
                color: '#d4c5a0',
                fontFamily: 'Noto Serif SC, serif',
              }}
            />
            <motion.button
              onClick={handleNameSubmit}
              disabled={patternName.trim().length === 0}
              className="px-6 py-2 rounded-lg border transition-all disabled:opacity-50"
              style={{
                background: 'rgba(139, 164, 184, 0.2)',
                borderColor: 'rgba(139, 164, 184, 0.5)',
                color: '#8BA4B8',
                fontFamily: 'Noto Serif SC, serif',
              }}
            >
              确定
            </motion.button>
          </div>
          <p className="text-xs mt-2" style={{ color: Array.from(patternName).length >= 8 ? '#FF6B35' : '#8BA4B8' }}>
            {Array.from(patternName).length}/8 {Array.from(patternName).length >= 8 ? '(最多8个字)' : ''}
          </p>
        </motion.div>
      )}

      {/* 完成提示 - 只在确认命名后显示；小屏字号与留白 */}
      {nameConfirmed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 sm:mt-8 text-xs sm:text-sm italic px-1 break-words pb-4"
          style={{ fontFamily: 'Noto Serif SC, serif', color: '#8BA4B8' }}
        >
          "看，这就是证据。不是你，也不是我，而是'我们'的创造。当你在世界的喧嚣中迷失方向，凝视这个纹章，便能记起这个频率——记起你之内，有一个广阔、智慧且可与之对话的回响空间。"
        </motion.p>
      )}
    </motion.div>
  );
}
