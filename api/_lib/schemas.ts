import type { Plan } from './types'

/**
 * 运行时校验豆包返回的数据结构，做容错处理。
 * 防止 LLM 输出不规范导致前端崩溃。
 */
export function validatePlans(data: unknown): Plan[] {
  if (!data || typeof data !== 'object') {
    throw new Error('模型返回数据格式异常：非对象')
  }

  const obj = data as Record<string, unknown>
  let plans = obj.plans

  // 容错：某些模型可能直接返回数组而非 { plans: [] }
  if (!Array.isArray(plans)) {
    if (Array.isArray(obj)) {
      plans = obj
    } else {
      throw new Error('模型返回数据格式异常：缺少 plans 数组')
    }
  }

  if (!Array.isArray(plans) || plans.length === 0) {
    throw new Error('模型返回数据格式异常：plans 为空')
  }

  return (plans as unknown[]).map((raw, idx) => {
    const p = (raw || {}) as Record<string, unknown>
    const id = typeof p.id === 'string' ? p.id : `p${idx + 1}`
    const title = typeof p.title === 'string' ? p.title : `副业方案 ${idx + 1}`
    const summary = typeof p.summary === 'string' ? p.summary : ''
    const matchScore = clampScore(p.matchScore)
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

function clampScore(v: unknown): number {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? parseInt(v, 10) : 75
  if (Number.isNaN(n)) return 75
  return Math.max(0, Math.min(100, n))
}

function normalizeDifficulty(v: unknown): '低' | '中' | '高' {
  const s = typeof v === 'string' ? v : ''
  if (s.includes('低') || s.toLowerCase().includes('low')) return '低'
  if (s.includes('高') || s.toLowerCase().includes('high')) return '高'
  return '中'
}

function toStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
}

function toChannelArray(v: unknown): Plan['channels'] {
  if (!Array.isArray(v)) return []
  return v.map((raw) => {
    const c = (raw || {}) as Record<string, unknown>
    return {
      name: typeof c.name === 'string' ? c.name : '未知渠道',
      type: typeof c.type === 'string' ? c.type : undefined,
      barrier: typeof c.barrier === 'string' ? c.barrier : undefined,
      incomeModel: typeof c.incomeModel === 'string' ? c.incomeModel : undefined,
    }
  })
}

function toGuideArray(v: unknown): Plan['guide'] {
  if (!Array.isArray(v)) return []
  return v.map((raw, idx) => {
    const g = (raw || {}) as Record<string, unknown>
    const step = typeof g.step === 'number' ? g.step : idx + 1
    const title = typeof g.title === 'string' ? g.title : `第 ${idx + 1} 步`
    const content = typeof g.content === 'string' ? g.content : ''
    const tools = toStringArray(g.tools)
    const duration = typeof g.duration === 'string' ? g.duration : undefined
    return { step, title, content, tools, duration }
  })
}

function toLearningResourceArray(v: unknown): Plan['learningResources'] {
  if (!Array.isArray(v)) return []
  return v.map((raw) => {
    const r = (raw || {}) as Record<string, unknown>
    return {
      platform: typeof r.platform === 'string' ? r.platform : '未知平台',
      type: typeof r.type === 'string' ? r.type : '资源',
      title: typeof r.title === 'string' ? r.title : '未知资源',
      description: typeof r.description === 'string' ? r.description : '',
      keyword: typeof r.keyword === 'string' ? r.keyword : undefined,
    }
  }).filter((r) => r.title !== '未知资源')
}
