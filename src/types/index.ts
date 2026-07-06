/**
 * 文件用途：定义整个前端应用使用的"数据模型"（TypeScript 类型）。
 * 也就是约定数据长什么样子——有哪些字段、字段是什么类型。
 * 这样写代码时有智能提示，也能在开发阶段及早发现数据格式错误。
 */

/**
 * 用户画像：记录用户在问卷中填写的各项信息。
 * 这些信息会发送给后端 AI，作为生成个性化副业方案的依据。
 */
export interface Profile {
  skills: string[]          // 技能特长（多选）：用户擅长什么，决定了推荐哪些方向的副业
  availableHours: number    // 每日可投入时间（小时）：影响推荐的方案是否现实可行
  incomeGoal: number        // 月期望收入（元）：用于筛选符合预期的方案档次
  // 风险偏好：决定推荐方案的稳健程度。
  // 'low' 稳健型（低风险） / 'medium' 平衡型 / 'high' 进取型（可接受较高风险）
  riskTolerance: 'low' | 'medium' | 'high'
  budget: number            // 启动资金（元）：影响推荐方案的前期投入门槛
}

/**
 * 操作指南单步：副业方案中的某一个操作步骤。
 * 一个完整的方案通常由多个步骤组成，用户按步骤一步步执行。
 */
export interface GuideStep {
  step: number              // 步骤序号（第几步）
  title: string             // 步骤标题（这一步要做什么）
  content: string           // 步骤详细说明（具体怎么做）
  tools?: string[]          // 这一步可能用到的工具（可选）
  duration?: string         // 预计耗时（可选，如"约2小时"）
}

/**
 * 赚钱渠道：副业方案中可以变现的具体渠道。
 * 比如做自媒体可以在小红书、B站、抖音等多个平台发布内容赚钱。
 */
export interface Channel {
  name: string              // 渠道名称（如"小红书"）
  type?: string             // 平台类型：平台流量型 / 私域粉丝型 / 线下接单型
  barrier?: string          // 进入门槛：低 / 中 / 高，帮助用户评估上手难度
  incomeModel?: string      // 收益模式：如广告分成、带货佣金、知识付费等
}

/**
 * 学习资源推荐：为用户推荐的进一步学习内容。
 * 帮助用户从零开始学习某项副业所需的技能。
 */
export interface LearningResource {
  platform: string           // 平台名称：小红书 / B站 / 知乎 / YouTube / 抖音 等
  type: string               // 资源类型：UP主 / 视频教程 / 文章专栏 / 课程 等
  title: string              // 资源标题或 UP主名称
  description: string        // 推荐理由（为什么值得学），帮助用户判断是否适合自己
  keyword?: string           // 搜索关键词（可选）：用户可自行去平台搜索相关内容
}

/**
 * 单个副业方案（完整）：AI 生成的推荐副业的全部信息。
 * 这是应用中最核心的数据结构，结果页和详情页都围绕它展示。
 */
export interface Plan {
  id: string                // 方案唯一标识：用于路由跳转、收藏等场景的查找定位
  title: string             // 方案标题（如"小红书图文带货"）
  summary: string           // 方案简介（一两句话说明是什么、适合谁）
  matchScore: number        // 匹配度评分（0-100）：与用户画像的契合程度，分数越高越推荐
  difficulty: '低' | '中' | '高'  // 上手难度：帮助用户评估是否在自己能力范围内
  estimatedIncome: string    // 预估收入范围（如"3000-8000元/月"），给用户一个收益预期
  pros: string[]            // 优势列表：这个方案好在哪里
  cons: string[]            // 劣势/注意事项列表：这个方案有哪些局限或风险
  channels: Channel[]       // 赚钱渠道列表：具体可以在哪些地方变现
  guide: GuideStep[]        // 操作指南：按步骤教用户怎么开始做
  learningResources?: LearningResource[]  // 学习资源推荐（可选）：帮用户入门学习
  tags: string[]            // 标签列表：用于分类和快速识别方案特点
}

/**
 * API 请求体：发送给后端的生成方案请求的数据结构。
 * 只需要携带用户画像，后端据此生成方案。
 */
export interface GenerateRequest {
  profile: Profile          // 用户在问卷中填写的信息
}

/**
 * API 响应体：后端返回的生成结果的数据结构。
 * 包含生成的方案列表，以及可能的错误信息。
 */
export interface GenerateResponse {
  plans: Plan[]             // 生成的副业方案列表
  error?: string            // 错误信息（可选）：如果生成过程中出现问题，这里会说明原因
}
