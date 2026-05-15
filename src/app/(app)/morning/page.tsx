'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CapybaraSprite from '@/components/capybara/CapybaraSprite'
import MissionCard from '@/components/mission/MissionCard'
import StatBar from '@/components/stats/StatBar'
import ResourceBadge from '@/components/stats/ResourceBadge'
import DialogCutscene from '@/components/dialog/DialogCutscene'
import { Button } from '@/components/ui/button'
import { Mission, DialogScene, XP_PER_LEVEL } from '@/types/game'

type Stage = 'loading' | 'brief' | 'completing' | 'dialog' | 'done'

export default function MorningPage() {
  const [stage, setStage] = useState<Stage>('loading')
  const [profile, setProfile] = useState<Record<string, any> | null>(null)
  const [mission, setMission] = useState<Mission | null>(null)
  const [scene, setScene] = useState<DialogScene | null>(null)
  const [completionData, setCompletionData] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(data)
    return { user, profile: data }
  }

  useEffect(() => {
    async function init() {
      const result = await loadProfile()
      if (!result) return

      const today = new Date().toISOString().split('T')[0]
      const { data: m } = await supabase
        .from('missions').select('*')
        .eq('user_id', result.user.id).eq('assigned_date', today)
        .in('status', ['active', 'completed']).single()

      if (m) setMission(m as any)
      setStage('brief')
    }
    init()
  }, [])

  async function handleComplete() {
    if (!mission) return
    setStage('completing')

    const res = await fetch('/api/missions/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mission_id: mission.id }),
    })
    const result = await res.json()
    setCompletionData(result)

    await loadProfile()

    const dRes = await fetch('/api/dialog/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trigger: result.leveled_up ? 'level_up' : 'mission_complete',
        mission_id: mission.id,
        stat_that_leveled: result.stat_that_leveled,
      }),
    })
    const { scene: s } = await dRes.json()
    setScene(s)
    setStage('dialog')
  }

  if (stage === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500 text-sm animate-pulse">Briefing operative...</p>
      </div>
    )
  }

  if (stage === 'brief' && profile) {
    const overallLevel = profile.focus_level + profile.discipline_level + profile.output_level

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 max-w-sm mx-auto w-full">
        <div className="flex items-center gap-4 w-full">
          <CapybaraSprite color={profile.capybara_color ?? 'brown'} size="md" />
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-widest">Level {overallLevel}</p>
            <p className="text-stone-100 font-semibold text-lg">
              {mission ? "Today's mission" : 'No mission yet'}
            </p>
            <p className="text-stone-500 text-xs">Streak: {profile.current_streak} days</p>
          </div>
        </div>

        {mission ? (
          <>
            <MissionCard mission={mission} />
            {mission.status === 'active' && (
              <Button onClick={handleComplete} className="w-full bg-stone-700 hover:bg-stone-600">
                Mark complete
              </Button>
            )}
            {mission.status === 'completed' && (
              <p className="text-green-400 text-sm text-center">Mission complete. Come back tonight.</p>
            )}
          </>
        ) : (
          <>
            <p className="text-stone-500 text-sm text-center">No mission assigned for today.</p>
            <Button onClick={() => router.push('/evening')} className="bg-stone-700 hover:bg-stone-600">
              Get tonight&apos;s brief
            </Button>
          </>
        )}

        <div className="w-full space-y-3 pt-2">
          <StatBar label="Focus" level={profile.focus_level} xp={profile.focus_xp} maxXp={XP_PER_LEVEL} color="bg-blue-500" />
          <StatBar label="Discipline" level={profile.discipline_level} xp={profile.discipline_xp} maxXp={XP_PER_LEVEL} color="bg-amber-500" />
          <StatBar label="Output" level={profile.output_level} xp={profile.output_xp} maxXp={XP_PER_LEVEL} color="bg-green-500" />
        </div>

        <div className="flex gap-2 w-full">
          <ResourceBadge label="Focus Crystals" amount={profile.focus_crystals} icon="💎" />
          <ResourceBadge label="Iron" amount={profile.iron} icon="⚙️" />
          <ResourceBadge label="Momentum" amount={profile.momentum} icon="⚡" />
        </div>
      </div>
    )
  }

  if (stage === 'completing') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500 text-sm animate-pulse">Reporting in...</p>
      </div>
    )
  }

  if (stage === 'dialog' && scene && profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
        {completionData?.leveled_up && (
          <p className="text-amber-400 text-xs uppercase tracking-widest font-bold">Stat leveled up</p>
        )}
        <DialogCutscene
          scene={scene}
          capybaraColor={profile.capybara_color ?? 'brown'}
          onComplete={() => setStage('done')}
        />
      </div>
    )
  }

  if (stage === 'done' && profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-5 text-center">
        <CapybaraSprite color={profile.capybara_color ?? 'brown'} size="lg" animated />
        <p className="text-stone-100 text-xl font-semibold">Solid work.</p>
        <p className="text-stone-500 text-sm">Come back tonight for tomorrow&apos;s brief.</p>
      </div>
    )
  }

  return null
}
