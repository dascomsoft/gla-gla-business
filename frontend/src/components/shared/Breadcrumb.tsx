import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-1 text-sm ${className}`}>
      <Link href="/" className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <div key={index} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                {item.label}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}