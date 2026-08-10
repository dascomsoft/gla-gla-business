'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const { settings } = useSettings()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    
    // Simuler l'envoi (à remplacer par un vrai service d'email)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Message envoyé avec succès !')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Contactez-nous
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {settings?.businessName || 'GLA GLA Business'}
            </h2>
            <p className="text-gray-600 mb-6">
              {settings?.businessDescription || 'Votre boutique en ligne au Cameroun'}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Téléphone</p>
                  <p className="text-gray-600">{settings?.businessPhone || '+237 600 000 000'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Email</p>
                  <p className="text-gray-600">{settings?.businessEmail || 'contact@glagla.com'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Adresse</p>
                  <p className="text-gray-600">{settings?.businessAddress || 'Yaoundé, Cameroun'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Horaires</p>
                  <p className="text-gray-600">Lun - Sam: 8h - 19h</p>
                </div>
              </div>
            </div>

            {settings?.deliveryInfo && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">{settings.deliveryInfo}</p>
              </div>
            )}

            <a
              href={`https://wa.me/${settings?.whatsappNumber || '237600000000'}`}
              target="_blank"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
            >
              <Phone className="h-5 w-5" />
              Nous contacter sur WhatsApp
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Envoyer un message</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                {sending ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}