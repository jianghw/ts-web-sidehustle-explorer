/**
 * 文件用途：职业洞察分析的自定义 Hook。
 * 封装"调用后端获取职业洞察 + 状态管理 + 错误处理"的完整流程。
 * 与 useGenerate 的设计模式一致。
 */

import { useState, useCallback } from 'react'
import type { CareerInsightsResponse } from '@/types/career'
import { fetchCareerInsights } from '@/services/careerApi'

export function useCareerInsights() {
  const [insights, setInsights] = useState<CareerInsightsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (skills: string[]) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchCareerInsights(skills)
      setInsights(result)
      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : '分析失败'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { insights, loading, error, analyze }
}
