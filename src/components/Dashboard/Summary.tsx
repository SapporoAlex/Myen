import { monthKeyLabel } from '../../utils/dates'

interface Props {
  lines: string[]
  monthKey: string
}

export function Summary({ lines, monthKey }: Props) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
        Summary — {monthKeyLabel(monthKey)}
      </h3>
      <ul className="mt-2 space-y-1.5 text-sm">
        {lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  )
}
