// 数据清理和转换函数
export function parseValue(value: string | number): number | null {
  if (value === 'NA' || value === '' || value === null || value === undefined) {
    return null
  }
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return isNaN(numValue) ? null : numValue
}
