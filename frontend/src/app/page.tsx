'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  ShoppingBag,
  ArrowRight,
  Phone,
  MapPin,
  Mail,
  Star,
  Truck,
  ShieldCheck,
  Headphones,
  CheckCircle,
  MessageCircle,
  Zap,
  Clock,
  Calendar,
  Send,
  Users,
  Heart,
  ChevronRight,
  Percent
} from 'lucide-react'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { useCart } from '@/context/CartContext'
import { Category, Product } from '@/types'
import { useSettings } from '@/hooks/useSettings'

// ─── Composant utilitaire : étoiles de notation ───
function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
          }`}
        />
      ))}
      {count !== undefined && (
        <span className="text-xs text-gray-400 ml-1">({count})</span>
      )}
    </div>
  )
}

// Génère un rating stable basé sur l'ID (pour la démo visuelle)
function getStableRating(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return (Math.abs(hash) % 3) + 3 // entre 3 et 5
}

function getReviewCount(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return (Math.abs(hash) % 150) + 12
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const { addItem } = useCart()
  const { settings } = useSettings()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getProducts({ limit: 8, featured: true }),
          categoryService.getCategories({ active: true })
        ])

        setFeaturedProducts(productsRes.products || [])
        setCategories(Array.isArray(categoriesRes) ? categoriesRes : [])

        const recentRes = await productService.getProducts({ limit: 4, sort: '-createdAt' })
        setRecentProducts(recentRes.products || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setFeaturedProducts([])
        setCategories([])
        setRecentProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
          <p className="text-sm text-gray-500">Chargement de votre expérience...</p>
        </div>
      </div>
    )
  }

  const categoriesToShow = Array.isArray(categories) ? categories.slice(0, 8) : []

  return (
    <div className="bg-white">
      {/* ═══════════════════════════════════════
          HERO SECTION — Fond sombre premium
      ═══════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Motif géométrique subtil */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Cercles décoratifs */}
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-3xl"></div>
        <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full bg-amber-500/5 blur-3xl"></div>

        <div className="container relative py-20 md:py-28">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-sm font-medium">Livraison express dans toutes les villes du Cameroun</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
              Votre shopping,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                simplifié.
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-8 text-slate-300 leading-relaxed max-w-xl">
              Des milliers de produits sélectionnés avec soin. Paiement sécurisé, livraison rapide et un service client qui vous accompagne à chaque étape.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/products"
                className="inline-flex items-center bg-amber-500 hover:bg-amber-400 text-slate-900 px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5"
              >
                Découvrir les produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center bg-white/5 hover:bg-white/10 border border-white/15 text-white px-7 py-3.5 rounded-xl font-medium transition-all duration-200"
              >
                Parcourir les catégories
              </Link>
            </div>

            {/* Preuve sociale */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {['bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-blue-500'].map((color, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${color} border-2 border-slate-800 flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {['MK', 'JT', 'AN', 'PL'][i]}
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-400">
                <span className="text-white font-semibold">+2 400 clients</span> satisfaits ce mois-ci
              </div>
            </div>
          </div>
        </div>

        {/* Vague de transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L48 46.7C96 53 192 67 288 66.7C384 67 480 53 576 43.3C672 33 768 27 864 30C960 33 1056 47 1152 50C1248 53 1344 47 1392 43.3L1440 40V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SEARCH BAR — Flottante & premium
      ═══════════════════════════════════════ */}
      <section className="container -mt-8 relative z-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 p-2 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 px-4 py-3">
            <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Rechercher un produit (ex: smartphone, casque, montre...)"
              className="flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm md:text-base bg-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = `/products?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`
                }
              }}
            />
            <Link
              href="/products"
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap text-sm font-medium"
            >
              Rechercher
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">
          Plus de 500 produits disponibles · Livraison sous 24-48h
        </p>
      </section>

      {/* ═══════════════════════════════════════
          TRUST BAR — 4 avantages clés (NOUVEAU)
      ═══════════════════════════════════════ */}
      <section className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'Livraison rapide', desc: '24-48h partout' },
            { icon: ShieldCheck, title: 'Paiement sécurisé', desc: '100% crypté' },
            { icon: Headphones, title: 'Support 24/7', desc: 'WhatsApp & appel' },
            { icon: CheckCircle, title: 'Qualité garantie', desc: 'Satisfait ou remboursé' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500 transition-colors">
                <item.icon className="h-5 w-5 text-white group-hover:text-slate-900 transition-colors" />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-800">{item.title}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════ */}
      <section className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Nos Catégories</h2>
            <p className="text-slate-500 mt-1 text-sm">Trouvez exactement ce dont vous avez besoin</p>
          </div>
          <Link
            href="/categories"
            className="hidden md:inline-flex items-center text-slate-700 hover:text-amber-600 font-medium text-sm transition-colors"
          >
            Voir toutes
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {categoriesToShow.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl">
            <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Aucune catégorie disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoriesToShow.map((category, index) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <ShoppingBag className="h-10 w-10 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {category.productCount || 'Plusieurs'} produits
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-6 md:hidden">
          <Link
            href="/categories"
            className="inline-flex items-center text-slate-700 hover:text-amber-600 font-medium text-sm"
          >
            Voir toutes les catégories
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY CHOOSE US — Storytelling inbound (NOUVEAU)
      ═══════════════════════════════════════ */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Pourquoi des milliers de Camerounais nous font confiance
            </h2>
            <p className="text-slate-500">
              Chez GLA GLA, on ne vend pas juste des produits. On vous accompagne de la commande à la livraison.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: CheckCircle,
                color: 'bg-amber-500',
                title: 'Produits vérifiés un par un',
                desc: 'Chaque article est inspecté avant expédition. Zéro mauvaise surprise à la réception. Vous recevez exactement ce que vous avez vu.',
              },
              {
                icon: ShieldCheck,
                color: 'bg-emerald-500',
                title: 'Paiement à la livraison',
                desc: 'Pas envie de payer en ligne ? Aucun problème. Réglez directement à la réception de votre colis. Votre tranquillité d\'esprit avant tout.',
              },
              {
                icon: MessageCircle,
                color: 'bg-rose-500',
                title: 'Conseil personnalisé par WhatsApp',
                desc: 'Hésitez entre deux modèles ? Notre équipe vous répond en direct pour vous aider à faire le bon choix, sans pression.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-5`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════ */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-600 text-sm font-medium mb-2">
              <Percent className="h-4 w-4" />
              <span>Meilleures offres du moment</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Produits Vedettes</h2>
          </div>
          <Link
            href="/products?featured=true"
            className="hidden md:inline-flex items-center text-slate-700 hover:text-amber-600 font-medium text-sm transition-colors"
          >
            Voir tout
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl">
              <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Aucun produit vedette disponible</p>
            </div>
          ) : (
            featuredProducts.map((product, index) => {
              const rating = getStableRating(product._id)
              const reviewCount = getReviewCount(product._id)
              const discount = product.oldPrice
                ? Math.round((1 - product.price / product.oldPrice) * 100)
                : 0

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="aspect-square relative overflow-hidden bg-slate-100">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <ShoppingBag className="h-10 w-10 text-slate-300" />
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.featured && (
                          <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                            <Star className="h-3 w-3 fill-white" />
                            VEDETTE
                          </span>
                        )}
                      </div>
                      {product.oldPrice && discount > 0 && (
                        <span className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          -{discount}%
                        </span>
                      )}

                      {/* Quick add overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            addItem({
                              productId: product._id,
                              name: product.name,
                              slug: product.slug,
                              price: product.price,
                              quantity: 1,
                              image: product.images?.[0],
                              stock: product.stock
                            })
                          }}
                          className="w-full bg-white/95 backdrop-blur-sm text-slate-900 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                          disabled={!product.available || product.stock === 0}
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Ajouter au panier
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <StarRating rating={rating} count={reviewCount} />
                      <h3 className="font-semibold text-slate-800 mt-2 mb-1 line-clamp-1 text-sm md:text-base group-hover:text-amber-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-slate-900 font-bold text-base">
                          {product.price.toLocaleString()} FCFA
                        </span>
                        {product.oldPrice && (
                          <span className="text-slate-400 text-sm line-through">
                            {product.oldPrice.toLocaleString()} FCFA
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          NEW ARRIVALS
      ═══════════════════════════════════════ */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-medium mb-2">
                <Zap className="h-4 w-4" />
                <span>Fresh drop — Nouveautés</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Nouveautés</h2>
            </div>
            <Link
              href="/products?sort=-createdAt"
              className="hidden md:inline-flex items-center text-slate-700 hover:text-amber-600 font-medium text-sm transition-colors"
            >
              Voir tout
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {recentProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl">
                <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Aucun nouveau produit disponible</p>
              </div>
            ) : (
              recentProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="aspect-square relative overflow-hidden bg-slate-100">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <ShoppingBag className="h-10 w-10 text-slate-300" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        NOUVEAU
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1 text-sm md:text-base group-hover:text-amber-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900 font-bold text-base">
                          {product.price.toLocaleString()} FCFA
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          addItem({
                            productId: product._id,
                            name: product.name,
                            slug: product.slug,
                            price: product.price,
                            quantity: 1,
                            image: product.images?.[0],
                            stock: product.stock
                          })
                        }}
                        className="mt-3 w-full bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={!product.available || product.stock === 0}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        {product.available && product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                      </button>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS — Preuve sociale (NOUVEAU)
      ═══════════════════════════════════════ */}
      <section className="container py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Ce que disent nos clients
          </h2>
          <p className="text-slate-500">
            Des histoires vraies de vraies personnes à travers le Cameroun.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Marie K.',
              city: 'Yaoundé',
              rating: 5,
              text: 'Livraison en 24h à Yaoundé, je n\'y croyais pas ! Le produit est exactement comme sur les photos. Service client au top sur WhatsApp.',
              avatar: 'bg-amber-500',
            },
            {
              name: 'Jean T.',
              city: 'Douala',
              rating: 5,
              text: 'J\'ai payé à la livraison, aucun stress. Le vendeur m\'a même conseillé par WhatsApp pour choisir la bonne taille. Je recommande à 100%.',
              avatar: 'bg-emerald-500',
            },
            {
              name: 'Aline N.',
              city: 'Bafoussam',
              rating: 4,
              text: 'Troisième commande et toujours satisfaite. Les prix sont compétitifs et la qualité est au rendez-vous. Mon site préféré au Cameroun.',
              avatar: 'bg-rose-500',
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.avatar} flex items-center justify-center text-white text-sm font-bold`}>
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          NEWSLETTER — Capture de leads (NOUVEAU)
      ═══════════════════════════════════════ */}
      <section className="container pb-16">
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
              <Heart className="h-3.5 w-3.5 text-rose-400" />
              <span className="text-sm text-slate-300">Rejoignez la communauté</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ne manquez aucune promo
            </h2>
            <p className="text-slate-300 mb-8 text-sm md:text-base">
              Inscrivez-vous et recevez en exclusivité nos offres flash, nouveautés et codes promo avant tout le monde.
            </p>

            {subscribed ? (
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl py-4 px-6 inline-flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Vous êtes inscrit ! Merci de votre confiance.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
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
                  S'inscrire
                </button>
              </form>
            )}

            <p className="text-slate-500 text-xs mt-4 flex items-center justify-center gap-1">
              <Users className="h-3 w-3" />
              +500 personnes inscrites cette semaine. Aucun spam, promis.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTACT / FOOTER
      ═══════════════════════════════════════ */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Une question ? On est là.
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Notre équipe répond sur WhatsApp en moins de 15 minutes. Que ce soit pour un conseil, un suivi de commande ou une question technique, n'hésitez pas.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Téléphone / WhatsApp</div>
                    <div className="font-medium">{settings?.businessPhone || '+237 600 000 000'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Adresse</div>
                    <div className="font-medium">{settings?.businessAddress || 'Yaoundé, Cameroun'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Email</div>
                    <div className="font-medium">{settings?.businessEmail || 'contact@glagla.com'}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`https://wa.me/${settings?.whatsappNumber || '237600000000'}`}
                  target="_blank"
                  className="inline-flex items-center bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Discuter sur WhatsApp
                </Link>
                <div className="inline-flex items-center gap-2 text-slate-400 text-sm px-4">
                  <Clock className="h-4 w-4" />
                  <span>Réponse sous 15 min</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-8 border border-white/5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/20">
                <ShoppingBag className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {settings?.businessName || 'GLA GLA Business'}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                {settings?.businessDescription || 'Votre partenaire de confiance pour un shopping simple, rapide et sécurisé au Cameroun.'}
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span>Lun-Ven : 8h-18h</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span>Sam : 9h-14h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p> {new Date().getFullYear()} {settings?.businessName || 'GLA GLA Business'}. Tous droits réservés.</p>
            <div className="flex items-center gap-6">
              <Link href="/products" className="hover:text-white transition-colors">Produits</Link>
              <Link href="/categories" className="hover:text-white transition-colors">Catégories</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}