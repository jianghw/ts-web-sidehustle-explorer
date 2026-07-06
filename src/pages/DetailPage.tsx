/**
 * 文件用途：详情页（第三步"详情"）。
 * 根据网址中的方案 id，从全局状态里找到对应方案，展示它的完整信息：
 * 摘要头部、优缺点、赚钱渠道、操作指南、学习资源，以及底部的操作工具栏。
 */

// useParams 用于读取网址中的动态参数（方案 id）；Navigate 用于找不到方案时重定向
import { useParams, Navigate } from 'react-router-dom'
// 引入全局状态仓库，从中读取所有已生成的方案
import { useAppStore } from '@/store/appStore'
// 引入详情页的各个区块组件
import { SummaryHeader } from '@/components/detail/SummaryHeader'
import { ProsConsSection } from '@/components/detail/ProsConsSection'
import { ChannelsSection } from '@/components/detail/ChannelsSection'
import { GuideTimeline } from '@/components/detail/GuideTimeline'
import { LearningResourcesSection } from '@/components/detail/LearningResourcesSection'
// 引入副业发展路径区块（Feature 3）：AI 生成从起步到大师的发展路径树
import { SideHustleTreeSection } from '@/components/tree/SideHustleTreeSection'
import { ActionToolbar } from '@/components/detail/ActionToolbar'

export function DetailPage() {
  // 从网址读取方案 id，例如 /detail/abc 中的 "abc"
  const { id } = useParams()
  // 从全局状态获取所有方案
  const plans = useAppStore((s) => s.plans)

  // 在方案列表里查找与网址 id 匹配的那一个
  const plan = plans.find((p) => p.id === id)

  // 找不到方案时重定向回列表页（replace 让用户按返回键不回到这个无效页面）
  if (!plan) {
    return <Navigate to="/results" replace />
  }

  return (
    // space-y-4 让各区块之间有均匀间距，整体阅读节奏更舒适
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      {/* 顶部摘要：标题、匹配度、难度、收入等核心信息 */}
      <SummaryHeader plan={plan} />
      {/* 优缺点分析：帮助用户权衡利弊 */}
      <ProsConsSection pros={plan.pros} cons={plan.cons} />
      {/* 赚钱渠道：这个方案可以通过哪些渠道落地 */}
      <ChannelsSection channels={plan.channels} />
      {/* 操作指南：按步骤说明如何执行这个方案 */}
      <GuideTimeline guide={plan.guide} />
      {/* 学习资源：有内容才渲染，避免出现空区块 */}
      {plan.learningResources && plan.learningResources.length > 0 && (
        <LearningResourcesSection resources={plan.learningResources} />
      )}
      {/* 副业发展路径（Feature 3）：可折叠区块，点击生成由 AI 画出发展路径树 */}
      <SideHustleTreeSection plan={plan} />

      {/* 底部操作栏：调整画像 / 换一批 / 收藏，固定悬浮在底部 */}
      <ActionToolbar plan={plan} />
    </div>
  )
}
