'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Tag, Star } from 'lucide-react'
import { productService } from '@/services/productService'
import { Product } from '@/types'

/* =========================================================
   SOUS-COMPOSANTS
========================================================= */

function ProductCard({ product }: { product: Product }) {
  const discount = Math.round((1 - product.price / product.oldPrice!) * 100)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-700">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-slate-500" />
          </div>
        )}

        <div className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
          -{discount}%
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-1 line-clamp-1 font-semibold text-slate-100">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-400">
            {product.price.toLocaleString()} FCFA
          </span>
          {product.oldPrice && (
            <span className="text-sm text-slate-500 line-through">
              {product.oldPrice.toLocaleString()} FCFA
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
        <Tag className="h-10 w-10 text-slate-500" />
      </div>
      <p className="text-lg font-semibold text-slate-200">
        Aucune promotion en cours
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Revenez bientôt pour découvrir nos offres
      </p>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
    </div>
  )
}

/* =========================================================
   PAGE PRINCIPALE
========================================================= */

export default function PromotionsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await productService.getProducts({
          available: 'true',
          minPrice: '0',
          sort: '-createdAt',
        })
        const promoProducts = response.products.filter(
          (p) => p.oldPrice && p.oldPrice > p.price
        )
        setProducts(promoProducts)
      } catch (error) {
        console.error('Error fetching promotions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-sm">
            <Tag className="h-5 w-5" />
            <span className="text-sm font-semibold">Offres limitées</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Promotions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Découvrez nos offres spéciales et économisez sur vos produits préférés.
          </p>
        </div>
      </section>

      {/* Produits */}
      <section className="container mx-auto px-4 py-12">
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}