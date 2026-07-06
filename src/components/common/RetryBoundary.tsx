/**
 * 文件用途：错误边界组件（Error Boundary）。
 * 用来"兜住"子组件在渲染时抛出的运行时错误，避免一个子组件崩溃导致整个白屏。
 * 捕获到错误后，会展示一个友好的错误页面，并提供"重试"和"刷新页面"按钮。
 */

// Component 是 React 类组件的基类，ReactNode 表示任意可作为子节点的 React 内容
import { Component, type ReactNode } from 'react'
// AlertTriangle 是一个三角警告图标，用于错误提示视觉
import { AlertTriangle } from 'lucide-react'

// 父组件传入需要被"保护"的子内容
interface Props {
  children: ReactNode
}

// 边界组件内部状态：是否发生了错误，以及错误信息
interface State {
  hasError: boolean
  message?: string
}

// 注意：错误边界必须是类组件，因为 React 只有类组件能实现 getDerivedStateFromError / componentDidCatch
export class RetryBoundary extends Component<Props, State> {
  // 初始状态为"未发生错误"
  state: State = { hasError: false }

  // 当子组件渲染抛出错误时，React 会调用这个静态方法；
  // 我们把错误信息存进 state，从而触发重新渲染并显示错误页
  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message }
  }

  // 这是 React 提供的"副作用"钩子，用于记录错误日志、上报监控等
  componentDidCatch(err: Error, info: unknown) {
    console.error('[RetryBoundary] 捕获渲染异常:', err, info)
  }

  // 点击"重试"时清空错误状态，让组件尝试重新渲染子组件
  handleReset = () => this.setState({ hasError: false, message: undefined })

  render() {
    // 如果已经捕获到错误，则展示错误页而不是崩溃的子组件
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
          <AlertTriangle className="mb-4 h-10 w-10 text-amber-400" />
          <h1 className="text-lg font-semibold text-slate-700">页面出错了</h1>
          <p className="mt-2 text-sm text-slate-500">
            {/* 优先显示具体错误信息，没有则用兜底文案 */}
            {this.state.message || '发生未知错误'}
          </p>
          <div className="mt-6 flex gap-3">
            {/* "重试"按钮清空错误状态，尝试重新渲染子组件 */}
            <button onClick={this.handleReset} className="btn-ghost">重试</button>
            {/* "刷新页面"按钮直接重新加载整个网页，用于重试也解决不了的严重错误 */}
            <button onClick={() => window.location.reload()} className="btn-primary">
              刷新页面
            </button>
          </div>
        </div>
      )
    }
    // 没有发生错误时，正常渲染子组件
    return this.props.children
  }
}
