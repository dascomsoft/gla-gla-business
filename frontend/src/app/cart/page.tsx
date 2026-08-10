'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  ShoppingCart
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useSettings } from '@/hooks/useSettings'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, total, totalItems, updateQuantity, removeItem, clearCart } = useCart()
  const { settings } = useSettings()
  const [isProcessing, setIsProcessing] = useState(false)

  const formatWhatsAppMessage = () => {
    let message = `Bonjour ${settings?.businessName || 'GLA GLA Business'},\n\n`
    message += 'Je souhaite passer la commande suivante :\n\n'
    
    items.forEach((item: CartItem, index: number) => {
      message += `${index + 1}. ${item.name}\n`
      message += `Prix : ${item.price.toLocaleString()} FCFA\n`
      message += `Quantité : ${item.quantity}\n\n`
    })
    
    message += `Total estimé : ${total.toLocaleString()} FCFA\n\n`
    message += 'Merci de confirmer la disponibilité de ma commande.'
    
    return encodeURIComponent(message)
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    try {
      const orderData = {
        customerName: 'Client',
        customerPhone: '237600000000',
        items: items.map((item: CartItem) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: total,
        notes: 'Commande depuis le site'
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de la création de la commande')
      }

      const phone = settings?.whatsappNumber || '237600000000'
      const message = formatWhatsAppMessage()
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
      
      clearCart()
      toast.success('Commande envoyée avec succès !')
    } catch (error: any) {
      console.error('Error processing order:', error)
      toast.error(error.message || 'Erreur lors du traitement de la commande')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingCart className="h-20 w-20 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 mb-6">Découvrez nos produits et faites vos achats</p>
        <Link
          href="/products"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Découvrir les produits
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <ShoppingBag className="h-8 w-8 text-blue-600" />
        Mon panier ({totalItems} articles)
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: CartItem) => (
            <div
              key={item.productId}
              className="bg-white rounded-xl shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-blue-600 font-bold">
                  {item.price.toLocaleString()} FCFA
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-100 rounded-l-lg transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="px-4 py-1 text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100 rounded-r-lg transition-colors"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Résumé</h2>
            
            <div className="space-y-2 border-b border-gray-200 pb-4">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total ({totalItems} articles)</span>
                <span>{total.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold py-4">
              <span>Total</span>
              <span className="text-blue-600">{total.toLocaleString()} FCFA</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing || items.length === 0}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                  Traitement...
                </>
              ) : (
                'Commander via WhatsApp'
              )}
            </button>

            <Link
              href="/products"
              className="flex items-center justify-center gap-2 mt-4 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Type pour CartItem (à importer depuis les types)
interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  quantity: number
  image?: string
  stock: number
}
