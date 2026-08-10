'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import { categoryService } from '@/services/categoryService'
import { Category } from '@/types'
import toast from 'react-hot-toast'

export default function CreateProduct() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Erreur lors du chargement des catégories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ajouter un produit</h1>
      <ProductForm categories={categories} />
    </div>
  )
}