import { createClient } from '@/lib/supabase/server'
import { generateDialog } from '@/lib/claude/dialog-generator'
import { NextResponse } from 'next/server'
import { DialogTrigger } from '@/types/game'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { trigger, mission_id, stat_that_leveled } = await request.json() as {
    trigger: DialogTrigger
    mission_id?: string
    stat_that_leveled?: string
  }

  const { data: profile } = await supabase
    .from('profiles').select('focus_level, discipline_level, output_level').eq('id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const overall_level = profile.focus_level + profile.discipline_level + profile.output_level

  let mission = undefined
  if (mission_id) {
    const { data } = await supabase
      .from('missions').select('title, description, stat_type').eq('id', mission_id).single()
    mission = data ?? undefined
  }

  const scene = await generateDialog({ trigger, mission, overall_level, stat_that_leveled })

  if (mission_id) {
    await supabase.from('dialog_history').insert({
      user_id: user.id,
      trigger_type: trigger,
      mission_id,
      dialog_data: scene,
    })
  }

  return NextResponse.json({ scene })
}
