import { CATEGORIES, type Entry } from '../types'
import { fullHistoryMonthlySeries } from './aggregate'
import { formatYen } from './format'
import { monthKeyLabel } from './dates'

function pctChange(from: number, to: number): number {
  return Math.round(((to - from) / from) * 100)
}

/**
 * Plain-language highlights for a single month, e.g. "Translation: ¥80,000 —
 * the most you've earned in this category in the past 5 months." Computed
 * against the full entry history (independent of the dashboard's range filter)
 * so "all-time high" claims stay correct regardless of what's on screen.
 */
export function generateMonthSummary(entries: Entry[], selectedMonthKey: string): string[] {
  const series = fullHistoryMonthlySeries(entries)
  const idx = series.findIndex((b) => b.month === selectedMonthKey)
  if (idx === -1) return ['No data for this month.']

  const bucket = series[idx]
  const lines: string[] = []

  if (idx > 0) {
    const prevTotal = series[idx - 1].total
    if (prevTotal > 0) {
      const pct = pctChange(prevTotal, bucket.total)
      lines.push(
        `Total earnings: ${formatYen(bucket.total)}, ${pct >= 0 ? 'up' : 'down'} ${Math.abs(pct)}% from ${monthKeyLabel(series[idx - 1].month)}.`,
      )
    } else if (bucket.total > 0) {
      lines.push(`Total earnings: ${formatYen(bucket.total)} — you had no earnings the month before.`)
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

    let monthsBeaten = 0
    for (let j = idx - 1; j >= 0; j--) {
      if (series[j][c.id] <= amount) monthsBeaten++
      else break
    }

    if (monthsBeaten === idx) {
      lines.push(`${c.label}: ${formatYen(amount)} — an all-time high for this category.`)
    } else if (monthsBeaten > 0) {
      lines.push(
        `${c.label}: ${formatYen(amount)} — the most you've earned in this category in the past ${monthsBeaten} month${monthsBeaten === 1 ? '' : 's'}.`,
      )
    } else {
      const prevAmount = series[idx - 1][c.id]
      if (prevAmount > 0) {
        const pct = pctChange(prevAmount, amount)
        lines.push(`${c.label}: ${formatYen(amount)}, ${pct >= 0 ? 'up' : 'down'} ${Math.abs(pct)}% from last month.`)
      } else {
        lines.push(`${c.label}: ${formatYen(amount)}.`)
      }
    }
  }

  if (bucket.total === 0) lines.push('No earnings recorded for this month.')

  return lines
}
