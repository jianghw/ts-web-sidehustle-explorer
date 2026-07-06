/**
 * 文件用途：单个赚钱渠道卡片组件。
 * 用一张卡片展示一个渠道（如"公众号""闲鱼""地推"）的类型、收益模式、门槛等信息，
 * 并根据渠道类型显示不同颜色的图标，让用户快速区分平台/私域/线下三类渠道。
 */

// 三个图标分别对应三类渠道：Store（平台商店）、Users（人群/私域）、MapPin（地点/线下）
import { Store, Users, MapPin } from 'lucide-react'
// 引入渠道的数据类型定义
import type { Channel } from '@/types'

// 渠道类型 → 图标 + 主题色配置；用不同颜色帮助用户一眼区分渠道类别
const TYPE_CONFIG: Record<string, { icon: typeof Store; bg: string; text: string; border: string }> = {
  '平台': { icon: Store, bg: 'bg-blue-500', text: 'text-white', border: 'border-l-blue-500' },
  '私域': { icon: Users, bg: 'bg-violet-500', text: 'text-white', border: 'border-l-violet-500' },
  '线下': { icon: MapPin, bg: 'bg-emerald-500', text: 'text-white', border: 'border-l-emerald-500' },
}

// 门槛等级 → 标签文案 + 配色，让用户判断这个渠道是否容易上手
const BARRIER_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  '低': { label: '低门槛', bg: 'bg-emerald-500', text: 'text-white' },
  '中': { label: '中门槛', bg: 'bg-amber-500', text: 'text-white' },
  '高': { label: '高门槛', bg: 'bg-rose-500', text: 'text-white' },
}

interface ChannelCardProps {
  // 渠道数据
  channel: Channel
  // 该渠道来自哪些方案（可选，仅在渠道总览里展示，用于显示来源）
  sources?: string[]
}

export function ChannelCard({ channel, sources }: ChannelCardProps) {
  // 取出渠道类型字符串，可能为空
  const typeKey = channel.type || ''
  // 根据类型查找配色；找不到时用灰色兜底，避免样式缺失
  const config = TYPE_CONFIG[typeKey] || { icon: Store, bg: 'bg-slate-500', text: 'text-white', border: 'border-l-slate-500' }
  // 把图标组件取出来，方便下面渲染
  const Icon = config.icon
  // 门槛配置可能不存在，没有就不显示门槛标签
  const barrier = channel.barrier ? BARRIER_CONFIG[channel.barrier] : null

  return (
    // 左侧彩色边框对应渠道类型；hover 时轻微上浮 + 加深阴影，增强交互感
    <div
      className={`flex items-start gap-3 rounded-xl border border-slate-200 border-l-4 ${config.border} bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
    >
      {/* 类型图标 — 实心彩色方块，颜色对应渠道类别 */}
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.text} shadow-sm`}>
        <Icon size={20} />
      </span>

      <div className="min-w-0 flex-1">
        {/* 标题行：渠道名称 + 门槛标签 */}
        <div className="flex items-center justify-between gap-2">
          {/* truncate 防止名称过长撑破布局 */}
          <h3 className="truncate text-sm font-bold text-slate-800">{channel.name}</h3>
          {barrier && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${barrier.bg} ${barrier.text}`}>
              {barrier.label}
            </span>
          )}
        </div>

        {/* 类型 + 收益模式：让用户了解这个渠道怎么赚钱 */}
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

        {/* 来源方案标签：仅在渠道总览里展示，标明这个渠道被哪些方案用到 */}
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
