import Plot from 'react-plotly.js'

interface ChartProps {
  data: any[]
  layout: any
  config?: any
  title?: string
  subtitle?: string
}

const defaultConfig = {
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  toImageButtonOptions: {
    format: 'png' as const,
    filename: 'chart',
    height: 800,
    width: 1400,
    scale: 1,
  },
}

export function Chart({
  data,
  layout,
  config = defaultConfig,
  title,
  subtitle,
}: ChartProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {(title || subtitle) && (
        <div className="mb-4 flex-shrink-0">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="w-full flex-1 min-h-0">
        <Plot
          data={data}
          layout={{ ...layout, autosize: true }}
          config={config}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </div>
    </div>
  )
}
