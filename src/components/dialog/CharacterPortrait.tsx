import CapybaraSprite from '@/components/capybara/CapybaraSprite'

interface CharacterPortraitProps {
  speaker: 'handler' | 'capybara'
  capybaraColor?: string
  active: boolean
}

export default function CharacterPortrait({ speaker, capybaraColor = 'brown', active }: CharacterPortraitProps) {
  return (
    <div className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-35'}`}>
      {speaker === 'handler' ? (
        <div className="w-20 h-20 bg-stone-900 rounded-2xl border border-stone-700 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-stone-800" />
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-7 h-7 bg-stone-700 rounded-full" />
            <div className="w-11 h-9 bg-stone-700 rounded-t-2xl" />
          </div>
          <div className="absolute inset-0 bg-stone-950/60" />
          <div className="absolute top-5 left-6 w-2 h-1 bg-amber-400 rounded-full blur-[1px]" />
          <div className="absolute top-5 right-6 w-2 h-1 bg-amber-400 rounded-full blur-[1px]" />
        </div>
      ) : (
        <CapybaraSprite color={capybaraColor} size="sm" />
      )}
      <span className="text-xs text-stone-600 uppercase tracking-widest">
        {speaker === 'handler' ? '???' : 'You'}
      </span>
    </div>
  )
}
