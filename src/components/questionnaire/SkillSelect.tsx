/**
 * 文件用途：多选技能标签组件。
 * 让用户从一组技能中挑选自己擅长的，支持限制最多选几项，
 * 选中后高亮显示，超过上限会给出提示，常用于"选择你掌握的技能"这类问题。
 */

// useState 用于记录"是否已超过选择上限"，从而控制提示文案的显示
import { useState } from 'react'
// 引入选项类型定义，与单选题保持一致的数据结构
import type { QuestionOption } from '@/constants/questionnaire'

interface SkillSelectProps {
  // 所有可选技能列表
  options: QuestionOption[]
  // 当前已选中的技能值数组（多选所以是数组），由父组件控制
  value: string[]
  // 选中/取消选中时的回调，把新数组传回父组件
  onChange: (v: string[]) => void
  // 最多可选几项，默认 5，避免用户选太多导致推荐不准
  max?: number
}

export function SkillSelect({ options, value, onChange, max = 5 }: SkillSelectProps) {
  // overflow 标记是否已超过上限，用来显示/隐藏提示语
  const [overflow, setOverflow] = useState(false)

  // 切换某个技能的选中状态：已选则取消，未选则添加（但受 max 限制）
  const toggle = (val: string) => {
    if (value.includes(val)) {
      // 已经选中，再次点击就是取消选中
      onChange(value.filter((v) => v !== val))
      setOverflow(false)
    } else {
      // 未选中，准备添加；但先检查是否已达上限，达上限则只提示不添加
      if (value.length >= max) {
        setOverflow(true)
        return
      }
      setOverflow(false)
      // 用展开运算符在原数组基础上追加新值，避免直接修改原数组
      onChange([...value, val])
    }
  }

  return (
    <div>
      {/* 技能按钮网格：小屏 3 列，大屏 4 列，方便手机和电脑都能看清 */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {options.map((opt) => {
          // 判断当前技能是否在已选列表中
          const active = value.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              // 选中态用主色高亮，未选中态悬停时给轻微反馈
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
      {/* 超过上限时显示警告提示，提醒用户只能选这么多 */}
      {overflow && (
        <p className="mt-2 text-xs text-amber-600">最多选择 {max} 项技能</p>
      )}
      {/* 始终显示已选数量，让用户清楚还能选几个 */}
      <p className="mt-2 text-xs text-slate-400">已选 {value.length}/{max}</p>
    </div>
  )
}
