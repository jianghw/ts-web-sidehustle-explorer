/**
 * 文件用途：应用的全局状态管理（使用 Zustand 库）。
 * 在这里集中存放"整个应用共享的数据"——比如用户填的问卷信息、生成的方案列表、
 * 加载状态和错误信息。任何页面都能读取或修改这些数据，无需一层层传递。
 */

// create：Zustand 库的核心函数，用于"创建"一个全局状态仓库
import { create } from 'zustand'
// 引入数据类型定义，让状态仓库有类型检查，写错字段名时能及时提醒
import type { Profile, Plan } from '@/types'

/**
 * AppState：定义全局状态的"形状"——包含哪些数据字段和操作方法。
 * - 数据字段：存放实际的值（如 profile、plans）
 * - 操作方法：修改这些值的函数（如 setProfile、reset）
 */
interface AppState {
  profile: Profile | null    // 用户画像。null 表示用户还没填问卷；填好后存入对象
  plans: Plan[]              // 生成的方案列表。空数组表示还没生成过
  loading: boolean           // 是否正在加载（生成方案时为 true，用于显示加载动画）
  error: string | null       // 错误信息。null 表示无错误；有值时页面可据此显示错误提示
  // 下面是一组 setter 方法。Zustand 的习惯是每个字段配一个 setter，职责清晰
  setProfile: (p: Profile | null) => void   // 设置/清空用户画像
  setPlans: (p: Plan[]) => void             // 设置方案列表
  setLoading: (v: boolean) => void          // 切换加载状态
  setError: (e: string | null) => void      // 设置/清空错误信息
  reset: () => void                          // 一键重置所有状态（如用户重新开始）
}

/**
 * useAppStore：创建并导出全局状态仓库。
 * 任何组件调用 useAppStore(...) 就能读取或修改其中的数据。
 *
 * create 接收一个函数，参数 set 是"更新状态"的方法。
 * 调用 set({ ... }) 即可修改对应字段，组件会自动重新渲染显示最新数据。
 */
export const useAppStore = create<AppState>((set) => ({
  // —— 初始值：应用刚启动时的默认状态 ——
  profile: null,             // 初始没有用户画像
  plans: [],                 // 初始没有方案
  loading: false,            // 初始不在加载中
  error: null,               // 初始无错误

  // —— 操作方法 ——
  // 每个 setter 都只是简单地用新值覆盖旧值
  setProfile: (profile) => set({ profile }),
  setPlans: (plans) => set({ plans }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  // 重置：把所有字段恢复到初始值。
  // 用户想"重新填写问卷、重新生成"时会用到，确保旧数据不残留
  reset: () => set({ profile: null, plans: [], loading: false, error: null }),
}))
