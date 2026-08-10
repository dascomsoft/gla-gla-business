'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface ProductSearchProps {
  value: string
  onChange: (value: string) => void
}

export default function ProductSearch({ value, onChange }: ProductSearchProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`relative transition-all duration-200 ${
      isFocused ? 'ring-2 ring-blue-500 shadow-md' : ''
    }`}>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
          isFocused ? 'text-blue-500' : 'text-gray-400'
        }`} />
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none transition-all"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}