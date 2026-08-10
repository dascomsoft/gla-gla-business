import Link from 'next/link'
import Image from 'next/image'
import { FolderTree, ArrowRight } from 'lucide-react'
import { Category } from '@/types'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6 text-center">
        {category.image ? (
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
            <Image
              src={category.image}
              alt={category.name}
              width={96}
              height={96}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <FolderTree className="h-10 w-10 text-blue-600" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
        <div className="mt-3 inline-flex items-center text-blue-600 group-hover:text-blue-700 font-medium text-sm">
          Voir les produits
          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}