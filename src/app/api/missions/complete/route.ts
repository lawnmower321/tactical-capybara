import { createClient } from '@/lib/supabase/server'
import { calculateStatGain } from '@/lib/game/stats'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { mission_id } = await request.json() as { mission_id: string }

  const { data: mission } = await supabase
    .from('missions').select('*')
    .eq('id', mission_id).eq('user_id', user.id).single()

  if (!mission || mission.status !== 'active') {
    return NextResponse.json({ error: 'Mission not found or not active' }, { status: 400 })
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const statKey = mission.stat_type as 'focus' | 'discipline' | 'output'
  const current_xp = profile[`${statKey}_xp` as keyof typeof profile] as number
  const current_level = profile[`${statKey}_level` as keyof typeof profile] as number

  const gain = calculateStatGain({ current_xp, current_level, xp_reward: mission.xp_reward })
  const rewards = mission.resource_rewards as Record<string, number>

  const new_focus_level = statKey === 'focus' ? gain.new_level : profile.focus_level
  const new_discipline_level = statKey === 'discipline' ? gain.new_level : profile.discipline_level
  const new_output_level = statKey === 'output' ? gain.new_level : profile.output_level

  await supabase.from('profiles').update({
    [`${statKey}_xp`]: gain.new_xp,
    [`${statKey}_level`]: gain.new_level,
    level: new_focus_level + new_discipline_level + new_output_level,
    focus_crystals: profile.focus_crystals + (rewards.focus_crystals ?? 0),
    iron: profile.iron + (rewards.iron ?? 0),
    momentum: profile.momentum + (rewards.momentum ?? 0),
    current_streak: profile.current_streak + 1,
    longest_streak: Math.max(profile.longest_streak, profile.current_streak + 1),
    last_mission_date: new Date().toISOString().split('T')[0],
    updated_at: new Date().toISOString(),
  }).eq('id', user.id)

  await supabase.from('missions').update({
    status: 'completed',
    completed_at: new Date().toISOString(),
  }).eq('id', mission_id)

  await supabase.from('stat_events').insert({
    user_id: user.id,
    stat_type: statKey,
    delta: gain.xp_gained,
    source: 'mission_complete',
    mission_id,
  })

  return NextResponse.json({
    gain,
    leveled_up: gain.leveled_up,
    stat_that_leveled: statKey,
    resources_earned: rewards,
  })
}
