/**
 * Chapter 1 Dynamic Data
 * 第一章动态数据：基于阴影和情绪的问题
 */

import type { Question } from './questions';

// 情绪词汇（对阴影的情绪反应）
export const EMOTION_WORDS = [
  { word: '恐惧', fragments: ['恐', '惧'] },
  { word: '愤怒', fragments: ['愤', '怒'] },
  { word: '羞耻', fragments: ['羞', '耻'] },
  { word: '厌恶', fragments: ['厌', '恶'] },
  { word: '悲伤', fragments: ['悲', '伤'] },
  { word: '焦虑', fragments: ['焦', '虑'] },
];

// 阴影的意图和转化方式
export const SHADOW_INTENTIONS: Record<string, { intention: string; transformation: string }> = {
  暴怒: {
    intention: '我的攻击性是为了保护你，当你感到被侵犯时，我会站出来。',
    transformation: '将攻击性转化为边界感，学会说"不"，保护自己的同时不伤害他人。',
  },
  嫉妒: {
    intention: '我渴望被认可，渴望拥有别人拥有的东西，这源于你内心的不满足。',
    transformation: '将嫉妒转化为动力，承认自己的渴望，用行动去争取，而不是怨恨他人。',
  },
  怯懦: {
    intention: '我保护你免受伤害，但我也阻止了你成长。',
    transformation: '将怯懦转化为谨慎，在安全的前提下，逐步尝试新的事物。',
  },
  贪婪: {
    intention: '我渴望更多，因为我害怕失去，害怕不够。',
    transformation: '将贪婪转化为对生活的热爱，学会满足，珍惜当下拥有的。',
  },
  傲慢: {
    intention: '我用优越感掩盖你的自卑，让你感觉自己是特别的。',
    transformation: '将傲慢转化为自信，承认自己的价值，同时尊重他人。',
  },
  虚伪: {
    intention: '我帮你适应社会，但我也让你迷失了真实的自己。',
    transformation: '将虚伪转化为社交智慧，在保持真实的同时，学会适当的表达。',
  },
  愤怒: {
    intention: '我代表你被压抑的愤怒，当你的边界被侵犯时，我会爆发。',
    transformation: '将愤怒转化为力量，学会表达不满，保护自己的权益。',
  },
  恐惧: {
    intention: '我保护你免受危险，但我也阻止了你探索世界。',
    transformation: '将恐惧转化为警觉，在安全的前提下，勇敢地面对未知。',
  },
  脆弱: {
    intention: '我让你感到无助，但我也让你有机会寻求帮助和连接。',
    transformation: '将脆弱转化为开放，允许自己感受情感，与他人建立真实的连接。',
  },
  羞耻: {
    intention: '我让你感到自己不够好，但我也提醒你关注自己的行为。',
    transformation: '将羞耻转化为自我反思，承认错误，但不被错误定义。',
  },
  怨恨: {
    intention: '我保存着你的伤痛，提醒你曾经受到的伤害。',
    transformation: '将怨恨转化为理解，承认伤痛，但选择原谅和放下。',
  },
  绝望: {
    intention: '我让你感到无望，但我也让你有机会重新开始。',
    transformation: '将绝望转化为接受，承认现状，但保持对未来的希望。',
  },
  自卑: {
    intention: '我让你感到自己不够好，但我也提醒你关注自己的成长。',
    transformation: '将自卑转化为谦逊，承认自己的不足，但相信自己的潜力。',
  },
  焦虑: {
    intention: '我让你对未来感到不安，但我也提醒你做好准备。',
    transformation: '将焦虑转化为准备，关注当下，为未来做计划但不被未来控制。',
  },
  冷漠: {
    intention: '我保护你免受情感伤害，但我也让你失去了连接。',
    transformation: '将冷漠转化为边界，保护自己的同时，允许自己感受和表达情感。',
  },
  偏执: {
    intention: '我让你保持警惕，但我也让你无法信任他人。',
    transformation: '将偏执转化为谨慎，保持警觉的同时，学会信任和开放。',
  },
  逃避: {
    intention: '我帮你避免痛苦，但我也阻止了你面对问题。',
    transformation: '将逃避转化为休息，在需要时给自己空间，但最终要面对现实。',
  },
  依赖: {
    intention: '我让你感到安全，但我也让你失去了独立。',
    transformation: '将依赖转化为连接，在保持关系的同时，发展自己的独立性。',
  },
};

// 基于阴影的问题（动态生成，基于三个阴影）
export function getShadowQuestions(shadowNames: string): Question[] {
  const names = shadowNames.split('、');
  return [
    {
      id: `chapter1-shadow-q1`,
      text: `关于这些阴影（${shadowNames}），你最害怕的是什么？`,
      phase: 'chapter1',
      order: 1,
      options: [
        {
          id: 'a',
          text: '它会控制我，让我失去理智',
          feedback: '恐惧控制本身也是一种控制，阴影需要被理解而不是被压制',
          knowledgeCardId: 'shadow',
        },
        {
          id: 'b',
          text: '它会伤害我身边的人',
          feedback: '理解阴影的意图，可以帮助你更好地控制它的表达方式',
          knowledgeCardId: 'shadow',
        },
        {
          id: 'c',
          text: '它会让我变得不像自己',
          feedback: '阴影本身就是你的一部分，接受它才能成为完整的自己',
          knowledgeCardId: 'shadow',
        },
      ],
    },
    {
      id: `chapter1-shadow-q2`,
      text: `这些阴影在你的生活中最常出现在什么时候？`,
      phase: 'chapter1',
      order: 2,
      options: [
        {
          id: 'a',
          text: '当我感到被忽视或被拒绝时',
          feedback: '阴影往往在脆弱的时候显现，理解它的触发点很重要',
          knowledgeCardId: 'shadow-root',
        },
        {
          id: 'b',
          text: '当我感到压力或焦虑时',
          feedback: '压力会激活阴影，学会管理压力有助于整合阴影',
          knowledgeCardId: 'shadow-root',
        },
        {
          id: 'c',
          text: '当我感到被威胁或攻击时',
          feedback: '阴影是防御机制，理解它的保护意图有助于转化',
          knowledgeCardId: 'shadow-root',
        },
      ],
    },
    {
      id: `chapter1-shadow-q3`,
      text: `如果这些阴影都是你的一部分，你会如何与它们对话？`,
      phase: 'chapter1',
      order: 3,
      options: [
        {
          id: 'a',
          text: '我会告诉它，我不需要它',
          feedback: '拒绝阴影只会让它更强大，尝试理解它的意图',
          knowledgeCardId: 'shadow-integration',
        },
        {
          id: 'b',
          text: '我会问它，你想要什么',
          feedback: '理解阴影的需求是整合的第一步',
          knowledgeCardId: 'shadow-integration',
        },
        {
          id: 'c',
          text: '我会拥抱它，接受它的存在',
          feedback: '接受是整合的关键，但理解同样重要',
          knowledgeCardId: 'shadow-integration',
        },
      ],
    },
  ];
}

// 基于转化力量的问题（动态生成，支持三种力量）
export function getEmotionQuestions(powerNames: string): Question[] {
  const powers = powerNames.split('、');
  const powerText = powers.length === 3 ? `"${powers[0]}"、"${powers[1]}"和"${powers[2]}"` : `"${powerNames}"`;
  
  return [
    {
      id: `chapter1-emotion-q1-${powerNames}`,
      text: `${powerText}这三种力量，如何帮助你转化阴影？`,
      phase: 'chapter1',
      order: 1,
      options: [
        {
          id: 'a',
          text: '用它们来压制阴影，让阴影消失',
          feedback: '压制不是转化，转化是理解阴影并让它成为你的资源',
          knowledgeCardId: 'shadow-integration',
        },
        {
          id: 'b',
          text: '用它们来理解阴影的意图和需求',
          feedback: '理解是转化的第一步，继续探索如何运用这些力量',
          knowledgeCardId: 'shadow-integration',
        },
        {
          id: 'c',
          text: '用它们来与阴影对话，建立新的关系',
          feedback: '建立关系是整合的关键，这些力量可以帮助你与阴影共处',
          knowledgeCardId: 'shadow-integration',
        },
      ],
    },
    {
      id: `chapter1-emotion-q2-${powerNames}`,
      text: `当你运用${powerText}时，你希望如何与阴影互动？`,
      phase: 'chapter1',
      order: 2,
      options: [
        {
          id: 'a',
          text: '让阴影服从我的意志',
          feedback: '控制不是整合，尝试理解阴影也有自己的智慧',
          knowledgeCardId: 'shadow-transformation',
        },
        {
          id: 'b',
          text: '与阴影合作，共同成长',
          feedback: '合作是整合的关键，这些力量可以帮助你建立与阴影的伙伴关系',
          knowledgeCardId: 'shadow-transformation',
        },
        {
          id: 'c',
          text: '让阴影成为我的一部分，不再分离',
          feedback: '整合是目标，这些力量可以帮助你接纳阴影，成为完整的自己',
          knowledgeCardId: 'shadow-transformation',
        },
      ],
    },
    {
      id: `chapter1-emotion-q3-${powerNames}`,
      text: `${powerText}将如何改变你与阴影的关系？`,
      phase: 'chapter1',
      order: 3,
      options: [
        {
          id: 'a',
          text: '让我能够控制阴影',
          feedback: '控制是暂时的，真正的转化是理解与整合',
          knowledgeCardId: 'shadow-transformation',
        },
        {
          id: 'b',
          text: '让我能够理解阴影的价值',
          feedback: '理解阴影的价值是整合的重要一步，这些力量可以帮助你看到阴影的智慧',
          knowledgeCardId: 'shadow-transformation',
        },
        {
          id: 'c',
          text: '让我与阴影建立新的平衡，共同前行',
          feedback: '平衡是整合的目标，这些力量可以帮助你与阴影建立健康的关系',
          knowledgeCardId: 'shadow-transformation',
        },
      ],
    },
  ];
}
