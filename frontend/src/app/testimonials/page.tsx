'use client'

export const dynamic = 'force-dynamic'

import { Star, User, Quote } from 'lucide-react'

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: 'Marie K.',
      city: 'Yaoundé',
      comment: 'Commande reçue en 24h ! Produit conforme et de qualité. Je recommande vivement.',
      rating: 5,
      product: 'Samsung Galaxy A15'
    },
    {
      name: 'Jean P.',
      city: 'Douala',
      comment: 'Service client exceptionnel. J\'ai eu un souci avec ma livraison, ils ont tout résolu rapidement.',
      rating: 5,
      product: 'Casque Sony'
    },
    {
      name: 'Amina D.',
      city: 'Bafoussam',
      comment: 'La livraison à Bafoussam a été rapide. Les produits sont exactement comme sur les photos.',
      rating: 4,
      product: 'T-shirt Homme'
    },
    {
      name: 'Sylvain M.',
      city: 'Yaoundé',
      comment: 'Excellent rapport qualité-prix. Je suis devenu un client fidèle.',
      rating: 5,
      product: 'Basket Nike'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Ce que disent nos clients</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Découvrez les avis de nos clients satisfaits.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                    <span className="text-sm text-gray-400">• {testimonial.city}</span>
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`h-4 w-4 ${j < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{testimonial.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">Acheté : {testimonial.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container text-center">
          <Quote className="h-8 w-8 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Vous aussi, partagez votre expérience</h2>
          <p className="text-gray-500 mb-6">
            Votre avis nous aide à nous améliorer et à aider d'autres clients.
          </p>
          <a
            href="https://wa.me/237600000000"
            target="_blank"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Laisser un avis
          </a>
        </div>
      </section>
    </div>
  )
}
