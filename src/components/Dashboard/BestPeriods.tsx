import { CATEGORIES, type Category } from '../../types'
import type { BestPeriod } from '../../utils/aggregate'
import { formatYen } from '../../utils/format'

interface Props {
  bestPeriods: Record<Category, BestPeriod>
  formatLabel: (period: string) => string
}

export function BestPeriods({ bestPeriods, formatLabel }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CATEGORIES.map((c) => {
        const best = bestPeriods[c.id]
        return (
          <div
            key={c.id}
            className="rounded-xl border p-3"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: `var(${c.colorVar})` }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {c.label}
              </span>
            </div>
            {best ? (
              <>
                <div className="mt-1 text-lg font-semibold tabular-nums">{formatYen(best.amount)}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {formatLabel(best.period)}
                </div>
              </>
            ) : (
              <div className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                No data
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
