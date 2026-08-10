import ProductCard from './ProductCard'
import { Product } from '@/types'
import { Package } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
  onPageChange?: (page: number) => void
}

export default function ProductGrid({ 
  products, 
  loading = false,
  pagination,
  onPageChange 
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Aucun produit trouvé</p>
        <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos filtres</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} featured={product.featured} />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Précédent
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {pagination.page} sur {pagination.pages}
          </span>
          <button
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}