/**
 * 文件用途：页面顶部导航栏（Header）。
 * 固定显示在页面最上方，包含网站 Logo 和"画像 → 方案 → 详情"三步进度指示，
 * 让用户随时知道自己走到了哪一步。
 */

// react-router-dom 是 React 的路由库：Link 用于做无刷新跳转，useLocation 用于读取当前网址
import { Link, useLocation } from 'react-router-dom'
// Sparkles 星星图标，作为产品 Logo 的视觉元素
import { Sparkles } from 'lucide-react'

// 定义三个步骤及其匹配规则。用 match 函数而非简单相等判断，是因为详情页路径可能带参数（如 /detail/xxx）
const STEPS = [
  // 第一步"画像"：只在首页时高亮
  { path: '/', label: '画像', match: (p: string) => p === '/' },
  // 第二步"方案"：所有以 /results 开头的路径都算这一步
  { path: '/results', label: '方案', match: (p: string) => p.startsWith('/results') },
  // 第三步"详情"：所有以 /detail 开头的路径都算这一步
  { path: '/detail', label: '详情', match: (p: string) => p.startsWith('/detail') },
]

export function Header() {
  // 读取当前页面的路径，用来判断用户处于哪一步
  const { pathname } = useLocation()
  // 找到第一个匹配当前路径的步骤索引；如果都不匹配返回 -1，用于后续样式判断
  const activeIdx = STEPS.findIndex((s) => s.match(pathname))

  return (
    // sticky 让导航栏滚动时固定在顶部；backdrop-blur 做半透明毛玻璃效果
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo 区域：点击可回到首页 */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Sparkles size={18} />
          </span>
          <span className="text-base font-bold tracking-tight">人生副业体验器</span>
        </Link>
        {/* 步骤指示器：小屏幕下隐藏，避免拥挤 */}
        <div className="hidden items-center gap-2 sm:flex">
          {STEPS.map((s, i) => (
            <div key={s.path} className="flex items-center gap-2">
              {/* 根据步骤是否完成/进行中/未开始，显示不同颜色：当前=主色实心，已完成=浅色，未开始=灰色 */}
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
              {/* 当前步骤文字加粗高亮，其余步骤弱化显示 */}
              <span className={`text-xs ${i === activeIdx ? 'font-semibold text-slate-700' : 'text-slate-400'}`}>
                {s.label}
              </span>
              {/* 步骤之间用斜杠分隔，最后一个步骤后面不显示分隔符 */}
              {i < STEPS.length - 1 && <span className="text-slate-300">/</span>}
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
