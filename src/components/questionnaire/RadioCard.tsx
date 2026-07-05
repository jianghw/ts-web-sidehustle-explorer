import type { QuestionOption } from '@/constants/questionnaire'

interface RadioCardProps {
  options: QuestionOption[]
  value: string
  onChange: (v: string) => void
  layout?: 'grid' | 'list'
}

export function RadioCard({ options, value, onChange, layout = 'grid' }: RadioCardProps) {
  return (
    <div className={layout === 'grid' ? 'grid grid-cols-2 gap-3 sm:grid-cols-4' : 'flex flex-col gap-2'}>
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
              active
                ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-200'
                : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40'
            }`}
          >
            <span className="text-2xl">{opt.icon}</span>
            <span className="flex-1">
              <span className={`block text-sm font-semibold ${active ? 'text-brand-700' : 'text-slate-700'}`}>
                {opt.label}
              </span>
              {opt.description && (
                <span className="mt-0.5 block text-xs text-slate-400">{opt.description}</span>
              )}
            </span>
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                active ? 'border-brand-500 bg-brand-500' : 'border-slate-300'
              }`}
            >
              {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
          </button>
        )
      })}
    </div>
  )
}
