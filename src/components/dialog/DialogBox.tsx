'use client'

interface DialogBoxProps {
  speaker: 'handler' | 'capybara'
  text: string
  options?: string[]
  onOptionSelect: (option: string) => void
  onAdvance: () => void
}

export default function DialogBox({ speaker, text, options, onOptionSelect, onAdvance }: DialogBoxProps) {
  const hasOptions = options && options.length > 0

  return (
    <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 space-y-4">
      <p className="text-xs text-stone-500 uppercase tracking-widest">
        {speaker === 'handler' ? '???' : 'You'}
      </p>
      <p className="text-stone-100 text-sm leading-relaxed min-h-[3rem]">{text}</p>

      {hasOptions ? (
        <div className="space-y-2 pt-1">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onOptionSelect(opt)}
              className="w-full text-left px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-xl text-stone-300 text-sm transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={onAdvance}
          className="text-stone-600 text-xs hover:text-stone-400 transition-colors"
        >
          Continue ▶
        </button>
      )}
    </div>
  )
}
