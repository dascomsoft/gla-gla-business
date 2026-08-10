
'use client'

import { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Header from './Header'
import Footer from './Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import { useSettings } from '@/hooks/useSettings'
import { Toaster } from 'react-hot-toast'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { settings } = useSettings()

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        }}
      />
      <Header onCartOpen={() => setIsCartOpen(true)} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        settings={settings || undefined}
      />
    </div>
  )
}
