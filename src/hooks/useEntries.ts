import { useCallback, useEffect, useState } from 'react'
import { repository } from '../lib/storage'
import type { Entry, EntryDraft } from '../types'

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setEntries(await repository.list())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load entries')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createEntry = useCallback(async (draft: EntryDraft) => {
    const entry = await repository.create(draft)
    setEntries((prev) => [...prev, entry])
    return entry
  }, [])

  const updateEntry = useCallback(async (id: string, draft: EntryDraft) => {
    const entry = await repository.update(id, draft)
    setEntries((prev) => prev.map((e) => (e.id === id ? entry : e)))
    return entry
  }, [])

  const removeEntry = useCallback(async (id: string) => {
    await repository.remove(id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    removeEntry,
    backend: repository.backend,
  }
}
