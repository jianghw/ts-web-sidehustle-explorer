/**
 * 文件用途：赚钱渠道区块组件。
 * 在详情页里把一个方案涉及的所有赚钱渠道整理成网格展示，
 * 让用户清楚这个副业方案可以通过哪些具体渠道来落地赚钱。
 */

// 引入渠道的数据类型定义
import type { Channel } from '@/types'
// 复用单张渠道卡片组件来展示每个渠道
import { ChannelCard } from './ChannelCard'

export function ChannelsSection({ channels }: { channels: Channel[] }) {
  return (
    <section className="card p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-800">赚钱渠道</h2>
      {/* 两列网格，让多个渠道卡片整齐排列 */}
      <div className="grid gap-3 sm:grid-cols-2">
        {channels.map((ch, i) => (
          // 用"名称+索引"组合作为 key，避免同名渠道导致 key 冲突
          <ChannelCard key={`${ch.name}-${i}`} channel={ch} />
        ))}
        {/* 没有渠道数据时显示占位提示，避免出现空白区块 */}
        {channels.length === 0 && (
          <p className="text-sm text-slate-400">暂无渠道信息</p>
        )}
      </div>
    </section>
  )
}
