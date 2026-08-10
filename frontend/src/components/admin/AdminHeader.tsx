'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, ShoppingBag, LogOut, User, ChevronDown } from 'lucide-react'

interface AdminHeaderProps {
  onMenuClick: () => void
  onLogout: () => void
}

export default function AdminHeader({ onMenuClick, onLogout }: AdminHeaderProps) {
  const [adminData, setAdminData] = useState<any>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('adminData')
    if (data) {
      try {
        setAdminData(JSON.parse(data))
      } catch (error) {
        console.error('Error parsing admin data:', error)
      }
    }
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-800 hidden sm:block">
              Admin GLA GLA
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            Voir le site
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {adminData?.name || 'Admin'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}