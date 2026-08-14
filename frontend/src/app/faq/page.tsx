'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useSettings } from '@/hooks/useSettings'

export default function FAQPage() {
  const { settings } = useSettings()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const faqs = [
    {
      category: 'Commandes',
      q: 'Comment passer une commande ?',
      a: 'Sélectionnez vos produits, ajoutez-les au panier, puis cliquez sur "Commander via WhatsApp". Un message automatisé sera généré avec le détail de votre commande.'
    },
    {
      category: 'Commandes',
      q: 'Puis-je modifier ma commande après validation ?',
      a: 'Oui, contactez-nous rapidement via WhatsApp avec votre numéro de commande. Nous ferons de notre mieux pour modifier votre commande avant expédition.'
    },
    {
      category: 'Paiement',
      q: 'Quels sont les modes de paiement acceptés ?',
      a: 'Nous acceptons le paiement à la livraison (cash), Orange Money, MTN Mobile Money et le virement bancaire. Un paiement sécurisé et flexible pour votre confort.'
    },
    {
      category: 'Paiement',
      q: 'Le paiement en ligne est-il sécurisé ?',
      a: 'Actuellement, nous privilégions le paiement à la livraison. Cela vous permet de vérifier vos produits avant de payer, pour une tranquillité d\'esprit totale.'
    },
    {
      category: 'Livraison',
      q: 'Quels sont les délais de livraison ?',
      a: 'Livraison sous 24-48h à Yaoundé et Douala. Pour les autres villes du Cameroun, comptez 3-5 jours ouvrés. Des délais supplémentaires peuvent s\'appliquer en période de forte affluence.'
    },
    {
      category: 'Livraison',
      q: 'Y a-t-il des frais de livraison ?',
      a: 'La livraison est gratuite pour toute commande à Yaoundé et Douala. Pour les autres villes, les frais sont calculés en fonction de la localisation.'
    },
    {
      category: 'Retours',
      q: 'Puis-je retourner un produit ?',
      a: 'Oui, vous disposez de 7 jours après réception pour retourner un produit non utilisé, dans son emballage d\'origine. Contactez-nous pour organiser le retour.'
    },
    {
      category: 'Retours',
      q: 'Comment se passe le remboursement ?',
      a: 'Le remboursement est effectué dans les 48h suivant la réception du produit retourné, sur le mode de paiement initial.'
    },
    {
      category: 'Service client',
      q: 'Comment contacter le service client ?',
      a: 'Par WhatsApp au +237 600 000 000 (réponse sous 15 min) ou par email à contact@glagla.com. Notre équipe est disponible du lundi au samedi de 8h à 19h.'
    },
    {
      category: 'Service client',
      q: 'Que faire si je reçois un produit défectueux ?',
      a: 'Contactez-nous immédiatement avec une photo du produit. Nous organiserons l\'échange ou le remboursement dans les meilleurs délais.'
    }
  ]

  const filteredFaqs = searchTerm
    ? faqs.filter(faq => 
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqs

  const categories = [...new Set(faqs.map(f => f.category))]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Foire Aux Questions</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Trouvez rapidement des réponses à vos questions. Si vous ne trouvez pas, contactez-nous.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="container -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Rechercher dans les FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSearchTerm('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !searchTerm ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Toutes
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSearchTerm(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                searchTerm === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ List */}
      <section className="container py-8 max-w-3xl">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune question trouvée pour "{searchTerm}"</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <div>
                      <span className="text-xs text-blue-600 font-medium">{faq.category}</span>
                      <span className="block font-semibold text-gray-800 mt-1">{faq.q}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Contact CTA */}
      <section className="container py-12">
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Vous ne trouvez pas votre réponse ?</h3>
          <p className="text-gray-500 mb-6">
            Contactez-nous directement, nous vous répondons sous 15 minutes.
          </p>
          <a
            href={`https://wa.me/${settings?.whatsappNumber || '237600000000'}`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Nous contacter sur WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
