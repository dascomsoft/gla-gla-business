'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Star } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  featured?: boolean
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addItem } = useCart()

  // Debug log
  console.log('🃏 ProductCard rendering:', product?.name, product?._id)

  if (!product) {
    console.warn('⚠️ ProductCard: product is null or undefined')
    return null
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.available || product.stock === 0) {
      toast.error('Ce produit est en rupture de stock')
      return
    }

    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      image: product.images?.[0],
      stock: product.stock
    })

    toast.success(`${product.name} ajouté au panier`)
  }

  const discount = product.oldPrice 
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {featured && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3" />
                Vedette
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {(!product.available || product.stock === 0) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                Rupture de stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          {product.brand && (
            <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-blue-600">
              {product.price?.toLocaleString() || 0} FCFA
            </span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                {product.oldPrice.toLocaleString()} FCFA
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.available || product.stock === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            {product.available && product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
          </button>
        </div>
      </Link>
    </div>
  )
}
