/**
 * @file tree.ts —— 副业发展路径树生成接口（Feature 3 后端入口）
 * @description Vercel Serverless Function：POST /api/tree
 *              接收副业方案信息，调用豆包 AI 生成树形发展路径图。
 *              使用与 generate.ts 相同的 { fetch } 对象签名。
 */

import { callDoubao } from './_lib/ark'
import { buildTreeSystemPrompt, buildTreeUserPrompt } from './_lib/careerPrompt'

// 简易内存限流
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
    const body = (await req.json()) as { title?: string; summary?: string; skills?: string[] }
    const title = body?.title
    const summary = body?.summary || ''
    const skills = body?.skills || []

    if (!title) {
      return Response.json({ error: '请求参数无效：缺少 title' }, { status: 400 })
    }

    const system = buildTreeSystemPrompt()
    const user = buildTreeUserPrompt(title, summary, skills)

    let raw: string
    try {
      raw = await callDoubao(system, user)
    } catch (firstErr) {
      console.warn('[tree] 首次调用失败，重试中...', firstErr)
      raw = await callDoubao(system, user)
    }

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

    const result = normalizeTree(parsed)
    console.log(`[tree] 成功生成发展路径树: ${result.title}`)

    return Response.json(result, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '未知错误'
    console.error('[tree] 失败:', msg)

    if (msg.includes('未配置')) {
      console.warn('[tree] 使用 mock 数据 fallback')
      const { getMockSideHustleTree } = await import('./_lib/careerMock')
      return Response.json(getMockSideHustleTree(), {
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
    }

    return Response.json({ error: `生成路径树失败：${msg}` }, { status: 500 })
  }
}

/**
 * 递归规范化树节点数据
 */
function normalizeNode(raw: unknown, idx: number = 0): SideHustleTreeNode {
  const n = (raw || {}) as Record<string, unknown>
  const levels = ['starter', 'growth', 'expert', 'master'] as const
  const levelVal = typeof n.level === 'string' && levels.includes(n.level as typeof levels[number])
    ? n.level as typeof levels[number]
    : levels[Math.min(idx, 3)]

  return {
    id: typeof n.id === 'string' ? n.id : `n${idx + 1}`,
    label: typeof n.label === 'string' ? n.label : `阶段 ${idx + 1}`,
    level: levelVal,
    description: typeof n.description === 'string' ? n.description : '',
    income: typeof n.income === 'string' ? n.income : '',
    skills: Array.isArray(n.skills) ? n.skills.filter((x: unknown) => typeof x === 'string') : [],
    duration: typeof n.duration === 'string' ? n.duration : '',
    children: Array.isArray(n.children) ? n.children.map((c: unknown, i: number) => normalizeNode(c, idx + 1 + i)) : undefined,
  }
}

/**
 * 规范化树数据
 */
function normalizeTree(data: unknown) {
  const obj = (data || {}) as Record<string, unknown>
  return {
    title: typeof obj.title === 'string' ? obj.title : '副业发展路径',
    description: typeof obj.description === 'string' ? obj.description : '',
    root: normalizeNode(obj.root, 0),
  }
}

// 类型引入（仅用于 normalizeNode 的返回类型）
import type { SideHustleTreeNode } from '../src/types/career'

export default { fetch: handleRequest }
