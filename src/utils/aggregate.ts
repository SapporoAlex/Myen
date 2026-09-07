import { CATEGORIES, type Category, type Entry, type RangePreset } from '../types'
import { currentMonthKey, monthKeysBetween, rangeStartMonthKey, toMonthKey } from './dates'

export type MonthlyBucket = { month: string; total: number } & Record<Category, number>

function emptyBucket(month: string): MonthlyBucket {
  const bucket = { month, total: 0 } as MonthlyBucket
  for (const c of CATEGORIES) bucket[c.id] = 0
  return bucket
}

export function buildMonthlySeries(entries: Entry[], monthKeys: string[]): MonthlyBucket[] {
  const buckets = new Map<string, MonthlyBucket>()
  for (const key of monthKeys) buckets.set(key, emptyBucket(key))
  for (const entry of entries) {
    const bucket = buckets.get(toMonthKey(entry.date))
    if (!bucket) continue
    bucket[entry.category] += entry.amount
    bucket.total += entry.amount
  }
  return monthKeys.map((key) => buckets.get(key)!)
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

/** Every month from the earliest entry (or now, if none) through now. */
export function fullHistoryMonthlySeries(entries: Entry[]): MonthlyBucket[] {
  return buildMonthlySeries(entries, resolveMonthKeysForRange('all', entries))
}

export type BestMonth = { month: string; amount: number } | null

export function bestMonthsByCategory(series: MonthlyBucket[]): Record<Category, BestMonth> {
  const result = {} as Record<Category, BestMonth>
  for (const c of CATEGORIES) {
    let best: BestMonth = null
    for (const bucket of series) {
      const amount = bucket[c.id]
      if (amount > 0 && (!best || amount > best.amount)) best = { month: bucket.month, amount }
    }
    result[c.id] = best
  }
  return result
}
