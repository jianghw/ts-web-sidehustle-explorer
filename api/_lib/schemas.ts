/**
 * @file schemas.ts —— 运行时数据校验与容错处理
 * @description AI（大模型）返回的内容不可 100% 信任——它可能漏字段、类型错误、甚至格式不符。
 *              这个文件的作用就是：对 AI 返回的数据逐字段做检查和修正，
 *              确保最终传给前端的是结构完整、类型正确的数据，防止前端因数据异常而白屏崩溃。
 *              这种"不信任外部输入"的防御式编程在后端开发中是标准做法。
 */

// 引入方案类型定义，校验通过后返回的数据需要符合这个类型
import type { Plan } from './types'

/**
 * 校验并规范化豆包返回的数据，转换为前端可安全使用的 Plan 数组
 *
 * 为什么不能直接用 JSON.parse 后的数据：TypeScript 的类型标注只是"声明"，运行时不会校验。
 * 也就是说 `as Plan` 只是骗编译器，实际数据可能缺字段或类型不对。
 * 必须手动逐个字段检查，给缺失的字段补默认值，才能保证前端不出错。
 *
 * @param data 从 AI 返回内容解析出来的原始数据（类型未知，需要逐一验证）
 * @returns 规范化后的方案数组
 * @throws 如果数据结构完全不可用，抛出错误让上层走兜底逻辑
 */
export function validatePlans(data: unknown): Plan[] {
  // 第一层校验：顶层必须是个对象
  if (!data || typeof data !== 'object') {
    throw new Error('模型返回数据格式异常：非对象')
  }

  const obj = data as Record<string, unknown>
  let plans = obj.plans

  // 容错：正常应该返回 { plans: [...] }，但有些模型可能直接返回数组 [...]，
  // 这里做一层兼容，如果 plans 不是数组但 obj 本身是数组，就直接用 obj
  if (!Array.isArray(plans)) {
    if (Array.isArray(obj)) {
      plans = obj
    } else {
      throw new Error('模型返回数据格式异常：缺少 plans 数组')
    }
  }

  // plans 为空数组或不是数组，都属于数据异常
  if (!Array.isArray(plans) || plans.length === 0) {
    throw new Error('模型返回数据格式异常：plans 为空')
  }

  // 逐个方案做字段规范化：每个字段都做类型检查，缺失的补默认值
  return (plans as unknown[]).map((raw, idx) => {
    const p = (raw || {}) as Record<string, unknown>
    // id 缺失就用 p1/p2/p3 顺序生成，保证前端有唯一标识可用
    const id = typeof p.id === 'string' ? p.id : `p${idx + 1}`
    // 标题缺失就用通用文案兜底
    const title = typeof p.title === 'string' ? p.title : `副业方案 ${idx + 1}`
    const summary = typeof p.summary === 'string' ? p.summary : ''
    // 匹配分数限制在 0-100 范围内
    const matchScore = clampScore(p.matchScore)
    // 难度归一化为「低/中/高」三种标准值
    const difficulty = normalizeDifficulty(p.difficulty)
    const estimatedIncome = typeof p.estimatedIncome === 'string' ? p.estimatedIncome : '面议'
    const pros = toStringArray(p.pros)
    const cons = toStringArray(p.cons)
    const channels = toChannelArray(p.channels)
    const guide = toGuideArray(p.guide)
    const learningResources = toLearningResourceArray(p.learningResources)
    const tags = toStringArray(p.tags)

    return { id, title, summary, matchScore, difficulty, estimatedIncome, pros, cons, channels, guide, learningResources, tags }
  })
}

/**
 * 把匹配分数约束在 0-100 的合理区间内
 * AI 可能返回负数、超过 100、或者字符串形式的数字，这里统一处理
 */
function clampScore(v: unknown): number {
  // 兼容数字和字符串两种形式；都不是就用默认值 75（中等偏上，不至于太差也不会虚高）
  const n = typeof v === 'number' ? v : typeof v === 'string' ? parseInt(v, 10) : 75
  // 解析失败（如 "abc"）也用默认值
  if (Number.isNaN(n)) return 75
  // 用 Math.max/min 把数值限制在 0-100 之间
  return Math.max(0, Math.min(100, n))
}

/**
 * 把难度字段归一化为标准枚举值「低/中/高」
 * AI 可能返回中文"低/高"，也可能返回英文"low/high"，统一处理
 */
function normalizeDifficulty(v: unknown): '低' | '中' | '高' {
  const s = typeof v === 'string' ? v : ''
  // 包含"低"或"low"就归为「低」，包含"高"或"high"就归为「高」，其余默认「中」
  if (s.includes('低') || s.toLowerCase().includes('low')) return '低'
  if (s.includes('高') || s.toLowerCase().includes('high')) return '高'
  return '中'
}

/**
 * 把任意值安全转换为字符串数组
 * 过滤掉非字符串和空字符串，只保留有效内容
 */
function toStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  // 用类型谓词（x is string）让 TypeScript 知道过滤后都是 string 类型
  return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
}

/**
 * 把原始数据转换为渠道（Channel）数组
 * 每个渠道的字段都做类型检查，缺失的给默认值或 undefined
 */
function toChannelArray(v: unknown): Plan['channels'] {
  if (!Array.isArray(v)) return []
  return v.map((raw) => {
    const c = (raw || {}) as Record<string, unknown>
    return {
      // 渠道名是必填字段，缺失就标记为「未知渠道」
      name: typeof c.name === 'string' ? c.name : '未知渠道',
      // 以下为可选字段，类型不对就设为 undefined
      type: typeof c.type === 'string' ? c.type : undefined,
      barrier: typeof c.barrier === 'string' ? c.barrier : undefined,
      incomeModel: typeof c.incomeModel === 'string' ? c.incomeModel : undefined,
    }
  })
}

/**
 * 把原始数据转换为操作指南（GuideStep）数组
 * 缺失步骤号时按数组下标自动补全，保证步骤有序
 */
function toGuideArray(v: unknown): Plan['guide'] {
  if (!Array.isArray(v)) return []
  return v.map((raw, idx) => {
    const g = (raw || {}) as Record<string, unknown>
    // 步骤号缺失就用数组下标 +1（从 1 开始计数更符合阅读习惯）
    const step = typeof g.step === 'number' ? g.step : idx + 1
    const title = typeof g.title === 'string' ? g.title : `第 ${idx + 1} 步`
    const content = typeof g.content === 'string' ? g.content : ''
    const tools = toStringArray(g.tools)
    const duration = typeof g.duration === 'string' ? g.duration : undefined
    return { step, title, content, tools, duration }
  })
}

/**
 * 把原始数据转换为学习资源（LearningResource）数组
 * 过滤掉标题为「未知资源」的无效条目，避免前端展示无意义内容
 */
function toLearningResourceArray(v: unknown): Plan['learningResources'] {
  if (!Array.isArray(v)) return []
  return v.map((raw) => {
    const r = (raw || {}) as Record<string, unknown>
    return {
      platform: typeof r.platform === 'string' ? r.platform : '未知平台',
      type: typeof r.type === 'string' ? r.type : '资源',
      // title 缺失标记为「未知资源」，后面会被 filter 过滤掉
      title: typeof r.title === 'string' ? r.title : '未知资源',
      description: typeof r.description === 'string' ? r.description : '',
      keyword: typeof r.keyword === 'string' ? r.keyword : undefined,
    }
    // 过滤掉 title 为「未知资源」的条目，这些是无效数据不值得展示
  }).filter((r) => r.title !== '未知资源')
}
