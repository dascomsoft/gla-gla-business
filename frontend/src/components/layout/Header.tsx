'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  ShoppingBag,
  Menu,
  X,
  Phone,
  User,
  LogOut,
  Settings,
  MessageCircle
} from 'lucide-react'
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
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(path + '/')

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-slate-900/5 border-b border-slate-100'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* ═══ LOGO — bien visible avec fond contrasté ═══ */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            {/* Fallback logo stylisé si l'image ne charge pas */}
            <div className="relative w-20 h-20 md:w-20 md:h-20 rounded-xl  flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
              {/* Si tu as un logo.png, décommente ci-dessous et commente la div "G" */}
              <Image
                src="/logo.png"
                alt="GLA GLA Business Logo"
                fill
                className="object-contain p-1.5"
                priority
              /> 
              <span className="text-amber-400 font-bold text-lg md:text-xl">G</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-base md:text-lg text-slate-900 tracking-tight">
                GLA GLA
              </span>
              <span className="font-medium text-slate-500"> Business</span>
            </div>
          </Link>

          {/* ═══ DESKTOP NAVIGATION ═══ */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-slate-900 bg-amber-50'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-amber-500 rounded-full" />
                )}
              </Link>
            ))}

            {/* Admin */}
            <Link
              href="/admin"
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                isActive('/admin')
                  ? 'text-slate-900 bg-amber-50'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              Admin
              {isActive('/admin') && (
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-amber-500 rounded-full" />
              )}
            </Link>
          </nav>

          {/* ═══ RIGHT ACTIONS ═══ */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '237600000000'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm shadow-emerald-500/20 hover:shadow-md hover:shadow-emerald-500/20"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>

            {/* Admin shortcut (desktop) */}
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>

            {/* Cart */}
            <button
              onClick={onCartOpen}
              className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-colors group"
              aria-label="Ouvrir le panier"
            >
              <ShoppingBag className="h-5 w-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-slate-900 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm animate-in zoom-in duration-200">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-slate-700" />
              ) : (
                <Menu className="h-5 w-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* ═══ MOBILE NAVIGATION ═══ */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isActive(item.href)
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="h-px bg-slate-100 my-1" />

              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-2.5 ${
                  isActive('/admin')
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Settings className="h-4 w-4" />
                Administration
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all text-sm font-medium flex items-center gap-2.5"
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all text-sm font-medium flex items-center gap-2.5 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </>
              )}

              <a
                href={`https://wa.me/${settings?.whatsappNumber || '237600000000'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium transition-all mt-2 shadow-sm shadow-emerald-500/20"
              >
                <MessageCircle className="h-4 w-4" />
                Discuter sur WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}