/**
 * 文件用途：生成副业方案的便捷 Hook（自定义 React 钩子）。
 * 它把"调用后端 API 生成方案 + 更新加载状态 + 处理错误"这套流程打包在一起，
 * 让页面组件只需调用一个 generate() 函数就能完成方案生成，不用关心内部细节。
 * 你可以把它理解为"生成方案"功能的总调度器。
 */

// useCallback：React 的性能优化钩子。
// 它能"记住"一个函数，避免每次组件重新渲染时都创建新的函数实例，
// 从而防止依赖这个函数的子组件做无意义的重新渲染
import { useCallback } from 'react'
// 引入全局状态仓库，用于读取和更新方案数据、加载状态、错误信息
import { useAppStore } from '@/store/appStore'
// 引入真正发请求的 API 函数，这个 hook 内部会调用它
import { generatePlans } from '@/services/api'
// 引入用户画像类型，约束 generate 方法接收的参数
import type { Profile } from '@/types'

/**
 * 生成方案的 hook
 * @returns { plans, loading, error, generate }
 *   - plans：当前已生成的方案列表（供页面展示）
 *   - loading：是否正在生成中（供页面显示加载动画）
 *   - error：错误信息（供页面显示错误提示）
 *   - generate：触发生成的函数，传入用户画像即可开始生成
 */
export function useGenerate() {
  // 从全局状态仓库中分别取出需要的数据和操作方法。
  // 注意：这里每行单独订阅一个字段，而不是一次性取整个 store，
  // 这样只有当对应字段变化时组件才会重新渲染，避免不必要的渲染开销
  const plans = useAppStore((s) => s.plans)
  const loading = useAppStore((s) => s.loading)
  const error = useAppStore((s) => s.error)
  const setPlans = useAppStore((s) => s.setPlans)
  const setLoading = useAppStore((s) => s.setLoading)
  const setError = useAppStore((s) => s.setError)

  // generate：核心生成函数。用 useCallback 包裹保证函数引用稳定。
  // 这是一个 async 异步函数，因为要等待后端返回结果
  const generate = useCallback(
    async (profile: Profile) => {
      // 1. 开始生成：先标记为"加载中"并清除之前的错误信息
      setLoading(true)
      setError(null)
      try {
        // 2. 调用 API 发送请求，等待后端返回方案列表
        const result = await generatePlans(profile)
        // 3. 成功：把方案存入全局状态，页面会自动更新显示
        setPlans(result)
        // 把结果也返回给调用方，方便调用方做额外处理（如跳转页面）
        return result
      } catch (err) {
        // 4. 失败：提取错误信息存入全局状态，页面会显示错误提示
        // 如果错误是标准 Error 对象就用它的 message，否则用通用提示语
        const msg = err instanceof Error ? err.message : '生成失败'
        setError(msg)
        // 出错时返回空数组，保证返回值类型一致，调用方不会拿到 undefined
        return []
      } finally {
        // 5. 无论成功还是失败，都要关闭"加载中"状态
        // finally 块保证这行一定会执行，避免加载动画永远转下去
        setLoading(false)
      }
    },
    // 依赖数组：只有这些 setter 变化时才重新创建 generate 函数。
    // Zustand 的 setter 引用是稳定的，所以实际上这个函数只创建一次
    [setPlans, setLoading, setError],
  )

  // 把数据和方法一起返回，调用方可以一次性拿到所有需要的东西
  return { plans, loading, error, generate }
}
