// 格式化日期
export function formatDate(dateString: string): string {
  try {
    const parts = dateString.split('/')
    if (parts.length === 3) {
      // 假设格式是 DD/MM/YYYY
      const [day, month, year] = parts
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
    return dateString
  } catch {
    return dateString
  }
}
