'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Tag, Clock, Zap, Star } from 'lucide-react'
import { productService } from '@/services/productService'
import { Product } from '@/types'

export default function PromotionsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await productService.getProducts({
          available: 'true',
          minPrice: '0',
          sort: '-createdAt'
        })
        // Filtrer les produits en promotion (ceux avec oldPrice)
        const promoProducts = response.products.filter(p => p.oldPrice && p.oldPrice > p.price)
        setProducts(promoProducts)
      } catch (error) {
        console.error('Error fetching promotions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tag className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Promotions</h1>
          </div>
          <p className="text-white/90 max-w-2xl mx-auto">
            Découvrez nos offres spéciales et économisez sur vos produits préférés.
          </p>
        </div>
      </section>

      <section className="container py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune promotion en cours</p>
            <p className="text-sm text-gray-400 mt-2">Revenez bientôt pour découvrir nos offres</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
              const discount = Math.round((1 - product.price / product.oldPrice!) * 100)
              return (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                      -{discount}%
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">
                        {product.price.toLocaleString()} FCFA
                      </span>
                      {product.oldPrice && (
                        <span className="text-gray-400 text-sm line-through">
                          {product.oldPrice.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
