import { useState } from 'react'
import type { QuestionOption } from '@/constants/questionnaire'

interface SkillSelectProps {
  options: QuestionOption[]
  value: string[]
  onChange: (v: string[]) => void
  max?: number
}

export function SkillSelect({ options, value, onChange, max = 5 }: SkillSelectProps) {
  const [overflow, setOverflow] = useState(false)

  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val))
      setOverflow(false)
    } else {
      if (value.length >= max) {
        setOverflow(true)
        return
      }
      setOverflow(false)
      onChange([...value, val])
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {options.map((opt) => {
          const active = value.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition ${
                active
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50/40'
              }`}
            >
              <span className="text-xl">{opt.icon}</span>
              <span className="text-xs font-medium">{opt.label}</span>
            </button>
          )
        })}
      </div>
      {overflow && (
        <p className="mt-2 text-xs text-amber-600">最多选择 {max} 项技能</p>
      )}
      <p className="mt-2 text-xs text-slate-400">已选 {value.length}/{max}</p>
    </div>
  )
}
