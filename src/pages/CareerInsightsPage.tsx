/**
 * 文件用途：职业洞察页（Feature 2 的主页面）。
 *
 * 用户在问卷页选择了职业/技能后，可进入本页查看 AI 给出的"职业洞察"。
 * 本页会自动调用后端 /api/analyze 接口，获取三部分内容并依次展示：
 *   1. 行业趋势 —— 当前哪些副业方向正在兴起
 *   2. 新型副业预测 —— 基于趋势推测出的新兴副业机会（创新亮点）
 *   3. 职业技能分析 —— 对用户所选职业方向的深度分析
 *
 * 页面会根据不同状态（无技能 / 加载中 / 出错 / 成功）显示对应界面。
 */

// useEffect 用于在进入页面时自动触发首次分析
import { useEffect } from 'react'
// useNavigate 用于点击"返回"按钮跳转回首页
import { useNavigate } from 'react-router-dom'
// 引入所需图标：
// - ArrowLeft：返回按钮的左箭头
// - TrendingUp：行业趋势区块标题图标
// - Sparkles：新型副业预测区块标题图标（呼应"创新亮点"）
// - BarChart3：职业技能分析区块标题图标
// - Compass：页面顶部标题图标，呼应"洞察/指引方向"
// - ClipboardList：空状态图标，提示用户先去选择职业
import { ArrowLeft, TrendingUp, Sparkles, BarChart3, Compass, ClipboardList } from 'lucide-react'
// 引入全局状态仓库，读取用户画像（其中含已选技能列表）
import { useAppStore } from '@/store/appStore'
// 引入职业洞察分析的自定义 Hook，提供 analyze 方法及 loading/error/insights 状态
import { useCareerInsights } from '@/hooks/useCareerInsights'
// 引入职业分类工具函数，把技能 value 转成可读的职业项（带标签、图标）
import { findCareersByValues } from '@/constants/careers'
// 引入三个洞察卡片组件，分别对应三类内容
import { TrendCard } from '@/components/insights/TrendCard'
import { EmergingHustleCard } from '@/components/insights/EmergingHustleCard'
import { CareerAnalysisCard } from '@/components/insights/CareerAnalysisCard'
// 引入通用的加载、错误状态组件
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { ErrorState } from '@/components/common/ErrorState'

/**
 * SectionHeader：区块标题的内部小组件。
 * 把"图标 + 标题 + 说明"统一排版，三个区块复用同一种样式。
 * 这个组件只在本文件内使用，所以不导出。
 */
function SectionHeader({
  icon: Icon,   // 图标组件
  title,        // 区块标题
  desc,         // 区块说明
}: {
  icon: typeof TrendingUp
  title: string
  desc: string
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {/* 品牌紫方块包裹图标 */}
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
        <Icon size={20} />
      </span>
      <div>
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </div>
  )
}

export function CareerInsightsPage() {
  // 从全局状态读取用户画像（可能为 null，表示还没填问卷）
  const profile = useAppStore((s) => s.profile)
  // analyze 触发分析；loading 表示是否请求中；error 存放错误信息；insights 存放分析结果
  const { insights, loading, error, analyze } = useCareerInsights()
  // 获取路由跳转方法，用于"返回"按钮
  const navigate = useNavigate()

  /**
   * 进入页面时的副作用：如果用户已选了技能、且还没分析过、且不在加载、也没报错，就自动触发一次分析。
   * 依赖只写 [profile]：只在画像变化时触发，避免 insights/loading/error 变化导致重复请求。
   * 这与 ResultsPage 的自动生成逻辑保持一致的设计模式。
   */
  useEffect(() => {
    // 没有画像、或画像里没有技能，就不触发分析（由下方空状态引导用户去选）
    if (!profile?.skills || profile.skills.length === 0) return
    // 已有结果、正在加载、或已报错时都不重复触发
    if (insights || loading || error) return
    void analyze(profile.skills)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  /**
   * 重试分析：出错后用户点击"重试"时调用，用当前画像的技能重新请求一次。
   */
  const handleRetry = () => {
    if (profile?.skills && profile.skills.length > 0) {
      void analyze(profile.skills)
    }
  }

  /**
   * 判断是否"无技能"：没有画像、或画像里技能列表为空。
   * 此时显示空状态，引导用户先返回选择职业。
   */
  const hasSkills = !!profile?.skills && profile.skills.length > 0

  // —— 状态1：无技能，显示空状态，引导用户先去选择职业 ——
  if (!hasSkills) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        {/* 灰色剪贴板图标，呼应"需要先填写/选择"的语义 */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <ClipboardList size={28} />
        </div>
        <h1 className="text-lg font-semibold text-slate-700">还没有选择职业方向</h1>
        <p className="mt-2 text-sm text-slate-400">
          请先返回选择你感兴趣的职业方向，AI 才能为你分析行业趋势与机会
        </p>
        {/* 点击返回首页（问卷页），让用户先选择职业 */}
        <button onClick={() => navigate('/')} className="btn-primary mt-6">
          去选择职业方向
        </button>
      </div>
    )
  }

  // —— 状态2：正在分析且还没有结果，显示加载动画 ——
  if (loading && !insights) {
    return <LoadingScreen />
  }

  // —— 状态3：分析出错且没有结果，显示错误页并提供重试 ——
  if (error && !insights) {
    return (
      <ErrorState
        title="分析失败"
        message={error}
        onRetry={handleRetry}
        onBack={() => navigate('/')}
        backLabel="返回选择职业"
      />
    )
  }

  // —— 状态4：成功，展示三类洞察内容 ——

  // 把技能 value 转成可读的职业项，用于在顶部展示"当前分析的职业"
  const selectedCareers = findCareersByValues(profile.skills)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* —— 页面顶部标题区 —— */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5">
          {/* 品牌紫方块包裹指南针图标，呼应"洞察/指引方向" */}
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white">
            <Compass size={22} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-800">职业洞察</h1>
            <p className="text-sm text-slate-400">AI 正在分析行业趋势，为你预测副业新机会</p>
          </div>
        </div>

        {/* 当前已选职业方向：用标签展示，让用户清楚本次分析基于哪些职业 */}
        {selectedCareers.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400">本次分析基于：</span>
            {selectedCareers.map((c) => (
              <span key={c.value} className="tag bg-brand-50 text-brand-600">
                {c.icon} {c.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* —— 区块一：行业趋势 —— */}
      {insights && insights.trends.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            icon={TrendingUp}
            title="行业趋势"
            desc="当前正在兴起的副业方向与机会"
          />
          {/* 三列网格展示趋势卡片，小屏单列、中屏两列、大屏三列 */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.trends.map((trend) => (
              <TrendCard key={trend.trend} trend={trend} />
            ))}
          </div>
        </section>
      )}

      {/* —— 区块二：新型副业预测（创新亮点）—— */}
      {insights && insights.emergingHustles.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            icon={Sparkles}
            title="新型副业预测"
            desc="基于趋势推测的新兴副业机会，抢先布局"
          />
          {/* 两列网格展示新型副业卡片 */}
          <div className="grid gap-4 sm:grid-cols-2">
            {insights.emergingHustles.map((hustle) => (
              <EmergingHustleCard key={hustle.name} hustle={hustle} />
            ))}
          </div>
        </section>
      )}

      {/* —— 区块三：职业技能分析 —— */}
      {insights && insights.careerAnalysis.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            icon={BarChart3}
            title="职业技能分析"
            desc="对你所选职业方向的深度分析，点击卡片展开详情"
          />
          {/* 单列展示可折叠卡片，纵向堆叠 */}
          <div className="flex flex-col gap-3">
            {insights.careerAnalysis.map((analysis) => (
              <CareerAnalysisCard key={analysis.careerName} analysis={analysis} />
            ))}
          </div>
        </section>
      )}

      {/* —— 底部：整体总结建议（高亮卡片）—— */}
      {insights?.summary && (
        <section className="mb-6">
          {/*
            总结卡片用品牌紫渐变背景 + 白色文字，与普通卡片区分，
            突出"这是最终的总结建议"。
          */}
          <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 p-6 text-white shadow-card">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={18} />
              <h2 className="text-base font-bold">总结建议</h2>
            </div>
            <p className="text-sm leading-relaxed text-white/90">{insights.summary}</p>
          </div>
        </section>
      )}

      {/* —— 返回按钮：回到首页 —— */}
      <button onClick={() => navigate('/')} className="btn-ghost">
        <ArrowLeft size={16} /> 返回
      </button>
    </div>
  )
}
