'use client'

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, Phone, Mail, MapPin, Store } from 'lucide-react'
import { settingsService } from '@/services/settingsService'
import { Settings } from '@/types'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings()
        setSettings(data)
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast.error('Erreur lors du chargement des paramètres')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    setSaving(true)
    try {
      await settingsService.updateSettings(settings)
      toast.success('Paramètres mis à jour avec succès')
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Erreur lors de la mise à jour des paramètres')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof Settings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Store className="h-4 w-4 inline mr-1" />
              Nom de l'entreprise
            </label>
            <input
              type="text"
              value={settings?.businessName || ''}
              onChange={(e) => handleChange('businessName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="h-4 w-4 inline mr-1" />
              Numéro WhatsApp
            </label>
            <input
              type="text"
              value={settings?.whatsappNumber || ''}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              placeholder="237600000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-sm text-gray-400 mt-1">Format: 237XXXXXXXXX</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="h-4 w-4 inline mr-1" />
              Téléphone
            </label>
            <input
              type="text"
              value={settings?.businessPhone || ''}
              onChange={(e) => handleChange('businessPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="h-4 w-4 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={settings?.businessEmail || ''}
              onChange={(e) => handleChange('businessEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="h-4 w-4 inline mr-1" />
              Adresse
            </label>
            <input
              type="text"
              value={settings?.businessAddress || ''}
              onChange={(e) => handleChange('businessAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={settings?.businessDescription || ''}
              onChange={(e) => handleChange('businessDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Devise
            </label>
            <input
              type="text"
              value={settings?.currency || 'FCFA'}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Informations de livraison
            </label>
            <textarea
              value={settings?.deliveryInfo || ''}
              onChange={(e) => handleChange('deliveryInfo', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Livraison disponible sur Yaoundé et Douala"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
          </button>
        </div>
      </form>
    </div>
  )
}