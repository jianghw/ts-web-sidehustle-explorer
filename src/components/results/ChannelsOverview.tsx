/**
 * 文件用途：渠道总览组件。
 * 把多个方案里出现的所有赚钱渠道汇总去重，再统一展示成一个网格，
 * 让用户一眼看到"这些副业方案用到了哪些赚钱渠道、哪些渠道是多个方案共用的"。
 */

// useMemo 用于缓存计算结果，避免每次渲染都重新去重
import { useMemo } from 'react'
// Layers 是一个图层叠放图标，寓意"汇总多个方案的渠道"
import { Layers } from 'lucide-react'
// 引入方案和渠道的数据类型定义
import type { Plan, Channel } from '@/types'
// 复用详情页的渠道卡片组件来展示单个渠道，保持视觉一致
import { ChannelCard } from '@/components/detail/ChannelCard'

// 在原有渠道类型基础上扩展一个 sources 字段，记录这个渠道来自哪些方案
interface ChannelWithSources extends Channel {
  sources: string[]
}

export function ChannelsOverview({ plans }: { plans: Plan[] }) {
  // 把所有方案的渠道按名字去重合并，并记录每个渠道出现在哪些方案里
  // 用 useMemo 是因为合并过程依赖 plans，只有 plans 变化时才需要重新计算
  const merged = useMemo<ChannelWithSources[]>(() => {
    // 用 Map 以渠道名为 key 做去重，比数组查找更高效
    const map = new Map<string, ChannelWithSources>()
    plans.forEach((p) => {
      p.channels.forEach((ch) => {
        // trim() 去掉名字首尾空格，避免"公众号 "和"公众号"被当成两个渠道
        const key = ch.name.trim()
        const exist = map.get(key)
        if (exist) {
          // 已存在则把当前方案名追加到来源列表
          exist.sources.push(p.title)
        } else {
          // 不存在则新建一条，sources 初始化为当前方案名
          map.set(key, { ...ch, sources: [p.title] })
        }
      })
    })
    // 把 Map 的值转成数组返回
    return Array.from(map.values())
  }, [plans])

  // 如果没有任何渠道，就不渲染这一区块
  if (merged.length === 0) return null

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6">
      {/* 头部：图标 + 标题 + 副标题说明 */}
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
          <Layers size={20} />
        </span>
        <div>
          <h2 className="text-lg font-bold text-slate-800">渠道总览</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            跨 {plans.length} 个方案共 {merged.length} 个渠道（已去重）
          </p>
        </div>
      </div>

      {/* 渠道网格：响应式布局，大屏 3 列、中屏 2 列 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {merged.map((ch) => (
          // 把来源信息一起传给卡片，让卡片能显示"哪些方案用到了这个渠道"
          <ChannelCard key={ch.name} channel={ch} sources={ch.sources} />
        ))}
      </div>
    </section>
  )
}
