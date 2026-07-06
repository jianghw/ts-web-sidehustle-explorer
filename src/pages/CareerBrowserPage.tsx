/**
 * 文件用途：职业浏览页。
 *
 * 用户在问卷页点"查看更多职业"会来到这里，按"大类 → 中类 → 具体职业"的层级
 * 浏览所有可选职业，并勾选自己擅长或感兴趣的方向。选好后点"确认选择"，
 * 选中的职业会带回问卷页，自动填入"技能"一栏。
 *
 * 数据来源：src/constants/careers.ts 里的 CAREER_CATEGORIES（共 8 个大类）。
 *
 * 数据回写说明：
 * - 问卷页（QuestionnairePage）把技能草稿存在浏览器 localStorage 里（键名
 *   'side-hustle-profile'），它是问卷页的"数据源"。所以本页确认时会把选中的
 *   职业同步写回这份草稿，这样返回问卷页就能立刻看到新选的技能。
 * - 同时也会写入全局状态仓库（useAppStore），供其他页面读取，符合任务要求。
 *
 * 回显说明：
 * - 进入本页时，先用问卷草稿里的技能来预选（它总是和问卷页显示一致、最新），
 *   草稿为空时再回退到全局状态里的画像技能。
 */

// useMemo：缓存"当前大类"和"搜索结果"等计算结果，避免每次渲染都重算
import { useMemo, useState } from 'react'
// useNavigate：编程式跳转，确认选择后用它返回问卷页
import { useNavigate } from 'react-router-dom'
// 图标：Search 搜索、ArrowLeft 返回箭头、Check 已选对勾、X 清空搜索
import { Search, ArrowLeft, Check, X } from 'lucide-react'
// 职业分类数据、副业潜力的中文标签与配色映射、技能值转中文名称工具函数
import {
  CAREER_CATEGORIES,
  POTENTIAL_LABELS,
  POTENTIAL_COLORS,
  getSkillLabels,
} from '@/constants/careers'
// 职业相关类型定义
import type { CareerItem, CareerCategory } from '@/constants/careers'
// 本地存储 Hook：读取问卷草稿（键名需与问卷页一致，才能读到同一份数据）
import { useLocalStorage } from '@/hooks/useLocalStorage'
// 全局状态仓库：读取/设置用户画像（任务要求通过 useAppStore 操作技能）
import { useAppStore } from '@/store/appStore'
// 用户画像类型
import type { Profile } from '@/types'

// 问卷草稿在 localStorage 里的键名，必须和 QuestionnairePage 完全一致，否则读写不到同一份数据
const PROFILE_STORAGE_KEY = 'side-hustle-profile'

// 画像默认值：与 QuestionnairePage 保持一致，仅在全局状态里还没有画像时作为兜底
const DEFAULT_PROFILE: Profile = {
  skills: [],
  availableHours: 2,
  incomeGoal: 3500,
  riskTolerance: 'medium',
  budget: 500,
}

export function CareerBrowserPage() {
  // —— 读取两份数据：全局状态 + 问卷草稿 ——
  // 全局状态里的画像（任务要求：从 store 读取当前已选技能用于回显）
  const storeProfile = useAppStore((s) => s.profile)
  const setProfile = useAppStore((s) => s.setProfile)
  // 问卷草稿：问卷页的数据源，读取它才能和问卷页显示一致的已选技能
  // 这里只取 draft 用于读取，不需要 setDraft（确认时用同步写入更可靠，见 handleConfirm）
  const [draft] = useLocalStorage<Profile>(PROFILE_STORAGE_KEY, DEFAULT_PROFILE)
  const navigate = useNavigate()

  // 当前选中的大类 id（默认第一个大类）
  const [activeCategoryId, setActiveCategoryId] = useState<string>(CAREER_CATEGORIES[0].id)
  // 搜索关键词：为空时按大类浏览；有内容时跨所有大类搜索
  const [query, setQuery] = useState('')
  // 已勾选的职业 value 列表。只在组件挂载时根据"当前已选技能"初始化一次，
  // 之后仅在用户点击卡片时变化，避免被外部数据覆盖用户的操作
  const [selected, setSelected] = useState<string[]>(() => {
    // 优先用问卷草稿里的技能（它总是最新、和问卷页显示一致）；
    // 草稿为空时再回退到全局状态里的画像技能
    if (draft.skills.length > 0) return draft.skills
    return storeProfile?.skills ?? []
  })

  // 当前选中的大类对象（用 useMemo 缓存，仅在大类切换时重新查找）
  const activeCategory = useMemo<CareerCategory>(
    () => CAREER_CATEGORIES.find((c) => c.id === activeCategoryId) ?? CAREER_CATEGORIES[0],
    [activeCategoryId],
  )

  /**
   * 搜索结果：跨所有大类筛选，并按"大类 → 中类"分组，方便用户看清来源。
   * 只在搜索关键词变化时重新计算。
   * 返回结构：[{ category, subs: [{ sub, careers }] }]（已剔除无匹配项的大类和中类）
   */
  const searchResults = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    // 没有关键词时返回空数组（此时走"按大类浏览"模式，不显示搜索结果）
    if (!keyword) return []
    return CAREER_CATEGORIES.map((cat) => ({
      category: cat,
      subs: cat.subCategories
        .map((sub) => ({
          sub,
          // 一个中类下匹配到的职业：名称或描述包含关键词即算命中
          careers: sub.careers.filter(
            (c) =>
              c.label.toLowerCase().includes(keyword) ||
              c.description.toLowerCase().includes(keyword),
          ),
        }))
        // 去掉没有任何匹配项的中类，让结果更干净
        .filter((g) => g.careers.length > 0),
    })).filter((g) => g.subs.length > 0)
  }, [query])

  // 切换某个职业的选中状态：已选则取消，未选则添加
  const toggleCareer = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  // 点击大类标签：切换大类并清空搜索，回到"按大类浏览"模式
  const handleSelectCategory = (id: string) => {
    setActiveCategoryId(id)
    setQuery('')
  }

  // 确认选择：把选中的职业写回问卷草稿和全局状态，然后返回问卷页
  const handleConfirm = () => {
    // 保留草稿里的其他字段（时间、收入目标等），只替换技能
    // 同时把技能值翻译成中文名称存入 skillLabels，供后端 AI 提示词使用
    const newDraft: Profile = {
      ...draft,
      skills: selected,
      skillLabels: getSkillLabels(selected),
    }
    // 直接同步写入 localStorage：因为本页即将卸载跳走，靠 hook 的副作用写入可能来不及执行，
    // 这里同步写入能保证返回问卷页时一定能读到最新的技能
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newDraft))
    } catch {
      // 写入失败（如浏览器隐私模式禁止写入）则忽略，不影响当前会话使用
    }
    // 同步到全局状态（任务要求：用 useAppStore 设置 profile 的 skills）
    setProfile(newDraft)
    // 返回问卷页
    navigate('/')
  }

  // 判断某个职业是否已被选中（给卡片加高亮用）
  const isSelected = (value: string) => selected.includes(value)

  /**
   * 渲染单个职业卡片。抽成函数避免在"按大类浏览"和"搜索结果"两处重复写卡片结构。
   * 注意：这里不是组件（首字母小写、直接当函数调用），所以不受 Hook 规则限制。
   */
  const renderCareerCard = (career: CareerItem) => {
    const active = isSelected(career.value)
    return (
      <button
        key={career.value}
        type="button"
        onClick={() => toggleCareer(career.value)}
        // 选中态：主色边框 + 浅紫底 + 主色描边光晕；未选中态：悬停时轻微强调
        className={`card relative p-4 text-left transition ${
          active
            ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
            : 'hover:border-brand-300 hover:shadow-card-hover'
        }`}
      >
        {/* 选中时右上角显示一个对勾标记 */}
        {active && (
          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white">
            <Check size={12} />
          </span>
        )}
        {/* 图标 + 名称 */}
        <div className="flex items-center gap-2 pr-6">
          <span className="text-2xl">{career.icon}</span>
          <span className="font-semibold text-slate-800">{career.label}</span>
        </div>
        {/* 描述：限制两行，超出省略，保持卡片高度整齐 */}
        <p className="mt-2 line-clamp-2 text-xs text-slate-500">{career.description}</p>
        {/* 副业潜力标签：根据潜力等级显示不同颜色 */}
        <span className={`tag mt-3 ${POTENTIAL_COLORS[career.sideHustlePotential]}`}>
          {POTENTIAL_LABELS[career.sideHustlePotential]}
        </span>
      </button>
    )
  }

  // 搜索结果命中的职业总数（用于"共找到 N 个"提示）
  const searchHitCount = searchResults.reduce(
    (total, g) => total + g.subs.reduce((n, s) => n + s.careers.length, 0),
    0,
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* 顶部：返回按钮 + 标题 + 搜索框 */}
      <div className="mb-6">
        <button onClick={() => navigate('/')} className="btn-ghost mb-4">
          <ArrowLeft size={16} /> 返回问卷
        </button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">职业浏览</h1>
            <p className="mt-1 text-sm text-slate-500">
              按分类浏览所有职业，勾选你擅长或感兴趣的方向，确认后会带回问卷页
            </p>
          </div>
          {/* 搜索框 */}
          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索职业名称或描述..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            {/* 有关键词时显示清空按钮 */}
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="清空搜索"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 主体：左侧大类导航 + 右侧职业卡片区域 */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 左侧大类导航：手机端横向滚动一行，桌面端纵向列表 */}
        <aside className="lg:w-56 lg:shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {CAREER_CATEGORIES.map((cat) => {
              // 搜索模式下不高亮任何大类（因为没有聚焦在某个大类）
              const active = cat.id === activeCategoryId && !query
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50/40'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="whitespace-nowrap">{cat.name}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* 右侧：职业卡片区域。搜索时展示跨大类结果，否则展示当前大类。pb-24 给底部固定栏留出空间 */}
        <div className="min-w-0 flex-1 pb-24">
          {query ? (
            // —— 搜索结果模式 ——
            searchResults.length > 0 ? (
              <div className="space-y-6">
                <p className="text-sm text-slate-500">共找到 {searchHitCount} 个相关职业</p>
                {searchResults.map((g) => (
                  <section key={g.category.id}>
                    {/* 大类标题 */}
                    <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-700">
                      <span>{g.category.icon}</span>
                      {g.category.name}
                    </h2>
                    {g.subs.map((s) => (
                      <div key={s.sub.name} className="mb-4">
                        <h3 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                          <span>{s.sub.icon}</span>
                          {s.sub.name}
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {s.careers.map(renderCareerCard)}
                        </div>
                      </div>
                    ))}
                  </section>
                ))}
              </div>
            ) : (
              // 没搜到任何结果
              <div className="card p-10 text-center text-sm text-slate-400">
                没有找到匹配「<span className="text-slate-600">{query}</span>」的职业，换个关键词试试吧
              </div>
            )
          ) : (
            // —— 按大类浏览模式 ——
            <div>
              {/* 当前大类简介 */}
              <div className="mb-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  <span className="text-2xl">{activeCategory.icon}</span>
                  {activeCategory.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{activeCategory.description}</p>
              </div>
              {/* 该大类下的每个中类作为一个区块展示 */}
              <div className="space-y-6">
                {activeCategory.subCategories.map((sub) => (
                  <section key={sub.name}>
                    <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                      <span>{sub.icon}</span>
                      {sub.name}
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {sub.careers.map(renderCareerCard)}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部固定操作栏：显示已选数量 + 确认按钮 */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <span className="text-sm text-slate-600">
            已选 <span className="font-bold text-brand-600">{selected.length}</span> 项
          </span>
          <button type="button" onClick={handleConfirm} className="btn-primary">
            <Check size={16} /> 确认选择
          </button>
        </div>
      </div>
    </div>
  )
}
