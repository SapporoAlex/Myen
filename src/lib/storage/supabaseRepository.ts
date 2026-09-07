import type { SupabaseClient } from '@supabase/supabase-js'
import type { Entry, EntryDraft } from '../../types'
import type { EntriesRepository } from './types'

const TABLE = 'entries'

interface Row {
  id: string
  date: string
  amount: number
  category: Entry['category']
}

function rowToEntry(row: Row): Entry {
  return { id: row.id, date: row.date, amount: row.amount, category: row.category }
}

export class SupabaseRepository implements EntriesRepository {
  readonly backend = 'supabase' as const
  private client: SupabaseClient

  constructor(client: SupabaseClient) {
    this.client = client
  }

  async list(): Promise<Entry[]> {
    const { data, error } = await this.client
      .from(TABLE)
      .select('id, date, amount, category')
      .order('date', { ascending: true })
    if (error) throw error
    return (data as Row[]).map(rowToEntry)
  }

  async create(draft: EntryDraft): Promise<Entry> {
    const { data, error } = await this.client
      .from(TABLE)
      .insert(draft)
      .select('id, date, amount, category')
      .single()
    if (error) throw error
    return rowToEntry(data as Row)
  }

  async update(id: string, draft: EntryDraft): Promise<Entry> {
    const { data, error } = await this.client
      .from(TABLE)
      .update(draft)
      .eq('id', id)
      .select('id, date, amount, category')
      .single()
    if (error) throw error
    return rowToEntry(data as Row)
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.client.from(TABLE).delete().eq('id', id)
    if (error) throw error
  }
}
