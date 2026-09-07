import { Dashboard } from './components/Dashboard/Dashboard'
import { EntryPanel } from './components/EntryPanel'
import { useEntries } from './hooks/useEntries'

function App() {
  const { entries, loading, error, createEntry, updateEntry, removeEntry, backend } = useEntries()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Earnings Tracker</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Amounts in yen, by category.
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
          style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          Storage: {backend === 'supabase' ? 'Supabase' : 'Browser (local)'}
        </span>
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

export default App
