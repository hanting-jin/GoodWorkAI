// Get unique filter options with all option
export function getUniqueValues<T extends Record<string, any>>(
  data: T[],
  key: keyof T
): string[] {
  const set = new Set<string>()
  data.forEach(row => {
    if (row[key] !== undefined && row[key] !== null) {
      const value = String(row[key]).toLowerCase()
      // Skip any existing variations of "all"
      if (value !== 'all') {
        set.add(String(row[key]))
      }
    }
  })
  const uniqueValues = Array.from(set).sort()
  return ['all', ...uniqueValues]
}
