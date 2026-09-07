import type { Entry, EntryDraft } from '../../types'

export interface EntriesRepository {
  /** Human-readable name of the active backend, shown in the UI. */
  readonly backend: 'local' | 'supabase'
  list(): Promise<Entry[]>
  create(draft: EntryDraft): Promise<Entry>
  update(id: string, draft: EntryDraft): Promise<Entry>
  remove(id: string): Promise<void>
}
