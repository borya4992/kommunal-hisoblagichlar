export type MeterKind = 'electric' | 'gas' | 'water'

export interface MeterConfig {
  id: MeterKind
  unit: string
  defaultTariff: number
  accent: string
  accentSoft: string
  digits: number
  hasLimit?: boolean
}

export const METERS: MeterConfig[] = [
  {
    id: 'electric',
    unit: 'kWh',
    defaultTariff: 450,
    accent: '#e8a317',
    accentSoft: 'rgba(232, 163, 23, 0.18)',
    digits: 6,
    hasLimit: true,
  },
  {
    id: 'gas',
    unit: 'm³',
    defaultTariff: 650,
    accent: '#2d8a6e',
    accentSoft: 'rgba(45, 138, 110, 0.18)',
    digits: 6,
  },
  {
    id: 'water',
    unit: 'm³',
    defaultTariff: 1800,
    accent: '#2a6f9e',
    accentSoft: 'rgba(42, 111, 158, 0.18)',
    digits: 6,
  },
]

export function calcMeterTotal(
  added: number,
  tariff: number,
  opts?: { limitEnabled?: boolean; limitAmount?: number; limitTariff?: number },
): { total: number; within: number; over: number } {
  const usage = Math.max(0, added)
  if (!opts?.limitEnabled) {
    return { total: usage * tariff, within: usage, over: 0 }
  }
  const limitAmount = Math.max(0, opts.limitAmount ?? 0)
  const limitTariff = Math.max(0, opts.limitTariff ?? 0)
  const within = Math.min(usage, limitAmount)
  const over = Math.max(0, usage - limitAmount)
  return {
    total: within * tariff + over * limitTariff,
    within,
    over,
  }
}
