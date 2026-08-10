interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          animate-spin rounded-full border-blue-600 border-t-transparent
          ${sizes[size]}
          ${className}
        `}
      />
    </div>
  )
}