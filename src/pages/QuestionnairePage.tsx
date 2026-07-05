import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react'
import { QUESTIONS, RISK_LABELS } from '@/constants/questionnaire'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useAppStore } from '@/store/appStore'
import { SkillSelect } from '@/components/questionnaire/SkillSelect'
import { SliderGroup } from '@/components/questionnaire/SliderGroup'
import { RadioCard } from '@/components/questionnaire/RadioCard'
import type { Profile } from '@/types'

const DEFAULT_PROFILE: Profile = {
  skills: [],
  availableHours: 2,
  incomeGoal: 3500,
  riskTolerance: 'medium',
  budget: 500,
}

export function QuestionnairePage() {
  const [draft, setDraft, resetDraft] = useLocalStorage<Profile>('side-hustle-profile', DEFAULT_PROFILE)
  const setProfile = useAppStore((s) => s.setProfile)
  const navigate = useNavigate()

  const canSubmit = useMemo(() => {
    return draft.skills.length > 0
  }, [draft.skills])

  const update = <K extends keyof Profile>(key: K, val: Profile[K]) => {
    setDraft({ ...draft, [key]: val })
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    setProfile(draft)
    navigate('/results')
  }

  const handleReset = () => {
    resetDraft()
    setDraft(DEFAULT_PROFILE)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* 头部介绍 */}
      <section className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          找到最适合你的<span className="text-brand-500">副业方向</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          花 5 分钟填写个人画像，AI 将为你量身定制 3 个副业方案
        </p>
      </section>

      {/* 问卷 */}
      <div className="space-y-6">
        {QUESTIONS.map((q, idx) => (
          <section key={q.id} className="card p-5 sm:p-6">
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
                {idx + 1}
              </span>
              <div>
                <h2 className="text-base font-semibold text-slate-800">{q.title}</h2>
                {q.description && <p className="mt-0.5 text-xs text-slate-400">{q.description}</p>}
              </div>
            </div>

            <div className="pl-10">
              {q.type === 'multi-select' && (
                <SkillSelect
                  options={q.options!}
                  value={draft.skills}
                  onChange={(v) => update('skills', v)}
                />
              )}
              {q.type === 'slider' && (
                <SliderGroup
                  min={q.min!}
                  max={q.max!}
                  step={q.step!}
                  unit={q.unit}
                  value={draft[q.id] as number}
                  onChange={(v) => update(q.id as 'availableHours', v)}
                />
              )}
              {q.type === 'radio-card' && (
                <RadioCard
                  options={q.options!}
                  value={String(draft[q.id])}
                  onChange={(v) => {
                    if (q.id === 'riskTolerance') {
                      update('riskTolerance', v as Profile['riskTolerance'])
                    } else {
                      update(q.id as 'incomeGoal' | 'budget', Number(v))
                    }
                  }}
                  layout={q.id === 'riskTolerance' ? 'list' : 'grid'}
                />
              )}
            </div>
          </section>
        ))}
      </div>

      {/* 摘要预览 */}
      <section className="mt-6 card bg-slate-50/50 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-600">你的画像：</span>
          <span className="tag bg-white text-slate-600">
            {draft.skills.length > 0 ? `${draft.skills.length}项技能` : '未选技能'}
          </span>
          <span className="tag bg-white text-slate-600">{draft.availableHours}小时/天</span>
          <span className="tag bg-white text-slate-600">{draft.incomeGoal}元/月</span>
          <span className="tag bg-white text-slate-600">{RISK_LABELS[draft.riskTolerance]}</span>
          <span className="tag bg-white text-slate-600">{draft.budget}元启动</span>
        </div>
      </section>

      {/* 操作栏 */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" onClick={handleReset} className="btn-ghost">
          <RotateCcw size={16} /> 重置
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="btn-primary"
        >
          {canSubmit ? (
            <>
              生成我的副业方案 <ArrowRight size={16} />
            </>
          ) : (
            <>
              <CheckCircle2 size={16} /> 请先选择技能
            </>
          )}
        </button>
      </div>
    </div>
  )
}
