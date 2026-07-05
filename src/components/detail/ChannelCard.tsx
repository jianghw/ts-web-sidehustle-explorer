import { Store, Users, MapPin } from 'lucide-react'
import type { Channel } from '@/types'

// 渠道类型 → 图标 + 主题色
const TYPE_CONFIG: Record<string, { icon: typeof Store; bg: string; text: string; border: string }> = {
  '平台': { icon: Store, bg: 'bg-blue-500', text: 'text-white', border: 'border-l-blue-500' },
  '私域': { icon: Users, bg: 'bg-violet-500', text: 'text-white', border: 'border-l-violet-500' },
  '线下': { icon: MapPin, bg: 'bg-emerald-500', text: 'text-white', border: 'border-l-emerald-500' },
}

const BARRIER_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  '低': { label: '低门槛', bg: 'bg-emerald-500', text: 'text-white' },
  '中': { label: '中门槛', bg: 'bg-amber-500', text: 'text-white' },
  '高': { label: '高门槛', bg: 'bg-rose-500', text: 'text-white' },
}

interface ChannelCardProps {
  channel: Channel
  sources?: string[]
}

export function ChannelCard({ channel, sources }: ChannelCardProps) {
  const typeKey = channel.type || ''
  const config = TYPE_CONFIG[typeKey] || { icon: Store, bg: 'bg-slate-500', text: 'text-white', border: 'border-l-slate-500' }
  const Icon = config.icon
  const barrier = channel.barrier ? BARRIER_CONFIG[channel.barrier] : null

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-slate-200 border-l-4 ${config.border} bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
    >
      {/* 类型图标 — 实心彩色方块 */}
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.text} shadow-sm`}>
        <Icon size={20} />
      </span>

      <div className="min-w-0 flex-1">
        {/* 标题行 */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-bold text-slate-800">{channel.name}</h3>
          {barrier && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${barrier.bg} ${barrier.text}`}>
              {barrier.label}
            </span>
          )}
        </div>

        {/* 类型 + 收益模式 */}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
          {channel.type && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500">
              {channel.type}
            </span>
          )}
          {channel.incomeModel && (
            <span className="text-slate-400">{channel.incomeModel}</span>
          )}
        </div>

        {/* 来源方案标签 */}
        {sources && sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {sources.map((s) => (
              <span
                key={s}
                className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-600 ring-1 ring-inset ring-brand-100"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
