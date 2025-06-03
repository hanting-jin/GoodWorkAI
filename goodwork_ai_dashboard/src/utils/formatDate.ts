// Format date
export function formatDate(dateStr: string): string {
  // Assume format is DD/MM/YYYY
  const [day, month, year] = dateStr.split('/')
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: '2-digit',
  })
}
