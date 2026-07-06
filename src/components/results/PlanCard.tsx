/**
 * 文件用途：方案卡片组件。
 * 在结果页用一张卡片展示一个副业方案的核心信息（类型、匹配度、标题、摘要、难度、收入、标签），
 * 点击整张卡片会跳转到该方案的详情页。
 */

// useNavigate 用于点击卡片后跳转到详情页
import { useNavigate } from 'react-router-dom'
// ArrowRight 是向右箭头图标，用于"查看详情"提示
import { ArrowRight } from 'lucide-react'
// 引入方案的数据类型定义
import type { Plan } from '@/types'
// 引入匹配度环形进度条组件，展示方案与用户的契合度
import { MatchScoreRing } from './MatchScoreRing'

interface PlanCardProps {
  // 要展示的方案数据
  plan: Plan
  // 方案在列表中的序号（0/1/2），用来对应"稳赚型/成长型/爆发型"标签
  index: number
}

// 不同难度对应的配色，让用户通过颜色快速识别难度等级
const DIFFICULTY_STYLE: Record<string, string> = {
  '低': 'bg-green-50 text-green-600',
  '中': 'bg-amber-50 text-amber-600',
  '高': 'bg-red-50 text-red-600',
}

// 方案序号到类型名称的映射：AI 生成的三个方案分别对应三种风格
const TYPE_LABEL: Record<number, string> = {
  0: '稳赚型',
  1: '成长型',
  2: '爆发型',
}

export function PlanCard({ plan, index }: PlanCardProps) {
  const navigate = useNavigate()

  return (
    // 整张卡片是一个按钮，点击跳转到详情页；用 group 让内部元素可响应卡片悬停状态
    <button
      onClick={() => navigate(`/detail/${plan.id}`)}
      className="card group flex flex-col p-5 text-left transition hover:shadow-card-hover"
    >
      {/* 顶部：左侧类型标签，右侧匹配度环形图 */}
      <div className="mb-3 flex items-start justify-between">
        {/* 序号对应不上时兜底显示"推荐"，避免数据异常时空白 */}
        <span className="tag bg-brand-50 text-brand-600">
          {TYPE_LABEL[index] || '推荐'}
        </span>
        <MatchScoreRing score={plan.matchScore} />
      </div>

      {/* 标题 + 摘要：悬停时标题变主色，强化可点击的反馈 */}
      <h3 className="text-base font-semibold text-slate-800 group-hover:text-brand-600">
        {plan.title}
      </h3>
      {/* line-clamp-2 限制摘要最多两行，超出省略，保持卡片高度一致 */}
      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{plan.summary}</p>

      {/* 标签行：难度 + 预期收入，让用户快速比较各方案 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`tag ${DIFFICULTY_STYLE[plan.difficulty] || 'bg-slate-100 text-slate-600'}`}>
          难度 {plan.difficulty}
        </span>
        <span className="tag bg-slate-100 text-slate-600">{plan.estimatedIncome}</span>
      </div>

      {/* 底部：标签 + 查看详情提示，用分隔线与上方内容区分 */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        {/* 只显示前两个标签，避免卡片过满 */}
        <div className="flex flex-wrap gap-1">
          {plan.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs text-slate-400">#{tag}</span>
          ))}
        </div>
        {/* "查看详情"默认隐藏，悬停卡片时才出现，引导用户点击进入详情 */}
        <span className="flex items-center gap-1 text-xs font-medium text-brand-500 opacity-0 transition group-hover:opacity-100">
          查看详情 <ArrowRight size={12} />
        </span>
      </div>
    </button>
  )
}
