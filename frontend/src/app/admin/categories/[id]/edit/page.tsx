'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CategoryForm from '@/components/admin/CategoryForm'
import { categoryService } from '@/services/categoryService'
import { Category } from '@/types'
import toast from 'react-hot-toast'

export default function EditCategory() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await categoryService.getCategoryById(id)
        setCategory(data)
      } catch (error) {
        console.error('Error fetching category:', error)
        toast.error('Erreur lors du chargement de la catégorie')
        router.push('/admin/categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Catégorie non trouvée</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Modifier la catégorie</h1>
      <CategoryForm category={category} />
    </div>
  )
}