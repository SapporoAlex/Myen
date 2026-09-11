import { Dashboard } from './Dashboard/Dashboard'
import { EntryPanel } from './EntryPanel'
import { useEntries } from '../hooks/useEntries'

interface Props {
  userEmail?: string | null
  onSignOut?: () => void
}

export function AppShell({ userEmail, onSignOut }: Props) {
  const { entries, loading, error, createEntry, updateEntry, removeEntry, backend } = useEntries()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Myen</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Amounts in yen, by category.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            Storage: {backend === 'supabase' ? 'Supabase' : backend === 'dummy' ? 'Sample data' : 'Browser (local)'}
          </span>
          {onSignOut && (
            <button
              onClick={onSignOut}
              title={userEmail ?? undefined}
              className="rounded-full border px-3 py-1 text-xs font-medium"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              Sign out
            </button>
          )}
        </div>
      </header>

      {error && (
        <div
          className="mb-4 rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
        >
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <EntryPanel
          entries={entries}
          createEntry={createEntry}
          updateEntry={updateEntry}
          removeEntry={removeEntry}
        />
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
        ) : (
          <Dashboard entries={entries} />
        )}
      </div>
    </div>
  )
}
