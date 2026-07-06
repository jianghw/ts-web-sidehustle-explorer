/**
 * 文件用途：问卷页面（第一步"画像"）。
 * 让用户填写技能、可投入时间、收入目标、风险偏好、启动资金等信息，
 * 填完后提交，由 AI 据此生成个性化副业方案。填写内容会自动保存到本地，刷新不丢失。
 */

// useMemo 用于缓存"是否可提交"的判断结果，避免每次渲染都重算
import { useMemo } from 'react'
// useNavigate 用于提交后跳转到结果页
import { useNavigate } from 'react-router-dom'
// 三个图标：ArrowRight（前进箭头）、RotateCcw（重置/逆时针箭头）、CheckCircle2（完成对勾）
import { ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react'
// 引入问卷题目配置和风险偏好文案映射，题目内容集中管理便于维护
import { QUESTIONS, RISK_LABELS } from '@/constants/questionnaire'
// 引入技能值转中文名称的工具函数，提交时把英文标识翻译成中文发给 AI
import { getSkillLabels } from '@/constants/careers'
// 引入本地存储 Hook，把草稿自动存到浏览器 localStorage，刷新页面不丢失
import { useLocalStorage } from '@/hooks/useLocalStorage'
// 引入全局状态仓库，提交时把画像存入全局状态供结果页使用
import { useAppStore } from '@/store/appStore'
// 引入三个问卷交互组件：多选技能、滑块、单选卡片
import { SkillSelect } from '@/components/questionnaire/SkillSelect'
import { SliderGroup } from '@/components/questionnaire/SliderGroup'
import { RadioCard } from '@/components/questionnaire/RadioCard'
// 引入"查看更多职业"入口链接，显示在技能多选题下方，可跳转到职业浏览页选更多职业
import { CareerBrowserLink } from '@/components/questionnaire/CareerBrowserLink'
// 引入画像的数据类型定义
import type { Profile } from '@/types'

// 画像的默认值，用户首次进入或重置时使用；数值设为常见合理值，降低填写门槛
const DEFAULT_PROFILE: Profile = {
  skills: [],
  availableHours: 2,
  incomeGoal: 3500,
  riskTolerance: 'medium',
  budget: 500,
}

export function QuestionnairePage() {
  // draft 是当前草稿；setDraft 更新草稿；resetDraft 清空本地存储的草稿
  // 键名 'side-hustle-profile' 是 localStorage 里的存储键
  const [draft, setDraft, resetDraft] = useLocalStorage<Profile>('side-hustle-profile', DEFAULT_PROFILE)
  // 提交时把画像写入全局状态，结果页会读取它来生成方案
  const setProfile = useAppStore((s) => s.setProfile)
  const navigate = useNavigate()

  // 只有选了至少一项技能才允许提交，因为技能是推荐方案的核心依据
  const canSubmit = useMemo(() => {
    return draft.skills.length > 0
  }, [draft.skills])

  // 通用的字段更新方法：传入字段名和新值，更新对应字段
  // 泛型 <K> 保证 key 和 val 的类型匹配，避免传错类型
  const update = <K extends keyof Profile>(key: K, val: Profile[K]) => {
    setDraft({ ...draft, [key]: val })
  }

  // 提交：校验通过后把草稿写入全局状态并跳转到结果页
  const handleSubmit = () => {
    if (!canSubmit) return
    // 把技能的英文标识翻译成中文名称，一起存入画像，后端 AI 提示词会优先使用中文名称
    const profileWithLabels = { ...draft, skillLabels: getSkillLabels(draft.skills) }
    setProfile(profileWithLabels)
    navigate('/results')
  }

  // 重置：清空本地存储并把草稿恢复为默认值
  const handleReset = () => {
    resetDraft()
    setDraft(DEFAULT_PROFILE)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* 头部介绍：说明这个页面要做什么，引导用户填写 */}
      <section className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          找到最适合你的<span className="text-brand-500">副业方向</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          花 5 分钟填写个人画像，AI 将为你量身定制 3 个副业方案
        </p>
      </section>

      {/* 问卷主体：根据配置循环渲染每一道题 */}
      <div className="space-y-6">
        {QUESTIONS.map((q, idx) => (
          <section key={q.id} className="card p-5 sm:p-6">
            {/* 题号 + 题目标题 + 可选的题目说明 */}
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
                {idx + 1}
              </span>
              <div>
                <h2 className="text-base font-semibold text-slate-800">{q.title}</h2>
                {q.description && <p className="mt-0.5 text-xs text-slate-400">{q.description}</p>}
              </div>
            </div>

            {/* pl-10 让题目内容与标题左对齐，视觉更整齐 */}
            <div className="pl-10">
              {/* 根据题目类型渲染不同的交互组件 */}
              {q.type === 'multi-select' && (
                <>
                  <SkillSelect
                    options={q.options!}
                    value={draft.skills}
                    onChange={(v) => update('skills', v)}
                  />
                  {/* 技能网格下方放一个低调的链接，引导用户去职业浏览页选更多职业 */}
                  <CareerBrowserLink />
                </>
              )}
              {q.type === 'slider' && (
                <SliderGroup
                  min={q.min!}
                  max={q.max!}
                  step={q.step!}
                  unit={q.unit}
                  value={draft[q.id] as number}
                  // 把滑块值写回对应字段（availableHours/incomeGoal/budget 之一）
                  onChange={(v) => update(q.id as 'availableHours', v)}
                />
              )}
              {q.type === 'radio-card' && (
                <RadioCard
                  options={q.options!}
                  value={String(draft[q.id])}
                  onChange={(v) => {
                    // 风险偏好是字符串枚举，其他单选题（收入目标/预算）是数字，需分别处理类型
                    if (q.id === 'riskTolerance') {
                      update('riskTolerance', v as Profile['riskTolerance'])
                    } else {
                      update(q.id as 'incomeGoal' | 'budget', Number(v))
                    }
                  }}
                  // 风险偏好用列表布局（选项有说明文字），其他用网格更紧凑
                  layout={q.id === 'riskTolerance' ? 'list' : 'grid'}
                />
              )}
            </div>
          </section>
        ))}
      </div>

      {/* 摘要预览：实时显示当前已填的画像，让用户在提交前确认信息 */}
      <section className="mt-6 card bg-slate-50/50 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-600">你的画像：</span>
          <span className="tag bg-white text-slate-600">
            {draft.skills.length > 0 ? `${draft.skills.length}项技能` : '未选技能'}
          </span>
          <span className="tag bg-white text-slate-600">{draft.availableHours}小时/天</span>
          <span className="tag bg-white text-slate-600">{draft.incomeGoal}元/月</span>
          {/* 风险偏好用文案而非英文枚举值显示，更友好 */}
          <span className="tag bg-white text-slate-600">{RISK_LABELS[draft.riskTolerance]}</span>
          <span className="tag bg-white text-slate-600">{draft.budget}元启动</span>
        </div>
      </section>

      {/* 操作栏：左侧重置、右侧提交；未选技能时提交按钮禁用并提示 */}
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
