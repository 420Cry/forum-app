import { startupStages } from '~/types/profile'

export type StartupStage = (typeof startupStages)[number]

/** Display labels for funding stages — sentence case (Trusted Standard Pill). */
export const STARTUP_STAGE_LABELS: Record<StartupStage, string> = {
  pre_seed: 'Pre-seed',
  seed: 'Seed',
  series_a: 'Series A',
  growth: 'Growth',
  scale: 'Scale',
  exit: 'Exit',
}

export type PillVariant
  = | StartupStage
    | 'investor'
    | 'opportunity'

const STAGE_ALIASES: Record<string, PillVariant> = {
  'pre_seed': 'pre_seed',
  'pre-seed': 'pre_seed',
  'preseed': 'pre_seed',
  'seed': 'seed',
  'series_a': 'series_a',
  'series a': 'series_a',
  'seriesa': 'series_a',
  'growth': 'growth',
  'scale': 'scale',
  'exit': 'exit',
  'investor': 'investor',
  'angel': 'investor',
  'opportunity': 'opportunity',
}

/**
 * Map an API stage / role string to a BasePill variant.
 * Returns `undefined` for Idea / unknown → base (muted) pill styling.
 */
export function stageToPillVariant(
  stage: string | null | undefined,
): PillVariant | undefined {
  if (!stage) return undefined
  const key = stage.trim().toLowerCase().replace(/\s+/g, ' ')
  if (key === 'idea') return undefined
  return STAGE_ALIASES[key] ?? STAGE_ALIASES[key.replace(/[-\s]/g, '_')]
}

export function isStartupStage(value: string): value is StartupStage {
  return (startupStages as readonly string[]).includes(value)
}
