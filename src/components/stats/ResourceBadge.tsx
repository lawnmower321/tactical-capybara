interface ResourceBadgeProps {
  label: string
  amount: number
  icon: string
}

export default function ResourceBadge({ label, amount, icon }: ResourceBadgeProps) {
  return (
    <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 flex-1">
      <span className="text-base">{icon}</span>
      <div className="min-w-0">
        <p className="text-stone-100 text-sm font-semibold">{amount}</p>
        <p className="text-stone-500 text-xs truncate">{label}</p>
      </div>
    </div>
  )
}
