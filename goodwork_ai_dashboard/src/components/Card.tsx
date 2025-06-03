import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const PADDING_CLASSES = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddingClass = PADDING_CLASSES[padding]

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${paddingClass} ${className}`}
    >
      {children}
    </div>
  )
}
