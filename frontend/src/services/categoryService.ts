import api from './api'

export interface Category {
  _id: string
  name: string
  slug: string
  description: string
  image?: string
  icon?: string
  active: boolean
  order: number
}

const buildParams = (params: any): any => {
  if (!params || typeof params !== 'object') return {}
  
  const cleaned: any = {}
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      cleaned[key] = value
    }
  })
  
  // Anti-cache
  cleaned._t = Date.now()
  
  return cleaned
}

export const categoryService = {
  getCategories: async (params?: { active?: boolean }): Promise<Category[]> => {
    try {
      const cleanedParams = buildParams(params)
      
      const response = await api.get('/categories', { 
        params: cleanedParams,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      const data = response.data
      
      if (Array.isArray(data)) {
        return data.filter((item): item is Category => 
          item && typeof item === 'object' && item._id && item.name
        )
      }
      
      if (data && typeof data === 'object') {
        if (data.categories && Array.isArray(data.categories)) {
          return data.categories.filter((item: any): item is Category => 
            item && typeof item === 'object' && item._id && item.name
          )
        }
        if (data.data && Array.isArray(data.data)) {
          return data.data.filter((item: any): item is Category => 
            item && typeof item === 'object' && item._id && item.name
          )
        }
        const values = Object.values(data)
        const foundArray = values.find(val => Array.isArray(val))
        if (foundArray) {
          return foundArray.filter((item: any): item is Category => 
            item && typeof item === 'object' && item._id && item.name
          )
        }
      }
      
      return []
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },

  getCategoryById: async (id: string): Promise<Category | null> => {
    try {
      const response = await api.get(`/categories/${id}`, {
        params: { _t: Date.now() },
        headers: { 'Cache-Control': 'no-cache' }
      })
      const data = response.data
      const category = data.category || data
      if (category && typeof category === 'object' && category._id && category.name) {
        return category
      }
      return null
    } catch (error) {
      console.error('Error fetching category:', error)
      return null
    }
  },

  createCategory: async (category: Partial<Category>): Promise<Category | null> => {
    try {
      const response = await api.post('/categories', category)
      const data = response.data
      const newCategory = data.category || data
      if (newCategory && typeof newCategory === 'object' && newCategory._id && newCategory.name) {
        return newCategory
      }
      return null
    } catch (error) {
      console.error('Error creating category:', error)
      return null
    }
  },

  updateCategory: async (id: string, category: Partial<Category>): Promise<Category | null> => {
    try {
      const response = await api.put(`/categories/${id}`, category)
      const data = response.data
      const updatedCategory = data.category || data
      if (updatedCategory && typeof updatedCategory === 'object' && updatedCategory._id && updatedCategory.name) {
        return updatedCategory
      }
      return null
    } catch (error) {
      console.error('Error updating category:', error)
      return null
    }
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/categories/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      return false
    }
  },

  toggleCategoryStatus: async (id: string): Promise<{ active: boolean } | null> => {
    try {
      const response = await api.patch(`/categories/${id}/toggle`)
      const data = response.data
      if (data && typeof data === 'object' && 'active' in data) {
        return { active: data.active }
      }
      return null
    } catch (error) {
      console.error('Error toggling category:', error)
      return null
    }
  }
}
