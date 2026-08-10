import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Anti-cache par défaut
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Ajouter un timestamp pour éviter le cache si ce n'est pas déjà fait
  if (config.method === 'get' && !config.params?.hasOwnProperty('_t')) {
    config.params = {
      ...config.params,
      _t: Date.now()
    }
  }
  
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => {
    // Log pour debug
    console.log(`📡 ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminData')
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }
    console.error('❌ API Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export default api
