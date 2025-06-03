import type { RawData, ProcessedData } from '../types'
import { METRICS, COMPARISON_TYPES } from '../enums'
import { parseValue } from './parseValue'

// Process raw data: group by fiscal_week and merge different metrics with proper aggregation
export function processData(
  rawData: RawData[],
  bannerFilter: string,
  packSizeFilter: string
): ProcessedData[] {
  // Filter data
  const filteredData = rawData.filter(row => {
    const bannerMatch = bannerFilter === 'all' || row.banner === bannerFilter
    const packSizeMatch =
      packSizeFilter === 'all' || row.pack_size === packSizeFilter
    return bannerMatch && packSizeMatch
  })

  // Create complete fiscal week range (1-53) to handle missing weeks gracefully
  // This ensures charts always have consistent x-axis alignment
  const allWeeks = Array.from({ length: 53 }, (_, i) => i + 1)

  // Group by fiscal_week and aggregate values
  const groupedData = new Map<
    number,
    {
      fiscal_week: number
      end_date: string
      sales_ty: number[]
      sales_ly: number[]
      asp_ty: number[]
      asp_ly: number[]
      gp_percent_ty: number[]
      gp_percent_ly: number[]
    }
  >()

  // Initialize all weeks with empty data structures
  allWeeks.forEach(week => {
    // Find an end_date for this week from any available data
    const weekData = rawData.find(row => row.fiscal_week === week)
    const endDate = weekData?.end_date || `Week ${week}` // Fallback if no data exists

    groupedData.set(week, {
      fiscal_week: week,
      end_date: endDate,
      sales_ty: [],
      sales_ly: [],
      asp_ty: [],
      asp_ly: [],
      gp_percent_ty: [],
      gp_percent_ly: [],
    })
  })

  // Populate with actual filtered data
  filteredData.forEach(row => {
    const week = row.fiscal_week
    const processedRow = groupedData.get(week)!
    const value = parseValue(row.value)

    // Add values to arrays for aggregation (including zeros, but not nulls)
    if (value !== null) {
      // Set data by metric type and comparison type
      if (row.metrics === METRICS.SALES) {
        if (row.comparison === COMPARISON_TYPES.FOCUS) {
          processedRow.sales_ty.push(value)
        } else if (row.comparison === COMPARISON_TYPES.COMPARISON) {
          processedRow.sales_ly.push(value)
        }
      } else if (row.metrics === METRICS.ASP) {
        if (row.comparison === COMPARISON_TYPES.FOCUS) {
          processedRow.asp_ty.push(value)
        } else if (row.comparison === COMPARISON_TYPES.COMPARISON) {
          processedRow.asp_ly.push(value)
        }
      } else if (row.metrics === METRICS.GP_PERCENT) {
        if (row.comparison === COMPARISON_TYPES.FOCUS) {
          processedRow.gp_percent_ty.push(value)
        } else if (row.comparison === COMPARISON_TYPES.COMPARISON) {
          processedRow.gp_percent_ly.push(value)
        }
      }
    }
  })

  // Convert to final format with aggregated values
  const result: ProcessedData[] = Array.from(groupedData.values()).map(row => ({
    fiscal_week: row.fiscal_week,
    end_date: row.end_date,
    // Sum sales values (additive metric) - return null for weeks with no data
    sales_ty:
      row.sales_ty.length > 0
        ? row.sales_ty.reduce((sum, val) => sum + val, 0)
        : null,
    sales_ly:
      row.sales_ly.length > 0
        ? row.sales_ly.reduce((sum, val) => sum + val, 0)
        : null,
    // Average ASP values (intensive metric)
    asp_ty:
      row.asp_ty.length > 0
        ? row.asp_ty.reduce((sum, val) => sum + val, 0) / row.asp_ty.length
        : null,
    asp_ly:
      row.asp_ly.length > 0
        ? row.asp_ly.reduce((sum, val) => sum + val, 0) / row.asp_ly.length
        : null,
    // Average GP% values (intensive metric)
    gp_percent_ty:
      row.gp_percent_ty.length > 0
        ? row.gp_percent_ty.reduce((sum, val) => sum + val, 0) /
          row.gp_percent_ty.length
        : null,
    gp_percent_ly:
      row.gp_percent_ly.length > 0
        ? row.gp_percent_ly.reduce((sum, val) => sum + val, 0) /
          row.gp_percent_ly.length
        : null,
  }))

  // Sort by fiscal_week and return only weeks that have some data
  // This balances between complete alignment and avoiding too many empty weeks
  const filteredResult = result.filter(
    week =>
      week.sales_ty !== null ||
      week.sales_ly !== null ||
      week.asp_ty !== null ||
      week.asp_ly !== null ||
      week.gp_percent_ty !== null ||
      week.gp_percent_ly !== null
  )

  return filteredResult.sort((a, b) => a.fiscal_week - b.fiscal_week)
}
