import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message?: string
}

export class RetryBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message }
  }

  componentDidCatch(err: Error, info: unknown) {
    console.error('[RetryBoundary] 捕获渲染异常:', err, info)
  }

  handleReset = () => this.setState({ hasError: false, message: undefined })

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
          <AlertTriangle className="mb-4 h-10 w-10 text-amber-400" />
          <h1 className="text-lg font-semibold text-slate-700">页面出错了</h1>
          <p className="mt-2 text-sm text-slate-500">
            {this.state.message || '发生未知错误'}
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={this.handleReset} className="btn-ghost">重试</button>
            <button onClick={() => window.location.reload()} className="btn-primary">
              刷新页面
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
