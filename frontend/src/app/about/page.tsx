'use client'

import { useSettings } from '@/hooks/useSettings'
import { Users, Award, Truck, Shield, Heart, Star, Clock, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  const { settings } = useSettings()

  const stats = [
    { icon: Users, value: '500+', label: 'Clients satisfaits' },
    { icon: Award, value: '1000+', label: 'Produits vendus' },
    { icon: Truck, value: '24h', label: 'Livraison rapide' },
    { icon: Shield, value: '100%', label: 'Satisfaction garantie' }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'Nous aimons ce que nous faisons et cela se ressent dans chaque produit'
    },
    {
      icon: Star,
      title: 'Qualité',
      description: 'Des produits rigoureusement sélectionnés pour vous'
    },
    {
      icon: Clock,
      title: 'Fiabilité',
      description: 'Votre commande livrée dans les délais, comme promis'
    },
    {
      icon: ThumbsUp,
      title: 'Service',
      description: 'Une équipe dédiée à votre satisfaction'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/pattern.png')] bg-repeat"></div>
        </div>
        <div className="container relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            À propos de{' '}
            <span className="text-yellow-400">{settings?.businessName || 'GLA GLA Business'}</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            {settings?.businessDescription || 'Votre boutique en ligne au Cameroun'}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="container -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Notre Histoire</h2>
        <div className="max-w-3xl mx-auto prose prose-lg">
          <p className="text-gray-600 leading-relaxed">
            {settings?.businessName || 'GLA GLA Business'} est né en 2024 de la volonté de proposer 
            des produits de qualité au meilleur prix au Cameroun. Notre objectif : rendre le shopping 
            en ligne accessible, fiable et agréable pour tous.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Basés à Yaoundé, nous avons développé un réseau de partenaires pour vous offrir 
            une large gamme de produits, des électroménagers aux vêtements, en passant par 
            les cosmétiques et l&apos;électronique.
          </p>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-500 text-sm">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Prêt à découvrir nos produits ?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Parcourez notre catalogue et trouvez les produits qui vous correspondent.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Découvrir nos produits
          </Link>
        </div>
      </section>
    </div>
  )
}
