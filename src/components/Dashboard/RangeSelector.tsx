import { RANGE_PRESETS, type RangePreset } from '../../types'

interface Props {
  value: RangePreset
  onChange: (preset: RangePreset) => void
}

export function RangeSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {RANGE_PRESETS.map((preset) => {
        const active = preset.id === value
        return (
          <button
            key={preset.id}
            onClick={() => onChange(preset.id)}
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: active ? 'var(--cat-main)' : 'transparent',
              color: active ? '#ffffff' : 'var(--text-secondary)',
              border: `1px solid ${active ? 'var(--cat-main)' : 'var(--border)'}`,
            }}
          >
            {preset.label}
          </button>
        )
      })}
    </div>
  )
}
