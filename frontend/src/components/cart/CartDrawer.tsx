'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { Settings } from '@/types'
import toast from 'react-hot-toast'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  settings?: Settings
}

export default function CartDrawer({ isOpen, onClose, settings }: CartDrawerProps) {
  const { items = [], total = 0, totalItems = 0, updateQuantity, removeItem, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const formatWhatsAppMessage = () => {
    let message = `Bonjour ${settings?.businessName || 'GLA GLA Business'},\n\n`
    message += 'Je souhaite passer la commande suivante :\n\n'
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      message += `Prix : ${item.price.toLocaleString()} FCFA\n`
      message += `Quantité : ${item.quantity}\n\n`
    })
    
    message += `Total estimé : ${total.toLocaleString()} FCFA\n\n`
    message += 'Merci de confirmer la disponibilité de ma commande.'
    
    return encodeURIComponent(message)
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Votre panier est vide')
      return
    }

    setIsProcessing(true)
    
    try {
      // Préparer les données de la commande
      const orderData = {
        customerName: 'Client',
        customerPhone: settings?.whatsappNumber || '237600000000',
        customerEmail: 'client@email.com',
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: total,
        notes: 'Commande depuis le site GLA GLA Business'
      }

      console.log('📦 Envoi de la commande:', orderData)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()
      console.log('📦 Réponse:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de la commande')
      }

      // Ouvrir WhatsApp
      const phone = settings?.whatsappNumber || '237600000000'
      const message = formatWhatsAppMessage()
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
      
      // Vider le panier
      clearCart()
      toast.success('Commande envoyée avec succès !')
      onClose()
    } catch (error: any) {
      console.error('❌ Error processing order:', error)
      toast.error(error.message || 'Erreur lors du traitement de la commande')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
              Mon panier ({totalItems})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {!items || items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Votre panier est vide</p>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Découvrir nos produits
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 bg-gray-50 rounded-lg p-3"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={onClose}
                        className="font-semibold text-gray-700 text-sm hover:text-blue-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-blue-600 font-bold text-sm">
                        {item.price.toLocaleString()} FCFA
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Minus className="h-3 w-3 text-gray-600" />
                        </button>
                        <span className="w-6 text-center text-sm text-gray-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, Math.min(item.stock || 999, item.quantity + 1))}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Plus className="h-3 w-3 text-gray-600" />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-1 hover:bg-red-100 rounded transition-colors ml-auto"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items && items.length > 0 && (
            <div className="border-t p-4 bg-gray-50">
              <div className="flex justify-between text-lg font-bold mb-4">
                <span className="text-gray-700">Total</span>
                <span className="text-blue-600">{total.toLocaleString()} FCFA</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Vider
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Traitement...' : 'Commander via WhatsApp'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
