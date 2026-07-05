import { ExternalLink, Search } from 'lucide-react'
import type { LearningResource } from '@/types'

// 平台 → 主题色配置
const PLATFORM_CONFIG: Record<string, { bg: string; text: string; ring: string }> = {
  'B站': { bg: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-100' },
  '小红书': { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-100' },
  '知乎': { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
  '抖音': { bg: 'bg-slate-50', text: 'text-slate-700', ring: 'ring-slate-200' },
  'YouTube': { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-100' },
}

// 平台搜索链接生成
const SEARCH_URLS: Record<string, (kw: string) => string> = {
  'B站': (kw) => `https://search.bilibili.com/all?keyword=${encodeURIComponent(kw)}`,
  '小红书': (kw) => `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(kw)}`,
  '知乎': (kw) => `https://www.zhihu.com/search?q=${encodeURIComponent(kw)}`,
  '抖音': (kw) => `https://www.douyin.com/search/${encodeURIComponent(kw)}`,
  'YouTube': (kw) => `https://www.youtube.com/results?search_query=${encodeURIComponent(kw)}`,
}

interface LearningResourcesSectionProps {
  resources: LearningResource[]
}

export function LearningResourcesSection({ resources }: LearningResourcesSectionProps) {
  if (!resources || resources.length === 0) return null

  return (
    <section className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-base font-semibold text-slate-800">学习资源推荐</h2>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
          {resources.length} 条
        </span>
      </div>
      <p className="mb-4 text-sm text-slate-400">
        针对这个方向，推荐以下平台的学习资源，帮助你快速入门和提升。
      </p>

      <div className="space-y-3">
        {resources.map((res, idx) => {
          const config = PLATFORM_CONFIG[res.platform] || { bg: 'bg-slate-50', text: 'text-slate-600', ring: 'ring-slate-200' }
          const searchUrl = SEARCH_URLS[res.platform]
          const keyword = res.keyword || res.title
          const link = searchUrl ? searchUrl(keyword) : null

          return (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-sm"
            >
              {/* 平台标签 */}
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.text} text-xs font-bold ring-1 ring-inset ${config.ring}`}
              >
                {res.platform}
              </span>

              <div className="min-w-0 flex-1">
                {/* 标题行 */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800">{res.title}</h3>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                      {res.type}
                    </span>
                  </div>
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-100"
                    >
                      <Search size={12} />
                      去搜索
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>

                {/* 推荐理由 */}
                {res.description && (
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    {res.description}
                  </p>
                )}

                {/* 搜索关键词 */}
                {res.keyword && (
                  <div className="mt-2">
                    <span className="text-[10px] text-slate-400">搜索关键词：</span>
                    <code className="ml-1 rounded bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-600">
                      {res.keyword}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
