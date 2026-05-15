import Anthropic from '@anthropic-ai/sdk'
import { StatType, Mission } from '@/types/game'
import { missionDifficultyForLevel, xpRewardForDifficulty } from '@/lib/game/progression'
import { calculateResourceDrop } from '@/lib/game/resources'

const client = new Anthropic()

const HANDLER_MISSION_SYSTEM = `You are a shadowy, impossibly capable operative handler. You do not explain yourself. You speak in short, precise sentences. You see potential in this operative that they cannot yet see in themselves.

Generate exactly ONE mission. It must be concrete, specific, and completable in a single session. It trains exactly one stat:
- focus: sustained attention without distraction
- discipline: showing up and doing the thing consistently
- output: producing something tangible

Difficulty calibration:
- Overall level 3-5: tiny missions, 5-20 minutes. The point is the habit.
- Overall level 6-9: real sessions, 30-60 minutes.
- Overall level 10+: demanding focus blocks, 60-120 minutes.

Respond ONLY with valid JSON, no other text:
{
  "title": "short title (max 8 words)",
  "description": "one sentence: exactly what to do",
  "stat_type": "focus" | "discipline" | "output",
  "estimated_minutes": number
}`

interface MissionContext {
  overall_level: number
  focus_level: number
  discipline_level: number
  output_level: number
  recent_missions: Array<{ title: string; stat_type: StatType; completed: boolean }>
  completion_rate_7d: number
}

export async function generateMission(
  context: MissionContext
): Promise<Omit<Mission, 'id' | 'status' | 'assigned_date'>> {
  const difficulty = missionDifficultyForLevel(context.overall_level)
  const recentTitles = context.recent_missions.map(m => m.title).join(', ') || 'none'

  const { content } = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    system: HANDLER_MISSION_SYSTEM,
    messages: [{
      role: 'user',
      content: `Focus L${context.focus_level}, Discipline L${context.discipline_level}, Output L${context.output_level}. Overall level ${context.overall_level}. 7-day completion rate: ${Math.round(context.completion_rate_7d * 100)}%. Recent missions: ${recentTitles}. Generate mission.`,
    }],
  })

  const text = content[0].type === 'text' ? content[0].text : ''
  const parsed = JSON.parse(text) as { title: string; description: string; stat_type: StatType; estimated_minutes: number }

  const stat_level = context[`${parsed.stat_type}_level` as 'focus_level' | 'discipline_level' | 'output_level']
  const resource_rewards = calculateResourceDrop({ stat_type: parsed.stat_type, stat_level })

  return {
    title: parsed.title,
    description: parsed.description,
    stat_type: parsed.stat_type,
    difficulty,
    estimated_minutes: parsed.estimated_minutes,
    xp_reward: xpRewardForDifficulty(difficulty),
    resource_rewards,
  }
}
