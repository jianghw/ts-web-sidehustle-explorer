import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  onBack?: () => void
  backLabel?: string
}

export function ErrorState({
  title = '生成失败',
  message,
  onRetry,
  onBack,
  backLabel = '返回修改画像',
}: ErrorStateProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <AlertCircle className="mb-4 h-10 w-10 text-red-400" />
      <h1 className="text-lg font-semibold text-slate-700">{title}</h1>
      {message && <p className="mt-2 text-sm text-slate-500">{message}</p>}
      <div className="mt-6 flex gap-3">
        {onBack && (
          <button onClick={onBack} className="btn-ghost">
            <ArrowLeft size={16} /> {backLabel}
          </button>
        )}
        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            <RefreshCw size={16} /> 重试
          </button>
        )}
      </div>
    </div>
  )
}
