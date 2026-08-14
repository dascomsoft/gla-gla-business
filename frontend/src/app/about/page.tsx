'use client'

export const dynamic = 'force-dynamic'

import { useSettings } from '@/hooks/useSettings'
import {
  Users,
  Award,
  Truck,
  Shield,
  Heart,
  Star,
  Clock,
  ThumbsUp,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageCircle,
  MapPin,
  PackageCheck,
  Headphones,
  BadgeCheck,
  Quote,
  Home,
  Smartphone,
  Shirt,
} from 'lucide-react'
import Link from 'next/link'

/* =========================================================
   SOUS-COMPOSANTS RÉUTILISABLES
========================================================= */

function SectionHeader({
  label,
  title,
  description,
  dark = false,
}: {
  label: string
  title: string
  description?: string
  dark?: boolean
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span
        className={`text-sm font-bold uppercase tracking-widest ${
          dark ? 'text-yellow-400' : 'text-blue-600'
        }`}
      >
        {label}
      </span>
      <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{title}</h2>
      {description && (
        <p className={`mt-4 ${dark ? 'text-slate-400' : 'text-slate-400'}`}>
          {description}
        </p>
      )}
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="group rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-600">
        <Icon className="h-7 w-7 text-blue-600 transition-colors group-hover:text-white" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-slate-100">{title}</h3>
      <p className="mt-3 leading-7 text-slate-400">{description}</p>
      <div className="mt-6 h-1 w-12 rounded-full bg-blue-600 transition-all group-hover:w-20" />
    </div>
  )
}

/* =========================================================
   PAGE PRINCIPALE
========================================================= */

export default function AboutPage() {
  const { settings } = useSettings()

  const businessName = settings?.businessName || 'GLA GLA Business'
  const businessDescription =
    settings?.businessDescription || 'Votre boutique en ligne au Cameroun'

  const stats = [
    {
      icon: Users,
      value: '500+',
      label: 'Clients satisfaits',
      description: 'Une communauté qui nous fait confiance',
    },
    {
      icon: Award,
      value: '1000+',
      label: 'Produits vendus',
      description: 'Des commandes traitées avec soin',
    },
    {
      icon: Truck,
      value: '24h',
      label: 'Livraison rapide',
      description: 'Une livraison pensée pour votre confort',
    },
    {
      icon: Shield,
      value: '100%',
      label: 'Satisfaction',
      description: 'Votre satisfaction reste notre priorité',
    },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description:
        'Nous aimons ce que nous faisons et cela se ressent dans chaque produit et chaque interaction.',
    },
    {
      icon: Star,
      title: 'Qualité',
      description:
        'Nous sélectionnons avec attention les produits proposés afin de vous offrir le meilleur.',
    },
    {
      icon: Clock,
      title: 'Fiabilité',
      description:
        'Nous faisons notre maximum pour respecter nos engagements et vos délais.',
    },
    {
      icon: ThumbsUp,
      title: 'Service',
      description:
        'Une équipe disponible pour vous accompagner avant, pendant et après votre commande.',
    },
  ]

  const advantages = [
    {
      icon: BadgeCheck,
      title: 'Produits sélectionnés',
      description:
        'Nous privilégions des produits répondant à nos critères de qualité et de fiabilité.',
    },
    {
      icon: PackageCheck,
      title: 'Commandes suivies',
      description:
        'Chaque commande est traitée avec attention afin de vous offrir une expérience simple.',
    },
    {
      icon: Headphones,
      title: 'Accompagnement humain',
      description:
        'Une équipe à votre écoute pour répondre à vos questions et vous guider.',
    },
  ]

  const timeline = [
    {
      year: '2024',
      title: 'La naissance de GLA GLA Business',
      description:
        'Lancement de notre aventure avec une ambition simple : rendre le shopping en ligne plus accessible au Cameroun.',
    },
    {
      year: '2025',
      title: 'Une communauté grandissante',
      description:
        'Développement de notre catalogue et création de relations durables avec nos clients et partenaires.',
    },
    {
      year: 'Aujourd’hui',
      title: 'Une expérience toujours meilleure',
      description:
        'Nous continuons à améliorer notre catalogue, notre service et notre expérience digitale.',
    },
  ]

  const categories = [
    {
      icon: Home,
      title: 'Électroménager',
      description: 'Des équipements pour votre maison',
    },
    {
      icon: Smartphone,
      title: 'Téléphones & Tech',
      description: 'Les essentiels du quotidien',
    },
    {
      icon: Shirt,
      title: 'Mode',
      description: 'Pour hommes, femmes et enfants',
    },
    {
      icon: Sparkles,
      title: 'Cosmétiques',
      description: 'Beauté et soins au quotidien',
    },
  ]

  const testimonials = [
    {
      name: 'Client satisfait',
      text: 'Une expérience simple et agréable. La commande a été traitée rapidement.',
      rating: 5,
    },
    {
      name: 'Client fidèle',
      text: 'J’apprécie surtout la disponibilité et la qualité du service.',
      rating: 5,
    },
    {
      name: 'Client GLA GLA',
      text: 'Une boutique pratique avec des produits intéressants et un bon accompagnement.',
      rating: 5,
    },
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>
        </div>

        <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm mb-6">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              Votre shopping, autrement
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Bienvenue chez{' '}
              <span className="text-yellow-300">{businessName}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100 md:text-xl">
              {businessDescription}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-3.5 font-bold text-blue-950 shadow-lg shadow-black/10 transition-all hover:bg-yellow-300 hover:-translate-y-0.5"
              >
                Découvrir nos produits
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <MessageCircle className="h-5 w-5" />
                Nous contacter
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-300" />
                Produits sélectionnés
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-300" />
                Livraison au Cameroun
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-300" />
                Service client disponible
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}
      <section className="relative z-10 -mt-10 px-4">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-700 bg-slate-800 p-5 shadow-2xl shadow-blue-900/10 md:p-7">
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-700 md:grid-cols-4 md:divide-y-0">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="group p-4 text-center transition-transform hover:-translate-y-1 md:p-6"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition-all group-hover:bg-blue-600">
                    <Icon className="h-7 w-7 text-blue-600 transition-colors group-hover:text-white" />
                  </div>
                  <div className="text-2xl font-extrabold text-white md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 font-semibold text-slate-200">
                    {stat.label}
                  </div>
                  <p className="mt-2 hidden text-xs leading-5 text-slate-400 md:block">
                    {stat.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          NOTRE HISTOIRE
      ========================================================= */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visual */}
          <div className="relative">
            <div className="absolute -left-5 -top-5 h-24 w-24 rounded-3xl bg-yellow-400/20" />
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-900 p-8 shadow-2xl md:p-12">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl">
                  <ShoppingBag className="h-10 w-10 text-blue-600" />
                </div>
                <div className="text-sm font-semibold uppercase tracking-widest text-blue-200">
                  Depuis 2024
                </div>
                <h2 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
                  Construire une meilleure expérience shopping.
                </h2>
                <p className="mt-5 leading-7 text-blue-100">
                  Une vision locale, une ambition moderne et surtout une
                  volonté de placer le client au centre de chaque décision.
                </p>
                <div className="mt-8 flex items-center gap-3 text-sm font-medium text-white">
                  <MapPin className="h-5 w-5 text-yellow-300" />
                  Yaoundé, Cameroun
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-4 rounded-2xl bg-slate-800 p-5 shadow-xl md:right-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">
                    Notre engagement
                  </p>
                  <p className="text-xs text-slate-400">
                    Votre satisfaction d'abord
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Notre histoire
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-100 md:text-4xl">
              Une entreprise pensée pour les besoins du quotidien.
            </h2>
            <div className="mt-7 space-y-5 text-slate-400">
              <p className="leading-8">
                <strong className="text-slate-100">{businessName}</strong>{' '}
                est né en 2024 de la volonté de proposer des produits de
                qualité au meilleur prix au Cameroun.
              </p>
              <p className="leading-8">
                Notre objectif est simple : rendre le shopping en ligne
                accessible, fiable et agréable pour tous.
              </p>
              <p className="leading-8">
                Basés à Yaoundé, nous développons progressivement un réseau
                de partenaires afin de proposer une gamme variée de produits,
                des électroménagers aux vêtements, en passant par les
                cosmétiques et l'électronique.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-100">
                  Une relation basée sur la confiance
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Nous voulons construire des relations durables avec chacun
                  de nos clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          POURQUOI NOUS CHOISIR
      ========================================================= */}
      <section className="bg-slate-900 py-20 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Pourquoi nous choisir ?"
            title="Plus qu'une boutique, un service pensé pour vous."
            description="Chaque détail compte lorsqu'il s'agit de votre expérience d'achat."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {advantages.map((item, index) => (
              <FeatureCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CATEGORIES
      ========================================================= */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Notre univers
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-100 md:text-4xl">
              Tout ce dont vous avez besoin.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-400">
              Découvrez nos différents univers et trouvez facilement les
              produits qui correspondent à votre quotidien.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-400"
          >
            Voir le catalogue
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Link
                href="/products"
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-800 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-500/10 transition-transform duration-500 group-hover:scale-150" />
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-slate-100">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {category.description}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-500">
                    Découvrir
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* =========================================================
          NOS VALEURS
      ========================================================= */}
      <section className="bg-slate-950 py-20 text-white md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Ce qui nous définit"
            title="Nos valeurs"
            description="Les principes qui guident notre manière de travailler chaque jour."
            dark
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.08]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          TIMELINE
      ========================================================= */}
      <section className="container mx-auto px-4 py-20 md:py-24">
        <SectionHeader
          label="Notre évolution"
          title="Une histoire qui continue de s'écrire."
        />
        <div className="mx-auto mt-14 max-w-4xl">
          {timeline.map((item, index) => (
            <div key={index} className="relative flex gap-6 pb-12 last:pb-0">
              {index !== timeline.length - 1 && (
                <div className="absolute left-6 top-12 h-full w-px bg-slate-700" />
              )}
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-600/20">
                {index + 1}
              </div>
              <div className="pt-1">
                <span className="text-sm font-bold text-blue-600">
                  {item.year}
                </span>
                <h3 className="mt-1 text-xl font-bold text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-2xl leading-7 text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          AVIS CLIENTS
      ========================================================= */}
      <section className="bg-slate-900 py-20 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Ils nous font confiance"
            title="L'expérience de nos clients compte."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-3xl bg-slate-800 p-7 shadow-sm"
              >
                <Quote className="h-8 w-8 text-blue-500/40" />
                <div className="mt-5 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map(
                    (_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    )
                  )}
                </div>
                <p className="mt-5 leading-7 text-slate-300">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-200">
                    {testimonial.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 px-6 py-16 text-center text-white md:px-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <ShoppingBag className="h-8 w-8 text-yellow-300" />
            </div>
            <h2 className="mt-7 text-3xl font-extrabold md:text-5xl">
              Prêt à découvrir votre prochain coup de cœur ?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Parcourez notre catalogue et découvrez les produits sélectionnés
              pour vous.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-8 py-4 font-bold text-blue-950 transition-all hover:bg-yellow-300 hover:-translate-y-0.5"
              >
                Commencer mes achats
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <MessageCircle className="h-5 w-5" />
                Besoin d'aide ?
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}