import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import type { RawDataRow } from '../types'

interface UseDataLoaderResult {
  data: RawDataRow[]
  loading: boolean
  error: string | null
}

export function useDataLoader(): UseDataLoaderResult {
  const [data, setData] = useState<RawDataRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          '/dashboardData/dummy_trend_table_take_home.csv'
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const csvText = await response.text()

        Papa.parse<RawDataRow>(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => header.trim(),
          transform: (value: string, field: string) => {
            // 转换数字字段
            if (field === 'fiscal_week') {
              return parseInt(value, 10)
            }
            // 保持其他字段为字符串，稍后在处理时转换
            return value.trim()
          },
          complete: results => {
            if (results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors)
            }

            // 过滤掉无效行
            const validData = results.data.filter((row): row is RawDataRow => {
              return (
                row &&
                typeof row === 'object' &&
                'fiscal_week' in row &&
                'metrics' in row &&
                'comparison' in row &&
                'value' in row
              )
            })

            setData(validData)
            setLoading(false)
          },
          error: (error: Error) => {
            console.error('CSV parsing error:', error)
            setError(`数据解析失败: ${error.message}`)
            setLoading(false)
          },
        })
      } catch (err) {
        console.error('数据加载失败:', err)
        setError(err instanceof Error ? err.message : '未知错误')
        setLoading(false)
      }
    }

    void loadData()
  }, [])

  return { data, loading, error }
}
