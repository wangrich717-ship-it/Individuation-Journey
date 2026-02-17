/**
 * Echo Poem Task Component
 * 核心任务：回响之诗 - 声音创作工具
 */
import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAudioSystem } from '@/lib/audioSystem';
import { playSfx } from '@/lib/bgmSfx';
import { X } from 'lucide-react';

// 低八度 1̣-7̣、中八度 1-7、高八度 1̇-7̇，共 21 个音符
const LOW_OCTAVE = ['1̣', '2̣', '3̣', '4̣', '5̣', '6̣', '7̣'];
const MID_OCTAVE = ['1', '2', '3', '4', '5', '6', '7'];
const HIGH_OCTAVE = ['1̇', '2̇', '3̇', '4̇', '5̇', '6̇', '7̇'];
const NOTES = [...LOW_OCTAVE, ...MID_OCTAVE, ...HIGH_OCTAVE];

interface EchoPoemTaskProps {
  onComplete: (melody: string[], seedId: string, responseMelody: string[]) => void;
}

export default function EchoPoemTask({ onComplete }: EchoPoemTaskProps) {
  const [melody, setMelody] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [responseMelody, setResponseMelody] = useState<string[]>([]);
  const [playPhase, setPlayPhase] = useState<'user' | 'response' | null>(null); // 播放阶段提示
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const audioSystem = getAudioSystem();

  // 切换章节时停止旋律播放
  useEffect(() => {
    return () => {
      audioSystem.stopMelody();
    };
  }, [audioSystem]);

  const handleNoteClick = useCallback((note: string) => {
    if (melody.length < 30) {
      const newMelody = [...melody, note];
      setMelody(newMelody);
      // 播放点击的音符（使用纯净sine波）
      audioSystem.playNote(note, 200);
    }
  }, [melody]);

  const handleNoteRemove = (index: number) => {
    const newMelody = melody.filter((_, i) => i !== index);
    setMelody(newMelody);
  };

  // 拖拽处理
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newMelody = [...melody];
    const [draggedItem] = newMelody.splice(draggedIndex, 1);
    newMelody.splice(dropIndex, 0, draggedItem);
    setMelody(newMelody);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handlePlay = () => {
    if (melody.length === 0) return;
    setIsPlaying(true);
    setPlayPhase('user');
    
    // 播放用户创作的旋律（使用纯净sine波）
    audioSystem.playMelody(melody, 200, 50);
    setTimeout(() => {
      // 生成回应旋律（基于用户旋律生成相似频率的）
      const response = generateResponseMelody(melody);
      setResponseMelody(response);
      
      // 显示切换提示
      setPlayPhase('response');
      
      // 播放回应旋律（使用纯净sine波）
      setTimeout(() => {
        audioSystem.playMelody(response, 200, 50);
        setTimeout(() => {
          setIsPlaying(false);
          setPlayPhase(null);
          setShowResponse(true);
        }, response.length * 250 + 500);
      }, 1000); // 给用户1秒时间看到切换提示
    }, melody.length * 250 + 500);
  };

  const generateResponseMelody = (userMelody: string[]): string[] => {
    const noteToIndex = (n: string): number => {
      const idx = NOTES.indexOf(n);
      return idx >= 0 ? idx : 10;
    };
    const indexToNote = (idx: number): string => NOTES[Math.max(0, Math.min(idx, NOTES.length - 1))];
    const response: string[] = [];
    for (let i = 0; i < userMelody.length; i++) {
      const noteIndex = noteToIndex(userMelody[i]);
      const variation = Math.floor(Math.random() * 3) - 1;
      response.push(indexToNote(noteIndex + variation));
    }
    return response;
  };

  const handleFinish = () => {
    if (melody.length > 0) {
      playSfx('sfx-choice');
      onComplete(melody, '', responseMelody);
    }
  };

  const handleRecreate = () => {
    // 重置所有状态，重新开始创作
    setMelody([]);
    setResponseMelody([]);
    setShowResponse(false);
    setIsPlaying(false);
    setPlayPhase(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
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
        className="text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4"
        style={{ fontFamily: 'Cinzel, serif', color: '#8BA4B8' }}
      >
        核心任务：回响之诗
      </motion.h3>
      {/* 引导文字 */}
      {melody.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm sm:text-base md:text-lg italic mb-6 sm:mb-8 leading-relaxed px-1"
          style={{ fontFamily: 'Noto Serif SC, serif', color: '#d4c5a0' }}
        >
          "现在，让我们创造一点别的东西。请用纯净的音调组成一个简短的'回响'，作为你对我的初次回应。"
        </motion.p>
      )}

      {/* 创作回响 — 小屏音调按钮缩小、旋律区可换行 */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <p className="text-xs sm:text-sm mb-3 sm:mb-4 px-1" style={{ color: '#8BA4B8', fontFamily: 'Noto Serif SC, serif' }}>
            创作"回响"：点击音调组成旋律（已选择 {melody.length}/30 个音符）
          </p>
          
          <div className="flex justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap min-w-0">
            {NOTES.map((note, index) => (
              <motion.button
                key={`${note}-${index}`}
                onClick={() => handleNoteClick(note)}
                disabled={melody.length >= 30}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border text-sm sm:text-base md:text-lg transition-all disabled:opacity-50 relative flex-shrink-0"
                style={{
                  background: 'rgba(139, 164, 184, 0.1)',
                  borderColor: 'rgba(139, 164, 184, 0.5)',
                  color: '#8BA4B8',
                  fontFamily: 'Noto Serif SC, serif',
                }}
                whileHover={melody.length < 30 ? { scale: 1.1 } : {}}
                whileTap={melody.length < 30 ? { scale: 0.9 } : {}}
                onMouseEnter={() => {
                  if (melody.length < 30) {
                    // 使用纯净sine波播放预览
                    audioSystem.playNote(note, 150);
                  }
                }}
              >
                {note}
              </motion.button>
            ))}
          </div>

          {/* 显示已选择的旋律 — 小屏可换行、不溢出 */}
          {melody.length > 0 && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg min-w-0" style={{ background: 'rgba(139, 164, 184, 0.05)' }}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="text-[10px] sm:text-xs min-w-0" style={{ color: '#8BA4B8' }}>你的旋律（点击删除，拖拽排序）：</div>
                {!isPlaying && (
                  <motion.button
                    onClick={handleRecreate}
                    className="px-2.5 sm:px-3 py-1 rounded text-xs transition-all hover:scale-105 flex-shrink-0"
                    style={{
                      background: 'rgba(139, 164, 184, 0.2)',
                      border: '1px solid rgba(139, 164, 184, 0.3)',
                      color: '#8BA4B8',
                      fontFamily: 'Noto Serif SC, serif',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    清空重来
                  </motion.button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 justify-center min-w-0">
                {melody.map((note, index) => (
                  <motion.div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`relative text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded group transition-all cursor-move flex-shrink-0 ${
                      draggedIndex === index ? 'opacity-50' : ''
                    } ${dragOverIndex === index ? 'scale-110' : ''}`}
                    style={{
                      background: dragOverIndex === index 
                        ? 'rgba(139, 164, 184, 0.4)' 
                        : 'rgba(139, 164, 184, 0.2)',
                      color: '#8BA4B8',
                      fontFamily: 'monospace',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => {
                      // 使用纯净sine波播放预览
                      audioSystem.playNote(note, 150);
                    }}
                  >
                    {note}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNoteRemove(index);
                      }}
                      className="absolute -top-1 -right-1 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: '#8BA4B8' }}
                    >
                      <X className="w-full h-full" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* 播放阶段提示 */}
          {playPhase && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg"
              style={{
                background: 'rgba(139, 164, 184, 0.2)',
                border: '1px solid rgba(139, 164, 184, 0.5)',
              }}
            >
              <p className="text-xs sm:text-sm" style={{ color: '#8BA4B8', fontFamily: 'Noto Serif SC, serif' }}>
                {playPhase === 'user' ? '正在播放你的旋律...' : '正在播放回应旋律...'}
              </p>
            </motion.div>
          )}

          {melody.length >= 30 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handlePlay}
              disabled={isPlaying}
              className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 rounded-lg border transition-all disabled:opacity-50 text-sm sm:text-base"
              style={{
                background: 'rgba(139, 164, 184, 0.1)',
                borderColor: 'rgba(139, 164, 184, 0.5)',
                color: '#8BA4B8',
                fontFamily: 'Noto Serif SC, serif',
              }}
            >
              {isPlaying ? '播放中...' : '完成并聆听'}
            </motion.button>
          )}
        </motion.div>

      {/* 对话回应 — 小屏内边距与文字、按钮适配 */}
      {showResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg"
          style={{ background: 'rgba(139, 164, 184, 0.1)', border: '1px solid rgba(139, 164, 184, 0.3)' }}
        >
          <p className="text-xs sm:text-sm mb-3 sm:mb-4 italic px-1 break-words" style={{ color: '#8BA4B8', fontFamily: 'Noto Serif SC, serif' }}>
            "这就是对话。不是你问我答，而是两种频率的相遇，产生了第三种东西——我们之间的'回响空间'。"
          </p>
          <p className="text-[10px] sm:text-xs mb-4 leading-relaxed px-1 break-words" style={{ color: '#d4c5a0', fontFamily: 'Noto Serif SC, serif' }}>
            "荣格与内在形象'菲勒蒙'的对话，始于倾听，成于回应。这种回应并非逻辑语言，而是象征性的、创造性的'接话'。你用声音序列创作回响，正是这种创造性对话的体现。在无意识领域，共鸣先于理解。"
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            <motion.button
              onClick={handleRecreate}
              className="px-4 sm:px-6 py-2 rounded-lg border transition-all hover:scale-105 text-sm"
              style={{
                background: 'rgba(139, 164, 184, 0.2)',
                borderColor: 'rgba(139, 164, 184, 0.5)',
                color: '#8BA4B8',
                fontFamily: 'Noto Serif SC, serif',
              }}
            >
              重新创作
            </motion.button>
            <motion.button
              onClick={handleFinish}
              className="px-4 sm:px-6 py-2 rounded-lg border transition-all hover:scale-105 text-sm"
              style={{
                background: 'rgba(139, 164, 184, 0.2)',
                borderColor: 'rgba(139, 164, 184, 0.5)',
                color: '#8BA4B8',
                fontFamily: 'Noto Serif SC, serif',
              }}
            >
              继续
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
