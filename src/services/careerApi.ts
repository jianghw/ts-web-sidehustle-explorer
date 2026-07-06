/**
 * 文件用途：职业洞察和副业发展路径树的前端 API 服务。
 * 负责与后端 /api/analyze 和 /api/tree 接口通信。
 * 与 api.ts（方案生成服务）设计一致：超时控制、错误处理、类型安全。
 */

import type { CareerInsightsResponse, SideHustleTree } from '@/types/career'

/**
 * 调用后端获取职业洞察分析
 * @param skills 用户选择的职业/技能列表
 * @returns 职业洞察结果（趋势、新型副业预测、职业分析）
 */
export async function fetchCareerInsights(skills: string[]): Promise<CareerInsightsResponse> {
  const ctrl = new AbortController()
  const timeout = setTimeout(() => ctrl.abort(), 60_000)

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills }),
      signal: ctrl.signal,
    })

    if (!res.ok) {
      const msg = await safeExtractError(res)
      throw new Error(msg)
    }

    const data: CareerInsightsResponse = await res.json()
    if (data.error) {
      throw new Error(data.error)
    }

    return data
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('请求超时，请检查网络后重试')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * 调用后端获取副业发展路径树
 * @param title 副业方案标题
 * @param summary 方案简介
 * @param skills 相关技能列表
 * @returns 树形发展路径数据
 */
export async function fetchSideHustleTree(
  title: string,
  summary: string,
  skills: string[],
): Promise<SideHustleTree> {
  const ctrl = new AbortController()
  const timeout = setTimeout(() => ctrl.abort(), 60_000)

  try {
    const res = await fetch('/api/tree', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, summary, skills }),
      signal: ctrl.signal,
    })

    if (!res.ok) {
      const msg = await safeExtractError(res)
      throw new Error(msg)
    }

    const data = await res.json()
    if (data.error) {
      throw new Error(data.error)
    }

    return data as SideHustleTree
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('请求超时，请检查网络后重试')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * 安全提取错误信息（与 api.ts 中相同的逻辑）
 */
async function safeExtractError(res: Response): Promise<string> {
  try {
    const data = await res.json()
    return data?.error || `请求失败（${res.status}）`
  } catch {
    return `请求失败（${res.status}）`
  }
}
