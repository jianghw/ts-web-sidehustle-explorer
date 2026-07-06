/**
 * 文件用途：副业发展路径树的自定义 Hook。
 * 封装"调用后端生成路径树 + 状态管理 + 错误处理"的完整流程。
 */

import { useState, useCallback } from 'react'
import type { SideHustleTree } from '@/types/career'
import { fetchSideHustleTree } from '@/services/careerApi'

export function useSideHustleTree() {
  const [tree, setTree] = useState<SideHustleTree | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateTree = useCallback(async (title: string, summary: string, skills: string[]) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchSideHustleTree(title, summary, skills)
      setTree(result)
      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : '生成路径树失败'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { tree, loading, error, generateTree }
}
