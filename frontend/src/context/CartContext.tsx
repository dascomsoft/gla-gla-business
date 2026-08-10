'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem } from '@/types'

interface CartContextType {
  items: CartItem[]
  total: number
  totalItems: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

// Créer et exporter le contexte
export const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'gla_gla_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setItems(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error('Error loading cart:', error)
        setItems([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0)

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId)
      if (existing) {
        const newQuantity = Math.min((existing.quantity || 0) + (item.quantity || 1), item.stock || 999)
        return prev.map(i => 
          i.productId === item.productId 
            ? { ...i, quantity: newQuantity }
            : i
        )
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, quantity: Math.min(quantity, item.stock || 999) }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider value={{
      items,
      total,
      totalItems,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Hook personnalisé pour utiliser le contexte
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    // Retourner un objet par défaut si le contexte n'est pas disponible
    return {
      items: [],
      total: 0,
      totalItems: 0,
      addItem: () => {},
      removeItem: () => {},
      updateQuantity: () => {},
      clearCart: () => {}
    }
  }
  return context
}
