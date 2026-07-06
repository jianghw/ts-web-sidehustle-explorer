/**
 * 文件用途：职业分类数据——包罗万象的职业大类与细分职业。
 *
 * 设计参考：中国《职业分类大典》（2022版）的 8 个大类框架，
 * 结合副业场景做了实用化裁剪，聚焦"适合作为副业开展的职业技能方向"。
 * 每个大类下有若干中类（子分类），每个中类下列出具体的技能/职业选项。
 *
 * 用户在问卷页可以点"查看更多职业"跳转到职业浏览页，
 * 按分类浏览所有职业，选中后会回填到问卷的技能列表中。
 */

/**
 * 单个职业/技能项的定义。
 * value 是程序内部使用的标识（英文或拼音），label 是显示给用户的中文。
 * icon 用 emoji 增加视觉辨识度，description 帮用户理解这个职业能做什么副业。
 */
export interface CareerItem {
  value: string         // 职业标识（如 'copywriting'）
  label: string         // 显示名称（如 '文案写作'）
  icon: string          // emoji 图标
  description: string   // 这个职业方向适合做什么副业
  sideHustlePotential: 'low' | 'medium' | 'high'  // 副业潜力评估
}

/**
 * 职业中类（子分类）：一个大类下包含若干中类，每个中类下有具体职业列表。
 */
export interface CareerSubCategory {
  name: string          // 中类名称（如"文字创作类"）
  icon: string          // 中类图标
  careers: CareerItem[] // 该中类下的所有职业
}

/**
 * 职业大类：顶层分类，对应《职业分类大典》的大类框架。
 */
export interface CareerCategory {
  id: string            // 大类标识（如 'creative'）
  name: string          // 大类名称（如 '创意与内容'）
  icon: string          // 大类图标
  description: string   // 大类简介
  color: string         // 主题色（Tailwind 色系名，用于 UI 配色）
  subCategories: CareerSubCategory[]  // 该大类下的所有中类
}

/**
 * CAREER_CATEGORIES：完整的职业分类数据。
 * 共 8 个大类，涵盖创意、技术、服务、商业、教育、生活、新兴等多个领域。
 * 用户可以在职业浏览页按大类 → 中类 → 具体职业的层级浏览和选择。
 */
export const CAREER_CATEGORIES: CareerCategory[] = [
  // ==================== 大类 1：创意与内容 ====================
  {
    id: 'creative',
    name: '创意与内容',
    icon: '🎨',
    description: '用创意和内容赚钱，适合有审美或表达欲的人',
    color: 'purple',
    subCategories: [
      {
        name: '文字创作类',
        icon: '✍️',
        careers: [
          { value: 'copywriting', label: '文案写作', icon: '📝', description: '为品牌写广告文案、产品描述、公众号文章', sideHustlePotential: 'high' },
          { value: 'novel-writing', label: '网络小说', icon: '📖', description: '在起点、番茄等平台写网文连载', sideHustlePotential: 'high' },
          { value: 'scriptwriting', label: '剧本杀/短剧编剧', icon: '🎭', description: '写剧本杀剧本或短视频剧本', sideHustlePotential: 'high' },
          { value: 'ghostwriting', label: '代笔/润色', icon: '🖋️', description: '帮人代写演讲稿、论文润色、公文', sideHustlePotential: 'medium' },
          { value: 'poetry-lyrics', label: '诗词/歌词创作', icon: '🎶', description: '为歌曲写词、为品牌写slogan', sideHustlePotential: 'low' },
        ],
      },
      {
        name: '视觉设计类',
        icon: '🖌️',
        careers: [
          { value: 'graphic-design', label: '平面设计', icon: '🎨', description: '海报、Logo、名片、包装设计接单', sideHustlePotential: 'high' },
          { value: 'ui-design', label: 'UI/界面设计', icon: '📱', description: 'App/网页界面设计外包', sideHustlePotential: 'high' },
          { value: 'illustration', label: '插画/漫画', icon: '🖌️', description: '商业插画、头像定制、漫画连载', sideHustlePotential: 'high' },
          { value: 'ppt-design', label: 'PPT设计', icon: '📊', description: '帮人做精美PPT，按页或按套收费', sideHustlePotential: 'high' },
          { value: '3d-modeling', label: '3D建模', icon: '🧊', description: '游戏/建筑/产品3D模型制作', sideHustlePotential: 'medium' },
        ],
      },
      {
        name: '视频创作类',
        icon: '🎬',
        careers: [
          { value: 'video-editing', label: '视频剪辑', icon: '✂️', description: '帮博主/企业剪辑短视频、Vlog', sideHustlePotential: 'high' },
          { value: 'short-video', label: '短视频创作', icon: '📱', description: '自己做抖音/快手短视频博主', sideHustlePotential: 'high' },
          { value: 'vlog', label: 'Vlog博主', icon: '🎥', description: '记录生活日常，B站/小红书涨粉变现', sideHustlePotential: 'medium' },
          { value: 'animation', label: '动画制作', icon: '🎞️', description: 'MG动画、AE特效、二次元动画', sideHustlePotential: 'medium' },
          { value: 'live-streaming', label: '直播', icon: '📹', description: '游戏/带货/知识分享直播', sideHustlePotential: 'high' },
        ],
      },
      {
        name: '摄影摄像类',
        icon: '📷',
        careers: [
          { value: 'portrait-photo', label: '人像摄影', icon: '👤', description: '证件照、写真、婚纱照拍摄', sideHustlePotential: 'medium' },
          { value: 'product-photo', label: '产品摄影', icon: '📦', description: '电商产品图、美食拍摄', sideHustlePotential: 'high' },
          { value: 'stock-photo', label: '图库摄影', icon: '🖼️', description: '拍照片上传图库平台赚版权费', sideHustlePotential: 'low' },
          { value: 'drone-photo', label: '航拍摄影', icon: '🚁', description: '无人机航拍婚礼/房产/景区', sideHustlePotential: 'medium' },
        ],
      },
    ],
  },

  // ==================== 大类 2：技术与开发 ====================
  {
    id: 'tech',
    name: '技术与开发',
    icon: '💻',
    description: '用代码和技术能力赚钱，适合逻辑思维强的人',
    color: 'blue',
    subCategories: [
      {
        name: '编程开发类',
        icon: '⌨️',
        careers: [
          { value: 'web-dev', label: 'Web开发', icon: '🌐', description: '做网站、小程序、H5页面外包', sideHustlePotential: 'high' },
          { value: 'app-dev', label: 'App开发', icon: '📱', description: 'iOS/Android应用开发接单', sideHustlePotential: 'high' },
          { value: 'mini-program', label: '小程序开发', icon: '💬', description: '微信小程序定制开发', sideHustlePotential: 'high' },
          { value: 'game-dev', label: '游戏开发', icon: '🎮', description: '独立游戏或小游戏开发', sideHustlePotential: 'medium' },
          { value: 'indie-dev', label: '独立开发者', icon: '🚀', description: '做SaaS工具、浏览器插件变现', sideHustlePotential: 'high' },
        ],
      },
      {
        name: '数据与AI类',
        icon: '📊',
        careers: [
          { value: 'data-analysis', label: '数据分析', icon: '📈', description: '帮企业做数据报表、用户分析', sideHustlePotential: 'medium' },
          { value: 'ai-prompt', label: 'AI提示词工程', icon: '🤖', description: '写AI提示词、搭建AI工作流', sideHustlePotential: 'high' },
          { value: 'ai-training', label: 'AI模型训练', icon: '🧠', description: '数据标注、模型微调服务', sideHustlePotential: 'medium' },
          { value: 'crawler', label: '爬虫/数据采集', icon: '🕷️', description: '采集公开数据、做数据清洗', sideHustlePotential: 'medium' },
        ],
      },
      {
        name: '技术写作类',
        icon: '📚',
        careers: [
          { value: 'tech-writing', label: '技术文档写作', icon: '📄', description: '写API文档、技术博客、教程', sideHustlePotential: 'medium' },
          { value: 'tech-tutorial', label: '技术教程', icon: '🎓', description: '录编程教程视频或写专栏', sideHustlePotential: 'high' },
          { value: 'code-review', label: '代码审查', icon: '🔍', description: '帮人审查代码质量、优化性能', sideHustlePotential: 'low' },
        ],
      },
      {
        name: '测试与运维类',
        icon: '🛠️',
        careers: [
          { value: 'software-testing', label: '软件测试', icon: '🐛', description: '帮团队做功能测试、Bug排查', sideHustlePotential: 'medium' },
          { value: 'devops', label: '运维/部署', icon: '⚙️', description: '服务器部署、CI/CD搭建', sideHustlePotential: 'low' },
          { value: 'security-audit', label: '安全审计', icon: '🔒', description: '网站/应用安全漏洞检测', sideHustlePotential: 'low' },
        ],
      },
    ],
  },

  // ==================== 大类 3：商业与运营 ====================
  {
    id: 'business',
    name: '商业与运营',
    icon: '📈',
    description: '用商业思维和运营能力赚钱，适合懂营销的人',
    color: 'green',
    subCategories: [
      {
        name: '电商运营类',
        icon: '🛒',
        careers: [
          { value: 'ecommerce', label: '电商开店', icon: '🏪', description: '淘宝/拼多多/闲鱼开店卖货', sideHustlePotential: 'high' },
          { value: 'cross-border', label: '跨境电商', icon: '🌍', description: 'Amazon/Shopee/TikTok Shop跨境卖货', sideHustlePotential: 'high' },
          { value: 'dropshipping', label: '无货源电商', icon: '📦', description: '一件代发，零库存做电商', sideHustlePotential: 'medium' },
          { value: 'secondhand', label: '二手倒卖', icon: '♻️', description: '闲鱼/转转低买高卖赚差价', sideHustlePotential: 'medium' },
        ],
      },
      {
        name: '社媒运营类',
        icon: '📣',
        careers: [
          { value: 'social-media', label: '社媒运营', icon: '📱', description: '帮企业运营公众号/小红书/抖音', sideHustlePotential: 'high' },
          { value: 'community-ops', label: '社群运营', icon: '👥', description: '管理微信群、做社群活动策划', sideHustlePotential: 'medium' },
          { value: 'koc', label: 'KOC种草', icon: '🌱', description: '在小红书/抖音做产品种草', sideHustlePotential: 'medium' },
          { value: 'live-commerce', label: '直播带货', icon: '🎥', description: '在直播间带货赚佣金', sideHustlePotential: 'high' },
        ],
      },
      {
        name: '营销推广类',
        icon: '📢',
        careers: [
          { value: 'seo', label: 'SEO优化', icon: '🔍', description: '帮网站做搜索引擎排名优化', sideHustlePotential: 'medium' },
          { value: 'ad-optimization', label: '广告投放', icon: '💰', description: '帮企业投信息流/搜索广告', sideHustlePotential: 'medium' },
          { value: 'brand-planning', label: '品牌策划', icon: '🏷️', description: '帮企业做品牌定位和营销方案', sideHustlePotential: 'low' },
          { value: 'pr-writing', label: '软文营销', icon: '📰', description: '写软文、新闻稿帮企业推广', sideHustlePotential: 'medium' },
        ],
      },
    ],
  },

  // ==================== 大类 4：教育与知识 ====================
  {
    id: 'education',
    name: '教育与知识',
    icon: '📚',
    description: '用知识和教学能力赚钱，适合擅长分享的人',
    color: 'amber',
    subCategories: [
      {
        name: '在线教学类',
        icon: '🎓',
        careers: [
          { value: 'tutoring', label: '学科辅导', icon: '📐', description: '中小学语数英理化辅导', sideHustlePotential: 'high' },
          { value: 'language-teaching', label: '语言教学', icon: '🌐', description: '教英语/日语/对外汉语', sideHustlePotential: 'high' },
          { value: 'music-teaching', label: '音乐教学', icon: '🎵', description: '教钢琴/吉他/声乐', sideHustlePotential: 'medium' },
          { value: 'art-teaching', label: '美术教学', icon: '🎨', description: '教绘画/书法/手工艺', sideHustlePotential: 'medium' },
        ],
      },
      {
        name: '知识付费类',
        icon: '💡',
        careers: [
          { value: 'online-course', label: '网课制作', icon: '🎬', description: '录制线上课程在平台售卖', sideHustlePotential: 'high' },
          { value: 'paid-consulting', label: '付费咨询', icon: '💬', description: '提供专业领域一对一咨询', sideHustlePotential: 'medium' },
          { value: 'paid-community', label: '付费社群', icon: '👥', description: '建知识星球/付费群分享干货', sideHustlePotential: 'high' },
          { value: 'e-book', label: '电子书出版', icon: '📕', description: '写电子书在豆瓣/知乎售卖', sideHustlePotential: 'low' },
        ],
      },
      {
        name: '内容科普类',
        icon: '🔬',
        careers: [
          { value: 'science-popularization', label: '科普创作', icon: '🧪', description: '做科普视频/图文，用知识涨粉', sideHustlePotential: 'medium' },
          { value: 'translation', label: '翻译', icon: '🔄', description: '英中翻译、字幕翻译、文献翻译', sideHustlePotential: 'medium' },
          { value: 'academic-support', label: '学术辅助', icon: '📑', description: '论文排版、文献检索辅导', sideHustlePotential: 'low' },
        ],
      },
    ],
  },

  // ==================== 大类 5：生活与服务 ====================
  {
    id: 'lifestyle',
    name: '生活与服务',
    icon: '🏠',
    description: '用生活技能和服务态度赚钱，适合动手能力强的人',
    color: 'orange',
    subCategories: [
      {
        name: '手工烘焙类',
        icon: '🧁',
        careers: [
          { value: 'baking', label: '私房烘焙', icon: '🍰', description: '做蛋糕/饼干/面包私房售卖', sideHustlePotential: 'medium' },
          { value: 'handcraft', label: '手工制作', icon: '🧶', description: '手工饰品/皮具/编织品售卖', sideHustlePotential: 'medium' },
          { value: 'custom-gifts', label: '定制礼品', icon: '🎁', description: '定制生日/节日/纪念礼品', sideHustlePotential: 'medium' },
          { value: 'flower-design', label: '花艺设计', icon: '💐', description: '插花/花束定制/花艺课程', sideHustlePotential: 'low' },
        ],
      },
      {
        name: '生活服务类',
        icon: '🛠️',
        careers: [
          { value: 'pet-care', label: '宠物服务', icon: '🐕', description: '宠物寄养/遛狗/上门喂养', sideHustlePotential: 'medium' },
          { value: 'home-cleaning', label: '上门保洁', icon: '🧹', description: '家庭深度清洁/收纳整理', sideHustlePotential: 'medium' },
          { value: 'cooking', label: '私厨/上门做饭', icon: '👨‍🍳', description: '上门做饭/私厨定制/便当配送', sideHustlePotential: 'medium' },
          { value: 'moving-help', label: '搬家协助', icon: '📦', description: '帮忙打包/搬运/整理', sideHustlePotential: 'low' },
        ],
      },
      {
        name: '健康健身类',
        icon: '💪',
        careers: [
          { value: 'fitness-coach', label: '健身教练', icon: '🏋️', description: '线上/线下私教、健身计划定制', sideHustlePotential: 'medium' },
          { value: 'yoga-coach', label: '瑜伽/普拉提', icon: '🧘', description: '教瑜伽课、做线上瑜伽教程', sideHustlePotential: 'medium' },
          { value: 'nutritionist', label: '营养咨询', icon: '🥗', description: '定制饮食方案、减脂餐指导', sideHustlePotential: 'low' },
          { value: 'massage', label: '推拿按摩', icon: '💆', description: '上门按摩/理疗服务', sideHustlePotential: 'low' },
        ],
      },
    ],
  },

  // ==================== 大类 6：声音与表演 ====================
  {
    id: 'performing',
    name: '声音与表演',
    icon: '🎵',
    description: '用声音和表演才华赚钱，适合有才艺的人',
    color: 'pink',
    subCategories: [
      {
        name: '声音演绎类',
        icon: '🎤',
        careers: [
          { value: 'voice-over', label: '配音', icon: '🎙️', description: '广告/有声书/动画/短剧配音', sideHustlePotential: 'high' },
          { value: 'audiobook', label: '有声书录制', icon: '📚', description: '在喜马拉雅/蜻蜓FM录有声书', sideHustlePotential: 'medium' },
          { value: 'singing', label: '翻唱/原创音乐', icon: '🎵', description: '在音乐平台发布翻唱或原创', sideHustlePotential: 'low' },
          { value: 'podcast', label: '播客', icon: '📻', description: '做播客节目，通过广告/赞助变现', sideHustlePotential: 'low' },
        ],
      },
      {
        name: '表演才艺类',
        icon: '🎭',
        careers: [
          { value: 'street-performance', label: '街头表演', icon: '🎸', description: '街头弹唱/魔术/杂技表演', sideHustlePotential: 'low' },
          { value: 'cosplay', label: 'Cosplay', icon: '🦸', description: '出Coser接商单/漫展嘉宾', sideHustlePotential: 'medium' },
          { value: 'dance', label: '舞蹈', icon: '💃', description: '舞蹈教学视频/商演/编舞', sideHustlePotential: 'medium' },
          { value: 'hosting', label: '主持/司仪', icon: '🎙️', description: '婚礼/活动/年会主持', sideHustlePotential: 'medium' },
        ],
      },
    ],
  },

  // ==================== 大类 7：咨询与专业服务 ====================
  {
    id: 'consulting',
    name: '咨询与专业',
    icon: '💼',
    description: '用专业知识和经验赚钱，适合有行业积累的人',
    color: 'indigo',
    subCategories: [
      {
        name: '专业咨询类',
        icon: '📋',
        careers: [
          { value: 'career-consulting', label: '职业规划', icon: '🎯', description: '帮人做职业规划、简历优化', sideHustlePotential: 'medium' },
          { value: 'legal-consulting', label: '法律咨询', icon: '⚖️', description: '提供法律建议、合同审查', sideHustlePotential: 'medium' },
          { value: 'financial-consulting', label: '理财规划', icon: '💰', description: '个人理财建议、税务筹划', sideHustlePotential: 'medium' },
          { value: 'psychological-counseling', label: '心理倾听', icon: '🤗', description: '情感倾诉、心理疏导服务', sideHustlePotential: 'medium' },
        ],
      },
      {
        name: '设计策划类',
        icon: '📐',
        careers: [
          { value: 'interior-design', label: '室内设计', icon: '🏠', description: '家装设计方案、软装搭配', sideHustlePotential: 'medium' },
          { value: 'event-planning', label: '活动策划', icon: '🎉', description: '帮人策划生日/求婚/团建活动', sideHustlePotential: 'medium' },
          { value: 'wedding-planning', label: '婚礼策划', icon: '💍', description: '婚礼方案设计、流程统筹', sideHustlePotential: 'medium' },
        ],
      },
      {
        name: '财务法务类',
        icon: '📊',
        careers: [
          { value: 'bookkeeping', label: '代理记账', icon: '🧾', description: '帮小企业/个体户做账报税', sideHustlePotential: 'medium' },
          { value: 'tax-filing', label: '税务申报', icon: '📋', description: '个人所得税申报辅导', sideHustlePotential: 'low' },
          { value: 'contract-review', label: '合同审查', icon: '📝', description: '帮人审查合同条款、规避风险', sideHustlePotential: 'low' },
        ],
      },
    ],
  },

  // ==================== 大类 8：新兴与前沿 ====================
  {
    id: 'emerging',
    name: '新兴与前沿',
    icon: '🚀',
    description: '紧跟趋势的新职业，适合敢于尝鲜的人',
    color: 'teal',
    subCategories: [
      {
        name: 'AI相关类',
        icon: '🤖',
        careers: [
          { value: 'ai-content', label: 'AI内容创作', icon: '✨', description: '用AI工具批量生成图文/视频内容', sideHustlePotential: 'high' },
          { value: 'ai-art', label: 'AI绘画', icon: '🎨', description: '用Midjourney/SD做AI插画接单', sideHustlePotential: 'high' },
          { value: 'ai-agent', label: 'AI智能体开发', icon: '🧠', description: '搭建AI Agent/工作流售卖', sideHustlePotential: 'high' },
          { value: 'prompt-engineer', label: '提示词工程师', icon: '💬', description: '专业写AI提示词、优化模型输出', sideHustlePotential: 'medium' },
        ],
      },
      {
        name: 'Web3/区块链类',
        icon: '🔗',
        careers: [
          { value: 'nft-art', label: 'NFT创作', icon: '🖼️', description: '创作数字艺术品铸造成NFT售卖', sideHustlePotential: 'low' },
          { value: 'crypto-writing', label: 'Web3内容', icon: '📝', description: '写区块链/Web3行业分析文章', sideHustlePotential: 'low' },
          { value: 'community-manager', label: 'DAO社区管理', icon: '🌐', description: '管理Web3/Discord社区', sideHustlePotential: 'low' },
        ],
      },
      {
        name: '新消费类',
        icon: '🛍️',
        careers: [
          { value: 'reviewer', label: '好物测评', icon: '⭐', description: '做产品测评博主，接品牌合作', sideHustlePotential: 'high' },
          { value: 'camping-ops', label: '露营经营', icon: '⛺', description: '经营露营地/卖露营装备', sideHustlePotential: 'medium' },
          { value: 'blind-box', label: '潮玩转卖', icon: '🎁', description: '潮玩/盲盒低买高卖', sideHustlePotential: 'low' },
          { value: 'pet-influencer', label: '宠物博主', icon: '🐱', description: '打造宠物IP，接广告/带货', sideHustlePotential: 'high' },
        ],
      },
      {
        name: '远程自由类',
        icon: '🌍',
        careers: [
          { value: 'virtual-assistant', label: '虚拟助手', icon: '📋', description: '远程帮人处理日常行政事务', sideHustlePotential: 'medium' },
          { value: 'remote-customer-service', label: '远程客服', icon: '🎧', description: '居家做在线客服', sideHustlePotential: 'medium' },
          { value: 'data-labeling', label: '数据标注', icon: '🏷️', description: '为AI公司做图片/文本标注', sideHustlePotential: 'low' },
          { value: 'online-moderator', label: '内容审核', icon: '👁️', description: '远程审核平台内容', sideHustlePotential: 'low' },
        ],
      },
    ],
  },
]

/**
 * 辅助函数：从所有分类中扁平化提取全部职业列表。
 * 用于搜索、统计等场景。
 */
export function getAllCareers(): CareerItem[] {
  return CAREER_CATEGORIES.flatMap((cat) =>
    cat.subCategories.flatMap((sub) => sub.careers)
  )
}

/**
 * 辅助函数：统计职业总数。
 */
export function getCareerCount(): number {
  return getAllCareers().length
}

/**
 * 辅助函数：根据 value 查找对应的职业项。
 */
export function findCareerByValue(value: string): CareerItem | undefined {
  return getAllCareers().find((c) => c.value === value)
}

/**
 * 辅助函数：根据 value 列表查找多个职业项。
 */
export function findCareersByValues(values: string[]): CareerItem[] {
  return values
    .map((v) => findCareerByValue(v))
    .filter((c): c is CareerItem => c !== undefined)
}

/**
 * 副业潜力标签映射：把英文值转成中文显示。
 */
export const POTENTIAL_LABELS: Record<CareerItem['sideHustlePotential'], string> = {
  low: '潜力一般',
  medium: '潜力不错',
  high: '潜力很高',
}

/**
 * 副业潜力颜色映射：用于UI配色。
 */
export const POTENTIAL_COLORS: Record<CareerItem['sideHustlePotential'], string> = {
  low: 'bg-slate-100 text-slate-500',
  medium: 'bg-amber-50 text-amber-600',
  high: 'bg-green-50 text-green-600',
}

/**
 * 旧版问卷技能选项的中文名称映射表。
 * 这些是 questionnaire.ts 中最初定义的 12 个固定技能选项，
 * 新版职业浏览页的职业使用 careers.ts 中的 CareerItem.label。
 * 这个映射表用于在构建 AI 提示词时把英文值统一翻译成中文。
 */
const LEGACY_SKILL_LABELS: Record<string, string> = {
  writing: '写作/文案',
  design: '设计/美工',
  coding: '编程/开发',
  video: '视频/剪辑',
  photography: '摄影',
  translation: '翻译',
  marketing: '运营/营销',
  teaching: '教学/辅导',
  handcraft: '手工/烘焙',
  data: '数据/分析',
  music: '音乐/配音',
  other: '其他',
}

/**
 * 辅助函数：把技能值列表统一翻译成中文名称列表。
 * 先从职业分类数据中查找（新版），找不到再查旧版映射表，都找不到就原样返回。
 * 用于构建发给 AI 的提示词，确保 AI 收到的是中文技能名称而非英文标识。
 */
export function getSkillLabels(skills: string[]): string[] {
  return skills.map((value) => {
    // 先从职业分类数据中查找
    const career = findCareerByValue(value)
    if (career) return career.label
    // 再从旧版映射表中查找
    if (LEGACY_SKILL_LABELS[value]) return LEGACY_SKILL_LABELS[value]
    // 都找不到就原样返回
    return value
  })
}
