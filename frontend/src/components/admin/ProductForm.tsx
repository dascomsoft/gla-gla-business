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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
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
        toast.error('Vous devez etre connecte en tant qu\'admin')
        return
      }

      const uploadedImages: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const uploadFormData = new FormData()
        uploadFormData.append('image', file)
        uploadFormData.append('folder', 'products')

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadFormData
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
        setImages(prev => [...prev, ...uploadedImages])
        toast.success(`${uploadedImages.length} image(s) uploadee(s) avec succes`)
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
    setImages(prev => prev.filter((_, i) => i !== index))
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
    setLoading(true)

    try {
      // Nettoyage des donnees avant envoi
      const productData: any = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        brand: formData.brand.trim() || undefined,
        stock: Number(formData.stock),
        available: Boolean(formData.available),
        featured: Boolean(formData.featured),
        images: images.length > 0 ? images : undefined
      }

      // N'envoyer oldPrice que s'il est superieur a 0 et au prix actuel
      const oldPriceNum = Number(formData.oldPrice)
      if (oldPriceNum > 0 && oldPriceNum > productData.price) {
        productData.oldPrice = oldPriceNum
      }

      // N'envoyer specifications que si non vide
      if (formData.specifications && Object.keys(formData.specifications).length > 0) {
        productData.specifications = formData.specifications
      }

      console.log('📤 Donnees envoyees au backend:', productData)

      if (product) {
        await productService.updateProduct(product._id, productData)
        toast.success('Produit mis a jour avec succes')
      } else {
        await productService.createProduct(productData)
        toast.success('Produit cree avec succes')
      }

      router.push('/admin/products')
    } catch (error: any) {
      console.error('❌ Submit error:', error)
      toast.error(error.response?.data?.message || error.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
      <div className="space-y-6">
        {/* Images */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-3">
            Images du produit
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden group border border-slate-100">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center hover:border-amber-400 hover:bg-amber-50/30 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-slate-300" />
                  <span className="text-xs text-slate-400 mt-1">Ajouter</span>
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
          <p className="text-xs text-slate-400 mt-2">
            Formats acceptes: JPG, PNG, GIF, WEBP, SVG (max 5MB)
          </p>
        </div>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Nom du produit *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-colors bg-white"
              required
              placeholder="Ex: Smartphone Pro Max"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-colors bg-slate-50"
              required
              placeholder="smartphone-pro-max"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none resize-none transition-colors"
            required
            placeholder="Decrivez votre produit en detail..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Categorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-colors bg-white"
              required
            >
              <option value="">Selectionner une categorie</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Marque
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-colors"
              placeholder="Ex: Samsung, Apple..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Prix (FCFA) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-colors"
              required
              min="0"
              placeholder="25000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Ancien prix (FCFA)
            </label>
            <input
              type="number"
              name="oldPrice"
              value={formData.oldPrice}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-colors"
              min="0"
              placeholder="35000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-colors"
              required
              min="0"
              placeholder="10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
            />
            <span className="text-sm text-slate-700 font-medium">Disponible</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
            />
            <span className="text-sm text-slate-700 font-medium">Produit vedette</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {product ? 'Mettre a jour' : 'Creer le produit'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
          >
            Annuler
          </button>
        </div>
      </div>
    </form>
  )
}