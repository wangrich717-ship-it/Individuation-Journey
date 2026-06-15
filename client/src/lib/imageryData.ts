/**
 * Chapter 3 — Imagery Sea Data
 * 意象之海的数据结构
 */

export interface ImagerySymbol {
  id: string;
  name: string;
  icon: string; // 图标（emoji 或 unicode 符号）
  color: string; // 光球颜色
  description: string;
  atmosphere: string; // 氛围描述
  question: string; // 开放性问题
  opposites: string[]; // 对立/互补意象ID列表
}

// 银白色系（12 个意象统一色调，与深色星空背景协调）
const SILVER_WHITE_COLORS = [
  '#E8E8E8', '#D8D8D8', '#E2E2E2', '#DADADA', '#E0E0E0', '#D4D4D4',
  '#E6E6E6', '#D0D0D0', '#DCDCDC', '#CECECE', '#D2D2D2', '#D6D6D6',
];

// 12个核心意象，每个都有且仅有 3 个来自本列表的「对立意象」（象征意义上的对立/互补）
export const IMAGERY_SYMBOLS: ImagerySymbol[] = [
  {
    id: 'serpent',
    name: '蛇',
    icon: '🐍',
    color: SILVER_WHITE_COLORS[0],
    description: '蛇是转化与重生的象征，它蜕皮的过程象征着自我的更新。',
    atmosphere: '微光中，一条古老的蛇缓缓游过，鳞片闪烁着神秘的光芒，仿佛在诉说着永恒的循环。',
    question: '"蛇"让你联想到自己内在的哪种状态或情感？是蜕变的渴望，还是隐藏的智慧？',
    opposites: ['bird', 'sun', 'star'],
  },
  {
    id: 'tree',
    name: '树',
    icon: '🌳',
    color: SILVER_WHITE_COLORS[1],
    description: '树连接着大地与天空，是生长、智慧与沉默庇护的象征。',
    atmosphere: '一棵巨大的古树静静矗立，根须深入黑暗，枝叶伸向光明，是存在与生长的永恒见证。',
    question: '"树"让你联想到自己内在的哪种状态或情感？是扎根的稳定，还是向上的伸展？',
    opposites: ['fire', 'water', 'mountain'],
  },
  {
    id: 'sun',
    name: '太阳',
    icon: '☀️',
    color: SILVER_WHITE_COLORS[2],
    description: '太阳是意识、光明与生命力的象征，它给予万物能量与方向。',
    atmosphere: '一轮金色的太阳缓缓升起，光芒穿透黑暗，带来温暖与希望，是意识的觉醒之光。',
    question: '"太阳"让你联想到自己内在的哪种状态或情感？是觉醒的渴望，还是生命力的涌动？',
    opposites: ['moon', 'water', 'serpent'],
  },
  {
    id: 'moon',
    name: '月亮',
    icon: '🌙',
    color: SILVER_WHITE_COLORS[3],
    description: '月亮是无意识、直觉与女性力量的象征，它反射着隐藏的智慧。',
    atmosphere: '一轮银色的月亮静静悬挂，光芒柔和而神秘，照亮无意识的深处，是直觉的指引。',
    question: '"月亮"让你联想到自己内在的哪种状态或情感？是直觉的指引，还是隐藏的情感？',
    opposites: ['sun', 'fire', 'lion'],
  },
  {
    id: 'fire',
    name: '火',
    icon: '🔥',
    color: SILVER_WHITE_COLORS[4],
    description: '火是转化、激情与毁灭重生的象征，它既能创造也能毁灭。',
    atmosphere: '一团火焰在黑暗中燃烧，光芒跳跃而热烈，是转化的力量，是激情与行动的象征。',
    question: '"火"让你联想到自己内在的哪种状态或情感？是转化的渴望，还是激情的涌动？',
    opposites: ['water', 'tree', 'moon'],
  },
  {
    id: 'cross',
    name: '十字架',
    icon: '✝️',
    color: SILVER_WHITE_COLORS[5],
    description: '十字架是整合、牺牲与超越的象征，它连接着四个方向，是完整的结构。',
    atmosphere: '一个发光的十字架静静悬浮，四个方向指向无限，是整合与超越的象征。',
    question: '"十字架"让你联想到自己内在的哪种状态或情感？是整合的渴望，还是超越的追求？',
    opposites: ['serpent', 'water', 'flower'],
  },
  {
    id: 'bird',
    name: '鸟',
    icon: '🦅',
    color: SILVER_WHITE_COLORS[6],
    description: '鸟是自由、精神与超越的象征，它能够飞翔，连接着大地与天空。',
    atmosphere: '一只鸟自由飞翔，翅膀划破黑暗，是精神的自由，是超越的渴望。',
    question: '"鸟"让你联想到自己内在的哪种状态或情感？是自由的渴望，还是精神的超越？',
    opposites: ['serpent', 'mountain', 'water'],
  },
  {
    id: 'lion',
    name: '狮子',
    icon: '🦁',
    color: SILVER_WHITE_COLORS[7],
    description: '狮子是力量、勇气与王权的象征，它代表着内在的野性与力量。',
    atmosphere: '一头雄狮在微光中缓缓显现，鬃毛闪烁，是力量的象征，是勇气的体现。',
    question: '"狮子"让你联想到自己内在的哪种状态或情感？是力量的觉醒，还是勇气的召唤？',
    opposites: ['moon', 'water', 'flower'],
  },
  {
    id: 'mountain',
    name: '山',
    icon: '⛰️',
    color: SILVER_WHITE_COLORS[8],
    description: '山是稳固、高度与超越的象征，它代表着内在的坚定与目标。',
    atmosphere: '一座山峰静静矗立，轮廓在微光中若隐若现，是稳固的象征，是高度的追求。',
    question: '"山"让你联想到自己内在的哪种状态或情感？是稳固的根基，还是高度的追求？',
    opposites: ['water', 'bird', 'tree'],
  },
  {
    id: 'water',
    name: '水',
    icon: '💧',
    color: SILVER_WHITE_COLORS[9],
    description: '水是情感、流动与无意识的象征，它能够适应任何形状，是生命的源泉。',
    atmosphere: '一股水流缓缓流动，波纹在微光中闪烁，是情感的流动，是无意识的深度。',
    question: '"水"让你联想到自己内在的哪种状态或情感？是情感的流动，还是无意识的深度？',
    opposites: ['fire', 'mountain', 'sun'],
  },
  {
    id: 'flower',
    name: '花',
    icon: '🌸',
    color: SILVER_WHITE_COLORS[10],
    description: '花是美丽、成长与开放的象征，它从种子到绽放，是生命的完整循环。',
    atmosphere: '一朵花静静绽放，花瓣在微光中舒展，是美丽的象征，是成长的见证。',
    question: '"花"让你联想到自己内在的哪种状态或情感？是美丽的追求，还是成长的渴望？',
    opposites: ['lion', 'fire', 'cross'],
  },
  {
    id: 'star',
    name: '星',
    icon: '⭐',
    color: SILVER_WHITE_COLORS[11],
    description: '星是希望、指引与永恒的象征，它在黑暗中闪烁，是远方的指引。',
    atmosphere: '一颗星星在黑暗中闪烁，光芒穿透夜色，是希望的象征，是永恒的指引。',
    question: '"星"让你联想到自己内在的哪种状态或情感？是希望的指引，还是永恒的追求？',
    opposites: ['moon', 'water', 'serpent'],
  },
];

// 获取意象的对立选项（根据第一问的选择）
export function getOppositeOptions(resonanceId: string): ImagerySymbol[] {
  const resonance = IMAGERY_SYMBOLS.find(s => s.id === resonanceId);
  if (!resonance) return [];
  
  return IMAGERY_SYMBOLS.filter(s => resonance.opposites.includes(s.id));
}

// 获取意象的反馈文本
export function getResonanceFeedback(symbolId: string): string {
  const symbol = IMAGERY_SYMBOLS.find(s => s.id === symbolId);
  if (!symbol) return '';
  
  return `你选择了"${symbol.name}"。${symbol.description}你内心是否也渴望这种特质？`;
}

// 获取对立关系的反馈文本
export function getOppositeFeedback(resonanceId: string, oppositeId: string): string {
  const resonance = IMAGERY_SYMBOLS.find(s => s.id === resonanceId);
  const opposite = IMAGERY_SYMBOLS.find(s => s.id === oppositeId);
  if (!resonance || !opposite) return '';
  
  const feedbacks: Record<string, Record<string, string>> = {
    serpent: {
      bird: '"蛇"的地下循环与"鸟"的天空自由在你内心形成张力。这像是"扎根"与"飞翔"的对话。',
      sun: '"蛇"的循环与"太阳"的线性上升在你内心相互呼应。这像是"循环"与"方向"的平衡。',
      star: '"蛇"的隐秘转化与"星"的遥远指引在你内心共存。这像是"内在"与"远方"的张力。',
    },
    tree: {
      fire: '"树"的稳固生长与"火"的动态转化在你内心共存。这像是生命结构中"存在"与"变化"的永恒对话。',
      water: '"树"的向上伸展与"水"的向下流动在你内心形成张力。这像是"生长"与"接纳"的平衡。',
      mountain: '"树"的生长与"山"的稳固在你内心相互呼应。这像是"动态"与"静态"的和谐统一。',
    },
    sun: {
      moon: '"太阳"的意识之光与"月亮"的无意识之影在你内心交替。这像是"理性"与"直觉"的永恒对话。',
      water: '"太阳"的炽热与"水"的流动在你内心形成张力。这像是"行动"与"接受"之间的平衡。',
      serpent: '"太阳"的上升与"蛇"的循环在你内心相互呼应。这像是"线性"与"循环"的和谐统一。',
    },
    moon: {
      sun: '"月亮"的无意识与"太阳"的意识在你内心交替。这像是"直觉"与"理性"的对话。',
      fire: '"月亮"的柔和与"火"的炽热在你内心形成张力。这像是"阴"与"阳"的平衡。',
      lion: '"月亮"的含蓄与"狮子"的力量在你内心相互呼应。这像是"内敛"与"张扬"的张力。',
    },
    fire: {
      water: '"火"的转化与"水"的流动在你内心共存。这像是"激情"与"情感"的永恒对话。',
      tree: '"火"的动态与"树"的稳固在你内心形成张力。这像是"变化"与"存在"之间的平衡。',
      moon: '"火"的炽热与"月亮"的柔和在你内心相互呼应。这像是"阳"与"阴"的和谐统一。',
    },
    cross: {
      serpent: '"十字架"的整合与"蛇"的转化在你内心形成张力。这像是"结构"与"蜕变"的对话。',
      water: '"十字架"的稳固与"水"的流动在你内心相互呼应。这像是"形式"与"流动"的平衡。',
      flower: '"十字架"的牺牲与"花"的绽放在你内心共存。这像是"超越"与"生长"的张力。',
    },
    bird: {
      serpent: '"鸟"的天空与"蛇"的地下在你内心形成张力。这像是"精神"与"本能"的对话。',
      mountain: '"鸟"的自由与"山"的稳固在你内心相互呼应。这像是"飞翔"与"扎根"的平衡。',
      water: '"鸟"的轻盈与"水"的深沉在你内心共存。这像是"超越"与"沉浸"的张力。',
    },
    lion: {
      moon: '"狮子"的力量与"月亮"的柔和在你内心形成张力。这像是"阳刚"与"阴柔"的对话。',
      water: '"狮子"的炽烈与"水"的包容在你内心相互呼应。这像是"征服"与"接纳"的平衡。',
      flower: '"狮子"的野性与"花"的柔美在你内心共存。这像是"力量"与"脆弱"的张力。',
    },
    mountain: {
      water: '"山"的稳固与"水"的流动在你内心形成张力。这像是"坚定"与"适应"的对话。',
      bird: '"山"的静止与"鸟"的飞翔在你内心相互呼应。这像是"大地"与"天空"的平衡。',
      tree: '"山"的永恒与"树"的生长在你内心共存。这像是"不变"与"变化"的张力。',
    },
    water: {
      fire: '"水"的流动与"火"的转化在你内心共存。这像是"情感"与"激情"的永恒对话。',
      mountain: '"水"的适应与"山"的稳固在你内心形成张力。这像是"柔"与"刚"的平衡。',
      sun: '"水"的深沉与"太阳"的明朗在你内心相互呼应。这像是"无意识"与"意识"的对话。',
    },
    flower: {
      lion: '"花"的柔美与"狮子"的力量在你内心形成张力。这像是"脆弱"与"野性"的对话。',
      fire: '"花"的绽放与"火"的燃烧在你内心相互呼应。这像是"生命"与"转化"的平衡。',
      cross: '"花"的开放与"十字架"的整合在你内心共存。这像是"自然"与"超越"的张力。',
    },
    star: {
      moon: '"星"的指引与"月亮"的反射在你内心形成张力。这像是"远方"与"内在"的对话。',
      water: '"星"的恒定与"水"的流动在你内心相互呼应。这像是"希望"与"深度"的平衡。',
      serpent: '"星"的光与"蛇"的隐秘在你内心共存。这像是"显现"与"隐藏"的张力。',
    },
  };
  
  return feedbacks[resonanceId]?.[oppositeId] || `"${resonance.name}"与"${opposite.name}"在你内心形成了一种独特的张力关系。`;
}
