import Link from 'next/link'
import { Category } from '@/types'
import { ChevronRight } from 'lucide-react'

interface CategoryListProps {
  categories: Category[]
  selectedCategory?: string
  onSelect?: (categoryId: string) => void
}

export default function CategoryList({ 
  categories, 
  selectedCategory,
  onSelect 
}: CategoryListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-semibold text-gray-700 mb-3">Catégories</h3>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onSelect?.('')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
              !selectedCategory ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'
            }`}
          >
            <span>Toutes les catégories</span>
            <ChevronRight className={`h-4 w-4 transition-transform ${
              !selectedCategory ? 'text-blue-600' : 'text-gray-400'
            }`} />
          </button>
        </li>
        {categories.map((category) => (
          <li key={category._id}>
            <button
              onClick={() => onSelect?.(category._id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                selectedCategory === category._id ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'
              }`}
            >
              <span>{category.name}</span>
              <ChevronRight className={`h-4 w-4 transition-transform ${
                selectedCategory === category._id ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}