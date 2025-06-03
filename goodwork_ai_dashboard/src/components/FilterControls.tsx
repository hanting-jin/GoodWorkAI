interface FilterControlsProps {
  bannerOptions: string[]
  packSizeOptions: string[]
  selectedBanner: string
  selectedPackSize: string
  onBannerChange: (value: string) => void
  onPackSizeChange: (value: string) => void
}

export function FilterControls({
  bannerOptions,
  packSizeOptions,
  selectedBanner,
  selectedPackSize,
  onBannerChange,
  onPackSizeChange,
}: FilterControlsProps) {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">筛选条件</h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="banner-select"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            渠道 (Banner)
          </label>
          <select
            id="banner-select"
            value={selectedBanner}
            onChange={e => onBannerChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {bannerOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="pack-size-select"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            包装规格 (Pack Size)
          </label>
          <select
            id="pack-size-select"
            value={selectedPackSize}
            onChange={e => onPackSizeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {packSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
