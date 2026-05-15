import {
  StatType,
  Resources,
  BASE_RESOURCE_DROP,
  RESOURCE_DROP_PER_STAT_LEVEL,
  STAT_TYPE_TO_RESOURCE,
} from '@/types/game'

export function calculateResourceDrop(input: {
  stat_type: StatType
  stat_level: number
}): Resources {
  const { stat_type, stat_level } = input
  const amount = BASE_RESOURCE_DROP + (stat_level - 1) * RESOURCE_DROP_PER_STAT_LEVEL
  const key = STAT_TYPE_TO_RESOURCE[stat_type]

  return {
    focus_crystals: key === 'focus_crystals' ? amount : 0,
    iron: key === 'iron' ? amount : 0,
    momentum: key === 'momentum' ? amount : 0,
  }
}
