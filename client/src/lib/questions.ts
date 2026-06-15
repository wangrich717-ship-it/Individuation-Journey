/**
 * Questions and Knowledge Cards Data
 * 问答和知识卡片数据
 */

export interface QuestionOption {
  id: string;
  text: string;
  feedback: string;
  knowledgeCardId?: string; // 解锁的知识卡片ID
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  phase: 'prologue' | 'chapter1' | 'chapter2' | 'chapter3';
  order: number; // 问题顺序（1-3或1-6）
}

export interface KnowledgeCard {
  id: string;
  title: string;
  definition: string;
  content: string;
  jungQuote: string;
  phase: 'prologue' | 'chapter1' | 'chapter2' | 'chapter3' | 'epilogue';
}

// ============================================================================
// 序章问题（3个）
// ============================================================================

export const PROLOGUE_QUESTIONS: Question[] = [
  {
    id: 'prologue-q1',
    text: '这些头衔曾给你带来什么？',
    phase: 'prologue',
    order: 1,
    options: [
      {
        id: 'a',
        text: '安全感，让我知道我是谁',
        feedback: '安全感是面具的礼物，但也可能是牢笼',
        knowledgeCardId: 'persona',
      },
      {
        id: 'b',
        text: '他人的认可和尊重',
        feedback: '他人的认可让我们迷失在他人的期待中',
        knowledgeCardId: 'persona',
      },
      {
        id: 'c',
        text: '逃避真实自我的借口',
        feedback: '承认面具的逃避功能，是走向真实的第一步',
        knowledgeCardId: 'persona',
      },
    ],
  },
  {
    id: 'prologue-q2',
    text: '如果放下这些头衔，你害怕失去什么？',
    phase: 'prologue',
    order: 2,
    options: [
      {
        id: 'a',
        text: '他人的爱',
        feedback: '真正的爱不需要面具',
        knowledgeCardId: 'collective-unconscious',
      },
      {
        id: 'b',
        text: '存在的意义',
        feedback: '意义不在头衔中，而在真实的自我里',
        knowledgeCardId: 'collective-unconscious',
      },
      {
        id: 'c',
        text: '控制感',
        feedback: '控制感是面具的幻觉，真实需要勇气',
        knowledgeCardId: 'collective-unconscious',
      },
    ],
  },
  {
    id: 'prologue-q3',
    text: '你准备好面对面具后的自己了吗？',
    phase: 'prologue',
    order: 3,
    options: [
      {
        id: 'a',
        text: '还没有，我需要这些头衔',
        feedback: '面具会继续保护你，但也会继续限制你',
        knowledgeCardId: 'individuation',
      },
      {
        id: 'b',
        text: '也许...但我害怕',
        feedback: '恐惧是正常的，但不要让恐惧阻止你',
        knowledgeCardId: 'individuation',
      },
      {
        id: 'c',
        text: '是的，我愿意尝试',
        feedback: '勇气是自性化的第一步',
        knowledgeCardId: 'individuation',
      },
    ],
  },
];

// ============================================================================
// 第一章问题（6个）
// ============================================================================

export const CHAPTER1_QUESTIONS: Question[] = [
  // 问题1-3：阴影的认知与接受
  {
    id: 'chapter1-q1',
    text: '你记得上次真正愤怒是什么时候吗？',
    phase: 'chapter1',
    order: 1,
    options: [
      {
        id: 'a',
        text: '我不常愤怒，我控制得很好',
        feedback: '控制可能是压抑的另一种形式',
        knowledgeCardId: 'shadow',
      },
      {
        id: 'b',
        text: '我压抑了它，因为愤怒是不好的',
        feedback: '压抑的阴影会以其他方式显现',
        knowledgeCardId: 'shadow',
      },
      {
        id: 'c',
        text: '我害怕愤怒，它会毁掉一切',
        feedback: '恐惧本身也是阴影的一部分',
        knowledgeCardId: 'shadow',
      },
    ],
  },
  {
    id: 'chapter1-q2',
    text: '你愿意承认阴影的存在吗？',
    phase: 'chapter1',
    order: 2,
    options: [
      {
        id: 'a',
        text: '不，你是错的，我没有阴影',
        feedback: '否认阴影只会让它更强大',
        knowledgeCardId: 'projection',
      },
      {
        id: 'b',
        text: '也许...但我需要时间',
        feedback: '时间是必要的，但不要无限拖延',
        knowledgeCardId: 'projection',
      },
      {
        id: 'c',
        text: '是的，你是我的一部分',
        feedback: '承认是整合的第一步',
        knowledgeCardId: 'projection',
      },
    ],
  },
  {
    id: 'chapter1-q3',
    text: '如果阴影是你的一部分，你会如何对待它？',
    phase: 'chapter1',
    order: 3,
    options: [
      {
        id: 'a',
        text: '我会压制它，让它消失',
        feedback: '压制只会让阴影在暗处生长',
        knowledgeCardId: 'shadow-integration',
      },
      {
        id: 'b',
        text: '我会观察它，但不让它控制我',
        feedback: '观察是好的开始，但还不够',
        knowledgeCardId: 'shadow-integration',
      },
      {
        id: 'c',
        text: '我会拥抱它，与它对话',
        feedback: '对话是整合阴影的关键',
        knowledgeCardId: 'shadow-integration',
      },
    ],
  },
  // 问题4-6：阴影的整合与命名
  {
    id: 'chapter1-q4',
    text: '你的阴影最常出现在什么时候？',
    phase: 'chapter1',
    order: 4,
    options: [
      {
        id: 'a',
        text: '当我感到被忽视时',
        feedback: '被忽视的愤怒是阴影的常见形式',
        knowledgeCardId: 'shadow-root',
      },
      {
        id: 'b',
        text: '当我感到被威胁时',
        feedback: '威胁感会激活我们的防御机制',
        knowledgeCardId: 'shadow-root',
      },
      {
        id: 'c',
        text: '当我感到被控制时',
        feedback: '控制的反面是失控，阴影在那里',
        knowledgeCardId: 'shadow-root',
      },
    ],
  },
  {
    id: 'chapter1-q5',
    text: '如果要给你的阴影一个名字，它会是什么？',
    phase: 'chapter1',
    order: 5,
    options: [
      {
        id: 'a',
        text: '愤怒',
        feedback: '愤怒是阴影的常见面具',
        knowledgeCardId: 'shadow-naming',
      },
      {
        id: 'b',
        text: '恐惧',
        feedback: '恐惧是阴影的另一种形式',
        knowledgeCardId: 'shadow-naming',
      },
      {
        id: 'c',
        text: '脆弱',
        feedback: '脆弱是阴影的核心',
        knowledgeCardId: 'shadow-naming',
      },
    ],
  },
  {
    id: 'chapter1-q6',
    text: '命名阴影后，你希望如何与它相处？',
    phase: 'chapter1',
    order: 6,
    options: [
      {
        id: 'a',
        text: '我会继续压制它',
        feedback: '压制不是解决之道',
        knowledgeCardId: 'shadow-transformation',
      },
      {
        id: 'b',
        text: '我会观察它，但不让它影响我',
        feedback: '观察是好的，但还不够',
        knowledgeCardId: 'shadow-transformation',
      },
      {
        id: 'c',
        text: '我会与它对话，理解它，整合它',
        feedback: '对话和理解是整合的关键',
        knowledgeCardId: 'shadow-transformation',
      },
    ],
  },
];

// ============================================================================
// 第二章问题（6个）
// ============================================================================

export const CHAPTER2_QUESTIONS: Question[] = [
  // 问题1-3：理性与直觉的平衡
  {
    id: 'chapter2-q1',
    text: '你更依赖理性还是直觉？',
    phase: 'chapter2',
    order: 1,
    options: [
      {
        id: 'a',
        text: '理性，逻辑更可靠',
        feedback: '理性是工具，但不是全部',
        knowledgeCardId: 'rational-intuitive',
      },
      {
        id: 'b',
        text: '直觉，感觉更真实',
        feedback: '直觉是向导，但也需要理性',
        knowledgeCardId: 'rational-intuitive',
      },
      {
        id: 'c',
        text: '两者都需要，但不知道如何平衡',
        feedback: '平衡是自性化的关键',
        knowledgeCardId: 'rational-intuitive',
      },
    ],
  },
  {
    id: 'chapter2-q2',
    text: '你听到过内心的声音吗？',
    phase: 'chapter2',
    order: 2,
    options: [
      {
        id: 'a',
        text: '没有，我只相信逻辑',
        feedback: '内在声音需要被倾听',
        knowledgeCardId: 'inner-voice',
      },
      {
        id: 'b',
        text: '偶尔，但我不确定',
        feedback: '不确定是正常的，继续探索',
        knowledgeCardId: 'inner-voice',
      },
      {
        id: 'c',
        text: '是的，我经常听到',
        feedback: '倾听内在声音是自性化的路径',
        knowledgeCardId: 'inner-voice',
      },
    ],
  },
  {
    id: 'chapter2-q3',
    text: '你内在有异性的声音吗？',
    phase: 'chapter2',
    order: 3,
    options: [
      {
        id: 'a',
        text: '没有，我是纯粹的男性/女性',
        feedback: '每个人内在都有异性的原型',
        knowledgeCardId: 'anima-animus',
      },
      {
        id: 'b',
        text: '也许有，但我没注意',
        feedback: '注意是发现的第一步',
        knowledgeCardId: 'anima-animus',
      },
      {
        id: 'c',
        text: '是的，我能感受到',
        feedback: '承认异性的内在声音是重要的',
        knowledgeCardId: 'anima-animus',
      },
    ],
  },
  // 问题4-6：阿尼玛/阿尼姆斯的引导
  {
    id: 'chapter2-q4',
    text: '你如何区分真正的直觉和恐惧？',
    phase: 'chapter2',
    order: 4,
    options: [
      {
        id: 'a',
        text: '我无法区分，所以不相信直觉',
        feedback: '区分需要练习和觉察',
        knowledgeCardId: 'intuition-recognition',
      },
      {
        id: 'b',
        text: '直觉是平静的，恐惧是紧张的',
        feedback: '平静是直觉的特征',
        knowledgeCardId: 'intuition-recognition',
      },
      {
        id: 'c',
        text: '直觉来自内心，恐惧来自外在',
        feedback: '内在与外在的区分很重要',
        knowledgeCardId: 'intuition-recognition',
      },
    ],
  },
  {
    id: 'chapter2-q5',
    text: '如果阿尼玛/阿尼姆斯是你的向导，你会如何跟随？',
    phase: 'chapter2',
    order: 5,
    options: [
      {
        id: 'a',
        text: '我不会跟随，我只相信理性',
        feedback: '理性是工具，但不是向导',
        knowledgeCardId: 'anima-guidance',
      },
      {
        id: 'b',
        text: '我会谨慎跟随，保持理性',
        feedback: '平衡是好的，但不要过度谨慎',
        knowledgeCardId: 'anima-guidance',
      },
      {
        id: 'c',
        text: '我会信任并跟随',
        feedback: '信任是自性化的关键',
        knowledgeCardId: 'anima-guidance',
      },
    ],
  },
  {
    id: 'chapter2-q6',
    text: '你如何平衡内在的不同声音？',
    phase: 'chapter2',
    order: 6,
    options: [
      {
        id: 'a',
        text: '我只听一个声音',
        feedback: '单一声音是片面的',
        knowledgeCardId: 'inner-harmony',
      },
      {
        id: 'b',
        text: '我让它们竞争，最强的获胜',
        feedback: '竞争不是解决之道',
        knowledgeCardId: 'inner-harmony',
      },
      {
        id: 'c',
        text: '我倾听所有声音，寻找和谐',
        feedback: '和谐是自性化的目标',
        knowledgeCardId: 'inner-harmony',
      },
    ],
  },
];

// ============================================================================
// 第三章问题（6个）
// ============================================================================

export const CHAPTER3_QUESTIONS: Question[] = [
  // 问题1-3：炼金术与对立面的理解
  {
    id: 'chapter3-q1',
    text: '荣格认为，自性化的关键是？',
    phase: 'chapter3',
    order: 1,
    options: [
      {
        id: 'a',
        text: '消除所有冲突',
        feedback: '冲突是成长的机会',
        knowledgeCardId: 'coniunctio',
      },
      {
        id: 'b',
        text: '整合对立面',
        feedback: '整合对立面是自性化的核心',
        knowledgeCardId: 'coniunctio',
      },
      {
        id: 'c',
        text: '选择正确的一方',
        feedback: '选择不是解决之道',
        knowledgeCardId: 'coniunctio',
      },
    ],
  },
  {
    id: 'chapter3-q2',
    text: '在炼金术中，"大作业"(Magnum Opus)指的是？',
    phase: 'chapter3',
    order: 2,
    options: [
      {
        id: 'a',
        text: '制造黄金',
        feedback: '黄金是象征，不是目标',
        knowledgeCardId: 'alchemy-symbol',
      },
      {
        id: 'b',
        text: '精神的转化',
        feedback: '精神的转化是自性化的过程',
        knowledgeCardId: 'alchemy-symbol',
      },
      {
        id: 'c',
        text: '获得永生',
        feedback: '永生是象征，不是字面意思',
        knowledgeCardId: 'alchemy-symbol',
      },
    ],
  },
  {
    id: 'chapter3-q3',
    text: '在你的生命中，"水"和"火"代表什么？',
    phase: 'chapter3',
    order: 3,
    options: [
      {
        id: 'a',
        text: '水是理性，火是情感',
        feedback: '理解对立面的象征意义',
        knowledgeCardId: 'water-fire-symbol',
      },
      {
        id: 'b',
        text: '水是情感，火是理性',
        feedback: '理解对立面的象征意义',
        knowledgeCardId: 'water-fire-symbol',
      },
      {
        id: 'c',
        text: '水是阴，火是阳',
        feedback: '理解对立面的象征意义',
        knowledgeCardId: 'water-fire-symbol',
      },
    ],
  },
  // 问题4-6：大作业与转化的准备
  {
    id: 'chapter3-q4',
    text: '你准备好进行"大作业"了吗？',
    phase: 'chapter3',
    order: 4,
    options: [
      {
        id: 'a',
        text: '还没有，我还没准备好',
        feedback: '准备是必要的，但不要无限拖延',
        knowledgeCardId: 'magnum-opus',
      },
      {
        id: 'b',
        text: '也许，但我害怕失败',
        feedback: '恐惧是正常的，但不要让恐惧阻止你',
        knowledgeCardId: 'magnum-opus',
      },
      {
        id: 'c',
        text: '是的，我愿意尝试',
        feedback: '勇气是转化的开始',
        knowledgeCardId: 'magnum-opus',
      },
    ],
  },
  {
    id: 'chapter3-q5',
    text: '你生命中的主要"对立面"是什么？',
    phase: 'chapter3',
    order: 5,
    options: [
      {
        id: 'a',
        text: '理性与情感',
        feedback: '理性与情感的整合是常见的挑战',
        knowledgeCardId: 'opposites-integration',
      },
      {
        id: 'b',
        text: '控制与自由',
        feedback: '控制与自由的平衡是重要的',
        knowledgeCardId: 'opposites-integration',
      },
      {
        id: 'c',
        text: '完美与不完美',
        feedback: '完美与不完美的接受是自性化的关键',
        knowledgeCardId: 'opposites-integration',
      },
    ],
  },
  {
    id: 'chapter3-q6',
    text: '转化的最终目标是什么？',
    phase: 'chapter3',
    order: 6,
    options: [
      {
        id: 'a',
        text: '成为完美的人',
        feedback: '完美不是目标',
        knowledgeCardId: 'transformation-goal',
      },
      {
        id: 'b',
        text: '消除所有冲突',
        feedback: '冲突是成长的机会',
        knowledgeCardId: 'transformation-goal',
      },
      {
        id: 'c',
        text: '成为完整的人',
        feedback: '完整是自性化的目标',
        knowledgeCardId: 'transformation-goal',
      },
    ],
  },
];

// ============================================================================
// 知识卡片数据
// ============================================================================

export const KNOWLEDGE_CARDS: Record<string, KnowledgeCard> = {
  // 序章知识卡片（3张）
  persona: {
    id: 'persona',
    title: '人格面具（Persona）',
    definition: '我们展示给世界的面孔',
    content: '人格面具是我们与外界交互的接口，它保护我们的真实自我，但也可能成为牢笼，让我们迷失在角色中。',
    jungQuote: '人格面具是我们与世界的接口，但不应成为我们的全部。',
    phase: 'prologue',
  },
  'collective-unconscious': {
    id: 'collective-unconscious',
    title: '集体无意识（Collective Unconscious）',
    definition: '人类共有的心理结构',
    content: '集体无意识包含人类共有的原型、象征和神话，它是我们心理的深层结构，连接着所有人类。',
    jungQuote: '集体无意识是人类的共同遗产。',
    phase: 'prologue',
  },
  individuation: {
    id: 'individuation',
    title: '个体化过程（Individuation）',
    definition: '成为完整自我的过程',
    content: '个体化是自性化的核心过程，包括认识面具、整合阴影、对话阿尼玛/阿尼姆斯，最终达到自性的圆满。',
    jungQuote: '个体化是自性化的核心。',
    phase: 'prologue',
  },
  
  // 第一章知识卡片（6张）
  shadow: {
    id: 'shadow',
    title: '阴影（Shadow）',
    definition: '我们拒绝成为的一切',
    content: '阴影是我们人格中被压抑、否认的部分，它包含我们不愿承认的欲望、情感和特质。',
    jungQuote: '阴影是我们拒绝成为的一切。',
    phase: 'chapter1',
  },
  projection: {
    id: 'projection',
    title: '投射（Projection）',
    definition: '将内在的阴影投射到他人身上',
    content: '投射是阴影的常见机制，我们否认自己的阴影，却在他人的行为中看到它，从而指责他人。',
    jungQuote: '投射是阴影的常见机制。',
    phase: 'chapter1',
  },
  'shadow-integration': {
    id: 'shadow-integration',
    title: '阴影的整合',
    definition: '承认、理解、整合阴影',
    content: '整合阴影不是消除它，而是承认它的存在，理解它的来源，并将其转化为创造力。',
    jungQuote: '整合阴影是自性化的关键。',
    phase: 'chapter1',
  },
  'shadow-root': {
    id: 'shadow-root',
    title: '阴影的根源',
    definition: '阴影的起源和形成',
    content: '阴影的根源在个体的历史中，包括童年经历、社会压抑和个人选择，理解根源有助于整合阴影。',
    jungQuote: '阴影的根源在个体的历史中。',
    phase: 'chapter1',
  },
  'shadow-naming': {
    id: 'shadow-naming',
    title: '阴影的命名',
    definition: '给阴影一个名字',
    content: '命名阴影是整合的第一步，通过命名，我们承认阴影的存在，开始与它对话。',
    jungQuote: '命名是整合的第一步。',
    phase: 'chapter1',
  },
  'shadow-transformation': {
    id: 'shadow-transformation',
    title: '阴影的转化',
    definition: '将阴影转化为力量',
    content: '阴影可以转化为创造力，通过理解、接纳和整合，阴影不再是负担，而是力量的源泉。',
    jungQuote: '阴影可以转化为创造力。',
    phase: 'chapter1',
  },
  
  // 第二章知识卡片（6张）
  'rational-intuitive': {
    id: 'rational-intuitive',
    title: '理性与直觉',
    definition: '两种认知方式',
    content: '理性是逻辑、分析、推理的能力，直觉是感觉、洞察、灵感的能力，两者都是自性化的重要工具。',
    jungQuote: '理性是工具，直觉是向导。',
    phase: 'chapter2',
  },
  'inner-voice': {
    id: 'inner-voice',
    title: '内在声音',
    definition: '内心的不同声音',
    content: '内在声音包括理性、情感、直觉、恐惧等不同的声音，倾听这些声音是自性化的路径。',
    jungQuote: '内在声音需要被倾听。',
    phase: 'chapter2',
  },
  'anima-animus': {
    id: 'anima-animus',
    title: '阿尼玛/阿尼姆斯（Anima/Animus）',
    definition: '内在的异性原型',
    content: '阿尼玛是男性内在的女性形象，阿尼姆斯是女性内在的男性形象，它们是内在的向导。',
    jungQuote: '阿尼玛是男人内在的女性形象。',
    phase: 'chapter2',
  },
  'intuition-recognition': {
    id: 'intuition-recognition',
    title: '直觉的识别',
    definition: '如何识别真正的直觉',
    content: '真正的直觉是平静的、内在的、真实的，它来自内心深处的智慧，而不是外在的恐惧。',
    jungQuote: '直觉来自内心，恐惧来自外在。',
    phase: 'chapter2',
  },
  'anima-guidance': {
    id: 'anima-guidance',
    title: '阿尼玛的指引',
    definition: '跟随内在向导',
    content: '阿尼玛/阿尼姆斯是内在的向导，信任并跟随它们，是自性化的重要步骤。',
    jungQuote: '阿尼玛是内在的向导。',
    phase: 'chapter2',
  },
  'inner-harmony': {
    id: 'inner-harmony',
    title: '内在的和谐',
    definition: '平衡内在的不同声音',
    content: '内在的和谐是自性化的目标，不是让一个声音压制其他声音，而是让所有声音和谐共存。',
    jungQuote: '内在的和谐是自性化的目标。',
    phase: 'chapter2',
  },
  'inner-vibration': {
    id: 'inner-vibration',
    title: '内在的振动',
    definition: '声音在体内的位置',
    content: '内在声音在体内的不同位置振动，反映了我们与这些声音的关系。心脏代表情感，大脑代表理性，腹部代表直觉。',
    jungQuote: '身体是心灵的容器。',
    phase: 'chapter2',
  },
  'inner-messenger': {
    id: 'inner-messenger',
    title: '内在的信使',
    definition: '声音传递的信息',
    content: '内在声音是信使，它们传递着不同的信息。积极的声音传递希望、力量和宁静，消极的声音传递警告、痛苦和怀疑。',
    jungQuote: '倾听内在的声音，它们是智慧的使者。',
    phase: 'chapter2',
  },
  'inner-response': {
    id: 'inner-response',
    title: '对内在声音的回应',
    definition: '如何回应内在声音',
    content: '回应内在声音的方式反映了我们与无意识的关系。深呼吸让它流过，是接纳；转身直面来源，是理解；伸手触碰，是整合。',
    jungQuote: '回应是对话的开始。',
    phase: 'chapter2',
  },
  'echo-space-feeling': {
    id: 'echo-space-feeling',
    title: '回响空间的感觉',
    definition: '共同创造的空间',
    content: '回响空间是两种频率相遇产生的第三种东西，它可能是被照亮的瞬间、被理解的宁静，或想要行动的动力。',
    jungQuote: '共鸣先于理解。',
    phase: 'chapter2',
  },
  'echo-space-color': {
    id: 'echo-space-color',
    title: '回响空间的颜色',
    definition: '空间的色彩象征',
    content: '回响空间的颜色反映了它的本质。幽蓝代表深度和神秘，暖金代表智慧和光明，灰绿代表平衡和生长。',
    jungQuote: '颜色是心灵的象征。',
    phase: 'chapter2',
  },
  'echo-space-integration': {
    id: 'echo-space-integration',
    title: '回响空间的整合',
    definition: '让回响进入生活',
    content: '将回响空间整合到生活中，可以是内心的避难所、行动的灯塔，或需要时间适应的新空间。整合是自性化的重要步骤。',
    jungQuote: '整合是自性化的关键。',
    phase: 'chapter2',
  },
  
  // 第三章知识卡片（6张）
  coniunctio: {
    id: 'coniunctio',
    title: '对立面的统一（Coniunctio）',
    definition: '整合对立面',
    content: '对立面的统一是自性化的核心，通过整合对立面，我们达到内在的和谐与完整。',
    jungQuote: '对立面的结合才能催生真正的自我。',
    phase: 'chapter3',
  },
  'alchemy-symbol': {
    id: 'alchemy-symbol',
    title: '炼金术象征',
    definition: '炼金术的心理学意义',
    content: '炼金术是关于转化的艺术，它象征着精神的转化过程，从原始材料到黄金的转化，对应心理的自性化。',
    jungQuote: '炼金术是关于转化的艺术。',
    phase: 'chapter3',
  },
  'water-fire-symbol': {
    id: 'water-fire-symbol',
    title: '水与火的象征',
    definition: '对立面的象征',
    content: '水与火代表对立面的象征，水是情感、阴、接受，火是理性、阳、行动，它们的统一是自性化的关键。',
    jungQuote: '水与火的对立统一。',
    phase: 'chapter3',
  },
  'magnum-opus': {
    id: 'magnum-opus',
    title: '大作业（Magnum Opus）',
    definition: '精神的转化过程',
    content: '大作业是炼金术的最高目标，对应心理的自性化过程，包括黑化、白化、黄化、红化四个阶段。',
    jungQuote: '大作业是自性化的过程。',
    phase: 'chapter3',
  },
  'opposites-integration': {
    id: 'opposites-integration',
    title: '对立面的整合',
    definition: '整合生命中的对立面',
    content: '整合生命中的对立面，不是消除冲突，而是承认、理解、统一对立面，达到内在的和谐。',
    jungQuote: '整合对立面是自性化的核心。',
    phase: 'chapter3',
  },
  'transformation-goal': {
    id: 'transformation-goal',
    title: '转化的目标',
    definition: '成为完整的人',
    content: '转化的目标不是成为完美的人，而是成为完整的人，整合所有的对立面，达到内在的和谐与圆满。',
    jungQuote: '与其做个好人，不如做一个完整的人。',
    phase: 'chapter3',
  },
  // 意象之海核心三问与深化三问知识卡片
  'symbol-unconscious-language': {
    id: 'symbol-unconscious-language',
    title: '象征作为无意识的语言',
    definition: '心灵最自然的表达',
    content: '荣格认为，象征是心灵最自然的表达。它比逻辑语言更古老、更丰富，能直接与我们的深层情感和集体记忆对话。',
    jungQuote: '象征是心灵最自然的表达。',
    phase: 'chapter3',
  },
  'opposites-tension': {
    id: 'opposites-tension',
    title: '对立面',
    definition: '心灵动力的来源',
    content: '荣格心理学认为，心灵的动力源于对立双方的紧张关系（如意识与无意识、理性与感性）。认识并接纳对立面，是走向完整的第一步。',
    jungQuote: '对立面的张力是心灵的引擎。',
    phase: 'chapter3',
  },
  'transcendence-function': {
    id: 'transcendence-function',
    title: '超越功能',
    definition: '连接对立面的桥梁',
    content: '当心灵有意识地承受对立面的张力时，便可能激发出一种「超越功能」，它像一座桥梁，能产生新的视角或解决方案，引领人格走向更复杂的整合层次。',
    jungQuote: '超越功能产生于对立面的张力之中。',
    phase: 'chapter3',
  },
  'archetype-complex': {
    id: 'archetype-complex',
    title: '原型与个人情结',
    definition: '核心象征的根须',
    content: '核心象征常常与我们的个人情结（情感聚集的簇）相连，而情结又根植于更古老的原型。追溯它，能理解这个意象对你为何如此有力。',
    jungQuote: '情结是通往无意识的桥梁。',
    phase: 'chapter3',
  },
  'shadow-gift': {
    id: 'shadow-gift',
    title: '阴影的馈赠',
    definition: '对立面中的被忽略能量',
    content: '我们排斥的对立面往往包含「阴影」成分。正视它，是收回被割裂力量、丰富人格的关键。',
    jungQuote: '阴影中藏着被我们割裂的力量。',
    phase: 'chapter3',
  },
  'active-imagination': {
    id: 'active-imagination',
    title: '积极想象',
    definition: '与无意识意象对话',
    content: '这是荣格推荐的方法：有意识地邀请无意识意象进行内在对话。让象征智慧为意识生活提供养分。',
    jungQuote: '积极想象是与无意识的对话。',
    phase: 'chapter3',
  },

  // 尾声知识卡片（3张）
  self: {
    id: 'self',
    title: '自性（Self）',
    definition: '完整的、统一的自我',
    content: '自性是自性化的目标，它是完整的、统一的自我，整合了所有的对立面，达到内在的和谐。',
    jungQuote: '自性是自性化的目标。',
    phase: 'epilogue',
  },
  mandala: {
    id: 'mandala',
    title: '曼陀罗（Mandala）',
    definition: '自性的象征',
    content: '曼陀罗是自性的象征，它的圆形、对称、完整的结构，代表着自性的圆满与和谐。',
    jungQuote: '曼陀罗是自性的象征。',
    phase: 'epilogue',
  },
  wholeness: {
    id: 'wholeness',
    title: '圆满（Wholeness）',
    definition: '成为完整的人',
    content: '圆满是自性化的最终目标，它不是完美，而是完整，整合了所有的对立面，达到内在的和谐与统一。',
    jungQuote: '圆满是自性化的最终目标。',
    phase: 'epilogue',
  },
};
