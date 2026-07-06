/**
 * 文件用途：管理用户"收藏"功能的全局状态。
 * 用户在浏览副业方案时，可以把感兴趣的方案收藏起来，方便以后查看。
 * 这个文件负责记录"哪些方案被收藏了"，并提供收藏/取消收藏等操作。
 */

// create：Zustand 库的核心函数，用于创建全局状态仓库
import { create } from 'zustand'
// persist：Zustand 的"持久化"中间件。
// 它会自动把状态保存到浏览器的 localStorage 里，这样即使关闭页面、重新打开，
// 收藏的数据依然还在，不会丢失
import { persist } from 'zustand/middleware'
// 引入方案的数据类型定义
import type { Plan } from '@/types'

/**
 * 收藏 Store（独立于 appStore）
 * 设计说明（为什么这样设计）：
 * - 使用 persist 中间件持久化到 localStorage，跨会话保留：收藏是用户长期积累的，不能因为刷新或关闭而消失
 * - 不并入 appStore：因为 appStore.reset() 会清空所有字段，而收藏是跨会话的持久态，
 *   两者生命周期不同，放在一起会导致重置问卷时误清收藏
 * - 存完整 Plan 对象（而非只存 id）：换一批方案后即使 plans 列表变化，收藏仍可独立查看完整内容
 */
interface FavoriteState {
  // 用"键值对"（对象）存储收藏，key 是方案 id，value 是完整方案对象。
  // 相比数组，用对象的好处是查找/删除某个方案时非常快（直接用 id 定位）
  favorites: Record<string, Plan>
  toggleFavorite: (plan: Plan) => void   // 切换收藏状态：已收藏则取消，未收藏则添加
  isFavorite: (id: string) => boolean     // 判断某个方案是否已被收藏
  removeFavorite: (id: string) => void    // 移除某个收藏
  clearFavorites: () => void              // 清空所有收藏
}

/**
 * useFavoriteStore：创建并导出收藏状态仓库。
 *
 * 注意末尾的 ()()：第一层括号是 TypeScript 类型参数，第二层括号是实际调用。
 * 这是使用 persist 中间件时的标准写法。
 *
 * persist 的第二个参数 { name: 'side-hustle-favorites' } 指定了
 * 在 localStorage 中保存时使用的键名，避免与其他应用的数据冲突。
 */
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      // 初始收藏为空对象（没有任何收藏）
      favorites: {},

      // 切换收藏：如果已收藏则移除，未收藏则添加。
      // 这样一个方法就能实现"点一下收藏，再点一下取消"的交互
      toggleFavorite: (plan) =>
        set((s) => {
          // 先复制一份现有收藏（不可变更新原则：不直接修改原对象）
          const next = { ...s.favorites }
          // 如果这个方案已经在收藏里，就删掉它（即取消收藏）
          if (next[plan.id]) delete next[plan.id]
          // 如果不在收藏里，就添加进去（即收藏）
          else next[plan.id] = plan
          return { favorites: next }
        }),

      // 判断是否已收藏：直接检查对象中有没有这个 id 对应的值
      // get() 用于在方法内部读取当前最新状态
      isFavorite: (id) => Boolean(get().favorites[id]),

      // 移除单个收藏：复制后删除指定 id，再返回新对象
      removeFavorite: (id) =>
        set((s) => {
          const next = { ...s.favorites }
          delete next[id]
          return { favorites: next }
        }),

      // 清空所有收藏：直接把 favorites 设为空对象
      clearFavorites: () => set({ favorites: {} }),
    }),
    // 持久化配置：指定 localStorage 中的存储键名
    { name: 'side-hustle-favorites' },
  ),
)
