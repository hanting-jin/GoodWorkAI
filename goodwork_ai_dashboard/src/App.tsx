import './App.css'
import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import type { RawData } from './types'
import { SalesDashboard, LoadingSpinner, ErrorMessage } from './components'

function App() {
  const [rawData, setRawData] = useState<RawData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch CSV file
        const response = await fetch(
          '/dashboardData/dummy_trend_table_take_home.csv'
        )
        if (!response.ok) {
          throw new Error('Failed to fetch data file')
        }

        const csvText = await response.text()

        // Parse CSV data
        const parseResult = await new Promise<Papa.ParseResult<any>>(
          (resolve, reject) => {
            Papa.parse(csvText, {
              header: true,
              skipEmptyLines: true,
              complete: resolve,
              error: reject,
            })
          }
        )

        // Process parsed data - using any for CSV parsing flexibility
        const parsed: RawData[] = parseResult.data.map((row: any) => ({
          article_id: row.article_id,
          banner: row.banner,
          pack_size: row.pack_size,
          fiscal_week: Number(row.fiscal_week),
          start_date: row.start_date,
          end_date: row.end_date,
          metrics: row.metrics,
          comparison: row.comparison,
          // Keep other fields as string, convert later in processing
          value: row.value,
        }))

        // Filter out invalid rows and set data
        const validData = parsed.filter(row => !isNaN(row.fiscal_week))
        setRawData(validData)
      } catch (error: any) {
        console.error('Data loading failed:', error)
        setError(
          error instanceof Error ? error.message : 'Unknown error occurred'
        )
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [])

  // Handle loading state
  if (loading) {
    return <LoadingSpinner />
  }

  // Handle error state
  if (error) {
    return <ErrorMessage message={error} />
  }

  // Handle no data state
  if (rawData.length === 0) {
    return (
      <ErrorMessage message="No data file found. Please check if the data is loaded correctly." />
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <h1 className="text-3xl font-bold text-gray-900">GoodWork.AI</h1>
          <p className="mt-2 text-sm text-gray-600">Weekly Sales Dashboard</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <SalesDashboard rawData={rawData} />
      </main>
    </div>
  )
}

export default App
