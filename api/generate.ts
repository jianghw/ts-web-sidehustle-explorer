import { callDoubao } from './_lib/ark'
import { buildSystemPrompt, buildUserPrompt } from './_lib/prompt'
import { validatePlans } from './_lib/schemas'
import type { Profile } from './_lib/types'

// 简易内存限流（Vercel Hobby 单实例够用；生产应换 Redis）
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

// Vercel Serverless Function: POST /api/generate
// 使用 Web 标准 Request/Response 签名（{ fetch } 对象形式，Vercel 官方推荐）
async function handleRequest(req: Request): Promise<Response> {
  // CORS 与 Method 校验
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

  // 限流检查
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
    const body = (await req.json()) as { profile?: Profile }
    const profile = body?.profile

    if (!profile || !profile.skills || !Array.isArray(profile.skills)) {
      return Response.json({ error: '请求参数无效：缺少 profile 或 skills' }, { status: 400 })
    }

    const system = buildSystemPrompt()
    const user = buildUserPrompt(profile)

    // 调用豆包，最多重试 1 次
    let raw: string
    try {
      raw = await callDoubao(system, user)
    } catch (firstErr) {
      console.warn('[generate] 首次调用失败，重试中...', firstErr)
      raw = await callDoubao(system, user)
    }

    // 解析与校验
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      // 容错：尝试从文本中提取 JSON
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        parsed = JSON.parse(match[0])
      } else {
        throw new Error('模型返回内容无法解析为 JSON')
      }
    }

    const plans = validatePlans(parsed)
    console.log(`[generate] 成功生成 ${plans.length} 个方案`)

    return Response.json({ plans }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '未知错误'
    console.error('[generate] 失败:', msg)

    // fallback：API Key 未配置时返回 mock 数据，便于演示和本地开发
    if (msg.includes('未配置')) {
      console.warn('[generate] 使用 mock 数据 fallback（API Key 未配置）')
      const { getMockPlans } = await import('./_lib/mock')
      return Response.json({ plans: getMockPlans() }, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
    }

    return Response.json({ error: `生成方案失败：${msg}` }, { status: 500 })
  }
}

// Vercel 官方推荐：使用 { fetch } 对象形式导出
export default { fetch: handleRequest }
