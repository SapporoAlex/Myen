import { subMonths } from 'date-fns'
import type { Entry } from '../types'

/**
 * Sample amounts for the past 6 months, oldest first, ending with the
 * current month. Dates are computed relative to today (not hardcoded) so
 * the dashboard's default 6-month view is always fully populated whenever
 * this is viewed.
 */
const MONTHLY_AMOUNTS = [
  { main: 230000, webFreelance: 12000, misc: 2000, translation: 18000 },
  { main: 230000, webFreelance: 28000, misc: 4000, translation: 25000 },
  { main: 230000, webFreelance: 5000, misc: 500, translation: 12000 },
  { main: 230000, webFreelance: 20000, misc: 3000, translation: 30000 },
  { main: 230000, webFreelance: 0, misc: 1000, translation: 15000 },
  { main: 230000, webFreelance: 15000, misc: 4500, translation: 22000 },
] as const

function dateInMonth(monthsAgo: number, day: number): string {
  const ref = subMonths(new Date(), monthsAgo)
  const year = ref.getFullYear()
  const month = String(ref.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-${String(day).padStart(2, '0')}`
}

let idCounter = 0
function nextId(): string {
  idCounter += 1
  return `dummy-${idCounter}`
}

export const DUMMY_ENTRIES: Entry[] = MONTHLY_AMOUNTS.flatMap((amounts, i) => {
  const monthsAgo = MONTHLY_AMOUNTS.length - 1 - i
  const entries: Entry[] = [
    { id: nextId(), date: dateInMonth(monthsAgo, 5), amount: amounts.main, category: 'main' },
    { id: nextId(), date: dateInMonth(monthsAgo, 24), amount: amounts.translation, category: 'translation' },
  ]
  if (amounts.webFreelance > 0) {
    entries.push({
      id: nextId(),
      date: dateInMonth(monthsAgo, 12),
      amount: amounts.webFreelance,
      category: 'web_freelance',
    })
  }
  if (amounts.misc > 0) {
    entries.push({ id: nextId(), date: dateInMonth(monthsAgo, 18), amount: amounts.misc, category: 'misc' })
  }
  return entries
})
