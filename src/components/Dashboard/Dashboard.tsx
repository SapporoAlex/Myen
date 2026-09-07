import { useEffect, useMemo, useState } from 'react'
import { RANGE_PRESETS, type Entry, type RangePreset } from '../../types'
import { bestMonthsByCategory, buildMonthlySeries, resolveMonthKeysForRange } from '../../utils/aggregate'
import { currentMonthKey } from '../../utils/dates'
import { generateMonthSummary } from '../../utils/insights'
import { BestMonths } from './BestMonths'
import { EarningsBarChart } from './EarningsBarChart'
import { MonthBreakdown } from './MonthBreakdown'
import { RangeSelector } from './RangeSelector'
import { Summary } from './Summary'

interface Props {
  entries: Entry[]
}

export function Dashboard({ entries }: Props) {
  const [range, setRange] = useState<RangePreset>('6m')
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey())

  const monthKeys = useMemo(() => resolveMonthKeysForRange(range, entries), [range, entries])
  const series = useMemo(() => buildMonthlySeries(entries, monthKeys), [entries, monthKeys])
  const bestMonths = useMemo(() => bestMonthsByCategory(series), [series])

  useEffect(() => {
    if (!monthKeys.includes(selectedMonth)) {
      setSelectedMonth(monthKeys[monthKeys.length - 1])
    }
    // Only re-check when the available months change, not on every selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKeys])

  const selectedBucket = series.find((b) => b.month === selectedMonth)
  const summaryLines = useMemo(() => generateMonthSummary(entries, selectedMonth), [entries, selectedMonth])

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">Earnings dashboard</h2>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
        <EarningsBarChart series={series} selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
          Best month by category ({RANGE_PRESETS.find((p) => p.id === range)?.label})
        </h3>
        <BestMonths bestMonths={bestMonths} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <MonthBreakdown bucket={selectedBucket} />
        <Summary lines={summaryLines} monthKey={selectedMonth} />
      </div>
    </section>
  )
}
