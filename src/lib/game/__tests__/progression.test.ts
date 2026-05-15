import { describe, it, expect } from 'vitest'
import { calculateOverallLevel, missionDifficultyForLevel, xpRewardForDifficulty } from '../progression'

describe('calculateOverallLevel', () => {
  it('sums all three stat levels', () => {
    expect(calculateOverallLevel({ focus_level: 2, discipline_level: 1, output_level: 3 })).toBe(6)
  })

  it('is 3 at game start (all stats level 1)', () => {
    expect(calculateOverallLevel({ focus_level: 1, discipline_level: 1, output_level: 1 })).toBe(3)
  })
})

describe('missionDifficultyForLevel', () => {
  it('returns 1 at level 3', () => {
    expect(missionDifficultyForLevel(3)).toBe(1)
  })

  it('increases with overall level', () => {
    expect(missionDifficultyForLevel(9)).toBeGreaterThan(missionDifficultyForLevel(3))
  })

  it('caps at 10', () => {
    expect(missionDifficultyForLevel(100)).toBe(10)
  })
})

describe('xpRewardForDifficulty', () => {
  it('returns 15 at difficulty 1', () => {
    expect(xpRewardForDifficulty(1)).toBe(15)
  })

  it('returns 60 at difficulty 10', () => {
    expect(xpRewardForDifficulty(10)).toBe(60)
  })
})
