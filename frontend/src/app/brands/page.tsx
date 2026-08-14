'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Package, ArrowRight } from 'lucide-react'
import { productService } from '@/services/productService'
import { Product } from '@/types'

interface Brand {
  name: string
  count: number
  products: Product[]
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await productService.getProducts({ limit: 100 })
        const products = response.products || []
        
        const brandMap = new Map<string, Product[]>()
        products.forEach(product => {
          if (product.brand) {
            if (!brandMap.has(product.brand)) {
              brandMap.set(product.brand, [])
            }
            brandMap.get(product.brand)!.push(product)
          }
        })
        
        const brandList: Brand[] = Array.from(brandMap.entries())
          .map(([name, products]) => ({
            name,
            count: products.length,
            products: products.slice(0, 4)
          }))
          .sort((a, b) => b.count - a.count)
        
        setBrands(brandList)
      } catch (error) {
        console.error('Error fetching brands:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
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
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Nos Marques</h1>
          <p className="text-blue-100 max-w-2xl">
            Découvrez les marques partenaires de {brands.length > 0 ? `${brands.length} marques` : 'GLA GLA Business'}
          </p>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="container py-12">
        {brands.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune marque disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <div key={brand.name} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{brand.name}</h2>
                  <span className="text-sm text-gray-500">{brand.count} produits</span>
                </div>
                
                <div className="space-y-2">
                  {brand.products.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {product.price.toLocaleString()} FCFA
                      </span>
                    </Link>
                  ))}
                </div>
                
                {brand.count > 4 && (
                  <Link
                    href={`/products?brand=${encodeURIComponent(brand.name)}`}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-4 font-medium"
                  >
                    Voir tous les produits
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
