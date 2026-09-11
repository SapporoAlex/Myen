import { supabase } from '../supabaseClient'
import { DummyRepository } from './dummyRepository'
import { LocalStorageRepository } from './localStorageRepository'
import { SupabaseRepository } from './supabaseRepository'
import type { EntriesRepository } from './types'

/**
 * VITE_USE_DUMMY_DATA=true -> generated sample data (for previewing the dashboard).
 * Otherwise: Supabase env vars set -> Supabase; unset -> local browser storage
 * (works with zero setup, e.g. on GitHub Pages). See .env.example / the
 * Supabase + deploy guide for how to switch between these.
 */
const useDummyData = import.meta.env.VITE_USE_DUMMY_DATA === 'true'

export const repository: EntriesRepository = useDummyData
  ? new DummyRepository()
  : supabase
    ? new SupabaseRepository(supabase)
    : new LocalStorageRepository()

export type { EntriesRepository } from './types'
