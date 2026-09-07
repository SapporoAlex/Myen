import { useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { CATEGORIES, categoryLabel, type Entry, type EntryDraft } from '../types'
import { dateToKey } from '../utils/dates'
import { formatYen } from '../utils/format'
import { EntryForm } from './EntryForm'

interface Props {
  entries: Entry[]
  createEntry: (draft: EntryDraft) => Promise<Entry>
  updateEntry: (id: string, draft: EntryDraft) => Promise<Entry>
  removeEntry: (id: string) => Promise<void>
}

/** 'closed' | 'create' | an entry id being edited */
type FormMode = 'closed' | 'create' | string

export function EntryPanel({ entries, createEntry, updateEntry, removeEntry }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [formMode, setFormMode] = useState<FormMode>('closed')

  const selectedKey = dateToKey(selectedDate)

  const dayEntries = useMemo(
    () => entries.filter((e) => e.date === selectedKey),
    [entries, selectedKey],
  )

  const datesWithEntries = useMemo(() => {
    const keys = new Set(entries.map((e) => e.date))
    return Array.from(keys, (key) => new Date(`${key}T00:00:00`))
  }, [entries])

  async function handleSave(draft: EntryDraft) {
    if (formMode === 'create') await createEntry(draft)
    else if (formMode !== 'closed') await updateEntry(formMode, draft)
    setFormMode('closed')
  }

  const editingEntry = formMode !== 'closed' && formMode !== 'create'
    ? (dayEntries.find((e) => e.id === formMode) ?? null)
    : null

  return (
    <section
      className="calendar-wrap rounded-2xl border p-4"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}
    >
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(d) => {
          if (d) {
            setSelectedDate(d)
            setFormMode('closed')
          }
        }}
        modifiers={{ hasEntry: datesWithEntries }}
        modifiersClassNames={{ hasEntry: 'has-entry' }}
      />

      <div className="mt-2 border-t pt-3" style={{ borderColor: 'var(--gridline)' }}>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </h2>

        <ul className="mt-2 space-y-2">
          {dayEntries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: `var(${CATEGORIES.find((c) => c.id === entry.category)!.colorVar})` }}
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {categoryLabel(entry.category)}
                </span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-sm font-medium tabular-nums">{formatYen(entry.amount)}</span>
                <button
                  className="text-xs underline"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setFormMode(entry.id)}
                >
                  Edit
                </button>
                <button
                  className="text-xs underline"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => removeEntry(entry.id)}
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
          {dayEntries.length === 0 && formMode === 'closed' && (
            <li className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No entries for this day.
            </li>
          )}
        </ul>

        {formMode === 'closed' && (
          <button
            className="mt-3 rounded-lg px-3 py-1.5 text-sm font-medium text-white"
            style={{ background: 'var(--cat-main)' }}
            onClick={() => setFormMode('create')}
          >
            + Add entry
          </button>
        )}

        {formMode !== 'closed' && (
          <EntryForm
            date={selectedKey}
            initial={editingEntry}
            onSave={handleSave}
            onCancel={() => setFormMode('closed')}
          />
        )}
      </div>
    </section>
  )
}
