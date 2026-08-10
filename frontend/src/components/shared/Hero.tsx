import Link from 'next/link'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

interface HeroProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
}

export default function Hero({ 
  title, 
  subtitle, 
  ctaText = 'Découvrir nos produits',
  ctaLink = '/products'
}: HeroProps) {
  const { settings } = useSettings()

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/pattern.png')] bg-repeat"></div>
      </div>
      <div className="container relative py-20 md:py-28">
        <div className="max-w-3xl" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {title || `Bienvenue chez ${settings?.businessName || 'GLA GLA Business'}`}
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            {subtitle || 'Découvrez notre sélection de produits de qualité au meilleur prix.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={ctaLink}
              className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center bg-white/10 hover:bg-white/20 border border-white/30 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Parcourir les catégories
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 50L60 55C120 60 240 70 360 65C480 60 600 40 720 35C840 30 960 40 1080 45C1200 50 1320 55 1380 57.5L1440 60V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}