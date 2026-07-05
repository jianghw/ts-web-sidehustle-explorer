export function SkeletonCard() {
  return (
    <div className="card animate-pulse p-5">
      <div className="mb-3 flex items-start justify-between">
        <div className="h-5 w-16 rounded-full bg-slate-200" />
        <div className="h-14 w-14 rounded-full bg-slate-200" />
      </div>
      <div className="h-4 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-full rounded bg-slate-100" />
      <div className="mt-1 h-3 w-2/3 rounded bg-slate-100" />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-16 rounded-full bg-slate-100" />
        <div className="h-5 w-20 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
    </div>
  )
}
