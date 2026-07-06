/**
 * 文件用途：详情页顶部摘要头部组件。
 * 展示一个方案的标题、摘要、匹配度、难度、预期收入和标签等核心信息，
 * 让用户进入详情页第一眼就能了解这个方案的全貌。
 */

// ArrowLeft 是左箭头图标，用于"返回列表"按钮
import { ArrowLeft } from 'lucide-react'
// useNavigate 用于点击返回按钮回到上一页
import { useNavigate } from 'react-router-dom'
// 引入方案的数据类型定义
import type { Plan } from '@/types'
// 复用匹配度环形进度条组件，展示方案契合度
import { MatchScoreRing } from '@/components/results/MatchScoreRing'

// 不同难度对应的配色，与方案卡片保持一致，方便用户跨页面识别
const DIFFICULTY_STYLE: Record<string, string> = {
  '低': 'bg-green-50 text-green-600',
  '中': 'bg-amber-50 text-amber-600',
  '高': 'bg-red-50 text-red-600',
}

export function SummaryHeader({ plan }: { plan: Plan }) {
  const navigate = useNavigate()

  return (
    <div className="card p-6">
      {/* 返回按钮：navigate(-1) 回到上一页（通常是结果列表页） */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-slate-400 transition hover:text-brand-500"
      >
        <ArrowLeft size={16} /> 返回列表
      </button>

      {/* 主体：左侧标题+摘要，右侧匹配度环形图；用 justify-between 让两者左右分布 */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* 标题在小屏稍小、大屏更大，适配不同设备 */}
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">{plan.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{plan.summary}</p>
        </div>
        {/* 这里用稍大的尺寸(64)突出展示匹配度 */}
        <MatchScoreRing score={plan.matchScore} size={64} />
      </div>

      {/* 标签行：难度、预期收入、自定义标签，让用户快速浏览关键属性 */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`tag ${DIFFICULTY_STYLE[plan.difficulty] || 'bg-slate-100 text-slate-600'}`}>
          难度 {plan.difficulty}
        </span>
        <span className="tag bg-brand-50 text-brand-600">{plan.estimatedIncome}</span>
        {/* 遍历显示所有标签，用 # 前缀呼应社交媒体的标签习惯 */}
        {plan.tags.map((t) => (
          <span key={t} className="tag bg-slate-100 text-slate-500">#{t}</span>
        ))}
      </div>
    </div>
  )
}
