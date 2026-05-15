'use client'

import { useState } from 'react'
import CharacterPortrait from './CharacterPortrait'
import DialogBox from './DialogBox'
import { DialogScene } from '@/types/game'

interface DialogCutsceneProps {
  scene: DialogScene
  capybaraColor: string
  onComplete: (choices: string[]) => void
}

export default function DialogCutscene({ scene, capybaraColor, onComplete }: DialogCutsceneProps) {
  const [index, setIndex] = useState(0)
  const [choices, setChoices] = useState<string[]>([])

  const line = scene.lines[index]
  const isLast = index === scene.lines.length - 1

  function advance() {
    if (isLast) { onComplete(choices); return }
    setIndex(i => i + 1)
  }

  function selectOption(option: string) {
    const next = [...choices, option]
    setChoices(next)
    if (isLast) { onComplete(next); return }
    setIndex(i => i + 1)
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <div className="flex justify-around items-end px-4">
        <CharacterPortrait speaker="handler" active={line.speaker === 'handler'} />
        <CharacterPortrait speaker="capybara" capybaraColor={capybaraColor} active={line.speaker === 'capybara'} />
      </div>
      <DialogBox
        speaker={line.speaker}
        text={line.text}
        options={line.options}
        onOptionSelect={selectOption}
        onAdvance={advance}
      />
    </div>
  )
}
