/**
 * Shadow Cards Data
 * 阴影卡片数据 - 从复原主卡目录加载
 */

// 卡片总数
export const TOTAL_CARDS = 99;

// 获取卡片图片路径
export function getCardImagePath(cardNumber: number): string {
  return `/复原主卡/${cardNumber}.jpg`;
}

// 随机抽取指定数量的卡片（不重复）
export function drawCards(count: number): number[] {
  const allCards = Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1);
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
