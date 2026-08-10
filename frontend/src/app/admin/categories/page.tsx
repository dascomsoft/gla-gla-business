'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye, FolderTree } from 'lucide-react'
import { categoryService } from '@/services/categoryService'
import { Category } from '@/types'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryService.getCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Erreur lors du chargement des catégories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return
    
    try {
      const success = await categoryService.deleteCategory(id)
      if (success) {
        toast.success('Catégorie supprimée avec succès')
        fetchCategories()
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const result = await categoryService.toggleCategoryStatus(id)
      if (result) {
        toast.success(`Catégorie ${result.active ? 'activée' : 'désactivée'}`)
        fetchCategories()
      } else {
        toast.error('Erreur lors du changement de statut')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Erreur lors du changement de statut')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Catégories</h1>
        <Link
          href="/admin/categories/create"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une catégorie
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FolderTree className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Aucune catégorie trouvée</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FolderTree className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {category.description || 'Aucune description'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleToggleStatus(category._id)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        category.active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {category.active ? 'Actif' : 'Inactif'}
                    </button>
                    <span className="text-xs text-gray-400">
                      Ordre: {category.order || 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/categories/${category.slug}`}
                    target="_blank"
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Voir"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/categories/${category._id}/edit`}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
