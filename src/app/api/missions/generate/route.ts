import { createClient } from '@/lib/supabase/server'
import { generateMission } from '@/lib/claude/mission-generator'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const today = new Date().toISOString().split('T')[0]
  const { data: existing } = await supabase
    .from('missions').select('*')
    .eq('user_id', user.id).eq('assigned_date', today)
    .in('status', ['pending', 'active']).single()

  if (existing) return NextResponse.json({ mission: existing })

  const { data: recent } = await supabase
    .from('missions').select('title, stat_type, status')
    .eq('user_id', user.id).order('created_at', { ascending: false }).limit(7)

  const completed = recent?.filter(m => m.status === 'completed').length ?? 0
  const completion_rate_7d = recent?.length ? completed / recent.length : 0
  const overall_level = profile.focus_level + profile.discipline_level + profile.output_level

  const missionData = await generateMission({
    overall_level,
    focus_level: profile.focus_level,
    discipline_level: profile.discipline_level,
    output_level: profile.output_level,
    recent_missions: (recent ?? []).map(m => ({
      title: m.title,
      stat_type: m.stat_type as any,
      completed: m.status === 'completed',
    })),
    completion_rate_7d,
  })

  const { data: mission, error } = await supabase
    .from('missions')
    .insert({ user_id: user.id, ...missionData, resource_rewards: missionData.resource_rewards })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ mission })
}
