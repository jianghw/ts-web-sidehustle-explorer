// 用户画像
export interface Profile {
  skills: string[]          // 技能特长（多选）
  availableHours: number    // 每日可投入时间（小时）
  incomeGoal: number        // 月期望收入（元）
  riskTolerance: 'low' | 'medium' | 'high'  // 风险偏好
  budget: number            // 启动资金（元）
}

// 操作指南单步
export interface GuideStep {
  step: number
  title: string
  content: string
  tools?: string[]
  duration?: string
}

// 赚钱渠道
export interface Channel {
  name: string
  type?: string        // 平台/私域/线下
  barrier?: string     // 低/中/高
  incomeModel?: string // 收益模式
}

// 学习资源推荐
export interface LearningResource {
  platform: string           // 平台名称：小红书 / B站 / 知乎 / YouTube / 抖音 等
  type: string               // 资源类型：UP主 / 视频教程 / 文章专栏 / 课程 等
  title: string              // 资源标题或 UP主名称
  description: string        // 推荐理由（为什么值得学）
  keyword?: string           // 搜索关键词（用于用户自行搜索）
}

// 单个副业方案（完整）
export interface Plan {
  id: string
  title: string
  summary: string
  matchScore: number         // 0-100
  difficulty: '低' | '中' | '高'
  estimatedIncome: string    // 如 "3000-8000元/月"
  pros: string[]
  cons: string[]
  channels: Channel[]
  guide: GuideStep[]
  learningResources?: LearningResource[]  // 学习资源推荐
  tags: string[]
}

// API 请求/响应
export interface GenerateRequest {
  profile: Profile
}

export interface GenerateResponse {
  plans: Plan[]
  error?: string
}
