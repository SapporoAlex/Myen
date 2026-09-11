import { CATEGORIES, type Category, type Entry, type RangePreset } from '../types'
import {
  currentMonthKey,
  currentYearKey,
  monthKeysBetween,
  rangeStartMonthKey,
  toMonthKey,
  toYearKey,
  yearKeysBetween,
} from './dates'

/** One bucket of totals for a period - a month (`period` = "yyyy-MM") or a year (`period` = "yyyy"). */
export type PeriodBucket = { period: string; total: number } & Record<Category, number>

function emptyBucket(period: string): PeriodBucket {
  const bucket = { period, total: 0 } as PeriodBucket
  for (const c of CATEGORIES) bucket[c.id] = 0
  return bucket
}

export function buildPeriodSeries(
  entries: Entry[],
  periodKeys: string[],
  periodKeyFor: (date: string) => string,
): PeriodBucket[] {
  const buckets = new Map<string, PeriodBucket>()
  for (const key of periodKeys) buckets.set(key, emptyBucket(key))
  for (const entry of entries) {
    const bucket = buckets.get(periodKeyFor(entry.date))
    if (!bucket) continue
    bucket[entry.category] += entry.amount
    bucket.total += entry.amount
  }
  return periodKeys.map((key) => buckets.get(key)!)
}

/** Month keys spanned by a range preset, given the entries available (for 'all'). */
export function resolveMonthKeysForRange(preset: RangePreset, entries: Entry[]): string[] {
  const now = currentMonthKey()
  if (preset === 'all') {
    if (entries.length === 0) return [now]
    const earliest = entries.reduce(
      (min, e) => (toMonthKey(e.date) < min ? toMonthKey(e.date) : min),
      toMonthKey(entries[0].date),
    )
    return monthKeysBetween(earliest, now)
  }
  return monthKeysBetween(rangeStartMonthKey(preset, now)!, now)
}

/** Every calendar year from the earliest entry (or this year, if none) through this year. */
export function resolveYearKeysForRange(entries: Entry[]): string[] {
  const now = currentYearKey()
  if (entries.length === 0) return [now]
  const earliest = entries.reduce(
    (min, e) => (toYearKey(e.date) < min ? toYearKey(e.date) : min),
    toYearKey(entries[0].date),
  )
  return yearKeysBetween(earliest, now)
}

export function buildMonthlySeries(entries: Entry[], monthKeys: string[]): PeriodBucket[] {
  return buildPeriodSeries(entries, monthKeys, toMonthKey)
}

export function buildYearlySeries(entries: Entry[], yearKeys: string[]): PeriodBucket[] {
  return buildPeriodSeries(entries, yearKeys, toYearKey)
}

/** Every month from the earliest entry (or now, if none) through now. */
export function fullHistoryMonthlySeries(entries: Entry[]): PeriodBucket[] {
  return buildMonthlySeries(entries, resolveMonthKeysForRange('all', entries))
}

/** Every year from the earliest entry (or this year, if none) through this year. */
export function fullHistoryYearlySeries(entries: Entry[]): PeriodBucket[] {
  return buildYearlySeries(entries, resolveYearKeysForRange(entries))
}

export type BestPeriod = { period: string; amount: number } | null

export function bestPeriodsByCategory(series: PeriodBucket[]): Record<Category, BestPeriod> {
  const result = {} as Record<Category, BestPeriod>
  for (const c of CATEGORIES) {
    let best: BestPeriod = null
    for (const bucket of series) {
      const amount = bucket[c.id]
      if (amount > 0 && (!best || amount > best.amount)) best = { period: bucket.period, amount }
    }
    result[c.id] = best
  }
  return result
}
