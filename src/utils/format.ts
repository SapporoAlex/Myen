const yenFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
})

export function formatYen(amount: number): string {
  return yenFormatter.format(amount)
}
