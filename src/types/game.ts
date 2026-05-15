export type StatType = 'focus' | 'discipline' | 'output'
export type ResourceType = 'focus_crystals' | 'iron' | 'momentum'
export type BoosterType = 'xp_surge' | 'streak_shield' | 'mission_reroll' | 'clarity_lens'
export type MissionStatus = 'pending' | 'active' | 'completed' | 'failed' | 'skipped'
export type DialogTrigger = 'mission_assign' | 'mission_complete' | 'level_up'

export interface StatState {
  focus_xp: number
  focus_level: number
  discipline_xp: number
  discipline_level: number
  output_xp: number
  output_level: number
}

export interface Resources {
  focus_crystals: number
  iron: number
  momentum: number
}

export interface Mission {
  id: string
  title: string
  description: string
  stat_type: StatType
  difficulty: number
  estimated_minutes: number
  xp_reward: number
  resource_rewards: Partial<Resources>
  status: MissionStatus
  assigned_date: string
}

export interface StatGainResult {
  xp_gained: number
  leveled_up: boolean
  new_xp: number
  new_level: number
}

export interface DecayResult {
  new_xp: number
  new_level: number
  leveled_down: boolean
}

export interface DialogLine {
  speaker: 'handler' | 'capybara'
  text: string
  options?: string[]
}

export interface DialogScene {
  lines: DialogLine[]
  trigger: DialogTrigger
}

export const XP_PER_LEVEL = 100
export const BASE_RESOURCE_DROP = 10
export const RESOURCE_DROP_PER_STAT_LEVEL = 3
export const DAILY_DECAY_AMOUNT = 5
export const STAT_TYPE_TO_RESOURCE: Record<StatType, ResourceType> = {
  focus: 'focus_crystals',
  discipline: 'iron',
  output: 'momentum',
}
