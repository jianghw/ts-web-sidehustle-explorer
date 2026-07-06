/**
 * 文件用途：收藏功能的便捷 Hook（自定义 React 钩子）。
 * 它把"某个方案是否被收藏"和"切换收藏"这两个能力打包在一起，
 * 让组件只需一行代码就能使用收藏功能，不用每次都手动从 store 里取数据。
 * 你可以把它理解为收藏功能的"快捷入口"。
 */

// 引入收藏状态仓库，这个 hook 内部就是对它做了一层封装
import { useFavoriteStore } from '@/store/favoriteStore'
// 引入方案的数据类型，用于约束 toggle 方法接收的参数类型
import type { Plan } from '@/types'

/**
 * 按 planId 订阅收藏状态的薄封装 hook
 * 设计说明（为什么这样做）：
 * - 避免组件直接写 useFavoriteStore((s) => s.favorites[id]) 这种样板代码
 * - 统一收藏相关的读取和操作入口，降低组件使用心智负担
 *
 * @param planId 要查询的方案 id
 * @returns { isFavorite, toggle } isFavorite 表示是否已收藏；toggle 用于切换收藏状态
 */
export function useFavorite(planId: string) {
  // 订阅"这个方案是否已被收藏"。当收藏状态变化时，组件会自动重新渲染
  // Boolean(...) 确保返回的是 true/false，而不是 undefined（当方案不在收藏列表时）
  const isFavorite = useFavoriteStore((s) => Boolean(s.favorites[planId]))
  // 取出 toggleFavorite 方法。这个方法引用稳定，不会导致不必要的重新渲染
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite)
  return {
    isFavorite,
    // 对外暴露一个更简短的 toggle 方法名，调用时传入完整的方案对象
    toggle: (plan: Plan) => toggleFavorite(plan),
  }
}
