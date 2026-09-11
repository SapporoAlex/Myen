import { CATEGORIES } from '../../types'
import type { PeriodBucket } from '../../utils/aggregate'
import { formatYen } from '../../utils/format'

interface Props {
  bucket: PeriodBucket | undefined
  label: string
}

export function PeriodBreakdown({ bucket, label }: Props) {
  if (!bucket) return null

  return (
    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
        {label} breakdown
      </h3>
      <table className="mt-2 w-full text-sm">
        <tbody>
          {CATEGORIES.map((c) => (
            <tr key={c.id} className="border-t" style={{ borderColor: 'var(--gridline)' }}>
              <td className="py-1.5">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: `var(${c.colorVar})` }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{c.label}</span>
                </span>
              </td>
              <td className="py-1.5 text-right tabular-nums">{formatYen(bucket[c.id])}</td>
            </tr>
          ))}
          <tr className="border-t font-semibold" style={{ borderColor: 'var(--baseline)' }}>
            <td className="py-1.5">Total</td>
            <td className="py-1.5 text-right tabular-nums">{formatYen(bucket.total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
