/**
 * @file types.ts —— 后端共享类型定义
 * @description 定义了后端各处通用的数据结构（TypeScript 接口/类型）。
 *              这些类型就像"数据图纸"，让 generate.ts、schemas.ts、mock.ts 等文件
 *              对用户画像、副业方案等数据结构达成共识，保证数据在各模块间传递时格式一致。
 *              注意：这里只有类型声明，不产生任何运行时代码（纯编译期检查）。
 */

// 后端共享类型（与前端 types 对齐，保证前后端数据结构一致）

/**
 * 用户画像 —— 用户在前端填写的基本信息
 * 这是生成副业方案的输入依据
 */
export interface Profile {
  /** 技能特长列表，如 ['编程', '写作'] */
  skills: string[]
  /** 每天可用于副业的小时数 */
  availableHours: number
  /** 期望月收入目标（元） */
  incomeGoal: number
  /** 风险偏好：low 稳健 / medium 平衡 / high 进取 */
  riskTolerance: 'low' | 'medium' | 'high'
  /** 可投入的启动资金（元） */
  budget: number
}

/**
 * 操作指南中的单步骤 —— 告诉用户具体怎么做这个副业
 */
export interface GuideStep {
  /** 步骤序号（从 1 开始） */
  step: number
  /** 步骤标题，如"注册接单平台账号" */
  title: string
  /** 具体可执行的说明文字 */
  content: string
  /** 这一步需要的工具列表，如 ['电脑', '作品集'] */
  tools?: string[]
  /** 预计耗时，如"1-2小时" */
  duration?: string
}

/**
 * 赚钱渠道 —— 这个副业在哪里、通过什么方式赚钱
 */
export interface Channel {
  /** 渠道名称，如"程序员客栈"、"抖音" */
  name: string
  /** 渠道类型：平台 / 私域 / 线下 */
  type?: string
  /** 准入门槛：低 / 中 / 高 */
  barrier?: string
  /** 收益模式说明，如"按篇计费""流量分成" */
  incomeModel?: string
}

/**
 * 学习资源 —— 推荐用户去哪里学习这个副业方向
 */
export interface LearningResource {
  /** 平台名称，如"B站""小红书""知乎" */
  platform: string
  /** 资源类型，如"UP主""视频教程""文章专栏" */
  type: string
  /** 资源标题或 UP 主名称 */
  title: string
  /** 推荐理由 */
  description: string
  /** 用户可搜索的关键词 */
  keyword?: string
}

/**
 * 副业方案 —— AI 生成的单个副业推荐，是整个应用的核心数据结构
 */
export interface Plan {
  /** 方案唯一标识，如"p1" */
  id: string
  /** 副业方向名称 */
  title: string
  /** 一句话简介 */
  summary: string
  /** 匹配度评分（0-100），数值越高越适合用户 */
  matchScore: number
  /** 难度等级：低 / 中 / 高 */
  difficulty: string
  /** 预估收入范围，如"2000-5000元/月" */
  estimatedIncome: string
  /** 优点列表 */
  pros: string[]
  /** 缺点列表 */
  cons: string[]
  /** 赚钱渠道列表 */
  channels: Channel[]
  /** 操作步骤指南 */
  guide: GuideStep[]
  /** 推荐学习资源（可选） */
  learningResources?: LearningResource[]
  /** 标签列表，用于分类和筛选 */
  tags: string[]
}

/**
 * 接口响应结构 —— /api/generate 接口返回给前端的数据格式
 */
export interface GenerateResponse {
  /** 方案列表（成功时返回） */
  plans: Plan[]
  /** 错误信息（失败时返回） */
  error?: string
}
