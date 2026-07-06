/**
 * 文件用途：职业洞察与新型副业预测相关的类型定义。
 *
 * Feature 2 的核心数据模型：AI 分析行业趋势后返回的洞察结果。
 * 包含三部分内容：
 * 1. 行业趋势分析：当前哪些副业方向正在兴起
 * 2. 新型副业预测：基于趋势推测出的新兴副业机会
 * 3. 职业技能分析：对用户所选职业方向的深度分析
 */

/**
 * 行业趋势项：描述一个正在兴起的副业趋势。
 */
export interface TrendItem {
  trend: string           // 趋势名称（如"AI内容创作爆发"）
  description: string     // 趋势详细说明
  growthRate: string      // 增长率/热度（如"↑300%"或"高热度"）
  relatedFields: string[] // 相关领域标签
  opportunity: string     // 这个趋势带来的副业机会
}

/**
 * 新型副业预测项：AI 基于趋势推测出的新兴副业方向。
 * 这是 Feature 2 的创新点——不只是推荐已有副业，还预测未来的新机会。
 */
export interface EmergingSideHustle {
  name: string            // 新型副业名称
  category: string        // 所属类别
  description: string     // 详细描述：是什么、怎么做
  whyEmerging: string     // 为什么会兴起（趋势驱动因素）
  potentialIncome: string // 预估收入潜力
  difficulty: string      // 上手难度
  entryBarrier: string    // 进入门槛
  skills: string[]        // 需要的技能
  timeToStart: string     // 预计上手时间
  riskLevel: string       // 风险等级
}

/**
 * 职业技能分析：对用户已选职业方向的深度分析。
 */
export interface CareerAnalysis {
  careerName: string      // 职业名称
  marketDemand: string    // 市场需求分析
  incomePotential: string // 收入潜力分析
  competitionLevel: string // 竞争激烈程度
  growthOutlook: string   // 发展前景
  keySkills: string[]     // 核心技能要求
  recommendedPlatforms: string[] // 推荐变现平台
  tips: string[]          // 入行建议
}

/**
 * 职业洞察响应体：AI 分析后返回的完整结果。
 */
export interface CareerInsightsResponse {
  trends: TrendItem[]                    // 行业趋势列表
  emergingHustles: EmergingSideHustle[]  // 新型副业预测列表
  careerAnalysis: CareerAnalysis[]       // 职业技能分析列表
  summary: string                        // 整体总结建议
  error?: string                         // 错误信息
}

/**
 * 职业洞察请求体：发送给后端的数据。
 */
export interface CareerInsightsRequest {
  skills: string[]        // 用户选择的职业/技能列表
  trends?: string[]       // 可选：用户感兴趣的趋势方向
}

/**
 * 副业发展树节点：Feature 3 的树形可视化数据结构。
 * 表示副业发展路径中的一个节点（如"入门 → 进阶 → 专家"）。
 */
export interface SideHustleTreeNode {
  id: string              // 节点唯一标识
  label: string           // 节点显示名称
  level: 'starter' | 'growth' | 'expert' | 'master'  // 发展阶段
  description: string     // 这个阶段的具体说明
  income: string          // 这个阶段的预估收入
  skills: string[]        // 这个阶段需要的技能
  duration: string        // 预计停留时间
  children?: SideHustleTreeNode[]  // 子节点（后续发展阶段）
}

/**
 * 副业发展路径图：完整的发展树。
 * 以一个副业方向为根节点，展开多条发展路径。
 */
export interface SideHustleTree {
  root: SideHustleTreeNode  // 根节点（起始阶段）
  title: string             // 发展路径标题
  description: string       // 路径说明
}

/**
 * 发展阶段标签映射。
 */
export const LEVEL_LABELS: Record<SideHustleTreeNode['level'], string> = {
  starter: '起步期',
  growth: '成长期',
  expert: '专家期',
  master: '大师期',
}

/**
 * 发展阶段颜色映射（用于树形图配色）。
 */
export const LEVEL_COLORS: Record<SideHustleTreeNode['level'], { bg: string; border: string; text: string }> = {
  starter: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
  growth: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
  expert: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700' },
  master: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' },
}
