/**
 * Character Pool for Word Spelling
 * 拼字任务的字符池
 */

// 阴影词汇分组（3组，每组6个）
export const SHADOW_GROUPS = {
  group1: ['暴怒', '嫉妒', '怯懦', '贪婪', '傲慢', '虚伪'],
  group2: ['愤怒', '恐惧', '脆弱', '羞耻', '怨恨', '绝望'],
  group3: ['自卑', '焦虑', '冷漠', '偏执', '逃避', '依赖'],
};

// 每组对应的字符池（12个字符）
export const SHADOW_CHARACTER_GROUPS = {
  group1: ['暴', '怒', '嫉', '妒', '怯', '懦', '贪', '婪', '傲', '慢', '虚', '伪'],
  group2: ['愤', '怒', '恐', '惧', '脆', '弱', '羞', '耻', '怨', '恨', '绝', '望'],
  group3: ['自', '卑', '焦', '虑', '冷', '漠', '偏', '执', '逃', '避', '依', '赖'],
};

// 情绪相关字符池（12个字符）
export const EMOTION_CHARACTER_POOL = [
  '恐', '惧', '愤', '怒', '羞', '耻', '厌', '恶', '悲', '伤', '焦', '虑',
];

// 检查拼出的词是否是有效的阴影词汇（根据组别）
export function isValidShadowWord(chars: string[], groupIndex: number): { valid: boolean; word?: string } {
  const word = chars.join('');
  const groupKey = `group${groupIndex + 1}` as keyof typeof SHADOW_GROUPS;
  const validWords = SHADOW_GROUPS[groupKey] || [];
  
  if (validWords.includes(word)) {
    return { valid: true, word };
  }
  return { valid: false };
}

// 获取指定组的字符池
export function getShadowCharacterGroup(groupIndex: number): string[] {
  const groupKey = `group${groupIndex + 1}` as keyof typeof SHADOW_CHARACTER_GROUPS;
  return SHADOW_CHARACTER_GROUPS[groupKey] || [];
}

// 检查拼出的词是否是有效的情绪词汇
export function isValidEmotionWord(chars: string[]): { valid: boolean; word?: string } {
  const word = chars.join('');
  const emotionWords = ['恐惧', '愤怒', '羞耻', '厌恶', '悲伤', '焦虑'];
  
  if (emotionWords.includes(word)) {
    return { valid: true, word };
  }
  return { valid: false };
}
