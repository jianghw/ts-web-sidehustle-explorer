/**
 * 文件用途：错误状态展示组件。
 * 当页面加载失败或生成失败时，统一用这个组件向用户展示错误信息，
 * 并提供"返回修改"和"重试"两个按钮，让用户可以自己恢复操作。
 */

// lucide-react 是一个图标库，这里引入三个图标：AlertCircle（警告圆圈）、RefreshCw（刷新箭头）、ArrowLeft（左箭头）
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'

// 定义本组件接收的参数类型，用问号标记表示这些参数都是可选的，调用方可以不传
interface ErrorStateProps {
  // 错误标题，例如"生成失败"，不传时使用默认值
  title?: string
  // 错误详细说明文字，告诉用户具体出了什么问题
  message?: string
  // 点击"重试"按钮时执行的回调函数，由父组件提供
  onRetry?: () => void
  // 点击"返回"按钮时执行的回调函数，由父组件提供
  onBack?: () => void
  // "返回"按钮上显示的文字，默认是"返回修改画像"，便于不同场景复用
  backLabel?: string
}

export function ErrorState({
  // 给可选参数设置默认值，这样即使调用方不传也能正常显示
  title = '生成失败',
  message,
  onRetry,
  onBack,
  backLabel = '返回修改画像',
}: ErrorStateProps) {
  return (
    // 整个错误区域居中显示，限制最大宽度让阅读体验更好
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      {/* 红色警告图标，直观提示用户出现了错误 */}
      <AlertCircle className="mb-4 h-10 w-10 text-red-400" />
      <h1 className="text-lg font-semibold text-slate-700">{title}</h1>
      {/* 只有当传入了 message 时才显示详细说明，避免出现空白区域 */}
      {message && <p className="mt-2 text-sm text-slate-500">{message}</p>}
      <div className="mt-6 flex gap-3">
        {/* 只有当外部提供了 onBack 回调时，才显示"返回"按钮，避免点击后没反应 */}
        {onBack && (
          <button onClick={onBack} className="btn-ghost">
            <ArrowLeft size={16} /> {backLabel}
          </button>
        )}
        {/* 只有当外部提供了 onRetry 回调时，才显示"重试"按钮 */}
        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            <RefreshCw size={16} /> 重试
          </button>
        )}
      </div>
    </div>
  )
}
