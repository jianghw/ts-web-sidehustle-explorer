import { useFavoriteStore } from '@/store/favoriteStore'
import type { Plan } from '@/types'

/**
 * 按 planId 订阅收藏状态的薄封装 hook
 * 避免组件直接写 useFavoriteStore((s) => s.favorites[id]) 样板
 */
export function useFavorite(planId: string) {
  const isFavorite = useFavoriteStore((s) => Boolean(s.favorites[planId]))
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite)
  return {
    isFavorite,
    toggle: (plan: Plan) => toggleFavorite(plan),
  }
}
