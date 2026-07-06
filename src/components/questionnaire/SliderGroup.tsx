/**
 * 文件用途：滑块选择组件。
 * 让用户通过拖动滑块来选择一个数值，常用于"每天能投入多少时间""每周能投入多少资金"这类问题，
 * 比直接输入数字更直观、更省事。
 */

// 组件参数定义，全部为必填或可选配置项
interface SliderGroupProps {
  // 滑块最小值
  min: number
  // 滑块最大值
  max: number
  // 每次拖动的步长，例如 1 表示只能选整数
  step: number
  // 数值单位（如"小时""元"），显示在数值后面让用户明白单位含义
  unit?: string
  // 当前数值，由父组件控制（受控组件）
  value: number
  // 拖动时的回调，把新数值传回父组件
  onChange: (v: number) => void
}

export function SliderGroup({ min, max, step, unit, value, onChange }: SliderGroupProps) {
  return (
    <div>
      {/* 顶部一行：左侧显示最小值，中间大字显示当前值，右侧显示最大值 */}
      <div className="mb-3 flex items-end justify-between">
        <span className="text-xs text-slate-400">{min}{unit}</span>
        {/* 当前值用大号主色字体突出显示，单位用小字弱化 */}
        <span className="text-2xl font-bold text-brand-600">
          {value}
          <span className="ml-1 text-sm font-normal text-slate-500">{unit}</span>
        </span>
        <span className="text-xs text-slate-400">{max}{unit}</span>
      </div>
      {/* 原生 range 滑块：浏览器自带，无需自己实现拖动逻辑；onChange 把字符串转成数字 */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      {/* 底部刻度：把 min 到 max 的每个整数都列出来，方便用户对齐数值 */}
      <div className="mt-2 flex justify-between text-[11px] text-slate-300">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
    </div>
  )
}
