import { useCallback } from 'react'
import { useAppStore } from '@/store/appStore'
import { generatePlans } from '@/services/api'
import type { Profile } from '@/types'

export function useGenerate() {
  const plans = useAppStore((s) => s.plans)
  const loading = useAppStore((s) => s.loading)
  const error = useAppStore((s) => s.error)
  const setPlans = useAppStore((s) => s.setPlans)
  const setLoading = useAppStore((s) => s.setLoading)
  const setError = useAppStore((s) => s.setError)

  const generate = useCallback(
    async (profile: Profile) => {
      setLoading(true)
      setError(null)
      try {
        const result = await generatePlans(profile)
        setPlans(result)
        return result
      } catch (err) {
        const msg = err instanceof Error ? err.message : '生成失败'
        setError(msg)
        return []
      } finally {
        setLoading(false)
      }
    },
    [setPlans, setLoading, setError],
  )

  return { plans, loading, error, generate }
}
