import Plot from 'react-plotly.js'
import type { ProcessedData } from '../types'
import { formatNumber, formatDate } from '../utils'

interface SalesDashboardProps {
  data: ProcessedData[]
}

export function SalesDashboard({ data }: SalesDashboardProps) {
  // 准备上部图表数据（销售额柱状图 + ASP折线图）
  const topChartData = [
    // Sales TY (Focus) - 主要柱状图
    {
      x: data.map(d => formatDate(d.end_date)),
      y: data.map(d => d.sales_ty || 0),
      type: 'bar' as const,
      name: 'Sales TY (Focus)',
      marker: { color: 'rgba(55, 128, 191, 0.8)' },
      yaxis: 'y',
      hovertemplate:
        '<b>第%{text}周</b><br>' +
        '销售额 TY: %{customdata}<br>' +
        '截止日期: %{x}<br>' +
        '<extra></extra>',
      text: data.map(d => d.fiscal_week.toString()),
      customdata: data.map(d => formatNumber(d.sales_ty ?? null, 'currency')),
    },
    // Sales LY (Comparison) - 背景柱状图
    {
      x: data.map(d => formatDate(d.end_date)),
      y: data.map(d => d.sales_ly || 0),
      type: 'bar' as const,
      name: 'Sales LY (Comparison)',
      marker: { color: 'rgba(219, 64, 82, 0.6)' },
      yaxis: 'y',
      hovertemplate:
        '<b>第%{text}周</b><br>' +
        '销售额 LY: %{customdata}<br>' +
        '截止日期: %{x}<br>' +
        '<extra></extra>',
      text: data.map(d => d.fiscal_week.toString()),
      customdata: data.map(d => formatNumber(d.sales_ly ?? null, 'currency')),
    },
    // ASP TY (Focus) - 折线图
    {
      x: data.map(d => formatDate(d.end_date)),
      y: data.map(d => d.asp_ty ?? null),
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: 'ASP TY (Focus)',
      line: { color: 'rgb(128, 177, 211)', width: 3 },
      marker: { color: 'rgb(128, 177, 211)', size: 6 },
      yaxis: 'y2',
      hovertemplate:
        '<b>第%{text}周</b><br>' +
        'ASP TY: %{customdata}<br>' +
        '截止日期: %{x}<br>' +
        '<extra></extra>',
      text: data.map(d => d.fiscal_week.toString()),
      customdata: data.map(d => formatNumber(d.asp_ty ?? null, 'currency')),
    },
    // ASP LY (Comparison) - 折线图
    {
      x: data.map(d => formatDate(d.end_date)),
      y: data.map(d => d.asp_ly ?? null),
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: 'ASP LY (Comparison)',
      line: { color: 'rgb(255, 127, 80)', width: 3, dash: 'dash' },
      marker: { color: 'rgb(255, 127, 80)', size: 6 },
      yaxis: 'y2',
      hovertemplate:
        '<b>第%{text}周</b><br>' +
        'ASP LY: %{customdata}<br>' +
        '截止日期: %{x}<br>' +
        '<extra></extra>',
      text: data.map(d => d.fiscal_week.toString()),
      customdata: data.map(d => formatNumber(d.asp_ly ?? null, 'currency')),
    },
  ]

  // 准备下部图表数据（GP%折线图）
  const bottomChartData = [
    // GP% TY (Focus)
    {
      x: data.map(d => formatDate(d.end_date)),
      y: data.map(d => d.gp_percent_ty ?? null),
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: 'GP% TY (Focus)',
      line: { color: 'rgb(50, 171, 96)', width: 3 },
      marker: { color: 'rgb(50, 171, 96)', size: 6 },
      hovertemplate:
        '<b>第%{text}周</b><br>' +
        '毛利率 TY: %{customdata}<br>' +
        '截止日期: %{x}<br>' +
        '<extra></extra>',
      text: data.map(d => d.fiscal_week.toString()),
      customdata: data.map(d =>
        formatNumber(d.gp_percent_ty ?? null, 'percentage')
      ),
    },
    // GP% LY (Comparison)
    {
      x: data.map(d => formatDate(d.end_date)),
      y: data.map(d => d.gp_percent_ly ?? null),
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: 'GP% LY (Comparison)',
      line: { color: 'rgb(255, 99, 132)', width: 3, dash: 'dash' },
      marker: { color: 'rgb(255, 99, 132)', size: 6 },
      hovertemplate:
        '<b>第%{text}周</b><br>' +
        '毛利率 LY: %{customdata}<br>' +
        '截止日期: %{x}<br>' +
        '<extra></extra>',
      text: data.map(d => d.fiscal_week.toString()),
      customdata: data.map(d =>
        formatNumber(d.gp_percent_ly ?? null, 'percentage')
      ),
    },
  ]

  // 上部图表布局
  const topChartLayout = {
    title: {
      text: '销售表现分析 - 销售额与平均售价',
      font: { size: 18, color: '#2c3e50' },
    },
    xaxis: {
      title: { text: '截止日期' },
      tickangle: -45,
      showgrid: true,
      gridcolor: 'rgba(0,0,0,0.1)',
    },
    yaxis: {
      title: { text: '销售额 ($)' },
      side: 'left' as const,
      showgrid: true,
      gridcolor: 'rgba(0,0,0,0.1)',
      tickformat: '$,.0f',
    },
    yaxis2: {
      title: { text: '平均售价 ($)' },
      side: 'right' as const,
      overlaying: 'y' as const,
      tickformat: '$,.2f',
    },
    legend: {
      orientation: 'h' as const,
      y: -0.2,
      x: 0,
    },
    hovermode: 'x unified' as const,
    margin: { l: 80, r: 80, t: 80, b: 100 },
    height: 400,
  }

  // 下部图表布局
  const bottomChartLayout = {
    title: {
      text: '毛利率趋势分析',
      font: { size: 18, color: '#2c3e50' },
    },
    xaxis: {
      title: { text: '截止日期' },
      tickangle: -45,
      showgrid: true,
      gridcolor: 'rgba(0,0,0,0.1)',
    },
    yaxis: {
      title: { text: '毛利率 (%)' },
      showgrid: true,
      gridcolor: 'rgba(0,0,0,0.1)',
      tickformat: '.1%',
    },
    legend: {
      orientation: 'h' as const,
      y: -0.2,
      x: 0,
    },
    hovermode: 'x unified' as const,
    margin: { l: 80, r: 80, t: 80, b: 100 },
    height: 350,
  }

  // 图表配置
  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    toImageButtonOptions: {
      format: 'png' as const,
      filename: 'sales_dashboard',
      height: 600,
      width: 1200,
      scale: 1,
    },
  }

  return (
    <div className="space-y-8">
      {/* 上部图表：销售额 + ASP */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Plot
          data={topChartData as any}
          layout={topChartLayout as any}
          config={config as any}
          style={{ width: '100%' }}
        />
      </div>

      {/* 下部图表：GP% */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Plot
          data={bottomChartData as any}
          layout={bottomChartLayout as any}
          config={config as any}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}
