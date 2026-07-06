/**
 * 文件用途：单个新型副业预测卡片组件。
 *
 * 这是 Feature 2 的"创新亮点"卡片：AI 不只是推荐已有副业，还会预测未来的新机会。
 * 为了体现"新颖、前沿"的感觉，本卡片在视觉上做了特别处理——
 * 外层用品牌紫渐变作为边框，让它在众多卡片中脱颖而出。
 *
 * 卡片内容包含：副业名称、类别徽章、详细描述、为什么兴起、
 * 收入潜力/上手难度/风险等级（三宫格）、所需技能标签、预计上手时间。
 */

// Sparkles 是"闪光星星"图标，呼应"新颖、闪亮的新机会"语义
import { Sparkles, Wallet, Gauge, AlertTriangle, Clock } from 'lucide-react'
// 引入新型副业预测的数据类型定义
import type { EmergingSideHustle } from '@/types/career'

/**
 * 本组件接收的参数。
 * - hustle：一条新型副业预测数据
 */
interface EmergingHustleCardProps {
  hustle: EmergingSideHustle
}

export function EmergingHustleCard({ hustle }: EmergingHustleCardProps) {
  /*
    渐变边框技巧：外层 div 设置一个紫色渐变背景并留出 1.5px 的内边距，
    内层 div 再覆盖白色背景，这样露出来的就是一圈渐变"边框"。
    比直接用纯色边框更有层次感和高级感，呼应"创新亮点"的定位。
  */
  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 p-[1.5px] shadow-card-hover">
      {/* 内层白色卡片，h-full 让它撑满外层高度，保持渐变边框上下一致 */}
      <div className="flex h-full flex-col rounded-2xl bg-white p-5">
        {/* 顶部：渐变图标方块 + 副业名称 + 类别徽章 */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* 图标方块本身也用渐变背景，与外边框呼应，强化"创新"视觉主题 */}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white">
              <Sparkles size={18} />
            </span>
            {/* 新型副业名称，加粗显示 */}
            <h3 className="text-base font-bold text-slate-800">{hustle.name}</h3>
          </div>
          {/* 类别徽章：品牌浅紫底色，标明这条副业属于哪个大类 */}
          <span className="tag shrink-0 bg-brand-50 text-brand-600">{hustle.category}</span>
        </div>

        {/* 详细描述：说明这个副业是什么、怎么做 */}
        <p className="text-sm leading-relaxed text-slate-500">{hustle.description}</p>

        {/* "为什么兴起"高亮区：用品牌浅紫背景突出，这是本卡片的重点信息 */}
        <div className="mt-3 rounded-xl bg-brand-50/60 p-3">
          <p className="text-xs font-semibold text-brand-600">为什么会兴起</p>
          <p className="mt-1 text-sm text-slate-600">{hustle.whyEmerging}</p>
        </div>

        {/*
          三宫格：收入潜力 / 上手难度 / 风险等级。
          用 grid 分成三列，每格一个图标+标签+数值，让用户一眼对比关键指标。
        */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {/* 收入潜力：钱包图标 */}
          <div className="rounded-lg bg-slate-50 p-2.5 text-center">
            <Wallet size={16} className="mx-auto text-slate-400" />
            <p className="mt-1 text-[10px] text-slate-400">收入潜力</p>
            <p className="text-xs font-semibold text-slate-700">{hustle.potentialIncome}</p>
          </div>
          {/* 上手难度：仪表盘图标 */}
          <div className="rounded-lg bg-slate-50 p-2.5 text-center">
            <Gauge size={16} className="mx-auto text-slate-400" />
            <p className="mt-1 text-[10px] text-slate-400">上手难度</p>
            <p className="text-xs font-semibold text-slate-700">{hustle.difficulty}</p>
          </div>
          {/* 风险等级：警告三角图标 */}
          <div className="rounded-lg bg-slate-50 p-2.5 text-center">
            <AlertTriangle size={16} className="mx-auto text-slate-400" />
            <p className="mt-1 text-[10px] text-slate-400">风险等级</p>
            <p className="text-xs font-semibold text-slate-700">{hustle.riskLevel}</p>
          </div>
        </div>

        {/* 所需技能标签：把每项技能渲染成胶囊标签，flex-wrap 自动换行 */}
        {hustle.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {hustle.skills.map((skill) => (
              <span key={skill} className="tag bg-slate-100 text-slate-600">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* 底部：进入门槛 + 预计上手时间，用分隔线与上方内容区分 */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>门槛：{hustle.entryBarrier}</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {hustle.timeToStart}
          </span>
        </div>
      </div>
    </div>
  )
}
