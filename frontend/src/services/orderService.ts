import api from './api'

export interface Order {
  _id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
  }>
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrdersResponse {
  orders: Order[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export const orderService = {
  getOrders: async (params?: any): Promise<OrdersResponse> => {
    const { data } = await api.get('/orders', { params })
    return data
  },

  getOrderById: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`)
    return data
  },

  createOrder: async (order: Partial<Order>): Promise<Order> => {
    const { data } = await api.post('/orders', order)
    return data
  },

  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}/status`, { status })
    return data
  }
}