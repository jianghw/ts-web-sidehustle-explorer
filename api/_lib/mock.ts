import type { Plan } from './types'

/**
 * Mock 方案数据，用于 API Key 未配置时的本地开发验证。
 * 生产环境不会使用。
 */
export function getMockPlans(): Plan[] {
  return [
    {
      id: 'p1',
      title: '技术写作接单',
      summary: '利用编程技能在平台接技术文档、API 文档写作订单，按篇计费。',
      matchScore: 92,
      difficulty: '低',
      estimatedIncome: '3000-8000元/月',
      pros: ['零成本起步，只需电脑', '时间灵活，按单结算', '能积累技术深度和作品集'],
      cons: ['初期接单难，需要好评积累', '收入不稳定，有淡旺季', '需要较强的文字表达力'],
      channels: [
        { name: '程序员客栈', type: '平台', barrier: '低', incomeModel: '按篇/按项目计费' },
        { name: '知乎付费专栏', type: '平台', barrier: '中', incomeModel: '订阅分成' },
        { name: '企业私单', type: '私域', barrier: '中', incomeModel: '长期合作月结' },
      ],
      guide: [
        { step: 1, title: '注册接单平台账号', content: '在程序员客栈、码市等平台注册，完善技术标签和作品集。', tools: ['电脑', '作品集'], duration: '1-2小时' },
        { step: 2, title: '接首批低价单积累评价', content: '前3-5单主动降价接，目标是获取5星好评，建立信任。', tools: ['平台账号'], duration: '1-2周' },
        { step: 3, title: '提价并拓展私单渠道', content: '评价攒够后提价30%-50%，同时在技术社群接企业私单。', tools: ['微信', '技术社群'], duration: '持续' },
      ],
      learningResources: [
        { platform: 'B站', type: 'UP主', title: '技术写作入门教程', description: '搜索「技术写作 教程」，有大量优质UP主分享技术文档写作技巧和接单经验。', keyword: '技术写作 接单' },
        { platform: '小红书', type: '文章', title: '程序员副业接单笔记', description: '搜索「程序员 副业 接单」，有很多真实接单经验分享和避坑指南。', keyword: '程序员副业 技术写作' },
        { platform: '知乎', type: '专栏', title: '技术写作变现指南', description: '搜索「技术写作 变现」，有资深技术写手的专栏分享从入门到接单的完整路径。', keyword: '技术写作 变现' },
      ],
      tags: ['编程', '写作', '零成本'],
    },
    {
      id: 'p2',
      title: '独立开发者工具',
      summary: '开发小型 SaaS 工具或浏览器插件，通过订阅或付费下载变现。',
      matchScore: 78,
      difficulty: '高',
      estimatedIncome: '5000-20000元/月',
      pros: ['天花板高，可被动收入', '积累产品和技术能力', '作品可长期运营'],
      cons: ['前期投入大，回报周期长', '需要产品+技术+运营综合能力', '竞争激烈，获客难'],
      channels: [
        { name: 'Product Hunt', type: '平台', barrier: '高', incomeModel: '付费下载/订阅' },
        { name: 'Chrome 应用商店', type: '平台', barrier: '中', incomeModel: '免费+付费版' },
        { name: '自有官网', type: '私域', barrier: '高', incomeModel: '订阅制' },
      ],
      guide: [
        { step: 1, title: '找到痛点需求', content: '在开发者社群、Reddit、V2EX 找高频痛点，验证付费意愿。', tools: ['电脑', '网络'], duration: '3-5天' },
        { step: 2, title: 'MVP 快速开发上线', content: '用 TRAE IDE 加速开发，2周内上线最小可用版本，收集反馈。', tools: ['TRAE IDE', '云服务'], duration: '2-3周' },
        { step: 3, title: '产品分发与变现', content: '上架应用商店，在技术社区推广，设置免费+付费分层。', tools: ['应用商店账号', '社群'], duration: '持续' },
      ],
      learningResources: [
        { platform: 'B站', type: 'UP主', title: '独立开发教程', description: '搜索「独立开发者 SaaS」，有独立开发者分享从0到1的产品构建和变现经验。', keyword: '独立开发 SaaS' },
        { platform: '小红书', type: '文章', title: '独立开发者变现笔记', description: '搜索「独立开发者 变现」，有开发者分享 Chrome 插件、SaaS 工具的盈利路径。', keyword: '独立开发者 变现' },
        { platform: '知乎', type: '专栏', title: '独立开发者出海指南', description: '搜索「独立开发 出海」，有专栏详细讲解 Product Hunt 发布和海外变现策略。', keyword: '独立开发 出海' },
      ],
      tags: ['编程', 'SaaS', '被动收入'],
    },
    {
      id: 'p3',
      title: '编程教学短视频',
      summary: '在抖音/B站做编程教学短视频，通过流量分成和课程变现。',
      matchScore: 85,
      difficulty: '中',
      estimatedIncome: '2000-15000元/月',
      pros: ['流量红利期，起步快', '既能练技术又能练表达', '可导流到付费课程'],
      cons: ['需要持续产出内容', '前期粉丝积累较慢', '平台算法不稳定'],
      channels: [
        { name: '抖音', type: '平台', barrier: '低', incomeModel: '流量分成+广告' },
        { name: 'B站', type: '平台', barrier: '低', incomeModel: '创作激励+充电' },
        { name: '付费课程', type: '私域', barrier: '中', incomeModel: '课程销售' },
      ],
      guide: [
        { step: 1, title: '确定细分赛道', content: '选一个你擅长的技术栈（如 React、Python），做5分钟入门教程。', tools: ['录屏软件', '麦克风'], duration: '1天' },
        { step: 2, title: '批量产出20条内容', content: '提前录制20条短视频，保证稳定更新频率，测试算法偏好。', tools: ['剪映', 'OBS'], duration: '2-3周' },
        { step: 3, title: '开通变现并导流', content: '粉丝过千后开通流量分成，引导到私域卖进阶课程。', tools: ['微信', '课程平台'], duration: '1-2月' },
      ],
      learningResources: [
        { platform: 'B站', type: 'UP主', title: '编程教学短视频教程', description: '搜索「编程教学 短视频」，有技术博主分享如何做编程教学内容的选题和录制技巧。', keyword: '编程教学 B站' },
        { platform: '抖音', type: 'UP主', title: '知识博主运营技巧', description: '搜索「知识博主 运营」，有运营达人分享如何在抖音做知识类内容的流量获取策略。', keyword: '知识博主 抖音运营' },
        { platform: '小红书', type: '文章', title: '短视频变现笔记', description: '搜索「编程短视频 变现」，有博主分享从流量分成到课程销售的完整变现路径。', keyword: '编程短视频 变现' },
      ],
      tags: ['编程', '短视频', '教学'],
    },
  ]
}
