/**
 * Color Picker Component
 * 颜色选择器 - 图二风格：4 组预设调色板，圆角色块 + 色号 + 渐变圆
 */
import { useState } from 'react';
import { motion } from 'framer-motion';

// 图二风格：4 组调色板，每组 5 色（马卡龙/现代协调）
const PALETTES: string[][] = [
  ['#47CACC', '#62BDD9', '#C8D8E4', '#E9CDCD', '#F1B5B8'],
  ['#F7768A', '#8668B2', '#6F5E90', '#7B88B7', '#96C5D2'],
  ['#3262D6', '#7FA2C9', '#B8B9C8', '#E3D2D4', '#8A67B6'],
  ['#BC527D', '#E89E6F', '#E7C95B', '#824AB2', '#7B6B9B'],
];

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  selectedColor?: string;
}

export default function ColorPicker({ onColorSelect, selectedColor }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewColor, setPreviewColor] = useState<string>(selectedColor || '');

  const currentColor = selectedColor || previewColor;

  const handleSwatchClick = (hex: string) => {
    setPreviewColor(hex);
  };

  const handleConfirm = () => {
    if (currentColor) {
      onColorSelect(currentColor);
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 rounded-xl border flex items-center gap-3"
        style={{
          background: 'rgba(139, 164, 184, 0.08)',
          borderColor: isOpen && currentColor ? currentColor : 'rgba(139, 164, 184, 0.3)',
        }}
      >
        <div
          className="w-12 h-12 rounded-xl border-2 shrink-0"
          style={{
            backgroundColor: currentColor || 'rgba(139, 164, 184, 0.2)',
            borderColor: currentColor ? currentColor : 'rgba(139, 164, 184, 0.4)',
          }}
        />
        <span className="text-sm flex-1 text-left" style={{ color: '#8BA4B8', fontFamily: 'Noto Serif SC, serif' }}>
          {currentColor ? '已选择颜色' : '点击选择颜色'}
        </span>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-4 rounded-xl"
          style={{
            background: 'rgba(20, 15, 10, 0.95)',
            border: '1px solid rgba(139, 164, 184, 0.25)',
          }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* 4 组调色板 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              {PALETTES.map((palette, paletteIndex) => (
                <div key={paletteIndex} className="flex flex-col gap-2">
                  {/* 五个圆角色块 */}
                  <div className="flex gap-1.5">
                    {palette.map((hex) => (
                      <motion.button
                        key={hex}
                        type="button"
                        onClick={() => handleSwatchClick(hex)}
                        className="flex-1 h-11 rounded-xl border-2 shrink-0 transition-transform"
                        style={{
                          backgroundColor: hex,
                          borderColor: currentColor === hex ? '#8BA4B8' : 'rgba(255,255,255,0.2)',
                          boxShadow: currentColor === hex ? '0 0 0 2px rgba(139,164,184,0.6)' : 'none',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 确认 */}
            <div className="flex flex-col items-center gap-3">
              <motion.button
                onClick={handleConfirm}
                disabled={!currentColor}
                className="px-5 py-2.5 rounded-xl border text-sm disabled:opacity-50"
                style={{
                  background: 'rgba(139, 164, 184, 0.2)',
                  borderColor: 'rgba(139, 164, 184, 0.5)',
                  color: '#8BA4B8',
                  fontFamily: 'Noto Serif SC, serif',
                }}
              >
                确认选择
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
