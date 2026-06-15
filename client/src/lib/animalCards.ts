/**
 * Animal Cards Data
 * 动物卡片数据 - 从动物卡目录加载
 */

// 卡片总数（100-143）
export const TOTAL_ANIMAL_CARDS = 44;
export const ANIMAL_CARD_START = 100;

// 获取卡片图片路径
export function getAnimalCardImagePath(cardNumber: number): string {
  return `/动物卡/${cardNumber}.jpg`;
}

// 随机抽取指定数量的卡片（不重复）
export function drawAnimalCards(count: number): number[] {
  const allCards = Array.from({ length: TOTAL_ANIMAL_CARDS }, (_, i) => ANIMAL_CARD_START + i);
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 转化力量选项（30个）
export const TRANSFORMATION_POWERS = [
  '坚韧',
  '耐心',
  '适应力',
  '勇气',
  '直觉',
  '洞察力',
  '守护',
  '疗愈',
  '自由',
  '智慧',
  '平衡',
  '速度',
  '合作',
  '独立',
  '重生',
  '警觉',
  '力量',
  '优雅',
  '神秘',
  '忠诚',
  '灵活',
  '耐力',
  '温柔',
  '爆发力',
  '沟通',
  '转化',
  '稳定',
  '探索',
  '防御',
  '生存',
];
