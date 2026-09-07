import { useState, type FormEvent } from 'react'
import { CATEGORIES, type Category, type Entry, type EntryDraft } from '../types'

interface Props {
  date: string
  initial: Entry | null
  onSave: (draft: EntryDraft) => Promise<void>
  onCancel: () => void
}

export function EntryForm({ date, initial, onSave, onCancel }: Props) {
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '')
  const [category, setCategory] = useState<Category>(initial?.category ?? CATEGORIES[0].id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = Number(amount)
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
      setError('Enter a whole number of yen greater than 0.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave({ date, amount: parsed, category })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 flex flex-col gap-2 rounded-lg border p-3"
      style={{ borderColor: 'var(--border)' }}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span style={{ color: 'var(--text-secondary)' }}>Amount (¥)</span>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-md border px-2 py-1"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
          autoFocus
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span style={{ color: 'var(--text-secondary)' }}>Category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="rounded-md border px-2 py-1"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p className="text-xs" style={{ color: 'var(--danger)' }}>
          {error}
        </p>
      )}
      <div className="mt-1 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
          style={{ background: 'var(--cat-main)' }}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
