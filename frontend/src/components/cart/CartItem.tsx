'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus } from 'lucide-react'
import { CartItem as CartItemType } from '@/types'
import { useCart } from '@/hooks/useCart'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-4 bg-white rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-2xl">📦</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.slug}`}
          className="font-semibold text-gray-700 hover:text-blue-600 transition-colors line-clamp-1"
        >
          {item.name}
        </Link>
        <p className="text-blue-600 font-bold">
          {item.price.toLocaleString()} FCFA
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="px-2 py-1 hover:bg-gray-100 rounded-l-lg transition-colors"
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3 text-gray-600" />
            </button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              className="px-2 py-1 hover:bg-gray-100 rounded-r-lg transition-colors"
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-3 w-3 text-gray-600" />
            </button>
          </div>
          <button
            onClick={() => removeItem(item.productId)}
            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors ml-auto"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  )
}