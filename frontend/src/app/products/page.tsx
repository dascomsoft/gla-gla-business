'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Truck,
  ShieldCheck,
  Headphones,
  CheckCircle,
  MessageCircle,
  Zap,
  ChevronRight,
  Home,
  SlidersHorizontal,
  Mail,
  Send,
  ArrowRight,
  ShoppingBag,
  SearchX,
  Sparkles,
  Clock
} from 'lucide-react'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilters from '@/components/products/ProductFilters'
import ProductSearch from '@/components/products/ProductSearch'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { useSettings } from '@/hooks/useSettings'
import { Product, Category } from '@/types'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const { settings } = useSettings()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  })

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    available: '',
    sort: '-createdAt'
  })

  // FONCTION CLE : nettoie les filtres vides avant envoi API
  // Un filtre vide ne doit JAMAIS etre envoye au backend
  const buildQueryParams = useCallback(() => {
    const raw: Record<string, any> = {
      ...filters,
      page: pagination.page,
      limit: pagination.limit
    }

    const cleaned: Record<string, any> = {}
    Object.entries(raw).forEach(([key, value]) => {
      // On garde seulement les valeurs non-vides
      if (value !== '' && value !== null && value !== undefined) {
        cleaned[key] = value
      }
    })

    // Debug
    console.log('🔧 Filtres bruts:', filters)
    console.log('🔧 Filtres nettoyes envoyes a l API:', cleaned)

    return cleaned
  }, [filters, pagination.page, pagination.limit])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const queryParams = buildQueryParams()

      const response = await productService.getProducts(queryParams)

      console.log('📦 API response:', response)
      console.log('📦 Nombre de produits:', response.products?.length)

      setProducts(response.products || [])
      setPagination(response.pagination || { page: 1, limit: 12, total: 0, pages: 1 })
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [buildQueryParams])

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.getCategories({ active: true })
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  const progressPercent =
    pagination.total > 0
      ? Math.min(100, ((pagination.page * pagination.limit) / pagination.total) * 100)
      : 0

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.brand ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.available

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="prod-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#prod-grid)" />
          </svg>
        </div>
        <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-amber-500/5 blur-3xl" />

        <div className="container relative py-10 md:py-14">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-amber-400 font-medium">Produits</span>
            {filters.search && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-slate-300">&quot;{filters.search}&quot;</span>
              </>
            )}
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {filters.search ? (
              <>Resultats pour <span className="text-amber-400">&quot;{filters.search}&quot;</span></>
            ) : (
              <>Trouvez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">bonheur</span></>
            )}
          </h1>
          <p className="text-slate-400 max-w-xl">
            {pagination.total > 0
              ? `${pagination.total} produits selectionnes avec soin. Livraison 24-48h partout au Cameroun.`
              : 'Explorez notre catalogue et trouvez le produit qui vous correspond.'}
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="container -mt-5 relative z-10">
        <div className="bg-white rounded-xl shadow-lg shadow-slate-900/5 border border-slate-100 p-4 flex flex-wrap items-center justify-center md:justify-between gap-3">
          {[
            { icon: Truck, text: 'Livraison 24-48h' },
            { icon: ShieldCheck, text: 'Paiement securise' },
            { icon: Headphones, text: 'Support WhatsApp' },
            { icon: CheckCircle, text: 'Garantie qualite' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-slate-600">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-4 w-4 text-amber-600" />
              </div>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      {!filters.search && !hasActiveFilters && (
        <section className="container mt-6">
          <div className="relative bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-amber-900 text-sm md:text-base">
                  Promo flash en cours !
                </div>
                <div className="text-xs text-amber-700/80">
                  Jusqu&apos;a -30% sur une selection de produits cette semaine.
                </div>
              </div>
            </div>
            <button
              onClick={() => handleFilterChange({ sort: '-price' })}
              className="relative bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              Voir les offres
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* Search */}
      <section className="container mt-6">
        <ProductSearch
          value={filters.search}
          onChange={(value: string) => handleFilterChange({ search: value })}
        />
      </section>

      {/* Main Content */}
      <section className="container py-6 md:py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              <span className="font-semibold text-slate-800 text-sm">Filtres</span>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setFilters({
                      search: '',
                      category: '',
                      brand: '',
                      minPrice: '',
                      maxPrice: '',
                      available: '',
                      sort: '-createdAt'
                    })
                    setPagination((prev) => ({ ...prev, page: 1 }))
                  }}
                  className="ml-auto text-xs text-rose-600 hover:text-rose-700 font-medium"
                >
                  Reinitialiser
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <ProductFilters
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* CTA WhatsApp - Sidebar desktop */}
            <div className="hidden lg:block bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                  <MessageCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Besoin d&apos;aide ?</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Notre equipe vous guide pour choisir le bon produit. Reponse en moins de 15 min.
                </p>
                <a
                  href={`https://wa.me/${settings?.whatsappNumber || '237600000000'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm shadow-emerald-500/20 w-full justify-center"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Discuter sur WhatsApp
                </a>
              </div>
            </div>

            {/* Mini trust - Sidebar desktop */}
            <div className="hidden lg:block bg-amber-50 rounded-2xl p-5 border border-amber-100">
              <h3 className="font-semibold text-amber-900 text-sm mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Pourquoi nous choisir ?
              </h3>
              <ul className="space-y-2.5">
                {[
                  'Produits inspectes un par un',
                  'Paiement a la livraison',
                  'Retour sous 7 jours',
                  'Conseil personnalise',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-amber-800/80">
                    <CheckCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {/* Results Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 bg-slate-50 rounded-xl border border-slate-100 p-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-slate-400" />
                <p className="text-sm text-slate-600">
                  <span className="font-bold text-slate-900">{pagination.total}</span> produit
                  {pagination.total > 1 ? 's' : ''} trouve
                  {pagination.total > 1 ? 's' : ''}
                </p>
                {hasActiveFilters && (
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    &middot; filtres actifs
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-500 hidden sm:inline">Trier par :</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none text-sm text-slate-700 shadow-sm cursor-pointer hover:border-slate-300 transition-colors"
                >
                  <option value="-createdAt">Plus recent</option>
                  <option value="price">Prix croissant</option>
                  <option value="-price">Prix decroissant</option>
                  <option value="-views">Les plus vus</option>
                </select>
              </div>
            </div>

            {/* Progress indicator */}
            {pagination.total > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>
                    Affichage {(pagination.page - 1) * pagination.limit + 1} -{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} sur{' '}
                    {pagination.total}
                  </span>
                  <span>{Math.round(progressPercent)}% vu</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && products.length === 0 && (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <SearchX className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Aucun produit trouve
                </h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                  Essayez de modifier vos filtres ou utilisez des mots-cles differents. Notre equipe peut aussi vous aider !
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setFilters({
                        search: '',
                        category: '',
                        brand: '',
                        minPrice: '',
                        maxPrice: '',
                        available: '',
                        sort: '-createdAt'
                      })
                      setPagination((prev) => ({ ...prev, page: 1 }))
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    Reinitialiser les filtres
                  </button>
                  <a
                    href={`https://wa.me/${settings?.whatsappNumber || '237600000000'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Demander de l&apos;aide
                  </a>
                </div>
              </div>
            )}

            <ProductGrid
              products={products}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
            />

            {/* Pagination progress mobile */}
            {pagination.total > 0 && (
              <div className="mt-4 lg:hidden">
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-center text-xs text-slate-400 mt-2">
                  Page {pagination.page} sur {pagination.pages}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA WhatsApp - Mobile */}
      <section className="container pb-8 lg:hidden">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Besoin d&apos;aide pour choisir ?</h3>
            <p className="text-sm text-slate-400 mb-5 max-w-sm mx-auto">
              Notre equipe vous repond sur WhatsApp en moins de 15 minutes. Gratuit et sans engagement.
            </p>
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '237600000000'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle className="h-5 w-5" />
              Discuter sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container pb-16">
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="relative max-w-xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
              <Mail className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-sm text-slate-300">Ne ratez aucune promo</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Soyez le premier averti
            </h2>
            <p className="text-slate-400 mb-8 text-sm md:text-base">
              Inscrivez-vous et recevez nos offres flash, nouveautes et codes promo avant tout le monde.
            </p>

            {subscribed ? (
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl py-4 px-6 inline-flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Merci ! Vous etes inscrit.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 outline-none focus:border-amber-400/50 transition-colors text-sm"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="h-4 w-4" />
                  S&apos;inscrire
                </button>
              </form>
            )}

            <p className="text-slate-600 text-xs mt-4 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              +500 personnes inscrites cette semaine. Aucun spam, promis.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}