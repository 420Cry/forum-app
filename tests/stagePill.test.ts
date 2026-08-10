import { describe, expect, it } from 'vitest'
import {
  STARTUP_STAGE_LABELS,
  isStartupStage,
  stageToPillVariant,
} from '~/utils/stagePill'

describe('stageToPillVariant', () => {
  it('maps API and display stage strings', () => {
    expect(stageToPillVariant('pre_seed')).toBe('pre_seed')
    expect(stageToPillVariant('Pre-seed')).toBe('pre_seed')
    expect(stageToPillVariant('Series A')).toBe('series_a')
    expect(stageToPillVariant('investor')).toBe('investor')
    expect(stageToPillVariant('Angel')).toBe('investor')
  })

  it('returns undefined for idea and unknown stages', () => {
    expect(stageToPillVariant('Idea')).toBeUndefined()
    expect(stageToPillVariant('')).toBeUndefined()
    expect(stageToPillVariant(null)).toBeUndefined()
    expect(stageToPillVariant('mystery')).toBeUndefined()
  })
})

describe('STARTUP_STAGE_LABELS', () => {
  it('uses sentence-case Trusted Standard labels', () => {
    expect(STARTUP_STAGE_LABELS.pre_seed).toBe('Pre-seed')
    expect(STARTUP_STAGE_LABELS.series_a).toBe('Series A')
  })
})

describe('isStartupStage', () => {
  it('narrows known stage keys', () => {
    expect(isStartupStage('seed')).toBe(true)
    expect(isStartupStage('Seed')).toBe(false)
  })
})
