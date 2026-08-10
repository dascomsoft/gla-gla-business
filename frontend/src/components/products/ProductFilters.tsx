'use client'

import { useState } from 'react'
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react'
import { Category } from '@/types'

interface ProductFiltersProps {
  categories: Category[] | any
  filters: {
    category: string
    brand: string
    minPrice: string
    maxPrice: string
    available: string
    sort: string
  }
  onFilterChange: (filters: any) => void
}

export default function ProductFilters({
  categories,
  filters,
  onFilterChange
}: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = (key: string, value: string) => {
    onFilterChange({ [key]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      available: '',
    })
  }

  const hasActiveFilters = filters.category || filters.brand ||
    filters.minPrice || filters.maxPrice || filters.available

  const extractCategories = (data: any): Category[] => {
    if (Array.isArray(data)) {
      return data.filter((item): item is Category =>
        item && typeof item === 'object' && item._id && item.name
      )
    }
    if (data && typeof data === 'object') {
      if (data.categories && Array.isArray(data.categories)) {
        return data.categories.filter((item: any): item is Category =>
          item && typeof item === 'object' && item._id && item.name
        )
      }
      if (data.data && Array.isArray(data.data)) {
        return data.data.filter((item: any): item is Category =>
          item && typeof item === 'object' && item._id && item.name
        )
      }
      const values = Object.values(data)
      const foundArray = values.find(val => Array.isArray(val))
      if (foundArray) {
        return foundArray.filter((item: any): item is Category =>
          item && typeof item === 'object' && item._id && item.name
        )
      }
    }
    return []
  }

  const categoriesArray = extractCategories(categories)

  return (
    <div className="bg-white rounded-xl p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between lg:hidden"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="font-medium text-slate-700">Filtres</span>
          {hasActiveFilters && (
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
              Actifs
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-slate-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-500" />
        )}
      </button>

      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block mt-4 lg:mt-0 space-y-4`}>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
          >
            <X className="h-3 w-3" />
            Effacer les filtres
          </button>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Categorie
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none text-sm bg-white"
          >
            <option value="">Toutes les categories</option>
            {categoriesArray.length > 0 ? (
              categoriesArray.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value="" disabled>Aucune categorie disponible</option>
            )}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Prix (FCFA)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-1/2 px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-1/2 px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none text-sm"
            />
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Disponibilite
          </label>
          <select
            value={filters.available}
            onChange={(e) => handleChange('available', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none text-sm bg-white"
          >
            <option value="">Tous les produits</option>
            <option value="true">Disponible</option>
            <option value="false">Indisponible</option>
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-medium transition-colors lg:hidden"
        >
          Effacer les filtres
        </button>
      </div>
    </div>
  )
}