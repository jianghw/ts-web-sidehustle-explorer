import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useGenerate } from '@/hooks/useGenerate'
import { PlanCard } from '@/components/results/PlanCard'
import { EmptyState } from '@/components/results/EmptyState'
import { ChannelsOverview } from '@/components/results/ChannelsOverview'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { ErrorState } from '@/components/common/ErrorState'
import { SkeletonCard } from '@/components/common/SkeletonCard'

export function ResultsPage() {
  const profile = useAppStore((s) => s.profile)
  const plans = useAppStore((s) => s.plans)
  const { generate, loading, error } = useGenerate()
  const navigate = useNavigate()

  useEffect(() => {
    if (!profile) {
      navigate('/', { replace: true })
      return
    }
    if (plans.length === 0 && !loading && !error) {
      void generate(profile)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const handleRetry = () => {
    if (profile) void generate(profile)
  }

  if (!profile) return null

  // 加载中（首次生成）
  if (loading && plans.length === 0) {
    return <LoadingScreen />
  }

  // 换一批刷新中：骨架网格
  if (loading && plans.length > 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  // 错误态
  if (error && plans.length === 0) {
    return (
      <ErrorState
        message={error}
        onRetry={handleRetry}
        onBack={() => navigate('/')}
      />
    )
  }

  // 空态
  if (plans.length === 0) {
    return <EmptyState />
  }

  // 成功：方案卡片列表
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">你的副业方案</h1>
          <p className="mt-1 text-sm text-slate-400">AI 为你生成了 {plans.length} 个方向，点击查看详情</p>
        </div>
        <button onClick={handleRetry} disabled={loading} className="btn-ghost">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 换一批
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan, idx) => (
          <PlanCard key={plan.id} plan={plan} index={idx} />
        ))}
      </div>

      <ChannelsOverview plans={plans} />

      <button onClick={() => navigate('/')} className="btn-ghost mt-6">
        <ArrowLeft size={16} /> 返回修改画像
      </button>
    </div>
  )
}
