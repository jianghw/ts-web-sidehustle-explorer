/**
 * 文件用途：学习资源推荐区块组件。
 * 针对一个副业方案，推荐若干个学习平台上的资源（如 B 站教程、知乎专栏），
 * 并为每个资源生成对应平台的搜索链接，让用户一键跳过去搜索学习。
 */

// ExternalLink（外链图标）、Search（搜索图标），用于"去搜索"按钮
import { ExternalLink, Search } from 'lucide-react'
// 引入学习资源的数据类型定义
import type { LearningResource } from '@/types'

// 平台 → 主题色配置，让不同平台的标签有辨识度，贴近各平台品牌色
const PLATFORM_CONFIG: Record<string, { bg: string; text: string; ring: string }> = {
  'B站': { bg: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-100' },
  '小红书': { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-100' },
  '知乎': { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
  '抖音': { bg: 'bg-slate-50', text: 'text-slate-700', ring: 'ring-slate-200' },
  'YouTube': { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-100' },
}

// 平台搜索链接生成：根据关键词拼接出各平台的搜索 URL
// encodeURIComponent 对关键词做 URL 编码，避免中文或特殊符号导致链接失效
const SEARCH_URLS: Record<string, (kw: string) => string> = {
  'B站': (kw) => `https://search.bilibili.com/all?keyword=${encodeURIComponent(kw)}`,
  '小红书': (kw) => `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(kw)}`,
  '知乎': (kw) => `https://www.zhihu.com/search?q=${encodeURIComponent(kw)}`,
  '抖音': (kw) => `https://www.douyin.com/search/${encodeURIComponent(kw)}`,
  'YouTube': (kw) => `https://www.youtube.com/results?search_query=${encodeURIComponent(kw)}`,
}

interface LearningResourcesSectionProps {
  // 要展示的学习资源列表
  resources: LearningResource[]
}

export function LearningResourcesSection({ resources }: LearningResourcesSectionProps) {
  // 没有资源就不渲染整个区块，保持页面干净
  if (!resources || resources.length === 0) return null

  return (
    <section className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-base font-semibold text-slate-800">学习资源推荐</h2>
        {/* 显示资源总数，让用户知道有多少条推荐 */}
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
          {resources.length} 条
        </span>
      </div>
      <p className="mb-4 text-sm text-slate-400">
        针对这个方向，推荐以下平台的学习资源，帮助你快速入门和提升。
      </p>

      <div className="space-y-3">
        {resources.map((res, idx) => {
          // 取该平台的配色；未知平台用灰色兜底
          const config = PLATFORM_CONFIG[res.platform] || { bg: 'bg-slate-50', text: 'text-slate-600', ring: 'ring-slate-200' }
          // 取该平台的搜索链接生成函数
          const searchUrl = SEARCH_URLS[res.platform]
          // 优先用资源指定的关键词，没有则用标题作为搜索词
          const keyword = res.keyword || res.title
          // 有对应的平台才生成链接，否则不显示"去搜索"按钮
          const link = searchUrl ? searchUrl(keyword) : null

          return (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-sm"
            >
              {/* 平台标签：用品牌色方块显示平台简称 */}
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.text} text-xs font-bold ring-1 ring-inset ${config.ring}`}
              >
                {res.platform}
              </span>

              <div className="min-w-0 flex-1">
                {/* 标题行：资源标题 + 类型标签 + 搜索按钮 */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800">{res.title}</h3>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                      {res.type}
                    </span>
                  </div>
                  {/* 有可生成的搜索链接时才显示"去搜索"按钮 */}
                  {link && (
                    <a
                      href={link}
                      // 新标签页打开，避免覆盖当前页面
                      target="_blank"
                      // noopener noreferrer 防止新页面通过 window.opener 访问原页面，提升安全性
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-100"
                    >
                      <Search size={12} />
                      去搜索
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>

                {/* 推荐理由：告诉用户为什么推荐这个资源 */}
                {res.description && (
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    {res.description}
                  </p>
                )}

                {/* 搜索关键词：用代码样式展示，方便用户复制到其他地方搜索 */}
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
