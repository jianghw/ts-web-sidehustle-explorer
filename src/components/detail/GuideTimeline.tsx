import { useState } from 'react'
import { ChevronDown, Wrench, Clock } from 'lucide-react'
import type { GuideStep } from '@/types'

export function GuideTimeline({ guide }: { guide: GuideStep[] }) {
  return (
    <section className="card p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-800">操作指南</h2>
      <ol className="relative space-y-3 border-l-2 border-brand-100 pl-6">
        {guide.map((step, idx) => (
          <GuideStepItem key={idx} step={step} />
        ))}
        {guide.length === 0 && (
          <li className="text-sm text-slate-400">暂无操作指南</li>
        )}
      </ol>
    </section>
  )
}

function GuideStepItem({ step }: { step: GuideStep }) {
  const [open, setOpen] = useState(false)

  return (
    <li className="relative">
      {/* 步骤序号点 */}
      <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white ring-4 ring-white">
        {step.step}
      </span>

      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-slate-50"
      >
        <span className="text-sm font-medium text-slate-700">{step.title}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-1 px-3 pb-2">
          <p className="text-sm text-slate-600">{step.content}</p>
          {(step.tools?.length || step.duration) && (
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
              {step.tools?.length ? (
                <span className="flex items-center gap-1">
                  <Wrench size={12} /> {step.tools.join('、')}
                </span>
              ) : null}
              {step.duration && (
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {step.duration}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  )
}
