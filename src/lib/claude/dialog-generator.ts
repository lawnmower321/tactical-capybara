import Anthropic from '@anthropic-ai/sdk'
import { DialogScene, DialogTrigger, Mission } from '@/types/game'

const client = new Anthropic()

const HANDLER_DIALOG_SYSTEM = `You are writing a short visual novel dialog scene with two characters:

THE HANDLER: Shadowy. Godly powerful. Cryptic. Speaks in short, precise sentences. Never explains motivations. Occasionally reveals something about the operative they did not know. Creates unease and intrigue.

THE CAPYBARA: The player's operative. Capable, occasionally bewildered. Communicates in short reactions. Can be curious, defiant, or quietly determined.

Write exactly 4 exchanges alternating: Handler, Capybara, Handler, Capybara. The final Capybara line must include 2-3 response options that shape personality.

Respond ONLY with valid JSON, no other text:
{
  "lines": [
    { "speaker": "handler", "text": "..." },
    { "speaker": "capybara", "text": "..." },
    { "speaker": "handler", "text": "..." },
    { "speaker": "capybara", "text": "...", "options": ["option 1", "option 2", "option 3"] }
  ]
}`

export async function generateDialog(context: {
  trigger: DialogTrigger
  mission?: Pick<Mission, 'title' | 'description' | 'stat_type'>
  overall_level: number
  stat_that_leveled?: string
}): Promise<DialogScene> {
  let prompt = ''

  if (context.trigger === 'mission_assign' && context.mission) {
    prompt = `Mission assignment. Tomorrow: "${context.mission.title}" — ${context.mission.description}. Operative level ${context.overall_level}. Handler delivers the brief.`
  } else if (context.trigger === 'mission_complete' && context.mission) {
    prompt = `Mission complete. Operative just finished: "${context.mission.title}". Level ${context.overall_level}. Handler acknowledges briefly, cryptically. Hint at what is coming.`
  } else if (context.trigger === 'level_up') {
    prompt = `Level-up. Operative's ${context.stat_that_leveled} stat leveled up. Overall level ${context.overall_level}. Bigger moment — Handler marks it. Something shifts.`
  }

  const { content } = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: HANDLER_DIALOG_SYSTEM,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = content[0].type === 'text' ? content[0].text : ''
  const parsed = JSON.parse(text)

  return { lines: parsed.lines, trigger: context.trigger }
}
