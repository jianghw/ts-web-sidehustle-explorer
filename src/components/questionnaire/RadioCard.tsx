/**
 * 文件用途：单选题卡片组件。
 * 在问卷中用于展示一组带图标的选项，用户只能选中其中一个，
 * 常用于"你更偏向哪种工作方式"这类单选问题。
 */

// 引入选项的类型定义，保证传入的选项数据结构（图标、标签、描述、值）是一致的
import type { QuestionOption } from '@/constants/questionnaire'

// 组件参数定义
interface RadioCardProps {
  // 可供选择的所有选项列表
  options: QuestionOption[]
  // 当前选中的值，由父组件控制（受控组件模式）
  value: string
  // 用户点击新选项时的回调，把新值传回父组件
  onChange: (v: string) => void
  // 布局方式：grid 是网格排列，list 是纵向列表，默认网格更紧凑
  layout?: 'grid' | 'list'
}

export function RadioCard({ options, value, onChange, layout = 'grid' }: RadioCardProps) {
  return (
    // 根据 layout 选择不同的布局样式：grid 适合选项多的情况，list 适合选项需要更多文字说明
    <div className={layout === 'grid' ? 'grid grid-cols-2 gap-3 sm:grid-cols-4' : 'flex flex-col gap-2'}>
      {options.map((opt) => {
        // 判断当前选项是否被选中，用于控制高亮样式
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            // type="button" 避免在表单中被当成提交按钮触发提交
            type="button"
            onClick={() => onChange(opt.value)}
            // 选中时用主色边框+背景+光晕，未选中时悬停才有轻微反馈，引导用户操作
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
              active
                ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-200'
                : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40'
            }`}
          >
            {/* 选项图标，用 emoji 直观区分不同选项 */}
            <span className="text-2xl">{opt.icon}</span>
            <span className="flex-1">
              {/* 选项标题，选中时变色强化反馈 */}
              <span className={`block text-sm font-semibold ${active ? 'text-brand-700' : 'text-slate-700'}`}>
                {opt.label}
              </span>
              {/* 部分选项带有补充说明，有则显示，没有则不渲染 */}
              {opt.description && (
                <span className="mt-0.5 block text-xs text-slate-400">{opt.description}</span>
              )}
            </span>
            {/* 右侧的单选圆点：选中时填充主色并显示白点，未选中时只显示空心圆框 */}
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
