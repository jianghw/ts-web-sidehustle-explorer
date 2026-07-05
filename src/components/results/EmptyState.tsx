import { useNavigate } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'

export function EmptyState() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <ClipboardList size={28} />
      </div>
      <h1 className="text-lg font-semibold text-slate-700">还没有生成方案</h1>
      <p className="mt-2 text-sm text-slate-400">先填写你的个人画像，AI 会为你量身推荐副业方向</p>
      <button onClick={() => navigate('/')} className="btn-primary mt-6">
        去填写画像
      </button>
    </div>
  )
}
