import { describe, expect, it } from 'vitest'
import { getConfidenceBand, getConfidenceColor } from './driveMath'

describe('getConfidenceBand', () => {
  it('returns reliable at high confidence', () => {
    expect(getConfidenceBand(92)).toBe('reliable')
  })

  it('returns uncertain for mid confidence', () => {
    expect(getConfidenceBand(55)).toBe('uncertain')
  })

  it('returns critical at low confidence', () => {
    expect(getConfidenceBand(22)).toBe('critical')
  })
})

describe('getConfidenceColor', () => {
  it('returns green for reliable band', () => {
    expect(getConfidenceColor(71)).toBe('#21c58e')
  })

  it('returns amber for uncertain band', () => {
    expect(getConfidenceColor(45)).toBe('#ffb648')
  })

  it('returns red for critical band', () => {
    expect(getConfidenceColor(10)).toBe('#ff5d5d')
  })
})
