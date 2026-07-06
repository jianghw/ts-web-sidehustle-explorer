/**
 * 文件用途：加载中过渡页面。
 * 当 AI 正在分析用户问卷、生成方案时，展示一个动画加载界面，
 * 并通过轮播提示文案告诉用户后台正在做什么，缓解等待焦虑。
 */

// useEffect 用于处理"副作用"（如定时器），useState 用于保存当前显示哪条提示
import { useEffect, useState } from 'react'
// Sparkles 是一个星星图标，配合动画营造"AI 正在工作"的感觉
import { Sparkles } from 'lucide-react'

// 预先准备好一组轮播文案，每隔一段时间切换一条，让用户知道系统没有卡死
const TIPS = [
  '正在分析你的技能树…',
  '匹配最适合的副业赛道…',
  '计算预期收入与投入产出比…',
  '生成 3 个差异化方案：稳赚型 / 成长型 / 爆发型…',
  '整理赚钱渠道与操作指南…',
]

export function LoadingScreen() {
  // idx 记录当前显示的是第几条提示，初始值为 0（第一条）
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    // 每 1.8 秒切换到下一条提示；用取模运算实现循环，到最后一条后回到第一条
    const t = setInterval(() => setIdx((i) => (i + 1) % TIPS.length), 1800)
    // 组件卸载时清除定时器，避免内存泄漏和重复触发
    return () => clearInterval(t)
  }, [])

  return (
    // 加载区域居中显示，与错误页保持一致的版式风格
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <div className="relative mb-6">
        {/* 外层用 ping 动画做一个向外扩散的光晕，强化"正在运转"的视觉反馈 */}
        <span className="absolute inset-0 animate-ping rounded-2xl bg-brand-400/30" />
        {/* 内层是实心图标方块，pulse 动画让它呼吸闪烁 */}
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-white">
          <Sparkles size={28} className="animate-pulse" />
        </span>
      </div>
      <h1 className="text-lg font-semibold text-slate-700">AI 正在为你匹配副业方向…</h1>
      {/* 设置 min-h 防止文案长度变化时整块内容上下跳动 */}
      <p className="mt-2 min-h-[20px] text-sm text-slate-400 transition">{TIPS[idx]}</p>
    </div>
  )
}
