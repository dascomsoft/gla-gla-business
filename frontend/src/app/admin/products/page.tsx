'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, Eye, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import { productService } from '@/services/productService'
import { Product } from '@/types'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productService.getProducts({
        search: search || undefined,
        page: currentPage,
        limit: 10
      })
      setProducts(response.products || [])
      setTotalPages(response.pagination?.pages || 1)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, search])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      const success = await productService.deleteProduct(id)
      if (success) {
        toast.success('Produit supprimé avec succès')
        fetchProducts()
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleToggleAvailability = async (id: string) => {
    try {
      const result = await productService.toggleProductAvailability(id)
      if (result) {
        toast.success(`Produit ${result.available ? 'disponible' : 'indisponible'}`)
        fetchProducts()
      } else {
        toast.error('Erreur lors du changement de statut')
      }
    } catch (error) {
      console.error('Error toggling availability:', error)
      toast.error('Erreur lors du changement de statut')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Produits</h1>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl transition-colors w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 shadow-sm"
          aria-label="Ajouter un produit"
        >
          <Plus className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="hidden sm:inline">Ajouter un produit</span>
        </Link>
      </div>

      {/* ── Recherche ──────────────────────────────────────── */}
      <div className="mb-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            inputMode="search"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 sm:py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm text-[16px] sm:text-sm"
          />
        </div>
      </div>

      {/* ── Liste produits ─────────────────────────────────── */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm py-16 flex flex-col items-center">
          <Package className="h-14 w-14 text-gray-200 mb-3" />
          <p className="text-gray-500">Aucun produit trouvé</p>
        </div>
      ) : (
        <>
          {/* Mobile : cartes */}
          <div className="space-y-3 md:hidden">
            {products.map((product) => (
              <article
                key={product._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3.5"
              >
                {/* Ligne 1 : image + infos principales */}
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package className="h-7 w-7" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {product.description?.substring(0, 60)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="font-bold text-blue-700 text-sm">
                        {product.price.toLocaleString()} FCFA
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {product.oldPrice.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ligne 2 : badges stock + statut */}
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-700'
                        : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} unités` : 'Rupture'}
                  </span>

                  <button
                    onClick={() => handleToggleAvailability(product._id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      product.available && product.stock > 0
                        ? 'bg-green-100 text-green-700 active:bg-green-200'
                        : 'bg-red-100 text-red-700 active:bg-red-200'
                    }`}
                  >
                    {product.available && product.stock > 0 ? 'Disponible' : 'Indisponible'}
                  </button>
                </div>

                {/* Ligne 3 : actions (zones tactiles ≥ 40px) */}
                <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-100">
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 active:bg-gray-100 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Voir
                  </Link>
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-blue-600 active:bg-blue-50 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 active:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Desktop : tableau */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.images && product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description?.substring(0, 50)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-800">
                          {product.price.toLocaleString()} FCFA
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            {product.oldPrice.toLocaleString()} FCFA
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10
                              ? 'bg-green-100 text-green-700'
                              : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} unités` : 'Rupture'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleAvailability(product._id)}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.available && product.stock > 0
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {product.available && product.stock > 0 ? 'Disponible' : 'Indisponible'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Voir"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Pagination ─────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            {currentPage} / {totalPages}
          </span>
          <div className="flex gap-2 flex-1 sm:flex-none justify-end">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center gap-1 px-3 py-2.5 sm:py-1.5 border border-gray-200 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sm:hidden">Préc.</span>
              <span className="hidden sm:inline">Précédent</span>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center gap-1 px-3 py-2.5 sm:py-1.5 border border-gray-200 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-50 transition-colors"
            >
              <span className="sm:hidden">Suiv.</span>
              <span className="hidden sm:inline">Suivant</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}