interface StatBarProps {
  label: string
  level: number
  xp: number
  maxXp: number
  color: string
}

export default function StatBar({ label, level, xp, maxXp, color }: StatBarProps) {
  const pct = Math.min(100, Math.round((xp / maxXp) * 100))

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-stone-400 text-xs uppercase tracking-widest">{label}</span>
        <span className="text-stone-400 text-xs font-mono">Lv.{level} · {xp}/{maxXp}</span>
      </div>
      <div className="h-2 rounded-full bg-stone-800 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
