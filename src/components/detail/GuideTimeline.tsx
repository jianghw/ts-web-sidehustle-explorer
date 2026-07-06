/**
 * 文件用途：操作指南时间轴组件。
 * 把一个副业方案的操作步骤按顺序排成一条竖向时间轴，
 * 每个步骤可以展开查看详细说明、所需工具和耗时，帮助用户一步步上手。
 */

// useState 用于控制每个步骤的展开/折叠状态
import { useState } from 'react'
// 三个图标：ChevronDown（下拉箭头，表示可展开）、Wrench（工具）、Clock（耗时）
import { ChevronDown, Wrench, Clock } from 'lucide-react'
// 引入操作步骤的数据类型定义
import type { GuideStep } from '@/types'

export function GuideTimeline({ guide }: { guide: GuideStep[] }) {
  return (
    <section className="card p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-800">操作指南</h2>
      {/* 左侧竖线 + 左侧留白，营造时间轴的视觉效果 */}
      <ol className="relative space-y-3 border-l-2 border-brand-100 pl-6">
        {guide.map((step, idx) => (
          <GuideStepItem key={idx} step={step} />
        ))}
        {/* 没有步骤时显示占位提示 */}
        {guide.length === 0 && (
          <li className="text-sm text-slate-400">暂无操作指南</li>
        )}
      </ol>
    </section>
  )
}

// 单个步骤项：可点击展开/折叠，避免一次性显示太多文字让页面拥挤
function GuideStepItem({ step }: { step: GuideStep }) {
  // open 控制当前步骤是否展开
  const [open, setOpen] = useState(false)

  return (
    <li className="relative">
      {/* 步骤序号点：用绝对定位贴在时间轴竖线上，ring-4 白色描边让它"咬"在竖线上 */}
      <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white ring-4 ring-white">
        {step.step}
      </span>

      {/* 点击标题行切换展开/折叠 */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-slate-50"
      >
        <span className="text-sm font-medium text-slate-700">{step.title}</span>
        {/* 箭头在展开时旋转 180 度，提示当前状态 */}
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 展开时显示详细内容 */}
      {open && (
        <div className="mt-1 px-3 pb-2">
          <p className="text-sm text-slate-600">{step.content}</p>
          {/* 工具和耗时是可选信息，有任一才渲染这一行 */}
          {(step.tools?.length || step.duration) && (
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
              {/* 用顿号连接多个工具名 */}
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
