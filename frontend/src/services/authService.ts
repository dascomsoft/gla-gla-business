import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  admin: {
    id: string
    name: string
    email: string
    role: string
  }
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', credentials)
    return data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  getMe: async (): Promise<any> => {
    const { data } = await api.get('/auth/me')
    return data
  }
}