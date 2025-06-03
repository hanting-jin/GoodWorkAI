import { useState, useMemo } from 'react'
import './App.css'
import { useDataLoader } from './hooks/useDataLoader'
import { processData, getUniqueValues } from './utils'
import { FilterControls } from './components/FilterControls'
import { SalesDashboard } from './components/SalesDashboard'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorMessage } from './components/ErrorMessage'

function App() {
  const { data: rawData, loading, error } = useDataLoader()
  const [selectedBanner, setSelectedBanner] = useState('ALL')
  const [selectedPackSize, setSelectedPackSize] = useState('ALL')

  // 计算过滤器选项
  const bannerOptions = useMemo(() => {
    if (rawData.length === 0) return ['ALL']
    return getUniqueValues(rawData, 'banner')
  }, [rawData])

  const packSizeOptions = useMemo(() => {
    if (rawData.length === 0) return ['ALL']
    return getUniqueValues(rawData, 'pack_size')
  }, [rawData])

  // 处理和过滤数据
  const processedData = useMemo(() => {
    if (rawData.length === 0) return []
    return processData(rawData, selectedBanner, selectedPackSize)
  }, [rawData, selectedBanner, selectedPackSize])

  // 处理加载状态
  if (loading) {
    return <LoadingSpinner />
  }

  // 处理错误状态
  if (error) {
    return <ErrorMessage message={error} />
  }

  // 处理无数据状态
  if (rawData.length === 0) {
    return <ErrorMessage message="没有找到数据文件，请检查数据是否正确加载。" />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            GoodWork.ai 销售仪表盘
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Weekly Sales Dashboard - 销售表现与趋势分析
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 过滤器控件 */}
        <FilterControls
          bannerOptions={bannerOptions}
          packSizeOptions={packSizeOptions}
          selectedBanner={selectedBanner}
          selectedPackSize={selectedPackSize}
          onBannerChange={setSelectedBanner}
          onPackSizeChange={setSelectedPackSize}
        />

        {/* 数据统计信息 */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">总数据行数</h3>
            <p className="text-2xl font-bold text-gray-900">
              {rawData.length.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">筛选后周数</h3>
            <p className="text-2xl font-bold text-gray-900">
              {processedData.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">当前过滤器</h3>
            <p className="text-sm text-gray-900">
              {selectedBanner} / {selectedPackSize}
            </p>
          </div>
        </div>

        {/* 仪表盘图表 */}
        {processedData.length > 0 ? (
          <SalesDashboard data={processedData} />
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">
              当前过滤条件下没有数据，请尝试调整过滤器设置。
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
