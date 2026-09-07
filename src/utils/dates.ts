import { addMonths, format, parseISO, subMonths } from 'date-fns'
import type { RangePreset } from '../types'

/** yyyy-MM-dd -> yyyy-MM */
export function toMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7)
}

export function monthKeyLabel(monthKey: string): string {
  return format(parseISO(`${monthKey}-01`), 'MMM yyyy')
}

export function currentMonthKey(): string {
  return format(new Date(), 'yyyy-MM')
}

export function dateToKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

const RANGE_MONTH_COUNTS: Record<Exclude<RangePreset, 'all'>, number> = {
  '3m': 2,
  '6m': 5,
  '1y': 11,
  '2y': 23,
}

/** Inclusive start-of-range month key for a preset, ending at referenceMonthKey. */
export function rangeStartMonthKey(preset: RangePreset, referenceMonthKey: string): string | null {
  if (preset === 'all') return null
  const monthsBack = RANGE_MONTH_COUNTS[preset]
  return format(subMonths(parseISO(`${referenceMonthKey}-01`), monthsBack), 'yyyy-MM')
}

/** Every month key from start to end, inclusive. */
export function monthKeysBetween(startKey: string, endKey: string): string[] {
  const start = parseISO(`${startKey}-01`)
  const end = parseISO(`${endKey}-01`)
  const keys: string[] = []
  for (let cur = start; cur <= end; cur = addMonths(cur, 1)) {
    keys.push(format(cur, 'yyyy-MM'))
  }
  return keys
}
