'use client'

import { Truck, MapPin, Clock, Package, CheckCircle } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

export default function DeliveryPage() {
  const { settings } = useSettings()

  const zones = [
    { city: 'Yaoundé', delay: '24h', price: 'Gratuit' },
    { city: 'Douala', delay: '24-48h', price: 'Gratuit' },
    { city: 'Bafoussam', delay: '48-72h', price: '2 500 FCFA' },
    { city: 'Garoua', delay: '3-5 jours', price: '3 500 FCFA' },
    { city: 'Maroua', delay: '3-5 jours', price: '4 000 FCFA' },
    { city: 'Ngaoundéré', delay: '3-5 jours', price: '3 500 FCFA' },
    { city: 'Bertoua', delay: '3-5 jours', price: '3 000 FCFA' },
    { city: 'Buea', delay: '48-72h', price: '3 000 FCFA' },
    { city: 'Kribi', delay: '48-72h', price: '3 000 FCFA' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Livraison</h1>
          <p className="text-blue-100 max-w-2xl">
            {settings?.deliveryInfo || 'Livraison disponible sur Yaoundé et Douala'}
          </p>
        </div>
      </section>

      {/* Info */}
      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Truck, label: 'Livraison rapide', value: '24-48h' },
            { icon: MapPin, label: 'Zones couvertes', value: 'Cameroun' },
            { icon: Clock, label: 'Préparation', value: 'Sous 24h' },
            { icon: Package, label: 'Suivi commande', value: 'Disponible' }
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 text-center border">
                <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-sm text-gray-500">{item.label}</div>
                <div className="font-bold text-gray-800">{item.value}</div>
              </div>
            )
          })}
        </div>

        {/* Zones */}
        <h2 className="text-2xl font-bold text-center mb-8">Zones de livraison</h2>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Délai</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {zones.map((zone, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{zone.city}</td>
                  <td className="px-6 py-4 text-gray-600">{zone.delay}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${zone.price === 'Gratuit' ? 'text-green-600' : 'text-gray-800'}`}>
                      {zone.price}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Process */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Comment se passe la livraison ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: 1, title: 'Commande', desc: 'Validez votre commande sur le site' },
              { step: 2, title: 'Préparation', desc: 'Nous préparons votre colis sous 24h' },
              { step: 3, title: 'Livraison', desc: 'Receptionnez votre colis en main propre' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{item.step}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
