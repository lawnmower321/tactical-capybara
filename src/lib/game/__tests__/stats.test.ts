import { describe, it, expect } from 'vitest'
import { calculateStatGain, calculateDecay } from '../stats'

describe('calculateStatGain', () => {
  it('adds xp without level-up when under threshold', () => {
    const result = calculateStatGain({ current_xp: 50, current_level: 1, xp_reward: 20 })
    expect(result.xp_gained).toBe(20)
    expect(result.leveled_up).toBe(false)
    expect(result.new_xp).toBe(70)
    expect(result.new_level).toBe(1)
  })

  it('levels up when xp crosses 100', () => {
    const result = calculateStatGain({ current_xp: 90, current_level: 1, xp_reward: 20 })
    expect(result.leveled_up).toBe(true)
    expect(result.new_level).toBe(2)
    expect(result.new_xp).toBe(10)
  })

  it('carries overflow xp into the new level', () => {
    const result = calculateStatGain({ current_xp: 80, current_level: 2, xp_reward: 25 })
    expect(result.leveled_up).toBe(true)
    expect(result.new_xp).toBe(5)
    expect(result.new_level).toBe(3)
  })
})

describe('calculateDecay', () => {
  it('subtracts decay amount from xp', () => {
    const result = calculateDecay({ current_xp: 50, current_level: 2 })
    expect(result.new_xp).toBe(45)
    expect(result.leveled_down).toBe(false)
    expect(result.new_level).toBe(2)
  })

  it('clamps to 0 without going negative', () => {
    const result = calculateDecay({ current_xp: 3, current_level: 2 })
    expect(result.new_xp).toBe(0)
    expect(result.leveled_down).toBe(false)
  })

  it('does not reduce level below 1', () => {
    const result = calculateDecay({ current_xp: 0, current_level: 1 })
    expect(result.new_xp).toBe(0)
    expect(result.new_level).toBe(1)
  })
})
