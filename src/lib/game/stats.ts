import { XP_PER_LEVEL, DAILY_DECAY_AMOUNT, StatGainResult, DecayResult } from '@/types/game'

export function calculateStatGain(input: {
  current_xp: number
  current_level: number
  xp_reward: number
}): StatGainResult {
  const { current_xp, current_level, xp_reward } = input
  const total = current_xp + xp_reward

  if (total >= XP_PER_LEVEL) {
    return {
      xp_gained: xp_reward,
      leveled_up: true,
      new_xp: total - XP_PER_LEVEL,
      new_level: current_level + 1,
    }
  }

  return {
    xp_gained: xp_reward,
    leveled_up: false,
    new_xp: total,
    new_level: current_level,
  }
}

export function calculateDecay(input: {
  current_xp: number
  current_level: number
}): DecayResult {
  const { current_xp, current_level } = input
  return {
    new_xp: Math.max(0, current_xp - DAILY_DECAY_AMOUNT),
    new_level: current_level,
    leveled_down: false,
  }
}
