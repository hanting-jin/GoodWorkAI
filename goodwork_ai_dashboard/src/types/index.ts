// Data interface definitions
export interface RawData {
  article_id: string
  banner: string
  pack_size: string
  fiscal_week: number
  start_date: string
  end_date: string
  metrics: string
  comparison: string
  value: number | null
}

export interface ProcessedData {
  fiscal_week: number
  end_date: string
  sales_ty: number | null
  sales_ly: number | null
  asp_ty: number | null
  asp_ly: number | null
  gp_percent_ty: number | null
  gp_percent_ly: number | null
}

// Format type
export type FormatType = 'currency' | 'percentage' | 'number'

// Filter type
export type FilterType = 'ALL' | 'CURRENT' | 'PREVIOUS' | 'CUSTOM'

// Metric type
export type MetricType = 'sales' | 'asp' | 'gp_percent'

// Comparison type
export type ComparisonType = 'focus' | 'comparison'
