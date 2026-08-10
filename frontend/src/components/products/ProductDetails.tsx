'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingBag, Plus, Minus, CheckCircle, Truck, Shield } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/hooks/useCart'
import toast from 'react-hot-toast'

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!product.available || product.stock === 0) {
      toast.error('Ce produit est en rupture de stock')
      return
    }

    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0],
      stock: product.stock
    })

    toast.success(`${product.name} ajouté au panier`)
  }

  const images = product.images || []
  const discount = product.oldPrice 
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Images */}
      <div>
        <div className="aspect-square relative bg-gray-100 rounded-xl overflow-hidden mb-4">
          {images.length > 0 ? (
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingBag className="h-20 w-20" />
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
        
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {product.name}
        </h1>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold text-blue-600">
            {product.price.toLocaleString()} FCFA
          </span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-xl">
              {product.oldPrice.toLocaleString()} FCFA
            </span>
          )}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            {product.available && product.stock > 0 ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">
                  En stock ({product.stock} unités)
                </span>
              </>
            ) : (
              <>
                <span className="h-5 w-5 text-red-500">✕</span>
                <span className="text-red-600 font-medium">Rupture de stock</span>
              </>
            )}
          </div>
          {product.brand && (
            <p className="text-gray-600">
              <span className="font-semibold">Marque:</span> {product.brand}
            </p>
          )}
        </div>

        <div className="prose prose-sm max-w-none text-gray-600 mb-6">
          <p>{product.description}</p>
        </div>

        {product.available && product.stock > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                >
                  <Minus className="h-4 w-4 text-gray-600" />
                </button>
                <span className="px-6 py-2 font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Ajouter au panier
              </button>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck className="h-5 w-5 text-blue-500" />
            <span>Livraison disponible</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-5 w-5 text-blue-500" />
            <span>Qualité garantie</span>
          </div>
        </div>
      </div>
    </div>
  )
}