import api from './api'

export interface Settings {
  _id: string
  whatsappNumber: string
  businessName: string
  businessPhone: string
  businessEmail: string
  businessAddress: string
  businessDescription: string
  currency: string
  deliveryInfo: string
}

export const settingsService = {
  getSettings: async (): Promise<Settings> => {
    const { data } = await api.get('/settings')
    return data
  },

  updateSettings: async (settings: Partial<Settings>): Promise<Settings> => {
    const { data } = await api.put('/settings', settings)
    return data
  }
}