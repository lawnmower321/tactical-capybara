export function calculateOverallLevel(stats: {
  focus_level: number
  discipline_level: number
  output_level: number
}): number {
  return stats.focus_level + stats.discipline_level + stats.output_level
}

export function missionDifficultyForLevel(overallLevel: number): number {
  // Overall level starts at 3 (all stats at level 1), so offset before scaling
  return Math.min(Math.floor((overallLevel - 3) / 3) + 1, 10)
}

export function xpRewardForDifficulty(difficulty: number): number {
  return 15 + (difficulty - 1) * 5
}
