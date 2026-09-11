import { CATEGORIES, type Entry } from '../types'
import { fullHistoryMonthlySeries, fullHistoryYearlySeries, type PeriodBucket } from './aggregate'
import { monthKeyLabel } from './dates'
import { formatYen } from './format'

function pctChange(from: number, to: number): number {
  return Math.round(((to - from) / from) * 100)
}

interface PeriodFormat {
  /** How to display a period key, e.g. monthKeyLabel, or identity for a bare year. */
  label: (period: string) => string
  /** Singular unit name used in prose, e.g. "month" or "year". */
  unit: string
}

/**
 * Plain-language highlights for one period (month or year) of a full-history
 * series, e.g. "Translation: ¥80,000 — the most you've earned in this
 * category in the past 5 months." `idx` is the selected period's position in
 * `series`; comparisons look backward from there so "all-time high" claims
 * are correct regardless of what's currently on screen elsewhere in the UI.
 */
function generatePeriodSummary(series: PeriodBucket[], idx: number, format: PeriodFormat): string[] {
  const bucket = series[idx]
  const lines: string[] = []

  if (idx > 0) {
    const prevTotal = series[idx - 1].total
    if (prevTotal > 0) {
      const pct = pctChange(prevTotal, bucket.total)
      lines.push(
        `Total earnings: ${formatYen(bucket.total)}, ${pct >= 0 ? 'up' : 'down'} ${Math.abs(pct)}% from ${format.label(series[idx - 1].period)}.`,
      )
    } else if (bucket.total > 0) {
      lines.push(`Total earnings: ${formatYen(bucket.total)} — you had no earnings the ${format.unit} before.`)
    }
  } else if (bucket.total > 0) {
    lines.push(`Total earnings: ${formatYen(bucket.total)}.`)
  }

  for (const c of CATEGORIES) {
    const amount = bucket[c.id]
    if (amount <= 0) continue

    if (idx === 0) {
      lines.push(`${c.label}: ${formatYen(amount)} — your first recorded earnings in this category.`)
      continue
    }

    let periodsBeaten = 0
    for (let j = idx - 1; j >= 0; j--) {
      if (series[j][c.id] <= amount) periodsBeaten++
      else break
    }

    if (periodsBeaten === idx) {
      lines.push(`${c.label}: ${formatYen(amount)} — an all-time high for this category.`)
    } else if (periodsBeaten > 0) {
      lines.push(
        `${c.label}: ${formatYen(amount)} — the most you've earned in this category in the past ${periodsBeaten} ${format.unit}${periodsBeaten === 1 ? '' : 's'}.`,
      )
    } else {
      const prevAmount = series[idx - 1][c.id]
      if (prevAmount > 0) {
        const pct = pctChange(prevAmount, amount)
        lines.push(
          `${c.label}: ${formatYen(amount)}, ${pct >= 0 ? 'up' : 'down'} ${Math.abs(pct)}% from the previous ${format.unit}.`,
        )
      } else {
        lines.push(`${c.label}: ${formatYen(amount)}.`)
      }
    }
  }

  if (bucket.total === 0) lines.push(`No earnings recorded for this ${format.unit}.`)

  return lines
}

export function generateMonthSummary(entries: Entry[], selectedMonthKey: string): string[] {
  const series = fullHistoryMonthlySeries(entries)
  const idx = series.findIndex((b) => b.period === selectedMonthKey)
  if (idx === -1) return ['No data for this month.']
  return generatePeriodSummary(series, idx, { label: monthKeyLabel, unit: 'month' })
}

export function generateYearSummary(entries: Entry[], selectedYear: string): string[] {
  const series = fullHistoryYearlySeries(entries)
  const idx = series.findIndex((b) => b.period === selectedYear)
  if (idx === -1) return ['No data for this year.']
  return generatePeriodSummary(series, idx, { label: (y) => y, unit: 'year' })
}
