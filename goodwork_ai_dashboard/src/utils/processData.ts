import type { RawDataRow, ProcessedData } from '../types'
import { METRICS, COMPARISON_TYPES } from '../enums'
import { parseValue } from './parseValue'

// 处理原始数据，按 fiscal_week 分组并合并不同指标
export function processData(
  rawData: RawDataRow[],
  bannerFilter: string,
  packSizeFilter: string
): ProcessedData[] {
  // 过滤数据
  const filteredData = rawData.filter(row => {
    const bannerMatch = bannerFilter === 'ALL' || row.banner === bannerFilter
    const packSizeMatch =
      packSizeFilter === 'ALL' || row.pack_size === packSizeFilter
    return bannerMatch && packSizeMatch
  })

  // 按 fiscal_week 分组
  const groupedData = new Map<number, ProcessedData>()

  filteredData.forEach(row => {
    const week = row.fiscal_week

    if (!groupedData.has(week)) {
      groupedData.set(week, {
        fiscal_week: week,
        end_date: row.end_date,
      })
    }

    const processedRow = groupedData.get(week)!
    const value = parseValue(row.value)

    // 根据指标类型和比较类型设置数据
    if (row.metrics === METRICS.SALES) {
      if (row.comparison === COMPARISON_TYPES.FOCUS) {
        processedRow.sales_ty = value
      } else if (row.comparison === COMPARISON_TYPES.COMPARISON) {
        processedRow.sales_ly = value
      }
    } else if (row.metrics === METRICS.ASP) {
      if (row.comparison === COMPARISON_TYPES.FOCUS) {
        processedRow.asp_ty = value
      } else if (row.comparison === COMPARISON_TYPES.COMPARISON) {
        processedRow.asp_ly = value
      }
    } else if (row.metrics === METRICS.GP_PERCENT) {
      if (row.comparison === COMPARISON_TYPES.FOCUS) {
        processedRow.gp_percent_ty = value
      } else if (row.comparison === COMPARISON_TYPES.COMPARISON) {
        processedRow.gp_percent_ly = value
      }
    }
  })

  // 转换为数组并按 fiscal_week 排序
  return Array.from(groupedData.values()).sort(
    (a, b) => a.fiscal_week - b.fiscal_week
  )
}
