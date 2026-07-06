/**
 * 文件用途：匹配度环形进度条组件。
 * 用一个圆环图形展示方案的"匹配分数"（0-100），分数越高环越满，
 * 并根据分数高低显示不同颜色（绿/紫/橙），让用户一眼判断方案契合度。
 */

// 组件参数定义
interface MatchScoreRingProps {
  // 匹配分数，范围 0-100
  score: number  // 0-100
  // 环形图的尺寸（直径），默认 56 像素，便于在不同位置复用
  size?: number
}

export function MatchScoreRing({ score, size = 56 }: MatchScoreRingProps) {
  // 圆环半径：减 8 是为了给描边宽度留出空间，避免被裁切
  const radius = (size - 8) / 2
  // 圆周长，用于计算进度条偏移量
  const circumference = 2 * Math.PI * radius
  // 偏移量：分数越高，偏移越小，环画得越满
  const offset = circumference - (score / 100) * circumference
  // 根据分数分段选用不同颜色：80+ 绿色（优秀）、60+ 紫色（良好）、其余橙色（一般）
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#7c4dff' : '#f59e0b'

  return (
    // 用相对定位让文字能叠在圆环正中间
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* SVG 绘制环形进度：-rotate-90 让起点从顶部 12 点钟方向开始 */}
      <svg width={size} height={size} className="-rotate-90">
        {/* 背景圆环（灰色底圈） */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="4"
        />
        {/* 进度圆环：用 strokeDasharray + strokeDashoffset 控制已绘制长度 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          // 过渡动画让分数变化时环平滑增长
          className="transition-all duration-500"
        />
      </svg>
      {/* 圆环中央显示分数和"匹配"字样 */}
      <div className="absolute flex flex-col items-center">
        <span className="text-base font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[9px] text-slate-400">匹配</span>
      </div>
    </div>
  )
}
