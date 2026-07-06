/**
 * 文件用途：结果页（第二步"方案"）。
 * 用户提交画像后进入此页，自动调用 AI 生成 3 个副业方案并以卡片展示，
 * 同时根据加载/错误/空数据等不同状态显示对应的界面。
 */

// useEffect 用于在进入页面时触发首次生成
import { useEffect } from 'react'
// useNavigate 用于跳转；ArrowLeft 用于返回按钮
import { useNavigate } from 'react-router-dom'
// ArrowLeft（左箭头）、RefreshCw（刷新，用于"换一批"）
import { ArrowLeft, RefreshCw } from 'lucide-react'
// 引入全局状态仓库，读取用户画像和已生成的方案
import { useAppStore } from '@/store/appStore'
// 引入生成方案的自定义 Hook，提供 generate 方法及 loading/error 状态
import { useGenerate } from '@/hooks/useGenerate'
// 引入方案卡片、空状态、渠道总览等结果页专用组件
import { PlanCard } from '@/components/results/PlanCard'
import { EmptyState } from '@/components/results/EmptyState'
import { ChannelsOverview } from '@/components/results/ChannelsOverview'
// 引入通用的加载、错误、骨架屏组件，用于不同状态的展示
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { ErrorState } from '@/components/common/ErrorState'
import { SkeletonCard } from '@/components/common/SkeletonCard'

export function ResultsPage() {
  // 从全局状态读取画像和方案列表
  const profile = useAppStore((s) => s.profile)
  const plans = useAppStore((s) => s.plans)
  // generate 触发生成；loading 表示是否在请求中；error 存放错误信息
  const { generate, loading, error } = useGenerate()
  const navigate = useNavigate()

  // 进入页面时的副作用：确保有画像且没有方案时自动生成一次
  useEffect(() => {
    // 没有画像说明用户没填问卷，直接回首页（replace 让用户按返回键不回到这个空页面）
    if (!profile) {
      navigate('/', { replace: true })
      return
    }
    // 有画像但还没方案、且当前不在加载、也没报错，就触发首次生成
    if (plans.length === 0 && !loading && !error) {
      void generate(profile)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // 依赖只写 profile：只在画像变化时触发，避免 plans/loading 变化导致重复生成
  }, [profile])

  // 重试生成：出错后用户点击"重试"时调用
  const handleRetry = () => {
    if (profile) void generate(profile)
  }

  // 没有画像（被重定向前的一帧）不渲染内容
  if (!profile) return null

  // 状态1：首次生成中，显示全屏加载动画
  if (loading && plans.length === 0) {
    return <LoadingScreen />
  }

  // 状态2：已有方案但正在"换一批"刷新，用骨架屏保留旧布局，避免页面闪空
  if (loading && plans.length > 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* 顶部标题占位 */}
        <div className="mb-6 h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  // 状态3：生成出错且没有任何方案，显示错误页，提供重试和返回
  if (error && plans.length === 0) {
    return (
      <ErrorState
        message={error}
        onRetry={handleRetry}
        onBack={() => navigate('/')}
      />
    )
  }

  // 状态4：无方案也无错误（理论上少见），显示空状态引导用户去填问卷
  if (plans.length === 0) {
    return <EmptyState />
  }

  // 状态5：成功，展示方案卡片列表 + 渠道总览
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">你的副业方案</h1>
          <p className="mt-1 text-sm text-slate-400">AI 为你生成了 {plans.length} 个方向，点击查看详情</p>
        </div>
        {/* "换一批"：基于同一画像重新生成；刷新中禁用按钮并让图标旋转 */}
        <button onClick={handleRetry} disabled={loading} className="btn-ghost">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 换一批
        </button>
      </div>

      {/* 三列网格展示方案卡片，点击进入详情页 */}
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan, idx) => (
          <PlanCard key={plan.id} plan={plan} index={idx} />
        ))}
      </div>

      {/* 渠道总览：汇总去重所有方案的赚钱渠道 */}
      <ChannelsOverview plans={plans} />

      {/* 返回按钮：回到问卷页修改画像后可重新生成 */}
      <button onClick={() => navigate('/')} className="btn-ghost mt-6">
        <ArrowLeft size={16} /> 返回修改画像
      </button>
    </div>
  )
}
