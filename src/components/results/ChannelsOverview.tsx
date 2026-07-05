import { useMemo } from 'react'
import { Layers } from 'lucide-react'
import type { Plan, Channel } from '@/types'
import { ChannelCard } from '@/components/detail/ChannelCard'

interface ChannelWithSources extends Channel {
  sources: string[]
}

export function ChannelsOverview({ plans }: { plans: Plan[] }) {
  const merged = useMemo<ChannelWithSources[]>(() => {
    const map = new Map<string, ChannelWithSources>()
    plans.forEach((p) => {
      p.channels.forEach((ch) => {
        const key = ch.name.trim()
        const exist = map.get(key)
        if (exist) {
          exist.sources.push(p.title)
        } else {
          map.set(key, { ...ch, sources: [p.title] })
        }
      })
    })
    return Array.from(map.values())
  }, [plans])

  if (merged.length === 0) return null

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6">
      {/* 头部 */}
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

      {/* 渠道网格 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {merged.map((ch) => (
          <ChannelCard key={ch.name} channel={ch} sources={ch.sources} />
        ))}
      </div>
    </section>
  )
}
