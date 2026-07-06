/**
 * 文件用途：单个行业趋势卡片组件。
 *
 * 在"职业洞察"页里，AI 会分析出若干正在兴起的副业趋势，
 * 本组件负责把其中"一条趋势"用一张卡片展示出来。
 * 卡片内容包含：趋势名称、增长率徽章、趋势说明、相关领域标签、带来的机会。
 */

// TrendingUp 是一个"折线上升"图标，用来直观表达"增长/趋势向上"的含义
import { TrendingUp } from 'lucide-react'
// 引入趋势数据的类型定义，让本组件接收的数据有类型检查
import type { TrendItem } from '@/types/career'

/**
 * 本组件接收的参数。
 * - trend：一条行业趋势数据（名称、说明、增长率、相关领域、机会）
 */
interface TrendCardProps {
  trend: TrendItem
}

export function TrendCard({ trend }: TrendCardProps) {
  /**
   * 判断增长率徽章的配色：
   * 如果增长率文字里包含"↑"（上升箭头），说明是正向增长，用绿色徽章突出；
   * 否则（如"高热度"这类描述）用品牌紫徽章，作为默认强调色。
   * 这里用 includes 方法判断字符串里是否包含某个字符。
   */
  const isPositiveGrowth = trend.growthRate.includes('↑')

  return (
    // 使用项目统一的 .card 样式（圆角、边框、白底、阴影），hover 时阴影加深
    <div className="card flex flex-col p-5 transition hover:shadow-card-hover">
      {/* 顶部：趋势名称（左侧图标+文字）+ 右侧增长率徽章 */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* 品牌紫色方块包裹上升图标，呼应"趋势"主题 */}
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
            <TrendingUp size={18} />
          </span>
          {/* 趋势名称，加粗显示 */}
          <h3 className="text-sm font-semibold text-slate-800">{trend.trend}</h3>
        </div>
        {/* 增长率徽章：根据是否为正向增长切换配色 */}
        <span
          className={`tag shrink-0 ${
            isPositiveGrowth ? 'bg-green-50 text-green-600' : 'bg-brand-50 text-brand-600'
          }`}
        >
          {trend.growthRate}
        </span>
      </div>

      {/* 趋势详细说明：用浅灰色文字，行高放松便于阅读 */}
      <p className="text-sm leading-relaxed text-slate-500">{trend.description}</p>

      {/* 相关领域标签：把每条相关领域渲染成胶囊标签，flex-wrap 让标签自动换行 */}
      {trend.relatedFields.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {trend.relatedFields.map((field) => (
            <span key={field} className="tag bg-slate-100 text-slate-600">
              {field}
            </span>
          ))}
        </div>
      )}

      {/* 机会说明：用一条分隔线隔开，并配以品牌色小标题，强调"这是机会" */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-xs font-medium text-brand-600">机会点</p>
        <p className="mt-1 text-sm text-slate-600">{trend.opportunity}</p>
      </div>
    </div>
  )
}
