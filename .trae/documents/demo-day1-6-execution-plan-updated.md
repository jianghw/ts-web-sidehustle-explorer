# 人生副业体验器 - Day1-Day6 执行计划（更新版）

## Summary

本计划为 TRAE AI 创造力大赛初赛 Demo「人生副业体验器」（生活娱乐赛道，报名帖 https://forum.trae.cn/t/topic/45038）的 Day1-Day6 落地执行方案。

项目采用「Vite + React + TailwindCSS 前端 + Vercel Serverless Functions (api/目录) BFF 后端 + 豆包大模型(火山方舟 Ark)」架构，单一 Vercel 项目部署。

核心数据流：用户填写画像问卷(技能/时间/收入目标/风险偏好/预算) → 前端 POST `/api/generate` → BFF 组装 Prompt 调用豆包(JSON mode 结构化输出) → 返回 3 个个性化副业方案(含优缺点/赚钱渠道/操作指南) → 前端列表页展示卡片 + 详情页展开完整内容。

**当前进度**：Day1-Day4 已完成并通过验证，Day5-Day6 待实施。本计划重点详述 Day5-Day6 的剩余工作。

## Current State Analysis

### Day1-Day4 已完成清单

**Day1（项目初始化 + 画像问卷页）- ✅ 完成**
- 配置文件：`package.json`、`vite.config.ts`（proxy /api → localhost:3001）、`tailwind.config.js`（brand 色板）、`postcss.config.js`、`tsconfig.json`（单配置无 project references）、`index.html`、`vercel.json`（rewrite 排除 /api）、`.env.example`、`.gitignore`
- 前端骨架：`src/main.tsx`、`src/App.tsx`（路由 / → /results → /detail/:id）、`src/styles/index.css`
- 类型与状态：`src/types/index.ts`（Profile/Plan/GuideStep/Channel）、`src/store/appStore.ts`（zustand: profile/plans/loading/error + reset）、`src/hooks/useLocalStorage.ts`
- 问卷页：`src/constants/questionnaire.ts`（5 题数据驱动）、`src/pages/QuestionnairePage.tsx`、`src/components/questionnaire/SkillSelect.tsx`、`SliderGroup.tsx`、`RadioCard.tsx`
- 布局：`src/components/layout/Header.tsx`、`Footer.tsx`
- 验证通过：dev server 运行、localStorage 草稿持久化、提交跳转 /results、build 无 TS 错误、深链正常

**Day2（豆包 API 接入 + BFF + Prompt 工程）- ✅ 完成**
- BFF 后端：`api/_lib/ark.ts`（OpenAI SDK 兼容封装）、`api/_lib/prompt.ts`（system prompt 要求 3 差异化方案 + 全字段结构）、`api/_lib/schemas.ts`（validatePlans 运行时校验 + 容错）、`api/_lib/types.ts`、`api/_lib/mock.ts`（3 个 mock 方案）、`api/generate.ts`（Vercel Function: CORS + retry + mock fallback）、`api/_dev.ts`（本地 3001 端口）
- 前端服务：`src/services/api.ts`（60s AbortController 超时 + 错误提取）、`src/hooks/useGenerate.ts`
- 验证通过：vite proxy 生效、BFF 收发请求正常、retry 逻辑工作、无 API Key 泄露、dev 模式 mock fallback 正常

**Day3-4（方案展示页 + 详情交互）- ✅ 完成**
- 结果页：`src/pages/ResultsPage.tsx`（loading/error/empty/success 四态 + "换一批" + "返回修改画像"）、`src/components/results/PlanCard.tsx`、`MatchScoreRing.tsx`（SVG 环形进度）、`EmptyState.tsx`
- 详情页：`src/pages/DetailPage.tsx`（4 分区渲染 + 找不到方案重定向 /results）、`src/components/detail/SummaryHeader.tsx`、`ProsConsSection.tsx`（优缺点双栏）、`ChannelsSection.tsx`（渠道网格 + 类型图标 + 门槛标签）、`GuideTimeline.tsx`（折叠步骤 + tools + duration）
- 验证通过：问卷→列表→详情闭环、3 卡片渲染正确、详情 4 分区完整、指南步骤折叠展开正常

### Day5 提前完成项（不再重复）

以下项目在 Day2-Day4 实现时已提前完成，Day5 不再处理：

| 项目 | 现状位置 | 证据 |
|------|----------|------|
| GuideTimeline 折叠/展开 + tools/duration | `src/components/detail/GuideTimeline.tsx` | `GuideStepItem` 已有 `open` state、Wrench/Clock 图标 |
| Prompt 要求输出全部字段 | `api/_lib/prompt.ts` | system prompt 已含 type/barrier/incomeModel、tools/duration |
| schemas 校验全部字段 | `api/_lib/schemas.ts` | `toChannelArray`/`toGuideArray` 已处理所有字段 |
| ChannelsSection 展示 type/barrier/incomeModel | `src/components/detail/ChannelsSection.tsx` | 已有 TYPE_ICON/BARRIER_STYLE 映射 |
| "换一批"按钮 | `src/pages/ResultsPage.tsx` | `handleRetry` 调 `generate(profile)` |
| "返回修改画像"按钮 | `src/pages/ResultsPage.tsx` | `navigate('/')` |

---

## Proposed Changes

### Day5：收藏功能 + 渠道总览 + 详情操作工具栏

**目标**：详情页增加收藏/换一批/调整画像统一工具栏；结果页增加跨方案渠道汇总视图；提取 ChannelCard 复用组件。

#### 新建文件

| 文件 | What | Why |
|------|------|-----|
| `src/store/favoriteStore.ts` | 独立收藏 store（zustand + persist 中间件），不并入 appStore | appStore.reset() 会清空所有字段，收藏是跨会话持久态，职责不同应分离；persist 多组件自动同步 |
| `src/hooks/useFavorite.ts` | 按 planId 订阅收藏态的薄封装 hook | 避免组件直接写 `useFavoriteStore((s) => s.favorites[id])` 样板 |
| `src/components/detail/ChannelCard.tsx` | 从 ChannelsSection 提取的单渠道卡片组件，支持可选 `sources` prop | 复用于详情页渠道列表和结果页渠道总览 |
| `src/components/results/ChannelsOverview.tsx` | 跨 3 方案去重渠道汇总视图 | 渠道总览，标注每个渠道出现在哪些方案中 |
| `src/components/detail/ActionToolbar.tsx` | 详情页底部 sticky 工具栏（换一批/调整画像/收藏） | 统一操作入口 |

#### 更新文件

| 文件 | What |
|------|------|
| `src/components/detail/ChannelsSection.tsx` | 删除内联 TYPE_ICON/BARRIER_STYLE 常量与卡片 JSX，改为渲染 `<ChannelCard />` |
| `src/pages/ResultsPage.tsx` | 在 PlanCard 网格下方插入 `<ChannelsOverview plans={plans} />` |
| `src/pages/DetailPage.tsx` | 底部"返回列表"按钮替换为 `<ActionToolbar plan={plan} />` |

#### 关键代码结构

**`src/store/favoriteStore.ts`**（独立 store + persist）：
```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Plan } from '@/types'

interface FavoriteState {
  favorites: Record<string, Plan>  // id -> 完整 Plan，换一批后收藏仍可独立查看
  toggleFavorite: (plan: Plan) => void
  isFavorite: (id: string) => boolean
  removeFavorite: (id: string) => void
  clearFavorites: () => void
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: {},
      toggleFavorite: (plan) =>
        set((s) => {
          const next = { ...s.favorites }
          if (next[plan.id]) delete next[plan.id]
          else next[plan.id] = plan
          return { favorites: next }
        }),
      isFavorite: (id) => Boolean(get().favorites[id]),
      removeFavorite: (id) =>
        set((s) => {
          const next = { ...s.favorites }
          delete next[id]
          return { favorites: next }
        }),
      clearFavorites: () => set({ favorites: {} }),
    }),
    { name: 'side-hustle-favorites' },
  ),
)
```

**`src/hooks/useFavorite.ts`**（薄封装）：
```ts
import { useFavoriteStore } from '@/store/favoriteStore'
import type { Plan } from '@/types'

export function useFavorite(planId: string) {
  const isFavorite = useFavoriteStore((s) => Boolean(s.favorites[planId]))
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite)
  return { isFavorite, toggle: (plan: Plan) => toggleFavorite(plan) }
}
```

**`src/components/detail/ChannelCard.tsx`**（提取 + 新增 sources prop）：
```tsx
import { Store, Users, MapPin } from 'lucide-react'
import type { Channel } from '@/types'

const TYPE_ICON: Record<string, typeof Store> = { '平台': Store, '私域': Users, '线下': MapPin }
const BARRIER_STYLE: Record<string, string> = {
  '低': 'bg-green-50 text-green-600', '中': 'bg-amber-50 text-amber-600', '高': 'bg-red-50 text-red-600',
}

interface ChannelCardProps {
  channel: Channel
  sources?: string[]  // 来源方案标题（渠道总览标注用）
}

export function ChannelCard({ channel, sources }: ChannelCardProps) {
  const Icon = TYPE_ICON[channel.type || ''] || Store
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
        <Icon size={18} />
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">{channel.name}</h3>
          {channel.barrier && (
            <span className={`tag text-[10px] ${BARRIER_STYLE[channel.barrier] || 'bg-slate-100 text-slate-600'}`}>
              门槛{channel.barrier}
            </span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
          {channel.type && <span>类型: {channel.type}</span>}
          {channel.incomeModel && <span>· {channel.incomeModel}</span>}
        </div>
        {sources && sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {sources.map((s) => (
              <span key={s} className="tag bg-brand-50 text-brand-500 text-[10px]">{s}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

**`src/components/results/ChannelsOverview.tsx`**（跨方案去重）：
```tsx
import { useMemo } from 'react'
import type { Plan, Channel } from '@/types'
import { ChannelCard } from '@/components/detail/ChannelCard'

interface ChannelWithSources extends Channel { sources: string[] }

export function ChannelsOverview({ plans }: { plans: Plan[] }) {
  const merged = useMemo<ChannelWithSources[]>(() => {
    const map = new Map<string, ChannelWithSources>()
    plans.forEach((p) => {
      p.channels.forEach((ch) => {
        const key = ch.name.trim()
        const exist = map.get(key)
        if (exist) exist.sources.push(p.title)
        else map.set(key, { ...ch, sources: [p.title] })
      })
    })
    return Array.from(map.values())
  }, [plans])

  if (merged.length === 0) return null

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">渠道总览</h2>
        <p className="mt-1 text-sm text-slate-400">
          跨 {plans.length} 个方案共 {merged.length} 个渠道（已去重）
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {merged.map((ch) => (
          <ChannelCard key={ch.name} channel={ch} sources={ch.sources} />
        ))}
      </div>
    </section>
  )
}
```

**`src/components/detail/ActionToolbar.tsx`**（详情页底部工具栏）：
```tsx
import { useNavigate } from 'react-router-dom'
import { RefreshCw, SlidersHorizontal, Heart } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useFavoriteStore } from '@/store/favoriteStore'
import { useGenerate } from '@/hooks/useGenerate'
import type { Plan } from '@/types'

export function ActionToolbar({ plan }: { plan: Plan }) {
  const navigate = useNavigate()
  const profile = useAppStore((s) => s.profile)
  const { generate, loading } = useGenerate()
  const isFavorite = useFavoriteStore((s) => Boolean(s.favorites[plan.id]))
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite)

  const handleRegenerate = async () => {
    if (!profile) return
    await generate(profile)
    navigate('/results')  // 新方案 id 可能变化，回列表最安全
  }

  return (
    <div className="sticky bottom-4 z-10 mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-card backdrop-blur">
      <button onClick={() => navigate('/')} className="btn-ghost flex-1">
        <SlidersHorizontal size={16} /> 调整画像
      </button>
      <button onClick={handleRegenerate} disabled={loading} className="btn-ghost flex-1">
        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 换一批
      </button>
      <button
        onClick={() => toggleFavorite(plan)}
        className={isFavorite ? 'btn-primary flex-1' : 'btn-ghost flex-1'}
      >
        <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
        {isFavorite ? '已收藏' : '收藏'}
      </button>
    </div>
  )
}
```

#### 实施顺序（有依赖）

1. `favoriteStore.ts` → 2. `useFavorite.ts`（依赖 store）→ 3. `ChannelCard.tsx` → 4. `ChannelsSection.tsx` 改造（依赖 ChannelCard）→ 5. `ChannelsOverview.tsx`（依赖 ChannelCard）→ 6. `ActionToolbar.tsx`（依赖 useFavorite + useGenerate）→ 7. DetailPage / ResultsPage 接线

#### Verification Steps (Day5)

1. 详情页底部出现三按钮工具栏，sticky 吸附正常，移动端不溢出。
2. 点「收藏」→ 按钮变高亮 + 心形填充；刷新页面 → 仍为已收藏（localStorage 持久化生效）。
3. 点「调整画像」→ 回到问卷页，技能/时间/收入等字段已回填（验证 localStorage draft）。
4. 点「换一批」→ loading 态 → 跳回 `/results` 且方案内容有差异（temperature 0.8 起效）。
5. 渠道总览出现在结果页卡片下方，跨方案同名渠道只显示一次，`sources` 标签正确标注来源方案标题。
6. 手动改 mock 数据让两个方案含同名渠道 → 验证去重逻辑。
7. `npm run build`（即 `tsc --noEmit && vite build`）无 TS 报错。
8. 浏览器控制台无运行时错误；localStorage 中能看到 `side-hustle-favorites` 键。

---

### Day6：UI 打磨 + 加载/空状态/错误兜底 + Vercel 部署

**目标**：视觉精修 + 全链路状态兜底 + 部署上线可访问。

#### 新建文件

| 文件 | What | Why |
|------|------|-----|
| `src/components/common/LoadingScreen.tsx` | 轮播文案 + 脉冲动画的增强加载态 | 替换内联 Loader2 旋转，长耗时 LLM 调用体验更好 |
| `src/components/common/ErrorState.tsx` | 统一错误组件（图标 + 消息 + 重试/返回） | 提取自 ResultsPage 内联错误块，可复用 |
| `src/components/common/SkeletonCard.tsx` | 方案卡片骨架屏 | 换一批时保持布局稳定 |
| `src/components/common/RetryBoundary.tsx` | React Error Boundary（class 组件） | 捕获渲染异常不白屏 |
| `README.md` | 项目介绍/本地启动/Vercel 部署/环境变量/演示说明 | 交付文档 |

#### 更新文件

| 文件 | What |
|------|------|
| `src/pages/ResultsPage.tsx` | 内联 loading/error 替换为 `<LoadingScreen />` / `<ErrorState />` / `<SkeletonCard />`；首次生成用 LoadingScreen，换一批用骨架网格 |
| `src/App.tsx` | 用 `<RetryBoundary>` 包裹 `<Routes>`（Header 内、Routes 外） |
| `api/generate.ts` | 模块顶层加内存滑动窗口限流（60s/10次/IP），handler 入口校验，返回 429 |
| `src/components/layout/Header.tsx` | 加步骤指示器（画像→方案→详情），基于 useLocation 高亮当前步骤，移动端隐藏 |
| `tailwind.config.js` / `src/styles/index.css` | 核对品牌色/圆角/阴影一致性，无硬编码色值 |

#### 关键代码结构

**`src/components/common/LoadingScreen.tsx`**（轮播文案 + 脉冲动画）：
```tsx
import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

const TIPS = [
  '正在分析你的技能树…',
  '匹配最适合的副业赛道…',
  '计算预期收入与投入产出比…',
  '生成 3 个差异化方案：稳赚型 / 成长型 / 爆发型…',
  '整理赚钱渠道与操作指南…',
]

export function LoadingScreen() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TIPS.length), 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <div className="relative mb-6">
        <span className="absolute inset-0 animate-ping rounded-2xl bg-brand-400/30" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-white">
          <Sparkles size={28} className="animate-pulse" />
        </span>
      </div>
      <h1 className="text-lg font-semibold text-slate-700">AI 正在为你匹配副业方向…</h1>
      <p className="mt-2 min-h-[20px] text-sm text-slate-400 transition">{TIPS[idx]}</p>
    </div>
  )
}
```

**`src/components/common/ErrorState.tsx`**（统一错误 UI）：
```tsx
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  onBack?: () => void
  backLabel?: string
}

export function ErrorState({
  title = '生成失败', message, onRetry, onBack, backLabel = '返回修改画像',
}: ErrorStateProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <AlertCircle className="mb-4 h-10 w-10 text-red-400" />
      <h1 className="text-lg font-semibold text-slate-700">{title}</h1>
      {message && <p className="mt-2 text-sm text-slate-500">{message}</p>}
      <div className="mt-6 flex gap-3">
        {onBack && (
          <button onClick={onBack} className="btn-ghost"><ArrowLeft size={16} /> {backLabel}</button>
        )}
        {onRetry && (
          <button onClick={onRetry} className="btn-primary"><RefreshCw size={16} /> 重试</button>
        )}
      </div>
    </div>
  )
}
```

**`src/components/common/SkeletonCard.tsx`**（骨架屏）：
```tsx
export function SkeletonCard() {
  return (
    <div className="card animate-pulse p-5">
      <div className="mb-3 flex items-start justify-between">
        <div className="h-5 w-16 rounded-full bg-slate-200" />
        <div className="h-14 w-14 rounded-full bg-slate-200" />
      </div>
      <div className="h-4 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-full rounded bg-slate-100" />
      <div className="mt-1 h-3 w-2/3 rounded bg-slate-100" />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-16 rounded-full bg-slate-100" />
        <div className="h-5 w-20 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
    </div>
  )
}
```

**`src/components/common/RetryBoundary.tsx`**（Error Boundary，class 组件）：
```tsx
import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props { children: ReactNode }
interface State { hasError: boolean; message?: string }

export class RetryBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message }
  }

  componentDidCatch(err: Error, info: unknown) {
    console.error('[RetryBoundary] 捕获渲染异常:', err, info)
  }

  handleReset = () => this.setState({ hasError: false, message: undefined })

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
          <AlertTriangle className="mb-4 h-10 w-10 text-amber-400" />
          <h1 className="text-lg font-semibold text-slate-700">页面出错了</h1>
          <p className="mt-2 text-sm text-slate-500">{this.state.message || '发生未知错误'}</p>
          <div className="mt-6 flex gap-3">
            <button onClick={this.handleReset} className="btn-ghost">重试</button>
            <button onClick={() => window.location.reload()} className="btn-primary">刷新页面</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
```

**ResultsPage 接入（两个 loading 分支语义分工）**：
- `loading && plans.length === 0`（首次生成）：用 `<LoadingScreen />`（长耗时 LLM 调用，轮播文案更合适）
- `loading && plans.length > 0`（换一批刷新）：用骨架网格（3 个 `<SkeletonCard />`，保持布局稳定）
- `error && plans.length === 0`：用 `<ErrorState message={error} onRetry={handleRetry} onBack={() => navigate('/')} />`

**后端限流（`api/generate.ts` 模块顶层）**：
```ts
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 10
const hits = new Map<string, number[]>()

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const arr = (hits.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (arr.length >= RATE_LIMIT_MAX) { hits.set(key, arr); return false }
  arr.push(now); hits.set(key, arr); return true
}

// handler 内 method/CORS 校验之后：
const ip = req.headers.get('x-forwarded-for')?.split(',')[0]
  || req.headers.get('x-real-ip') || 'unknown'
if (!checkRateLimit(ip)) {
  return Response.json({ error: '请求过于频繁，请稍后再试' }, { status: 429, headers: { 'Access-Control-Allow-Origin': '*' } })
}
```
注意：Vercel Serverless 实例无状态，冷启动后 Map 重置；多实例间不共享。Hobby Demo 足够，生产应换 Upstash Redis。前端 api.ts 的 safeExtractError 已能从 429 响应体提取文案，无需改 api.ts。

**Header 步骤指示器**：基于 `useLocation` 高亮当前步骤（画像→方案→详情），移动端隐藏。

**README.md 章节**：技术栈 / 本地启动 / 环境变量表 / Vercel 部署 / 目录结构 / 演示流程 / 须知（免鉴权、AI 方案仅供参考、收藏存 localStorage）。

#### 实施顺序

1. 建 4 个 common 组件（LoadingScreen / ErrorState / SkeletonCard / RetryBoundary）→ 2. 改 ResultsPage 接入 → 3. 改 App.tsx 接入 RetryBoundary → 4. 改 generate.ts 加限流 → 5. 改 Header 加步骤指示器 → 6. UI 走查 → 7. 写 README → 8. 部署验证

#### Verification Steps (Day6)

1. 首次生成时显示 LoadingScreen，文案每 1.8s 轮播，动画流畅。
2. 点「换一批」时旧卡片区切换为 3 个 SkeletonCard 骨架，布局不跳动。
3. 断网提交 → ErrorState 显示错误文案 + 重试按钮，点重试恢复。
4. 在某组件故意抛异常（临时 `throw new Error('test')`）→ RetryBoundary 捕获，显示「页面出错了」+ 重试/刷新按钮，不白屏；验证后删除测试代码。
5. 用脚本/Postman 连续 POST `/api/generate` 11 次 → 第 11 次返回 429 + `请求过于频繁` 文案。
6. Header 步骤指示器在 `/`、`/results`、`/detail/*` 三页正确高亮对应步骤，移动端隐藏不挤压。
7. `npm run build` 无 TS 报错，产物体积正常。
8. Vercel 部署成功，线上全流程跑通，深链兜底正常，无 API Key 泄露。
9. 移动端 375px + 桌面端 1440px 视觉走查无错位。

---

## Assumptions & Decisions

### 假设
1. 执行者已在火山方舟控制台完成实名认证、创建 API Key、创建推理接入点(Endpoint)并取得 Endpoint ID。
2. Vercel 免费额度(Hobby 计划) 足够 Demo 演示。
3. 初赛评审通过线上 Demo 链接访问，无需鉴权/多用户。
4. 豆包 JSON mode 对所选模型可用；若不支持，已有正则提取兜底（generate.ts）。

### 关键决策
1. **收藏独立 store（favoriteStore + persist）**：不并入 appStore，因为 appStore.reset() 会清空所有字段，收藏是跨会话持久态。persist 中间件基于 zustand 订阅模型，多组件（PlanCard 心标 + DetailPage 工具栏）自动同步。
2. **ActionToolbar 换一批后 navigate('/results')**：新方案 id 可能变化，回列表最安全。DetailPage 已有 `Navigate to="/results"` 兜底处理旧 id。
3. **ChannelCard 提取**：从 ChannelsSection 内联代码提取为独立组件，复用于详情页渠道列表和结果页渠道总览。TYPE_ICON/BARRIER_STYLE 常量一并迁移。
4. **两个 loading 分支语义分工**：首次生成用 LoadingScreen（轮播文案适合长耗时），换一批用 SkeletonCard（保持布局稳定）。
5. **RetryBoundary 放 Header 内 Routes 外**：避免布局被吞，捕获路由级渲染异常。
6. **限流用内存 Map**：Vercel Hobby 单实例够用，生产应换 Redis。前端 api.ts 已能从 429 提取文案，无需改。
7. **不引入 SSR/Next.js**：Demo 无 SEO 需求，Vite SPA 足够。

### 风险与应对
| 风险 | 应对 |
|------|------|
| favoriteStore persist 在 SSR 报错 | 纯 SPA 无 SSR，persist 默认 localStorage 安全 |
| 限流 Map 在 Vercel 多实例间不共享 | Hobby 计划单实例够用；README 注明生产应换 Redis |
| 「换一批」后 detail 旧 id 失效 | ActionToolbar 生成后 navigate('/results')，DetailPage 已有重定向兜底 |
| ChannelCard 提取后 key 重复 | ChannelsSection 用 `${ch.name}-${i}`，ChannelsOverview 用 `ch.name`（已去重） |
| 收藏存完整 Plan 占用 localStorage | 3 个方案体积小（<10KB），localStorage 5MB 配额无忧 |

---

## 全局验证清单（Day6 收尾）

- [ ] 本地 `npm run dev:all` 全流程：问卷 → 生成 → 列表 → 详情 → 收藏 → 换一批 → 调整画像，无报错
- [ ] `npm run build` 无 TS 错误，产物体积合理
- [ ] Vercel 部署成功，线上域名可访问，环境变量已在 Vercel 项目设置中配置
- [ ] 浏览器侧无 API Key 泄露（查 Sources / 网络请求）
- [ ] 错误路径（断网/超时/5xx/429/深链）均有兜底 UI
- [ ] 移动端 + 桌面端响应式正常
- [ ] README 含本地启动、部署、环境变量、演示说明
