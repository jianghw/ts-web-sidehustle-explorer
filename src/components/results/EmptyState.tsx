/**
 * 文件用途：空状态提示组件。
 * 当用户还没填写问卷、没有生成方案就直接来到结果页时，
 * 用这个组件提示用户"先去填写画像"，并提供跳转按钮引导用户操作。
 */

// useNavigate 是 react-router-dom 提供的编程式跳转方法，用于点击按钮后跳到首页
import { useNavigate } from 'react-router-dom'
// ClipboardList 是一个带清单的剪贴板图标，呼应"需要填写问卷"的语义
import { ClipboardList } from 'lucide-react'

export function EmptyState() {
  // 获取路由跳转方法
  const navigate = useNavigate()
  return (
    // 居中布局，与其他状态页（加载、错误）保持一致
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      {/* 灰色图标占位，弱化但能传达"空"的含义 */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <ClipboardList size={28} />
      </div>
      <h1 className="text-lg font-semibold text-slate-700">还没有生成方案</h1>
      <p className="mt-2 text-sm text-slate-400">先填写你的个人画像，AI 会为你量身推荐副业方向</p>
      {/* 点击按钮跳转到首页（问卷页），引导用户完成第一步 */}
      <button onClick={() => navigate('/')} className="btn-primary mt-6">
        去填写画像
      </button>
    </div>
  )
}
