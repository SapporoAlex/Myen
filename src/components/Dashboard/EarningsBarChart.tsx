import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CATEGORIES, type Category } from '../../types'
import type { PeriodBucket } from '../../utils/aggregate'
import { formatYen } from '../../utils/format'

interface Props {
  series: PeriodBucket[]
  selectedPeriod: string
  onSelectPeriod: (period: string) => void
  formatLabel: (period: string) => string
}

export function EarningsBarChart({ series, selectedPeriod, onSelectPeriod, formatLabel }: Props) {
  return (
    <div className="h-80 w-full cursor-pointer">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={series}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          onClick={(state) => {
            const label = state?.activeLabel
            if (typeof label === 'string') onSelectPeriod(label)
          }}
        >
          <CartesianGrid vertical={false} stroke="var(--gridline)" />
          <XAxis
            dataKey="period"
            tickFormatter={(p: string) => formatLabel(p)}
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
            labelFormatter={(label) => formatLabel(String(label))}
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
                <Cell key={bucket.period} fillOpacity={bucket.period === selectedPeriod ? 1 : 0.55} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
