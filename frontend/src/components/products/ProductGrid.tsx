import ProductCard from './ProductCard'
import { Product } from '@/types'
import { Package, ChevronLeft, ChevronRight } from 'lucide-react'

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
  // ── Chargement : squelettes ─────────────────────────────
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="aspect-square bg-slate-200 animate-pulse" />
            <div className="p-3 md:p-4 space-y-2">
              <div className="h-3 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
              <div className="h-9 bg-slate-200 rounded-xl animate-pulse mt-2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ── Vide ────────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <div className="text-center py-14 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-slate-300" />
        </div>
        <p className="font-semibold text-slate-700">Aucun produit trouvé</p>
        <p className="text-sm text-slate-400 mt-1">Essayez de modifier vos filtres</p>
      </div>
    )
  }

  // ── Numéros de pages à afficher (desktop) ───────────────
  const getPageNumbers = (): (number | '...')[] => {
    if (!pagination) return []
    const { page, pages } = pagination
    if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1)

    const nums: (number | '...')[] = []
    if (page > 2) nums.push(1)
    if (page > 3) nums.push('...')
    for (let i = Math.max(1, page - 1); i <= Math.min(pages, page + 1); i++) {
      nums.push(i)
    }
    if (page < pages - 2) nums.push('...')
    if (page < pages - 1) nums.push(pages)
    return nums
  }

  return (
    <div>
      {/* ── Grille produits ─────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} featured={product.featured} />
        ))}
      </div>

      {/* ── Pagination ──────────────────────────────────── */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8">
          {/* Mobile : boutons larges préc/suiv */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex-1 h-11 inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 active:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </button>
            <span className="text-xs text-slate-500 whitespace-nowrap px-1">
              {pagination.page} / {pagination.pages}
            </span>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="flex-1 h-11 inline-flex items-center justify-center gap-1.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 active:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Desktop : pagination numérotée */}
          <div className="hidden md:flex items-center justify-center gap-1.5">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Page précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {getPageNumbers().map((num, i) =>
              num === '...' ? (
                <span key={`dots-${i}`} className="px-1.5 text-sm text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={num}
                  onClick={() => onPageChange?.(num)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    num === pagination.page
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {num}
                </button>
              )
            )}

            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Page suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}