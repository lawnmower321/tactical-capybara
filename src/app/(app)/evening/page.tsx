'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import DialogCutscene from '@/components/dialog/DialogCutscene'
import MissionCard from '@/components/mission/MissionCard'
import { Button } from '@/components/ui/button'
import { DialogScene, Mission } from '@/types/game'

type Stage = 'loading' | 'dialog' | 'review' | 'committed'

export default function EveningPage() {
  const [stage, setStage] = useState<Stage>('loading')
  const [mission, setMission] = useState<Mission | null>(null)
  const [scene, setScene] = useState<DialogScene | null>(null)
  const [color, setColor] = useState('brown')
  const router = useRouter()
  const supabase = createClient()

  async function loadMissionAndDialog() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('capybara_color').eq('id', user.id).single()
    if (profile) setColor(profile.capybara_color)

    const mRes = await fetch('/api/missions/generate', { method: 'POST' })
    const { mission: m } = await mRes.json()
    setMission(m)

    const dRes = await fetch('/api/dialog/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trigger: 'mission_assign', mission_id: m.id }),
    })
    const { scene: s } = await dRes.json()
    setScene(s)
    setStage('dialog')
  }

  useEffect(() => {
    loadMissionAndDialog()
  }, [])

  async function commitMission() {
    if (!mission) return
    await supabase.from('missions').update({ status: 'active' }).eq('id', mission.id)
    setStage('committed')
  }

  async function reroll() {
    if (!mission) return
    setStage('loading')
    await supabase.from('missions').update({ status: 'skipped' }).eq('id', mission.id)
    setMission(null)
    setScene(null)
    await loadMissionAndDialog()
  }

  if (stage === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500 text-sm animate-pulse">Incoming transmission...</p>
      </div>
    )
  }

  if (stage === 'dialog' && scene) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <DialogCutscene scene={scene} capybaraColor={color} onComplete={() => setStage('review')} />
      </div>
    )
  }

  if (stage === 'review' && mission) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
        <p className="text-stone-400 text-xs uppercase tracking-widest">Tomorrow&apos;s mission</p>
        <MissionCard mission={mission} />
        <div className="flex gap-3">
          <Button variant="outline" className="border-stone-700 text-stone-400 hover:text-stone-200" onClick={reroll}>
            Reroll
          </Button>
          <Button className="bg-stone-700 hover:bg-stone-600" onClick={commitMission}>
            Accept mission
          </Button>
        </div>
      </div>
    )
  }

  if (stage === 'committed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4 text-center">
        <p className="text-stone-100 text-xl font-semibold">Mission locked in.</p>
        <p className="text-stone-500 text-sm">Get some rest. Tomorrow you move.</p>
        <Button variant="outline" className="border-stone-700 text-stone-400 mt-4" onClick={() => router.push('/morning')}>
          Done
        </Button>
      </div>
    )
  }

  return null
}
