'use client'

export const dynamic = 'force-dynamic'

import { CreditCard, Smartphone, Banknote, Shield, CheckCircle } from 'lucide-react'

export default function PaymentPage() {
  const methods = [
    {
      icon: Banknote,
      title: 'Paiement à la livraison',
      description: 'Payez en espèces à la réception de votre colis',
      details: 'Disponible pour toutes les commandes'
    },
    {
      icon: Smartphone,
      title: 'Orange Money',
      description: 'Payez via votre compte Orange Money',
      details: 'Frais de transaction inclus'
    },
    {
      icon: Smartphone,
      title: 'MTN Mobile Money',
      description: 'Payez via votre compte MTN MoMo',
      details: 'Frais de transaction inclus'
    },
    {
      icon: CreditCard,
      title: 'Virement bancaire',
      description: 'Virement vers notre compte bancaire',
      details: 'Délai de 24-48h'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Modes de paiement</h1>
          <p className="text-blue-100 max-w-2xl">
            Des solutions de paiement flexibles et sécurisées pour votre confort.
          </p>
        </div>
      </section>

      {/* Methods */}
      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methods.map((method, i) => {
            const Icon = method.icon
            return (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{method.title}</h3>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                    <p className="text-gray-400 text-xs mt-2">{method.details}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Security */}
      <section className="bg-gray-50 py-12">
        <div className="container text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Paiement sécurisé</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Toutes vos transactions sont sécurisées. Pour votre tranquillité,
            nous privilégions le paiement à la livraison.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {['Orange Money', 'MTN MoMo', 'Cash', 'Virement'].map((label) => (
              <span key={label} className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
