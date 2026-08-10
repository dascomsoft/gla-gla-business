export interface Category {
  _id: string
  name: string
  slug: string
  description: string
  image?: string
  icon?: string
  active: boolean
  order: number
  productCount?: number
}

export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  oldPrice?: number
  images: string[]
  category: string | Category
  brand?: string
  stock: number
  available: boolean
  featured: boolean
  views?: number
  rating?: number
  numReviews?: number
  specifications?: Record<string, string>
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
  discountPercentage?: number
  inStock?: boolean
}

export interface CartItem {
  productId: string
  name: string
  slug: string
  price: number
  quantity: number
  image?: string
  stock: number
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  total: number
}

export interface Order {
  _id?: string
  orderNumber?: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: OrderItem[]
  subtotal?: number
  deliveryFee?: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface Settings {
  _id: string
  whatsappNumber: string
  businessName: string
  businessPhone: string
  businessEmail: string
  businessAddress: string
  businessDescription: string
  currency: string
  currencySymbol?: string
  deliveryInfo: string
  deliveryFee?: number
  freeDeliveryThreshold?: number
  taxRate?: number
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
  }
  seo?: {
    title?: string
    description?: string
    keywords?: string
  }
  maintenance?: {
    enabled: boolean
    message: string
  }
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface Filters {
  search?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  available?: boolean
  featured?: boolean
  sort?: string
}
