import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Plan } from '@/types'
import { MatchScoreRing } from './MatchScoreRing'

interface PlanCardProps {
  plan: Plan
  index: number
}

const DIFFICULTY_STYLE: Record<string, string> = {
  '低': 'bg-green-50 text-green-600',
  '中': 'bg-amber-50 text-amber-600',
  '高': 'bg-red-50 text-red-600',
}

const TYPE_LABEL: Record<number, string> = {
  0: '稳赚型',
  1: '成长型',
  2: '爆发型',
}

export function PlanCard({ plan, index }: PlanCardProps) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/detail/${plan.id}`)}
      className="card group flex flex-col p-5 text-left transition hover:shadow-card-hover"
    >
      {/* 顶部：类型标签 + 匹配度 */}
      <div className="mb-3 flex items-start justify-between">
        <span className="tag bg-brand-50 text-brand-600">
          {TYPE_LABEL[index] || '推荐'}
        </span>
        <MatchScoreRing score={plan.matchScore} />
      </div>

      {/* 标题 + 摘要 */}
      <h3 className="text-base font-semibold text-slate-800 group-hover:text-brand-600">
        {plan.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{plan.summary}</p>

      {/* 标签行 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`tag ${DIFFICULTY_STYLE[plan.difficulty] || 'bg-slate-100 text-slate-600'}`}>
          难度 {plan.difficulty}
        </span>
        <span className="tag bg-slate-100 text-slate-600">{plan.estimatedIncome}</span>
      </div>

      {/* 底部：标签 + 查看详情 */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex flex-wrap gap-1">
          {plan.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs text-slate-400">#{tag}</span>
          ))}
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-brand-500 opacity-0 transition group-hover:opacity-100">
          查看详情 <ArrowRight size={12} />
        </span>
      </div>
    </button>
  )
}
