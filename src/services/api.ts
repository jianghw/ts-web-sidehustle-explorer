import type { GenerateResponse, Plan, Profile } from '@/types'

/**
 * 调用 BFF 接口生成副业方案
 * API Key 在服务端，前端不接触密钥
 */
export async function generatePlans(profile: Profile): Promise<Plan[]> {
  const ctrl = new AbortController()
  const timeout = setTimeout(() => ctrl.abort(), 60_000)

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
      signal: ctrl.signal,
    })

    if (!res.ok) {
      const msg = await safeExtractError(res)
      throw new Error(msg)
    }

    const data: GenerateResponse = await res.json()
    if (data.error) {
      throw new Error(data.error)
    }
    if (!Array.isArray(data.plans) || data.plans.length === 0) {
      throw new Error('未生成任何方案，请重试')
    }
    return data.plans
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('请求超时，请检查网络后重试')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

async function safeExtractError(res: Response): Promise<string> {
  try {
    const data = await res.json()
    return data?.error || `请求失败（${res.status}）`
  } catch {
    return `请求失败（${res.status}）`
  }
}
