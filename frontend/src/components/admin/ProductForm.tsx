'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Upload, 
  X, 
  Plus, 
  Trash2,
  Loader2
} from 'lucide-react'
import { productService } from '@/services/productService'
import { Category } from '@/types'
import toast from 'react-hot-toast'

interface ProductFormProps {
  product?: any
  categories: Category[]
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    oldPrice: product?.oldPrice || '',
    category: product?.category?._id || '',
    brand: product?.brand || '',
    stock: product?.stock || '',
    available: product?.available !== undefined ? product.available : true,
    featured: product?.featured || false,
    specifications: product?.specifications || {}
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères'
    }
    
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères'
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0'
    }
    
    if (!formData.category) {
      newErrors.category = 'Veuillez sélectionner une catégorie'
    }
    
    if (!formData.stock || Number(formData.stock) < 0) {
      newErrors.stock = 'Le stock ne peut pas être négatif'
    }
    
    if (images.length === 0) {
      newErrors.images = 'Veuillez ajouter au moins une image'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    // Effacer l'erreur du champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    try {
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'admin')
        return
      }

      const uploadedImages = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('image', file)
        formData.append('folder', 'products')

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Upload failed')
        }

        const data = await response.json()
        
        if (data.success && data.image) {
          uploadedImages.push(data.image)
        }
      }

      if (uploadedImages.length > 0) {
        setImages([...images, ...uploadedImages])
        toast.success(`${uploadedImages.length} image(s) uploadée(s) avec succès`)
        // Effacer l'erreur d'images
        if (errors.images) {
          setErrors(prev => ({ ...prev, images: '' }))
        }
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Erreur lors de l\'upload des images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation avant soumission
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire')
      return
    }
    
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        stock: Number(formData.stock),
        images
      }

      if (product) {
        await productService.updateProduct(product._id, productData)
        toast.success('Produit mis à jour avec succès')
      } else {
        await productService.createProduct(productData)
        toast.success('Produit créé avec succès')
      }

      router.push('/admin/products')
    } catch (error: any) {
      console.error('Submit error:', error)
      const errorMsg = error.response?.data?.message || 'Erreur lors de l\'enregistrement'
      toast.error(errorMsg)
      
      // Si l'erreur est une validation MongoDB, afficher le détail
      if (error.response?.data?.errors) {
        const fieldErrors = error.response.data.errors
        const newErrors: Record<string, string> = {}
        fieldErrors.forEach((err: any) => {
          newErrors[err.path] = err.message
        })
        setErrors(newErrors)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
      <div className="space-y-6">
        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images du produit *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Ajouter</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          {errors.images && (
            <p className="text-xs text-red-500 mt-1">{errors.images}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Formats acceptés: JPG, PNG, GIF, WEBP, SVG (max 5MB)
          </p>
        </div>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du produit *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description * (minimum 10 caractères)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            minLength={10}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {formData.description.length}/10 caractères minimum
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marque
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix (FCFA) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min="0"
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ancien prix (FCFA)
            </label>
            <input
              type="number"
              name="oldPrice"
              value={formData.oldPrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min="0"
            />
            {errors.stock && (
              <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Disponible</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Produit vedette</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {product ? 'Mettre à jour' : 'Créer le produit'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </form>
  )
}
