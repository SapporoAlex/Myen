import { supabase } from '../supabaseClient'
import { LocalStorageRepository } from './localStorageRepository'
import { SupabaseRepository } from './supabaseRepository'
import type { EntriesRepository } from './types'

/**
 * Supabase env vars unset -> local browser storage (works with zero setup, e.g. on
 * GitHub Pages). Set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (see .env.example)
 * to switch to the cloud backend with no code changes.
 */
export const repository: EntriesRepository = supabase
  ? new SupabaseRepository(supabase)
  : new LocalStorageRepository()

export type { EntriesRepository } from './types'
