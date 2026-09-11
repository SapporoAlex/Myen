import { DUMMY_ENTRIES } from '../../data/dummyEntries'
import type { Entry, EntryDraft } from '../../types'
import type { EntriesRepository } from './types'

/**
 * Serves the generated sample data for previewing the dashboard. Edits are
 * kept in memory only (reset on reload) - this never touches localStorage
 * or a real backend. See lib/storage/index.ts for how it's selected.
 */
export class DummyRepository implements EntriesRepository {
  readonly backend = 'dummy' as const

  private entries: Entry[] = DUMMY_ENTRIES.map((e) => ({ ...e }))

  async list(): Promise<Entry[]> {
    return this.entries.map((e) => ({ ...e }))
  }

  async create(draft: EntryDraft): Promise<Entry> {
    const entry: Entry = { ...draft, id: crypto.randomUUID() }
    this.entries = [...this.entries, entry]
    return entry
  }

  async update(id: string, draft: EntryDraft): Promise<Entry> {
    const updated: Entry = { ...draft, id }
    this.entries = this.entries.map((e) => (e.id === id ? updated : e))
    return updated
  }

  async remove(id: string): Promise<void> {
    this.entries = this.entries.filter((e) => e.id !== id)
  }
}
