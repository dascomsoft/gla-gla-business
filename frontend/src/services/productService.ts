import api from './api'
import { Product } from '@/types'

export interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Nettoie les params vides et ajoute l'anti-cache
const buildParams = (params: any): any => {
  if (!params || typeof params !== 'object') return {}
  
  const cleaned: any = {}
  
  // Nettoyer les params vides
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      cleaned[key] = value
    }
  })
  
  // 🚨 ANTI-CACHE : ajoute un timestamp unique à chaque requête
  // Cela force le navigateur à NE PAS utiliser sa version en cache
  cleaned._t = Date.now()
  
  return cleaned
}

export const productService = {
  getProducts: async (params?: any): Promise<ProductsResponse> => {
    try {
      const cleanedParams = buildParams(params)
      
      console.log('📤 GET /products', cleanedParams)

      const { data } = await api.get('/products', { 
        params: cleanedParams,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      let products: Product[] = []
      let pagination = { page: 1, limit: 12, total: 0, pages: 1 }

      if (data && typeof data === 'object') {
        if (Array.isArray(data.products)) {
          products = data.products
        } else if (Array.isArray(data.data)) {
          products = data.data
        } else if (Array.isArray(data)) {
          products = data
        }
        if (data.pagination) pagination = data.pagination
      }

      console.log(`✅ ${products.length} produits recus`)
      return { products, pagination }
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      return { products: [], pagination: { page: 1, limit: 12, total: 0, pages: 1 } }
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const { data } = await api.get(`/products/${id}`, {
        params: { _t: Date.now() },
        headers: { 
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      return data.product || data || null
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const { data } = await api.get(`/products/slug/${slug}`, {
        params: { _t: Date.now() },
        headers: { 
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      return data.product || data || null
    } catch (error) {
      console.error('Error fetching product by slug:', error)
      return null
    }
  },

  createProduct: async (product: Partial<Product>): Promise<Product | null> => {
    try {
      const { data } = await api.post('/products', product)
      console.log('✅ Product created:', data)
      return data.product || data || null
    } catch (error) {
      console.error('❌ Error creating product:', error)
      return null
    }
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<Product | null> => {
    try {
      const { data } = await api.put(`/products/${id}`, product)
      return data.product || data || null
    } catch (error) {
      console.error('Error updating product:', error)
      return null
    }
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/products/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      return false
    }
  },

  toggleProductAvailability: async (id: string): Promise<{ available: boolean } | null> => {
    try {
      const { data } = await api.patch(`/products/${id}/toggle`)
      return data
    } catch (error) {
      console.error('Error toggling product:', error)
      return null
    }
  }
}
