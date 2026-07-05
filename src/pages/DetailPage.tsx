import { useParams, Navigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { SummaryHeader } from '@/components/detail/SummaryHeader'
import { ProsConsSection } from '@/components/detail/ProsConsSection'
import { ChannelsSection } from '@/components/detail/ChannelsSection'
import { GuideTimeline } from '@/components/detail/GuideTimeline'
import { LearningResourcesSection } from '@/components/detail/LearningResourcesSection'
import { ActionToolbar } from '@/components/detail/ActionToolbar'

export function DetailPage() {
  const { id } = useParams()
  const plans = useAppStore((s) => s.plans)

  const plan = plans.find((p) => p.id === id)

  // 找不到方案时重定向回列表
  if (!plan) {
    return <Navigate to="/results" replace />
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <SummaryHeader plan={plan} />
      <ProsConsSection pros={plan.pros} cons={plan.cons} />
      <ChannelsSection channels={plan.channels} />
      <GuideTimeline guide={plan.guide} />
      {plan.learningResources && plan.learningResources.length > 0 && (
        <LearningResourcesSection resources={plan.learningResources} />
      )}

      <ActionToolbar plan={plan} />
    </div>
  )
}
