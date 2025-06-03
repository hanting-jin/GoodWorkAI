// Format number for display
export function formatNumber(
  value: number | null,
  type: 'currency' | 'percentage' = 'currency'
): string {
  if (value === null || value === undefined) return 'N/A'
  if (type === 'currency') {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }
  if (type === 'percentage') {
    return `${(value * 100).toFixed(1)}%`
  }
  return value.toString()
}
