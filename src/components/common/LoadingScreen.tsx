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
