/**
 * 文件用途：本地存储 Hook（自定义 React 钩子）。
 * 它把 React 的状态管理和浏览器的 localStorage 打通——
 * 你像用普通 state 一样读写数据，它会在背后自动同步到浏览器本地存储里，
 * 这样即使刷新页面数据也不会丢失。
 * 你可以把它理解为"带自动保存功能的 useState"。
 */

// useCallback：记忆函数，避免每次渲染创建新函数
// useEffect：在组件渲染后执行副作用（这里是同步数据到 localStorage）
// useState：React 的状态管理钩子，用于存储和更新数据
import { useCallback, useEffect, useState } from 'react'

/**
 * 一个通用的本地存储 hook
 *
 * @param key 存储在 localStorage 中的键名（就像一个"抽屉的标签"）
 * @param initialValue 初始默认值（当 localStorage 里还没有数据时使用）
 * @returns [value, setValue, reset] 分别是：当前值、设置新值、重置为初始值
 *
 * 泛型 <T> 表示这个 hook 可以存储任意类型的数据（数字、字符串、对象等），
 * TypeScript 会根据传入的初始值自动推断类型
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // useState 的初始化使用函数形式（懒初始化），这样只在组件首次渲染时读取一次 localStorage，
  // 避免每次渲染都去读取（读取 localStorage 是有性能开销的）
  const [value, setValue] = useState<T>(() => {
    try {
      // 尝试从 localStorage 中取出之前保存的数据
      const raw = window.localStorage.getItem(key)
      // 如果有数据，就用 JSON.parse 把字符串还原成对象；没有就用初始默认值
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      // 如果读取或解析失败（比如数据损坏），就安全地回退到初始值，不让应用崩溃
      return initialValue
    }
  })

  // 每当 value 变化时，自动把它同步写入 localStorage。
  // 这样数据就始终和本地存储保持一致，刷新后能恢复
  useEffect(() => {
    try {
      // JSON.stringify 把对象转成字符串（localStorage 只能存字符串）
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 忽略写入异常：比如浏览器隐私模式禁止写入、或存储空间已满。
      // 这种情况下数据无法持久化，但不应影响当前会话的使用
    }
  }, [key, value]) // 依赖数组：key 或 value 变化时才重新执行

  // reset：重置为初始值。用 useCallback 包裹保证函数引用稳定。
  // 调用后 value 变回 initialValue，同时上面的 useEffect 会把它写入 localStorage
  const reset = useCallback(() => setValue(initialValue), [initialValue])

  // as const 让 TypeScript 知道这是一个固定长度和顺序的元组，
  // 这样调用方可以用数组解构 [value, setValue, reset] 精确拿到每一项
  return [value, setValue, reset] as const
}
