'use client'

export const dynamic = 'force-dynamic'

import { ArrowLeftRight, Clock, Package, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ReturnsPage() {
  const steps = [
    {
      icon: Package,
      title: '1. Contactez-nous',
      description: 'Contactez-nous via WhatsApp pour signaler votre retour'
    },
    {
      icon: ArrowLeftRight,
      title: '2. Préparez le retour',
      description: 'Emballez le produit dans son emballage d\'origine'
    },
    {
      icon: Clock,
      title: '3. Attendez le traitement',
      description: 'Nous traitons votre retour sous 48h'
    },
    {
      icon: CheckCircle,
      title: '4. Recevez votre remboursement',
      description: 'Remboursement effectué dans les 48h suivant la réception'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Politique de retours</h1>
          <p className="text-blue-100 max-w-2xl">
            Des retours simples et sans tracas. Votre satisfaction est notre priorité.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <AlertCircle className="h-6 w-6 text-amber-600" />
            <h3 className="font-bold text-amber-800 mt-2">Délai de retour : 7 jours</h3>
            <p className="text-amber-700 text-sm">
              Vous disposez de 7 jours à compter de la réception pour retourner un produit non utilisé.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-8 text-center">Comment retourner un produit ?</h2>
          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="flex items-start gap-6 p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{step.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mt-8 text-center">
            <h3 className="font-bold text-gray-800 mb-2">Vous avez une question ?</h3>
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contactez-nous → 
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
