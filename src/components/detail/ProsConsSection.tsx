import { Check, X } from 'lucide-react'

interface ProsConsSectionProps {
  pros: string[]
  cons: string[]
}

export function ProsConsSection({ pros, cons }: ProsConsSectionProps) {
  return (
    <section className="card p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-800">优缺点分析</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* 优点 */}
        <div className="rounded-xl bg-green-50/50 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-green-600">
            <Check size={16} /> 优点
          </div>
          <ul className="space-y-1.5">
            {pros.map((p, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-slate-600">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-green-400" />
                {p}
              </li>
            ))}
            {pros.length === 0 && <li className="text-sm text-slate-400">暂无</li>}
          </ul>
        </div>
        {/* 缺点 */}
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
