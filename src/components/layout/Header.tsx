import { Link, useLocation } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const STEPS = [
  { path: '/', label: '画像', match: (p: string) => p === '/' },
  { path: '/results', label: '方案', match: (p: string) => p.startsWith('/results') },
  { path: '/detail', label: '详情', match: (p: string) => p.startsWith('/detail') },
]

export function Header() {
  const { pathname } = useLocation()
  const activeIdx = STEPS.findIndex((s) => s.match(pathname))

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Sparkles size={18} />
          </span>
          <span className="text-base font-bold tracking-tight">人生副业体验器</span>
        </Link>
        <div className="hidden items-center gap-2 sm:flex">
          {STEPS.map((s, i) => (
            <div key={s.path} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition ${
                  i === activeIdx
                    ? 'bg-brand-500 text-white'
                    : i < activeIdx
                      ? 'bg-brand-100 text-brand-600'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {i + 1}
              </span>
              <span className={`text-xs ${i === activeIdx ? 'font-semibold text-slate-700' : 'text-slate-400'}`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <span className="text-slate-300">/</span>}
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
