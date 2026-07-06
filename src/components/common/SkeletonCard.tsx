/**
 * 文件用途：骨架屏卡片组件。
 * 在真实数据还没加载完成时，用一组灰色色块模拟卡片的形状，
 * 配合脉冲动画让用户感觉"内容正在加载"，比空白页面体验更好。
 */

// 这个组件不需要接收任何参数，因为它只是占位用的"假卡片"
export function SkeletonCard() {
  return (
    // animate-pulse 让整个卡片做轻微的明暗呼吸动画，营造"加载中"的视觉效果
    <div className="card animate-pulse p-5">
      {/* 顶部一行：左侧模拟一个标签，右侧模拟一个圆形头像/图标占位 */}
      <div className="mb-3 flex items-start justify-between">
        <div className="h-5 w-16 rounded-full bg-slate-200" />
        <div className="h-14 w-14 rounded-full bg-slate-200" />
      </div>
      {/* 模拟主标题：宽度占 3/4，比正文略高 */}
      <div className="h-4 w-3/4 rounded bg-slate-200" />
      {/* 两行正文占位，宽度不同是为了看起来更像真实文字 */}
      <div className="mt-2 h-3 w-full rounded bg-slate-100" />
      <div className="mt-1 h-3 w-2/3 rounded bg-slate-100" />
      {/* 模拟底部标签组 */}
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-16 rounded-full bg-slate-100" />
        <div className="h-5 w-20 rounded-full bg-slate-100" />
      </div>
      {/* 用分隔线和留白模拟卡片底部信息区 */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
    </div>
  )
}
