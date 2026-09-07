import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CATEGORIES, type Category } from '../../types'
import type { MonthlyBucket } from '../../utils/aggregate'
import { monthKeyLabel } from '../../utils/dates'
import { formatYen } from '../../utils/format'

interface Props {
  series: MonthlyBucket[]
  selectedMonth: string
  onSelectMonth: (month: string) => void
}

export function EarningsBarChart({ series, selectedMonth, onSelectMonth }: Props) {
  return (
    <div className="h-80 w-full cursor-pointer">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={series}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          onClick={(state) => {
            const label = state?.activeLabel
            if (typeof label === 'string') onSelectMonth(label)
          }}
        >
          <CartesianGrid vertical={false} stroke="var(--gridline)" />
          <XAxis
            dataKey="month"
            tickFormatter={(m: string) => monthKeyLabel(m)}
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--baseline)' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => formatYen(v)}
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip
            cursor={{ fill: 'var(--gridline)', opacity: 0.5 }}
            formatter={(value, name) => [
              formatYen(Number(value)),
              CATEGORIES.find((c) => c.id === name)?.label ?? String(name),
            ]}
            labelFormatter={(label) => monthKeyLabel(String(label))}
            contentStyle={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend
            formatter={(value: string) => CATEGORIES.find((c) => c.id === value)?.label ?? value}
            wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }}
          />
          {CATEGORIES.map((c) => (
            <Bar
              key={c.id}
              dataKey={c.id as Category}
              name={c.id}
              stackId="earnings"
              fill={`var(${c.colorVar})`}
              stroke="var(--surface-1)"
              strokeWidth={2}
              maxBarSize={24}
            >
              {series.map((bucket) => (
                <Cell key={bucket.month} fillOpacity={bucket.month === selectedMonth ? 1 : 0.55} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
