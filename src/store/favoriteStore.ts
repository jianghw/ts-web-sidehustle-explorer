import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Plan } from '@/types'

/**
 * 收藏 Store（独立于 appStore）
 * - 使用 persist 中间件持久化到 localStorage，跨会话保留
 * - 不并入 appStore，因为 appStore.reset() 会清空所有字段，收藏是跨会话持久态
 * - 存完整 Plan 对象，换一批后即使 plans 变化，收藏仍可独立查看
 */
interface FavoriteState {
  favorites: Record<string, Plan>
  toggleFavorite: (plan: Plan) => void
  isFavorite: (id: string) => boolean
  removeFavorite: (id: string) => void
  clearFavorites: () => void
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: {},
      toggleFavorite: (plan) =>
        set((s) => {
          const next = { ...s.favorites }
          if (next[plan.id]) delete next[plan.id]
          else next[plan.id] = plan
          return { favorites: next }
        }),
      isFavorite: (id) => Boolean(get().favorites[id]),
      removeFavorite: (id) =>
        set((s) => {
          const next = { ...s.favorites }
          delete next[id]
          return { favorites: next }
        }),
      clearFavorites: () => set({ favorites: {} }),
    }),
    { name: 'side-hustle-favorites' },
  ),
)
