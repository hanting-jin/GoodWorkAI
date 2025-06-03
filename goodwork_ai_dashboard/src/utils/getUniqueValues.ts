import type { RawDataRow } from '../types'

// 获取唯一的过滤器选项
export function getUniqueValues(
  data: RawDataRow[],
  field: keyof RawDataRow
): string[] {
  const values = new Set(data.map(row => row[field] as string))
  return ['ALL', ...Array.from(values).sort()]
}
