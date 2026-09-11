import { useEffect, useMemo, useState } from 'react'
import { RANGE_PRESETS, type Entry, type RangePreset } from '../../types'
import {
  bestPeriodsByCategory,
  buildMonthlySeries,
  buildYearlySeries,
  resolveMonthKeysForRange,
  resolveYearKeysForRange,
} from '../../utils/aggregate'
import { currentMonthKey, currentYearKey, monthKeyLabel } from '../../utils/dates'
import { generateMonthSummary, generateYearSummary } from '../../utils/insights'
import { BestPeriods } from './BestPeriods'
import { EarningsBarChart } from './EarningsBarChart'
import { PeriodBreakdown } from './PeriodBreakdown'
import { RangeSelector } from './RangeSelector'
import { Summary } from './Summary'

interface Props {
  entries: Entry[]
}

type Granularity = 'month' | 'year'

const yearLabel = (year: string) => year

export function Dashboard({ entries }: Props) {
  const [granularity, setGranularity] = useState<Granularity>('month')
  const [range, setRange] = useState<RangePreset>('6m')
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey())
  const [selectedYear, setSelectedYear] = useState<string>(currentYearKey())

  const monthKeys = useMemo(() => resolveMonthKeysForRange(range, entries), [range, entries])
  const monthlySeries = useMemo(() => buildMonthlySeries(entries, monthKeys), [entries, monthKeys])

  const yearKeys = useMemo(() => resolveYearKeysForRange(entries), [entries])
  const yearlySeries = useMemo(() => buildYearlySeries(entries, yearKeys), [entries, yearKeys])

  const series = granularity === 'month' ? monthlySeries : yearlySeries
  const bestPeriods = useMemo(() => bestPeriodsByCategory(series), [series])
  const formatLabel = granularity === 'month' ? monthKeyLabel : yearLabel
  const selectedPeriod = granularity === 'month' ? selectedMonth : selectedYear
  const setSelectedPeriod = granularity === 'month' ? setSelectedMonth : setSelectedYear

  useEffect(() => {
    if (!monthKeys.includes(selectedMonth)) setSelectedMonth(monthKeys[monthKeys.length - 1])
    // Only re-check when the available months change, not on every selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKeys])

  useEffect(() => {
    if (!yearKeys.includes(selectedYear)) setSelectedYear(yearKeys[yearKeys.length - 1])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearKeys])

  const selectedBucket = series.find((b) => b.period === selectedPeriod)
  const summaryLines = useMemo(
    () =>
      granularity === 'month'
        ? generateMonthSummary(entries, selectedMonth)
        : generateYearSummary(entries, selectedYear),
    [entries, granularity, selectedMonth, selectedYear],
  )

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">Earnings dashboard</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full border p-0.5" style={{ borderColor: 'var(--border)' }}>
            {(['month', 'year'] as const).map((g) => {
              const active = g === granularity
              return (
                <button
                  key={g}
                  onClick={() => setGranularity(g)}
                  className="rounded-full px-3 py-1 text-xs font-medium capitalize"
                  style={{
                    background: active ? 'var(--cat-main)' : 'transparent',
                    color: active ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  {g}ly
                </button>
              )
            })}
          </div>
          {granularity === 'month' && <RangeSelector value={range} onChange={setRange} />}
        </div>
      </div>

      <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
        <EarningsBarChart
          series={series}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
          formatLabel={formatLabel}
        />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
          Best {granularity} by category
          {granularity === 'month' ? ` (${RANGE_PRESETS.find((p) => p.id === range)?.label})` : ''}
        </h3>
        <BestPeriods bestPeriods={bestPeriods} formatLabel={formatLabel} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PeriodBreakdown bucket={selectedBucket} label={formatLabel(selectedPeriod)} />
        <Summary lines={summaryLines} label={formatLabel(selectedPeriod)} />
      </div>
    </section>
  )
}
