interface SliderGroupProps {
  min: number
  max: number
  step: number
  unit?: string
  value: number
  onChange: (v: number) => void
}

export function SliderGroup({ min, max, step, unit, value, onChange }: SliderGroupProps) {
  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <span className="text-xs text-slate-400">{min}{unit}</span>
        <span className="text-2xl font-bold text-brand-600">
          {value}
          <span className="ml-1 text-sm font-normal text-slate-500">{unit}</span>
        </span>
        <span className="text-xs text-slate-400">{max}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="mt-2 flex justify-between text-[11px] text-slate-300">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
    </div>
  )
}
