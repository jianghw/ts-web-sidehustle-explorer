/**
 * 文件用途：单个职业技能分析卡片组件（可折叠）。
 *
 * 在"职业洞察"页里，AI 会对用户选择的每个职业方向做深度分析。
 * 由于分析内容较多，本卡片默认只显示职业名称，点击后展开查看详情，
 * 这样既能浏览全部职业，又不会让页面一次性塞满信息。
 *
 * 展开后包含：市场需求、收入潜力、竞争程度、发展前景（四宫格），
 * 核心技能与推荐平台（标签），以及入行建议（要点列表）。
 */

// useState 是 React 提供的"状态管理"钩子，这里用来记录卡片是否展开
import { useState } from 'react'
// BarChart3 是"柱状图"图标，呼应"数据分析"主题；ChevronDown 是向下箭头，指示展开方向
import { BarChart3, ChevronDown, CheckCircle2 } from 'lucide-react'
// 引入职业技能分析的数据类型定义
import type { CareerAnalysis } from '@/types/career'

/**
 * 本组件接收的参数。
 * - analysis：一条职业技能分析数据
 */
interface CareerAnalysisCardProps {
  analysis: CareerAnalysis
}

export function CareerAnalysisCard({ analysis }: CareerAnalysisCardProps) {
  // open 记录当前卡片是否展开，初始为 false（默认收起）
  const [open, setOpen] = useState(false)

  return (
    // 使用项目统一的 .card 样式
    <div className="card overflow-hidden transition hover:shadow-card-hover">
      {/*
        卡片头部：点击可展开/收起。
        整个头部做成 button，方便键盘焦点和无障碍访问（aria-expanded 状态供读屏软件识别）。
      */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        // aria-expanded 告诉读屏软件这个折叠区当前是否展开
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 p-5 text-left"
      >
        <div className="flex items-center gap-2">
          {/* 品牌紫方块包裹柱状图图标，呼应"分析"主题 */}
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
            <BarChart3 size={18} />
          </span>
          {/* 职业名称，加粗显示 */}
          <h3 className="text-sm font-semibold text-slate-800">{analysis.careerName}</h3>
        </div>
        {/*
          展开箭头：收起时朝下，展开时旋转 180 度朝上。
          transition 让旋转有平滑动画，transition-transform 只对 transform 属性生效更高效。
        */}
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/*
        展开内容区：仅当 open 为 true 时渲染。
        用 border-t 在头部和内容之间加分隔线。
      */}
      {open && (
        <div className="border-t border-slate-100 p-5">
          {/*
            四宫格：市场需求 / 收入潜力 / 竞争程度 / 发展前景。
            两列网格，每格一个标签+内容，让用户快速把握这个职业的全貌。
          */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-400">市场需求</p>
              <p className="mt-1 text-sm text-slate-700">{analysis.marketDemand}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-400">收入潜力</p>
              <p className="mt-1 text-sm text-slate-700">{analysis.incomePotential}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-400">竞争程度</p>
              <p className="mt-1 text-sm text-slate-700">{analysis.competitionLevel}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-400">发展前景</p>
              <p className="mt-1 text-sm text-slate-700">{analysis.growthOutlook}</p>
            </div>
          </div>

          {/* 核心技能标签：每项技能渲染成胶囊标签 */}
          {analysis.keySkills.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-medium text-slate-400">核心技能</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.keySkills.map((skill) => (
                  <span key={skill} className="tag bg-brand-50 text-brand-600">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 推荐变现平台标签：用浅灰底色与技能标签区分 */}
          {analysis.recommendedPlatforms.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-medium text-slate-400">推荐变现平台</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.recommendedPlatforms.map((platform) => (
                  <span key={platform} className="tag bg-slate-100 text-slate-600">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 入行建议：要点列表，每条前配一个品牌色对勾图标 */}
          {analysis.tips.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-medium text-slate-400">入行建议</p>
              <ul className="space-y-1.5">
                {analysis.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-sm text-slate-600">
                    {/* CheckCircle2 对勾图标，品牌紫，shrink-0 防止被挤压 */}
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-brand-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
