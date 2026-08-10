import CategoryCard from './CategoryCard'
import { Category } from '@/types'
import { FolderTree } from 'lucide-react'

interface CategoryGridProps {
  categories: Category[]
  loading?: boolean
}

export default function CategoryGrid({ categories, loading = false }: CategoryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderTree className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Aucune catégorie disponible</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {categories.map((category) => (
        <CategoryCard key={category._id} category={category} />
      ))}
    </div>
  )
}