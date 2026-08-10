'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { Product, Category } from '@/types'
import toast from 'react-hot-toast'

export default function EditProduct() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoriesData] = await Promise.all([
          productService.getProductById(id),
          categoryService.getCategories()
        ])
        
        // S'assurer que productData est bien un objet Product
        if (productData) {
          setProduct(productData)
        } else {
          toast.error('Produit non trouvé')
          router.push('/admin/products')
        }
        
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Erreur lors du chargement des données')
        router.push('/admin/products')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Produit non trouvé</p>
        <button
          onClick={() => router.push('/admin/products')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Retour à la liste
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Modifier le produit</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}
