/**
 * 文件用途：优缺点分析区块组件。
 * 把一个副业方案的优点和缺点分别用绿色和红色两列展示，
 * 帮助用户客观权衡利弊，做出更理性的决策。
 */

// Check（对勾，表示优点）、X（叉号，表示缺点）
import { Check, X } from 'lucide-react'

interface ProsConsSectionProps {
  // 优点列表
  pros: string[]
  // 缺点列表
  cons: string[]
}

export function ProsConsSection({ pros, cons }: ProsConsSectionProps) {
  return (
    <section className="card p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-800">优缺点分析</h2>
      {/* 两列并排：左优点右缺点，便于对照比较 */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* 优点区：浅绿背景 + 绿色对勾 */}
        <div className="rounded-xl bg-green-50/50 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-green-600">
            <Check size={16} /> 优点
          </div>
          <ul className="space-y-1.5">
            {pros.map((p, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-slate-600">
                {/* 用小圆点作为列表标记，比默认圆点更精致 */}
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-green-400" />
                {p}
              </li>
            ))}
            {/* 没有优点时显示占位，保持布局对称 */}
            {pros.length === 0 && <li className="text-sm text-slate-400">暂无</li>}
          </ul>
        </div>
        {/* 缺点区：浅红背景 + 红色叉号 */}
        <div className="rounded-xl bg-red-50/50 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-red-500">
            <X size={16} /> 缺点
          </div>
          <ul className="space-y-1.5">
            {cons.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-slate-600">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                {c}
              </li>
            ))}
            {cons.length === 0 && <li className="text-sm text-slate-400">暂无</li>}
          </ul>
        </div>
      </div>
    </section>
  )
}
