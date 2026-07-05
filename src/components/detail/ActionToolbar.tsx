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
    navigate('/results')
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
