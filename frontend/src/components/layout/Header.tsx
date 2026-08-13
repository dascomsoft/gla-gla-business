'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, Phone, User, LogOut, Settings, Heart, Tag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useSettings } from '@/hooks/useSettings'

interface HeaderProps {
  onCartOpen: () => void
}

export default function Header({ onCartOpen }: HeaderProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { isAuthenticated, logout } = useAuth()
  const { settings } = useSettings()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Produits', href: '/products' },
    { name: 'Catégories', href: '/categories' },
    { name: 'À propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/')

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="GLA GLA Business Logo" 
                width={40} 
                height={40}
                className="h-10 w-auto"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-blue-600">GLA GLA</span>
              <span className="font-semibold text-gray-700"> Business</span>
            </div>
            <span className="sm:hidden font-bold text-lg text-blue-600">GLA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive(item.href)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/promotions"
              className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              <Tag className="h-4 w-4 inline mr-1" />
              Promos
            </Link>
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive('/admin')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-1" />
              Admin
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '237600000000'}`}
              target="_blank"
              className="hidden md:flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Phone className="h-4 w-4" />
              WhatsApp
            </a>

            <Link
              href="/admin"
              className="hidden md:flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>

            <button
              onClick={onCartOpen}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="h-5 w-5 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slideDown">
            <div className="flex flex-col gap-1">
              {[...navItems, { name: 'Promotions', href: '/promotions' }, { name: 'FAQ', href: '/faq' }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Administration
              </Link>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              )}
              <a
                href={`https://wa.me/${settings?.whatsappNumber || '237600000000'}`}
                target="_blank"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors mx-4 mt-2"
              >
                <Phone className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
