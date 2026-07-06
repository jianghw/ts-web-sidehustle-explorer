/**
 * 文件用途：页面底部页脚（Footer）。
 * 显示产品名称和免责声明，提醒用户 AI 生成的方案仅供参考，需谨慎决策。
 */

// 页脚是纯静态展示内容，不需要接收任何参数
export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-400">
        <p>人生副业体验器 · TRAE AI 创造力大赛参赛作品</p>
        {/* 免责声明：用较浅的颜色弱化，但保留必要提示，规避潜在风险 */}
        <p className="mt-1">AI 生成的方案仅供参考，投资有风险，入局需谨慎。</p>
      </div>
    </footer>
  )
}
