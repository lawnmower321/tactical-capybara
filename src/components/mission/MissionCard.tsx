import { Mission } from '@/types/game'

const STAT_STYLES: Record<string, { label: string; classes: string }> = {
  focus: { label: 'FOCUS', classes: 'text-blue-400 bg-blue-950' },
  discipline: { label: 'DISCIPLINE', classes: 'text-amber-400 bg-amber-950' },
  output: { label: 'OUTPUT', classes: 'text-green-400 bg-green-950' },
}

export default function MissionCard({ mission }: { mission: Mission }) {
  const stat = STAT_STYLES[mission.stat_type]
  const rewards = mission.resource_rewards as Record<string, number>

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 w-full max-w-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${stat.classes}`}>{stat.label}</span>
        <span className="text-stone-500 text-xs">{mission.estimated_minutes} min</span>
      </div>
      <h3 className="text-stone-100 font-semibold text-lg leading-snug">{mission.title}</h3>
      <p className="text-stone-400 text-sm">{mission.description}</p>
      <div className="flex gap-4 text-xs text-stone-600 pt-1">
        <span>+{mission.xp_reward} XP</span>
        {Object.entries(rewards).filter(([, v]) => v > 0).map(([k, v]) => (
          <span key={k}>+{v} {k.replace(/_/g, ' ')}</span>
        ))}
      </div>
    </div>
  )
}
