/**
 * @file careerMock.ts —— 职业洞察与发展路径树的 Mock 假数据
 * @description 当 API Key 未配置时，返回这些预置数据让前端正常展示效果。
 *              数据结构必须和真实 AI 返回的完全一致。
 */

import type { CareerInsightsResponse, SideHustleTree } from '../../src/types/career'

/**
 * 获取职业洞察的 mock 数据
 */
export function getMockCareerInsights(): CareerInsightsResponse {
  return {
    trends: [
      {
        trend: 'AI内容创作爆发',
        description: 'AI工具降低了内容生产门槛，普通人也能批量产出高质量图文/视频内容',
        growthRate: '↑500%',
        relatedFields: ['AI绘画', 'AI写作', 'AI视频'],
        opportunity: '用AI工具做内容矩阵，一个人当一个团队用',
      },
      {
        trend: '银发经济崛起',
        description: '老龄化加速催生大量适老化服务需求，从健康到娱乐都有新机会',
        growthRate: '↑200%',
        relatedFields: ['健康服务', '老年教育', '适老设计'],
        opportunity: '做老年人专属的内容、产品或服务',
      },
      {
        trend: '私域流量精细化',
        description: '公域获客成本飙升，企业和个人都在转向私域精细化运营变现',
        growthRate: '↑150%',
        relatedFields: ['社群运营', '私域电商', '知识付费'],
        opportunity: '帮企业做私域代运营或自己做私域变现',
      },
      {
        trend: '跨境内容出海',
        description: 'TikTok、YouTube等平台的中国创作者出海趋势加速，内容跨境变现成新蓝海',
        growthRate: '↑300%',
        relatedFields: ['跨境电商', '海外内容', 'TikTok'],
        opportunity: '把国内成熟的内容模式复制到海外平台',
      },
    ],
    emergingHustles: [
      {
        name: 'AI数字人定制',
        category: 'AI服务',
        description: '用AI工具为客户生成数字人形象，用于直播、短视频、客服场景',
        whyEmerging: 'AI视频工具成熟，数字人需求从大企业下沉到中小企业',
        potentialIncome: '5000-20000元/月',
        difficulty: '中',
        entryBarrier: '需掌握AI视频工具，有基本审美',
        skills: ['AI工具使用', '视频剪辑', '客户沟通'],
        timeToStart: '1-2周',
        riskLevel: '低',
      },
      {
        name: '银发短视频代运营',
        category: '社媒运营',
        description: '帮中老年人或适老品牌运营短视频账号，制作适合老年人的内容',
        whyEmerging: '银发群体上网率提升，但缺乏内容制作能力',
        potentialIncome: '3000-10000元/月',
        difficulty: '低',
        entryBarrier: '懂短视频制作，理解老年人需求',
        skills: ['短视频制作', '内容策划', '耐心沟通'],
        timeToStart: '1周',
        riskLevel: '低',
      },
      {
        name: 'AI提示词模板商店',
        category: 'AI服务',
        description: '制作高质量AI提示词模板，在平台售卖或做定制服务',
        whyEmerging: 'AI普及但大多数人不会写提示词，存在技能差',
        potentialIncome: '2000-8000元/月',
        difficulty: '低',
        entryBarrier: '深度使用AI工具，能产出高质量提示词',
        skills: ['AI工具', '逻辑思维', '文案能力'],
        timeToStart: '3-5天',
        riskLevel: '低',
      },
      {
        name: 'TikTok短视频搬运优化',
        category: '跨境电商',
        description: '将国内优质短视频内容适配后发布到TikTok，赚取流量分成和带货佣金',
        whyEmerging: 'TikTok创作者激励计划扩大，国内内容有信息差优势',
        potentialIncome: '5000-30000元/月',
        difficulty: '中',
        entryBarrier: '需要科学上网，懂短视频本地化',
        skills: ['视频剪辑', '英语基础', '平台运营'],
        timeToStart: '2-3周',
        riskLevel: '中',
      },
    ],
    careerAnalysis: [
      {
        careerName: '文案写作',
        marketDemand: '需求旺盛，电商、自媒体、企业宣传都缺好文案',
        incomePotential: '初级2000-5000，资深可达10000+',
        competitionLevel: '中：门槛低导致竞争者多，但优质写手稀缺',
        growthOutlook: 'AI辅助下效率提升，懂AI的文案更有竞争力',
        keySkills: ['文字表达', '用户洞察', 'AI工具使用'],
        recommendedPlatforms: ['猪八戒网', '小红书', '公众号'],
        tips: ['先做个人作品集', '学会用AI提效但保持创意', '聚焦一个垂直领域深耕'],
      },
      {
        careerName: '视频剪辑',
        marketDemand: '短视频爆发导致剪辑需求井喷，供不应求',
        incomePotential: '按条100-500，月入5000-15000常见',
        competitionLevel: '中：会剪辑的人多，但精剪+创意稀缺',
        growthOutlook: 'AI剪辑工具降低了基础门槛，创意剪辑更值钱',
        keySkills: ['剪辑软件', '节奏感', '创意思维'],
        recommendedPlatforms: ['抖音', 'B站', '猪八戒网'],
        tips: ['建立模板库提效', '学AE/达芬奇差异化', '做垂类如美食/美妆精剪'],
      },
    ],
    summary: '你选择的职业方向都处于数字经济主赛道，市场需求旺盛。建议重点关注AI工具赋能（用AI提效而非被AI替代）、内容出海（把国内成熟模式复制到海外）两大趋势。先聚焦一个方向做到前20%，再横向扩展。',
  }
}

/**
 * 获取副业发展路径树的 mock 数据
 */
export function getMockSideHustleTree(): SideHustleTree {
  return {
    title: '技术写作接单 → 知识IP发展路径',
    description: '从接单写文档起步，逐步建立个人品牌和知识产品，实现被动收入',
    root: {
      id: 'n1',
      label: '接单起步',
      level: 'starter',
      description: '在接单平台接技术文档写作订单，积累经验和评价',
      income: '0-3000元/月',
      skills: ['技术理解', '文档规范', '基本排版'],
      duration: '1-3个月',
      children: [
        {
          id: 'n2a',
          label: '垂直领域深耕',
          level: 'growth',
          description: '聚焦一个技术领域（如AI/云原生），成为该领域文档专家',
          income: '3000-8000元/月',
          skills: ['垂直领域知识', '技术深度', '客户运营'],
          duration: '3-6个月',
          children: [
            {
              id: 'n3a',
              label: '知识付费产品',
              level: 'expert',
              description: '把积累的知识做成付费专栏、在线课程',
              income: '8000-20000元/月',
              skills: ['课程设计', '内容营销', '社群运营'],
              duration: '6-12个月',
              children: [
                {
                  id: 'n4a',
                  label: '知识IP品牌',
                  level: 'master',
                  description: '建立个人技术品牌，通过咨询、培训、出书多元变现',
                  income: '20000+元/月',
                  skills: ['品牌运营', '商业思维', '团队管理'],
                  duration: '1-2年',
                },
              ],
            },
          ],
        },
        {
          id: 'n2b',
          label: '技术自媒体',
          level: 'growth',
          description: '把接单经验做成技术博客/视频，在平台积累粉丝',
          income: '2000-6000元/月',
          skills: ['内容创作', 'SEO', '平台运营'],
          duration: '3-6个月',
          children: [
            {
              id: 'n3b',
              label: '技术社群运营',
              level: 'expert',
              description: '建付费技术社群，提供持续价值，订阅制变现',
              income: '6000-15000元/月',
              skills: ['社群运营', '活动策划', '价值交付'],
              duration: '6-12个月',
              children: [],
            },
          ],
        },
      ],
    },
  }
}
