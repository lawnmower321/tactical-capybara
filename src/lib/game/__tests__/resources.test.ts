import { describe, it, expect } from 'vitest'
import { calculateResourceDrop } from '../resources'

describe('calculateResourceDrop', () => {
  it('drops focus_crystals for focus missions', () => {
    const result = calculateResourceDrop({ stat_type: 'focus', stat_level: 1 })
    expect(result.focus_crystals).toBeGreaterThan(0)
    expect(result.iron).toBe(0)
    expect(result.momentum).toBe(0)
  })

  it('drops iron for discipline missions', () => {
    const result = calculateResourceDrop({ stat_type: 'discipline', stat_level: 1 })
    expect(result.iron).toBeGreaterThan(0)
    expect(result.focus_crystals).toBe(0)
  })

  it('drops momentum for output missions', () => {
    const result = calculateResourceDrop({ stat_type: 'output', stat_level: 1 })
    expect(result.momentum).toBeGreaterThan(0)
  })

  it('scales with stat level', () => {
    const low = calculateResourceDrop({ stat_type: 'focus', stat_level: 1 })
    const high = calculateResourceDrop({ stat_type: 'focus', stat_level: 5 })
    expect(high.focus_crystals).toBeGreaterThan(low.focus_crystals)
  })
})
