// Data cleaning and conversion function
export function parseValue(val: string | number | null): number | null {
  if (val === null || val === undefined) return null
  if (typeof val === 'number') return val
  if (val === 'NA' || val === '') return null
  const num = Number(val)
  return isNaN(num) ? null : num
}
