export type Category = 'main' | 'web_freelance' | 'misc' | 'translation'

export interface CategoryMeta {
  id: Category
  label: string
  colorVar: string
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'main', label: 'Main', colorVar: '--cat-main' },
  { id: 'web_freelance', label: 'Web Freelance', colorVar: '--cat-freelance' },
  { id: 'misc', label: 'Misc', colorVar: '--cat-misc' },
  { id: 'translation', label: 'Translation', colorVar: '--cat-translation' },
]

export function categoryLabel(id: Category): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}

export interface Entry {
  id: string
  /** ISO date string, yyyy-MM-dd */
  date: string
  /** Amount in yen (whole number, no decimals) */
  amount: number
  category: Category
}

export type EntryDraft = Omit<Entry, 'id'>

export type RangePreset = '3m' | '6m' | '1y' | '2y' | 'all'

export const RANGE_PRESETS: { id: RangePreset; label: string }[] = [
  { id: '3m', label: '3 months' },
  { id: '6m', label: '6 months' },
  { id: '1y', label: '1 year' },
  { id: '2y', label: '2 years' },
  { id: 'all', label: 'All time' },
]
