/**
 * 文件用途：副业发展路径区块组件（Feature 3 的入口与状态管理）。
 *
 * 这是一个"可折叠"的卡片区块，负责：
 * 1. 展示"副业发展路径"标题（带树状图标）；
 * 2. 调用 useSideHustleTree 这个 Hook 向后端请求生成发展路径树；
 * 3. 根据当前状态（未生成 / 加载中 / 出错 / 已生成）展示不同内容；
 * 4. 已生成时，把树数据交给 SideHustleTreeGraph 画出来。
 *
 * 交互说明：
 * - 默认折叠，只显示标题栏；点击标题栏可展开/收起。
 * - 折叠状态下提供"生成发展路径图"按钮，点一下即可展开并开始生成。
 */

// useState：记录区块是否展开
import { useState } from 'react'
// 图标：
//   Network —— 树状网络，作为区块标题图标
//   ChevronDown —— 下拉箭头，展开/收起的视觉提示
//   Sparkles —— 星星，代表 AI 生成动作
//   Loader2 —— 加载圈，配合 animate-spin 做旋转动画
//   AlertCircle —— 警告圆圈，出错时提示
//   RefreshCw —— 刷新箭头，"重试 / 重新生成"按钮
import { Network, ChevronDown, Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
// 引入方案的数据类型定义（从中取标题、简介、标签传给后端）
import type { Plan } from '@/types'
// 引入副业发展路径树的 Hook：负责请求 + 状态管理
import { useSideHustleTree } from '@/hooks/useSideHustleTree'
// 引入树形可视化组件：树数据就绪后用它来画图
import { SideHustleTreeGraph } from './SideHustleTreeGraph'

interface SideHustleTreeSectionProps {
  // 当前查看的副业方案；标题/简介/标签会作为生成路径树的依据
  plan: Plan
}

export function SideHustleTreeSection({ plan }: SideHustleTreeSectionProps) {
  // 从 Hook 获取：树数据、加载中标记、错误信息、生成方法
  const { tree, loading, error, generateTree } = useSideHustleTree()
  // 控制区块展开/收起，默认折叠（false），避免一进详情页就占很大空间
  const [expanded, setExpanded] = useState(false)

  /**
   * 生成发展路径图：展开区块 + 调用后端生成。
   * 把方案的标题、简介、标签作为技能列表一起发给后端，供 AI 参考生成路径。
   */
  const handleGenerate = () => {
    // 先展开，让用户立刻看到加载状态
    setExpanded(true)
    // 调用 Hook 提供的生成方法（内部会管理 loading / error / tree 状态）
    void generateTree(plan.title, plan.summary, plan.tags)
  }

  // 是否已经拿到树数据（用来区分"未生成"和"已生成"两种展示）
  const hasTree = !!tree

  return (
    // 整个区块用 .card 样式；overflow-hidden 让折叠时的圆角裁剪更干净
    <section className="card overflow-hidden">
      {/* 标题栏：左侧可点击展开/收起，右侧在折叠且未生成时放一个生成按钮 */}
      <div className="flex items-center justify-between gap-3 p-6">
        {/* 点击标题区域切换展开/收起；用 button 保证可键盘操作和无障碍 */}
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-2 text-left"
          // aria-expanded 告诉屏幕阅读器当前展开状态，提升无障碍体验
          aria-expanded={expanded}
        >
          {/* 树状图标，用品牌色突出 */}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
            <Network size={18} />
          </span>
          <h2 className="text-base font-semibold text-slate-800">副业发展路径</h2>
          {/* 下拉箭头：展开时旋转 180 度，直观反映状态 */}
          <ChevronDown
            size={16}
            className={`shrink-0 text-slate-400 transition ${expanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/*
          折叠状态下，若还没有树、也没在加载，则显示一个"生成"按钮。
          这样用户无需先展开就能一键生成（点击会同时展开并开始生成）。
        */}
        {!expanded && !hasTree && !loading && (
          <button type="button" onClick={handleGenerate} className="btn-primary px-4 py-2">
            <Sparkles size={16} />
            生成发展路径图
          </button>
        )}
      </div>

      {/* 展开时才渲染主体内容；用顶部细线与标题栏分隔 */}
      {expanded && (
        <div className="border-t border-slate-100 px-6 pb-6 pt-4">
          {/* 根据状态分别渲染：加载中 → 出错 → 已生成 → 未生成 */}
          {loading ? (
            <LoadingView />
          ) : error ? (
            <ErrorView message={error} onRetry={handleGenerate} />
          ) : hasTree && tree ? (
            <div className="space-y-4">
              {/* 树数据就绪，交给可视化组件画图 */}
              <SideHustleTreeGraph tree={tree} />
              {/* 已生成后允许重新生成，覆盖旧结果 */}
              <div className="flex justify-end">
                <button type="button" onClick={handleGenerate} className="btn-ghost">
                  <RefreshCw size={16} />
                  重新生成
                </button>
              </div>
            </div>
          ) : (
            <PromptView onGenerate={handleGenerate} />
          )}
        </div>
      )}
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*                          未生成时的引导提示                                  */
/* -------------------------------------------------------------------------- */

interface PromptViewProps {
  // 点击"生成发展路径图"按钮的回调
  onGenerate: () => void
}

/**
 * 未生成时的引导视图：用一段话告诉用户这个功能能做什么，并提供生成按钮。
 */
function PromptView({ onGenerate }: PromptViewProps) {
  return (
    <div className="rounded-xl bg-brand-50/60 p-5 text-center">
      <p className="text-sm leading-relaxed text-slate-600">
        AI 可以根据这个方案，生成一条
        <span className="font-semibold text-brand-600">从起步到大师</span>
        的发展路径图，帮你看清每个阶段的
        <span className="font-medium text-slate-700">收入预期、所需技能和时间投入</span>。
      </p>
      <button type="button" onClick={onGenerate} className="btn-primary mt-4">
        <Sparkles size={16} />
        生成发展路径图
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                              加载中视图                                     */
/* -------------------------------------------------------------------------- */

/**
 * 加载中视图：旋转的加载圈 + 提示文案，告诉用户 AI 正在工作、请稍候。
 */
function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* animate-spin 让加载圈持续旋转，形成"正在处理"的动效 */}
      <Loader2 size={28} className="animate-spin text-brand-500" />
      <p className="mt-3 text-sm text-slate-500">正在生成发展路径图，请稍候…</p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                               出错视图                                      */
/* -------------------------------------------------------------------------- */

interface ErrorViewProps {
  // 错误信息，展示给用户看
  message: string
  // 点击"重试"按钮的回调
  onRetry: () => void
}

/**
 * 出错视图：展示错误原因，并提供"重试"按钮让用户重新尝试。
 */
function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {/* 红色警告图标，直观提示出现了问题 */}
      <AlertCircle size={28} className="text-red-400" />
      <p className="mt-3 max-w-md text-sm text-slate-500">{message}</p>
      <button type="button" onClick={onRetry} className="btn-ghost mt-4">
        <RefreshCw size={16} />
        重试
      </button>
    </div>
  )
}
