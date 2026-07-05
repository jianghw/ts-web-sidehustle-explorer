interface MatchScoreRingProps {
  score: number  // 0-100
  size?: number
}

export function MatchScoreRing({ score, size = 56 }: MatchScoreRingProps) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#7c4dff' : '#f59e0b'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="4"
        />
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
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-base font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[9px] text-slate-400">匹配</span>
      </div>
    </div>
  )
}
