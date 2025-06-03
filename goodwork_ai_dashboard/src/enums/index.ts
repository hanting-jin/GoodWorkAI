// Data processing constants
export const METRICS = {
  SALES: 'sales',
  ASP: 'asp',
  GP_PERCENT: 'gp_percent',
} as const

export const COMPARISON_TYPES = {
  FOCUS: 'focus',
  COMPARISON: 'comparison',
} as const

// Export types
export type MetricsType = (typeof METRICS)[keyof typeof METRICS]
export type ComparisonType =
  (typeof COMPARISON_TYPES)[keyof typeof COMPARISON_TYPES]
