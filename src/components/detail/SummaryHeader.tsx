import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Plan } from '@/types'
import { MatchScoreRing } from '@/components/results/MatchScoreRing'

const DIFFICULTY_STYLE: Record<string, string> = {
  '低': 'bg-green-50 text-green-600',
  '中': 'bg-amber-50 text-amber-600',
  '高': 'bg-red-50 text-red-600',
}

export function SummaryHeader({ plan }: { plan: Plan }) {
  const navigate = useNavigate()

  return (
    <div className="card p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-slate-400 transition hover:text-brand-500"
      >
        <ArrowLeft size={16} /> 返回列表
      </button>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">{plan.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{plan.summary}</p>
        </div>
        <MatchScoreRing score={plan.matchScore} size={64} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`tag ${DIFFICULTY_STYLE[plan.difficulty] || 'bg-slate-100 text-slate-600'}`}>
          难度 {plan.difficulty}
        </span>
        <span className="tag bg-brand-50 text-brand-600">{plan.estimatedIncome}</span>
        {plan.tags.map((t) => (
          <span key={t} className="tag bg-slate-100 text-slate-500">#{t}</span>
        ))}
      </div>
    </div>
  )
}
