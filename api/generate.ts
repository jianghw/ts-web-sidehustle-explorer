/**
 * @file generate.ts —— 副业方案生成接口（后端核心入口）
 * @description 这是部署在 Vercel 上的 Serverless Function（无服务器函数），
 *              当前端用户提交自己的技能、时间等信息后，会调用这个接口，
 *              由它去请求豆包 AI 大模型，最终返回 3 个个性化的副业赚钱方案。
 */

// 引入豆包 AI 的调用封装。豆包（火山方舟 Ark）兼容 OpenAI 接口，这里把调用逻辑抽到单独文件便于维护
import { callDoubao } from './_lib/ark'
// 引入提示词构建函数。把用户填写的信息转换成 AI 能理解的 prompt，提示词质量直接决定生成方案的质量
import { buildSystemPrompt, buildUserPrompt } from './_lib/prompt'
// 引入数据校验函数。AI 返回的内容不一定 100% 规范，需要校验和兜底处理，避免前端拿到坏数据崩溃
import { validatePlans } from './_lib/schemas'
// 引入用户画像类型定义。纯类型引入（type-only import），不占用运行时体积
import type { Profile } from './_lib/types'

// ============================================================
// 简易内存限流模块
// 作用：防止恶意用户短时间疯狂调用接口，既浪费 AI 额度又拖慢服务
// 原理：用内存 Map 记录每个 IP 在近 1 分钟内的请求次数，超过上限就拒绝
// 局限：Vercel Hobby 免费版是单实例的，内存限流够用；如果是多实例生产环境需要换 Redis
// ============================================================

// 限流时间窗口：1 分钟（60_000 是 60000 毫秒的写法，下划线只是方便读数）
const RATE_LIMIT_WINDOW_MS = 60_000
// 在时间窗口内允许的最大请求次数：1 分钟最多 10 次
const RATE_LIMIT_MAX = 10
// 存储每个 IP 的请求时间戳数组。key 是 IP 地址，value 是该 IP 历次请求的时间戳列表
const hits = new Map<string, number[]>()

/**
 * 检查某个 IP 是否还在允许的请求频率内
 * @param key 通常是客户端的 IP 地址
 * @returns true 表示放行，false 表示已超限需要拒绝
 */
function checkRateLimit(key: string): boolean {
  const now = Date.now() // 当前时间戳（毫秒）

  // 取出该 IP 的历史请求记录，过滤掉超过 1 分钟窗口的旧记录（只保留最近的）
  const arr = (hits.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)

  // 如果过滤后还有 >= 10 条记录，说明这一分钟内已经请求够多次了，拒绝
  if (arr.length >= RATE_LIMIT_MAX) {
    hits.set(key, arr)
    return false
  }

  // 否则放行，并把这次请求的时间戳追加到记录里
  arr.push(now)
  hits.set(key, arr)
  return true
}

// ============================================================
// 主请求处理函数
// Vercel Serverless Function 入口：POST /api/generate
// 使用 Web 标准 Request/Response 签名（{ fetch } 对象形式，Vercel 官方推荐写法）
// 这种写法的好处是符合 Web 标准，未来迁移到其他平台（如 Cloudflare）改动最小
// ============================================================
async function handleRequest(req: Request): Promise<Response> {
  // ---------- CORS 预检与 Method 校验 ----------
  // 浏览器在跨域 POST 请求前会先发一个 OPTIONS 预检请求，这里直接放行
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        // 允许任何网站跨域访问（开发阶段方便，生产建议限制为具体域名）
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  // 只接受 POST 请求，GET/PUT 等一律拒绝
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method Not Allowed，请使用 POST' }, { status: 405 })
  }

  // ---------- 限流检查 ----------
  // 从请求头获取客户端真实 IP。Vercel 会把原始 IP 放在 x-forwarded-for 头里
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]
    || req.headers.get('x-real-ip')
    || 'unknown'
  // 如果这个 IP 1 分钟内请求超过 10 次，返回 429（请求过多）
  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: '请求过于频繁，请稍后再试' },
      { status: 429, headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  }

  // ---------- 核心业务逻辑 ----------
  try {
    // 从请求体解析 JSON，期望收到 { profile: {...} } 结构
    const body = (await req.json()) as { profile?: Profile }
    const profile = body?.profile

    // 基础参数校验：profile 必须存在且 skills 必须是数组
    if (!profile || !profile.skills || !Array.isArray(profile.skills)) {
      return Response.json({ error: '请求参数无效：缺少 profile 或 skills' }, { status: 400 })
    }

    // 构建发给 AI 的系统提示词（定义 AI 的角色和输出格式要求）
    const system = buildSystemPrompt()
    // 构建发给 AI 的用户提示词（把用户的技能、时间、预算等信息拼装进去）
    const user = buildUserPrompt(profile)

    // 调用豆包 AI 生成方案。网络/服务偶尔会抖动，所以最多重试 1 次
    let raw: string
    try {
      raw = await callDoubao(system, user)
    } catch (firstErr) {
      // 第一次调用失败，打印警告日志后重试一次
      console.warn('[generate] 首次调用失败，重试中...', firstErr)
      raw = await callDoubao(system, user)
    }

    // ---------- 解析与校验 AI 返回内容 ----------
    let parsed: unknown
    try {
      // 正常情况下 AI 返回的是合法 JSON 字符串，直接解析
      parsed = JSON.parse(raw)
    } catch {
      // 容错处理：万一 AI 返回了多余的文字包裹着 JSON，尝试用正则把 JSON 部分提取出来
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        parsed = JSON.parse(match[0])
      } else {
        // 既不是合法 JSON 又提取不到 JSON 结构，只能报错
        throw new Error('模型返回内容无法解析为 JSON')
      }
    }

    // 对解析出来的数据做结构校验和字段兜底，确保返回给前端的是规范数据
    const plans = validatePlans(parsed)
    console.log(`[generate] 成功生成 ${plans.length} 个方案`)

    // 成功返回方案列表
    return Response.json({ plans }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
  } catch (err) {
    // ---------- 错误处理与兜底 ----------
    const msg = err instanceof Error ? err.message : '未知错误'
    console.error('[generate] 失败:', msg)

    // 特殊兜底：如果失败原因是「API Key 未配置」，返回 mock 假数据，方便本地开发演示
    if (msg.includes('未配置')) {
      console.warn('[generate] 使用 mock 数据 fallback（API Key 未配置）')
      // 动态引入 mock 模块，只有真正用到时才加载，减少冷启动时间
      const { getMockPlans } = await import('./_lib/mock')
      return Response.json({ plans: getMockPlans() }, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
    }

    // 其他错误返回 500，把错误信息透传给前端
    return Response.json({ error: `生成方案失败：${msg}` }, { status: 500 })
  }
}

// Vercel 官方推荐：使用 { fetch } 对象形式导出，Vercel 会自动识别并作为 Serverless Function 部署
export default { fetch: handleRequest }
