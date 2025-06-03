// 数据接口定义
export interface RawDataRow {
  article_id: string
  banner: string
  pack_size: string
  fiscal_week: number
  start_date: string
  end_date: string
  metrics: string
  comparison: string
  value: string | number
}

export interface ProcessedData {
  fiscal_week: number
  end_date: string
  sales_ty?: number | null
  sales_ly?: number | null
  asp_ty?: number | null
  asp_ly?: number | null
  gp_percent_ty?: number | null
  gp_percent_ly?: number | null
}

// 格式化类型
export type FormatType = 'currency' | 'percentage' | 'number'
