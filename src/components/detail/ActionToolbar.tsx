/**
 * 文件用途：详情页底部操作工具栏。
 * 固定显示在详情页底部，提供"调整画像""换一批""收藏"三个快捷操作，
 * 让用户在看方案详情时能快速做出下一步动作，而不必回到顶部找按钮。
 */

// useNavigate 用于跳转页面（回到画像页或结果页）
import { useNavigate } from 'react-router-dom'
// 三个图标：RefreshCw（刷新）、SlidersHorizontal（滑块调节）、Heart（收藏）
import { RefreshCw, SlidersHorizontal, Heart } from 'lucide-react'
// 引入全局状态仓库，从中读取用户的画像数据，用于重新生成方案
import { useAppStore } from '@/store/appStore'
// 引入收藏状态仓库，用于判断当前方案是否已收藏、以及切换收藏状态
import { useFavoriteStore } from '@/store/favoriteStore'
// 引入生成方案的自定义 Hook，封装了调用 AI 接口的逻辑
import { useGenerate } from '@/hooks/useGenerate'
// 引入方案的数据类型定义
import type { Plan } from '@/types'

export function ActionToolbar({ plan }: { plan: Plan }) {
  const navigate = useNavigate()
  // 从全局状态读取用户画像；重新生成方案时需要用到它作为输入
  const profile = useAppStore((s) => s.profile)
  // generate 触发重新生成，loading 表示是否正在生成中
  const { generate, loading } = useGenerate()
  // 判断当前方案是否在收藏夹里，用于控制收藏按钮的样式和文字
  const isFavorite = useFavoriteStore((s) => Boolean(s.favorites[plan.id]))
  // 切换收藏状态的方法
  const toggleFavorite = useFavoriteStore((s) => s.toggleFavorite)

  // 重新生成一批方案：基于当前画像重新调用 AI，生成完后跳到结果页查看
  const handleRegenerate = async () => {
    // 没有画像就无法生成，直接返回避免无效请求
    if (!profile) return
    await generate(profile)
    navigate('/results')
  }

  return (
    // sticky bottom-4 让工具栏悬浮在页面底部偏上一点，方便单手操作；毛玻璃背景增强可读性
    <div className="sticky bottom-4 z-10 mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-card backdrop-blur">
      {/* "调整画像"：回到首页重新填写问卷 */}
      <button onClick={() => navigate('/')} className="btn-ghost flex-1">
        <SlidersHorizontal size={16} /> 调整画像
      </button>
      {/* "换一批"：基于当前画像重新生成方案；生成中禁用按钮并让图标旋转，提示正在处理 */}
      <button onClick={handleRegenerate} disabled={loading} className="btn-ghost flex-1">
        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> 换一批
      </button>
      {/* "收藏"：根据是否已收藏切换样式（实心主色 vs 空心）和文字 */}
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
