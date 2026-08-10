'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export default function SearchBar({ 
  placeholder = 'Rechercher un produit...', 
  className = '' 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}>
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
          isFocused ? 'text-blue-500' : 'text-gray-400'
        }`} />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none transition-all bg-white"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  )
}