import type { Channel } from '@/types'
import { ChannelCard } from './ChannelCard'

export function ChannelsSection({ channels }: { channels: Channel[] }) {
  return (
    <section className="card p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-800">赚钱渠道</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {channels.map((ch, i) => (
          <ChannelCard key={`${ch.name}-${i}`} channel={ch} />
        ))}
        {channels.length === 0 && (
          <p className="text-sm text-slate-400">暂无渠道信息</p>
        )}
      </div>
    </section>
  )
}
