import type { RawData } from '../types'
import { Chart } from './Chart'
import { useState, useMemo } from 'react'
import {
  processData,
  getUniqueValues,
  formatNumber,
  formatDate,
} from '../utils'

interface SalesDashboardProps {
  rawData: RawData[]
}

export function SalesDashboard({ rawData }: SalesDashboardProps) {
  // Calculate filter options
  const bannerOptions = useMemo(() => {
    return getUniqueValues(rawData, 'banner')
  }, [rawData])

  const packSizeOptions = useMemo(() => {
    return getUniqueValues(rawData, 'pack_size')
  }, [rawData])

  // Filter state - default to "all"
  const [selectedBanner, setSelectedBanner] = useState('all')
  const [selectedPackSize, setSelectedPackSize] = useState('all')

  // Process and filter data
  const processedData = useMemo(() => {
    if (rawData.length === 0) return []
    return processData(rawData, selectedBanner, selectedPackSize)
  }, [rawData, selectedBanner, selectedPackSize])

  // Sales and ASP chart data
  const salesChartData = useMemo(() => {
    // Filter out weeks with no sales data at all for better visualization
    const validData = processedData.filter(
      d =>
        d.sales_ty !== null ||
        d.sales_ly !== null ||
        d.asp_ty !== null ||
        d.asp_ly !== null
    )

    if (validData.length === 0) return []

    return [
      // Sales LY (Comparison) - background bars (behind)
      {
        x: validData.map(d => formatDate(d.end_date)),
        y: validData.map(d => d.sales_ly || 0),
        type: 'bar' as const,
        name: 'Sales LY',
        marker: {
          color: 'rgba(173, 216, 230, 0.7)',
          line: { color: 'rgba(173, 216, 230, 1)', width: 1 },
        },
        yaxis: 'y',
        hovertemplate:
          '<b>Week %{text}</b><br>' +
          'Sales LY: %{customdata}<br>' +
          'End Date: %{x}<br>' +
          '<extra></extra>',
        text: validData.map(d => d.fiscal_week.toString()),
        customdata: validData.map(d =>
          formatNumber(d.sales_ly ?? null, 'currency')
        ),
        showlegend: true,
      },
      // Sales TY (Focus) - foreground bars (in front)
      {
        x: validData.map(d => formatDate(d.end_date)),
        y: validData.map(d => d.sales_ty || 0),
        type: 'bar' as const,
        name: 'Sales TY',
        marker: {
          color: 'rgba(65, 131, 215, 0.8)',
          line: { color: 'rgba(65, 131, 215, 1)', width: 1 },
        },
        yaxis: 'y',
        hovertemplate:
          '<b>Week %{text}</b><br>' +
          'Sales TY: %{customdata}<br>' +
          'End Date: %{x}<br>' +
          '<extra></extra>',
        text: validData.map(d => d.fiscal_week.toString()),
        customdata: validData.map(d =>
          formatNumber(d.sales_ty ?? null, 'currency')
        ),
        showlegend: true,
      },
      // ASP TY (Focus) - purple line
      {
        x: validData.map(d => formatDate(d.end_date)),
        y: validData.map(d => d.asp_ty ?? null),
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'ASP TY',
        line: { color: 'rgb(147, 112, 219)', width: 2 },
        marker: { color: 'rgb(147, 112, 219)', size: 4 },
        yaxis: 'y2',
        hovertemplate:
          '<b>Week %{text}</b><br>' +
          'ASP TY: %{customdata}<br>' +
          'End Date: %{x}<br>' +
          '<extra></extra>',
        text: validData.map(d => d.fiscal_week.toString()),
        customdata: validData.map(d =>
          formatNumber(d.asp_ty ?? null, 'currency')
        ),
        showlegend: true,
      },
      // ASP LY (Comparison) - pink line
      {
        x: validData.map(d => formatDate(d.end_date)),
        y: validData.map(d => d.asp_ly ?? null),
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'ASP LY',
        line: { color: 'rgb(219, 112, 147)', width: 2 },
        marker: { color: 'rgb(219, 112, 147)', size: 4 },
        yaxis: 'y2',
        hovertemplate:
          '<b>Week %{text}</b><br>' +
          'ASP LY: %{customdata}<br>' +
          'End Date: %{x}<br>' +
          '<extra></extra>',
        text: validData.map(d => d.fiscal_week.toString()),
        customdata: validData.map(d =>
          formatNumber(d.asp_ly ?? null, 'currency')
        ),
        showlegend: true,
      },
    ]
  }, [processedData])

  // GP% chart data
  const gpChartData = useMemo(() => {
    // Filter out weeks with no GP data for better visualization
    const validData = processedData.filter(
      d => d.gp_percent_ty !== null || d.gp_percent_ly !== null
    )

    if (validData.length === 0) return []

    return [
      // GP% LY (Comparison) - blue line
      {
        x: validData.map(d => formatDate(d.end_date)),
        y: validData.map(d => d.gp_percent_ly ?? null),
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Margin LY',
        line: { color: 'rgb(70, 130, 180)', width: 2 },
        marker: { color: 'rgb(70, 130, 180)', size: 4 },
        hovertemplate:
          '<b>Week %{text}</b><br>' +
          'GP% LY: %{customdata}<br>' +
          'End Date: %{x}<br>' +
          '<extra></extra>',
        text: validData.map(d => d.fiscal_week.toString()),
        customdata: validData.map(d =>
          formatNumber(d.gp_percent_ly ?? null, 'percentage')
        ),
        showlegend: true,
      },
      // GP% TY (Focus) - teal line
      {
        x: validData.map(d => formatDate(d.end_date)),
        y: validData.map(d => d.gp_percent_ty ?? null),
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Margin TY',
        line: { color: 'rgb(32, 178, 170)', width: 2 },
        marker: { color: 'rgb(32, 178, 170)', size: 4 },
        hovertemplate:
          '<b>Week %{text}</b><br>' +
          'GP% TY: %{customdata}<br>' +
          'End Date: %{x}<br>' +
          '<extra></extra>',
        text: validData.map(d => d.fiscal_week.toString()),
        customdata: validData.map(d =>
          formatNumber(d.gp_percent_ty ?? null, 'percentage')
        ),
        showlegend: true,
      },
    ]
  }, [processedData])

  // Chart layout configuration
  const salesChartLayout = useMemo(
    () => ({
      xaxis: {
        title: { text: 'Week Ending', font: { size: 12 } },
        tickangle: -45,
        showgrid: true,
        gridcolor: 'rgba(0,0,0,0.1)',
        tickfont: { size: 10 },
      },
      yaxis: {
        title: { text: 'Sales ($)', font: { size: 12 } },
        side: 'left' as const,
        showgrid: true,
        gridcolor: 'rgba(0,0,0,0.1)',
        tickformat: '$,.0s',
        tickfont: { size: 10 },
      },
      yaxis2: {
        title: { text: 'ASP ($)', font: { size: 12 } },
        side: 'right' as const,
        overlaying: 'y' as const,
        tickformat: '$,.2f',
        tickfont: { size: 10 },
      },
      legend: {
        orientation: 'h' as const,
        x: 1,
        xanchor: 'right' as const,
        y: 1.02,
        font: { size: 10 },
      },
      hovermode: 'x unified' as const,
      margin: { l: 60, r: 60, t: 40, b: 80 },
      autosize: true,
      showlegend: true,
      barmode: 'overlay' as const,
    }),
    []
  )

  const gpChartLayout = useMemo(
    () => ({
      xaxis: {
        title: { text: 'Week Ending', font: { size: 12 } },
        tickangle: -45,
        showgrid: true,
        gridcolor: 'rgba(0,0,0,0.1)',
        tickfont: { size: 10 },
      },
      yaxis: {
        title: { text: 'GP%', font: { size: 12 } },
        showgrid: true,
        gridcolor: 'rgba(0,0,0,0.1)',
        tickformat: '.1%',
        tickfont: { size: 10 },
      },
      legend: {
        orientation: 'h' as const,
        x: 1,
        xanchor: 'right' as const,
        y: 1.02,
        font: { size: 10 },
      },
      hovermode: 'x unified' as const,
      margin: { l: 60, r: 60, t: 40, b: 80 },
      autosize: true,
      showlegend: true,
    }),
    []
  )

  const chartConfig = {
    responsive: true,
    displayModeBar: false,
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Filters */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Banner Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Banner</h3>
            <div className="space-y-2">
              {bannerOptions.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="banner"
                    value={option}
                    checked={selectedBanner === option}
                    onChange={e => setSelectedBanner(e.target.value)}
                    className="mr-2 text-purple-600"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pack Size Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Pack Size
            </h3>
            <div className="space-y-2">
              {packSizeOptions.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="packSize"
                    value={option}
                    checked={selectedPackSize === option}
                    onChange={e => setSelectedPackSize(e.target.value)}
                    className="mr-2 text-purple-600"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Charts Container */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {processedData.length > 0 ? (
            <>
              {/* Sales Performance Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="h-96">
                  <Chart
                    data={salesChartData}
                    layout={salesChartLayout}
                    config={chartConfig}
                  />
                </div>
              </div>

              {/* GP% Trend Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="h-80">
                  <Chart
                    data={gpChartData}
                    layout={gpChartLayout}
                    config={chartConfig}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Data Available
                </h3>
                <p className="text-gray-500">
                  No data matches the current filter criteria. Please try
                  adjusting the filter settings.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
