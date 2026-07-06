/**
 * @file analyze.ts —— 职业洞察分析接口（Feature 2 后端入口）
 * @description Vercel Serverless Function：POST /api/analyze
 *              接收用户选择的职业方向，调用豆包 AI 分析行业趋势、
 *              预测新型副业、做职业技能深度分析。
 *              使用与 generate.ts 相同的 { fetch } 对象签名。
 */

import { callDoubao } from './_lib/ark'
import { buildCareerSystemPrompt, buildCareerUserPrompt } from './_lib/careerPrompt'

// 简易内存限流（与 generate.ts 一致的设计）
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 10
const hits = new Map<string, number[]>()

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const arr = (hits.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (arr.length >= RATE_LIMIT_MAX) {
    hits.set(key, arr)
    return false
  }
  arr.push(now)
  hits.set(key, arr)
  return true
}

async function handleRequest(req: Request): Promise<Response> {
  // CORS 预检
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method Not Allowed，请使用 POST' }, { status: 405 })
  }

  // 限流
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]
    || req.headers.get('x-real-ip')
    || 'unknown'
  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: '请求过于频繁，请稍后再试' },
      { status: 429, headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  }

  try {
    const body = (await req.json()) as { skills?: string[] }
    const skills = body?.skills

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return Response.json({ error: '请求参数无效：缺少 skills' }, { status: 400 })
    }

    const system = buildCareerSystemPrompt()
    const user = buildCareerUserPrompt(skills)

    let raw: string
    try {
      raw = await callDoubao(system, user)
    } catch (firstErr) {
      console.warn('[analyze] 首次调用失败，重试中...', firstErr)
      raw = await callDoubao(system, user)
    }

    // 解析 AI 返回的 JSON
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        parsed = JSON.parse(match[0])
      } else {
        throw new Error('模型返回内容无法解析为 JSON')
      }
    }

    // 规范化数据：确保各字段存在且类型正确
    const result = normalizeInsights(parsed)
    console.log(`[analyze] 成功分析 ${result.trends.length} 个趋势，${result.emergingHustles.length} 个新型副业`)

    return Response.json(result, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '未知错误'
    console.error('[analyze] 失败:', msg)

    if (msg.includes('未配置')) {
      console.warn('[analyze] 使用 mock 数据 fallback')
      const { getMockCareerInsights } = await import('./_lib/careerMock')
      return Response.json(getMockCareerInsights(), {
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
    }

    return Response.json({ error: `分析失败：${msg}` }, { status: 500 })
  }
}

/**
 * 规范化 AI 返回的洞察数据，确保字段完整
 */
function normalizeInsights(data: unknown) {
  const obj = (data || {}) as Record<string, unknown>

  const trends = Array.isArray(obj.trends) ? obj.trends.map((raw: unknown, i: number) => {
    const t = (raw || {}) as Record<string, unknown>
    return {
      trend: typeof t.trend === 'string' ? t.trend : `趋势 ${i + 1}`,
      description: typeof t.description === 'string' ? t.description : '',
      growthRate: typeof t.growthRate === 'string' ? t.growthRate : '',
      relatedFields: Array.isArray(t.relatedFields) ? t.relatedFields.filter((x: unknown) => typeof x === 'string') : [],
      opportunity: typeof t.opportunity === 'string' ? t.opportunity : '',
    }
  }) : []

  const emergingHustles = Array.isArray(obj.emergingHustles) ? obj.emergingHustles.map((raw: unknown, i: number) => {
    const h = (raw || {}) as Record<string, unknown>
    return {
      name: typeof h.name === 'string' ? h.name : `新型副业 ${i + 1}`,
      category: typeof h.category === 'string' ? h.category : '其他',
      description: typeof h.description === 'string' ? h.description : '',
      whyEmerging: typeof h.whyEmerging === 'string' ? h.whyEmerging : '',
      potentialIncome: typeof h.potentialIncome === 'string' ? h.potentialIncome : '面议',
      difficulty: typeof h.difficulty === 'string' ? h.difficulty : '中',
      entryBarrier: typeof h.entryBarrier === 'string' ? h.entryBarrier : '',
      skills: Array.isArray(h.skills) ? h.skills.filter((x: unknown) => typeof x === 'string') : [],
      timeToStart: typeof h.timeToStart === 'string' ? h.timeToStart : '',
      riskLevel: typeof h.riskLevel === 'string' ? h.riskLevel : '中',
    }
  }) : []

  const careerAnalysis = Array.isArray(obj.careerAnalysis) ? obj.careerAnalysis.map((raw: unknown, i: number) => {
    const c = (raw || {}) as Record<string, unknown>
    return {
      careerName: typeof c.careerName === 'string' ? c.careerName : `职业 ${i + 1}`,
      marketDemand: typeof c.marketDemand === 'string' ? c.marketDemand : '',
      incomePotential: typeof c.incomePotential === 'string' ? c.incomePotential : '',
      competitionLevel: typeof c.competitionLevel === 'string' ? c.competitionLevel : '',
      growthOutlook: typeof c.growthOutlook === 'string' ? c.growthOutlook : '',
      keySkills: Array.isArray(c.keySkills) ? c.keySkills.filter((x: unknown) => typeof x === 'string') : [],
      recommendedPlatforms: Array.isArray(c.recommendedPlatforms) ? c.recommendedPlatforms.filter((x: unknown) => typeof x === 'string') : [],
      tips: Array.isArray(c.tips) ? c.tips.filter((x: unknown) => typeof x === 'string') : [],
    }
  }) : []

  const summary = typeof obj.summary === 'string' ? obj.summary : ''

  return { trends, emergingHustles, careerAnalysis, summary }
}

export default { fetch: handleRequest }
