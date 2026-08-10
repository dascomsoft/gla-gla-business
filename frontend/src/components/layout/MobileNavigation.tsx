'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, FolderTree, Phone, ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export default function MobileNavigation() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/')

  const navItems = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Produits', href: '/products', icon: ShoppingBag },
    { name: 'Catégories', href: '/categories', icon: FolderTree },
    { name: 'Contact', href: '/contact', icon: Phone },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                active ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
        <Link
          href="/cart"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors relative ${
            pathname === '/cart' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="text-[10px] font-medium">Panier</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </Link>
      </div>
    </div>
  )
}