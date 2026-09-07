import type { Entry, EntryDraft } from '../../types'
import type { EntriesRepository } from './types'

const STORAGE_KEY = 'earnings-tracker/entries'

function readAll(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Entry[]) : []
  } catch {
    return []
  }
}

function writeAll(entries: Entry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export class LocalStorageRepository implements EntriesRepository {
  readonly backend = 'local' as const

  async list(): Promise<Entry[]> {
    return readAll()
  }

  async create(draft: EntryDraft): Promise<Entry> {
    const entry: Entry = { ...draft, id: crypto.randomUUID() }
    const entries = readAll()
    entries.push(entry)
    writeAll(entries)
    return entry
  }

  async update(id: string, draft: EntryDraft): Promise<Entry> {
    const entries = readAll()
    const index = entries.findIndex((e) => e.id === id)
    if (index === -1) throw new Error(`Entry ${id} not found`)
    const updated: Entry = { ...draft, id }
    entries[index] = updated
    writeAll(entries)
    return updated
  }

  async remove(id: string): Promise<void> {
    writeAll(readAll().filter((e) => e.id !== id))
  }
}
