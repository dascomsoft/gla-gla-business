'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  FolderTree,
  ArrowRight,
  ChevronRight,
  Home,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  CheckCircle,
  MessageCircle,
  Mail,
  Send,
  Clock,
  Sparkles,
  SearchX
} from 'lucide-react'
import { categoryService } from '@/services/categoryService'
import { Category } from '@/types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories({ active: true })
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
          <p className="text-sm text-slate-400">Chargement des categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="cat-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cat-grid)" />
          </svg>
        </div>
        <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-amber-500/5 blur-3xl" />

        <div className="container relative py-10 md:py-14">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-amber-400 font-medium">Categories</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Explorez nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">categories</span>
          </h1>
          <p className="text-slate-400 max-w-xl">
            {categories.length > 0
              ? `${categories.length} categories soigneusement selectionnees pour vous. Trouvez exactement ce que vous cherchez.`
              : 'Parcourez notre catalogue et decouvrez des produits de qualite au meilleur prix.'}
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="container -mt-5 relative z-10">
        <div className="bg-white rounded-xl shadow-lg shadow-slate-900/5 border border-slate-100 p-4 flex flex-wrap items-center justify-center md:justify-between gap-3">
          {[
            { icon: Truck, text: 'Livraison 24-48h' },
            { icon: ShieldCheck, text: 'Paiement securise' },
            { icon: Headphones, text: 'Support WhatsApp' },
            { icon: CheckCircle, text: 'Garantie qualite' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-slate-600">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-4 w-4 text-amber-600" />
              </div>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container py-10 md:py-14">
        {categories.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <SearchX className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Aucune categorie disponible</h3>
            <p className="text-sm text-slate-500 mb-6">Revenez bientot, de nouvelles categories arrivent.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Voir tous les produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <FolderTree className="h-10 w-10 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-flex items-center gap-1 text-white text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      Voir les produits
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors text-base">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {category.productCount || 'Plusieurs'} produits
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center transition-colors">
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Pourquoi acheter par categorie ?
            </h2>
            <p className="text-slate-500 text-sm">
              Chaque categorie est soigneusement organisee pour vous faire gagner du temps et trouver le bon produit plus vite.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                color: 'bg-amber-500',
                title: 'Selection qualite',
                desc: 'Chaque produit est verifie avant d\'etre mis en ligne. Zéro mauvaise surprise.',
              },
              {
                icon: ShieldCheck,
                color: 'bg-emerald-500',
                title: 'Paiement a la livraison',
                desc: 'Payez uniquement quand vous recevez votre colis. Aucun risque pris.',
              },
              {
                icon: MessageCircle,
                color: 'bg-rose-500',
                title: 'Conseil personnalise',
                desc: 'Hesitez entre deux categories ? Notre equipe vous guide par WhatsApp.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="container py-8 md:py-12">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="relative max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <MessageCircle className="h-7 w-7 text-emerald-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Vous ne trouvez pas votre categorie ?
            </h2>
            <p className="text-slate-400 mb-8 text-sm md:text-base">
              Contactez-nous sur WhatsApp et nous vous aiderons a trouver exactement ce dont vous avez besoin. Reponse garantie sous 15 minutes.
            </p>
            <a
              href="https://wa.me/237600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle className="h-5 w-5" />
              Discuter sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container pb-16">
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="relative max-w-xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-5">
              <Mail className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-sm text-slate-300">Ne ratez aucune nouveaute</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Soyez le premier informe
            </h2>
            <p className="text-slate-400 mb-8 text-sm md:text-base">
              Inscrivez-vous et recevez une alerte des qu&apos;une nouvelle categorie ou de nouveaux produits arrivent.
            </p>

            {subscribed ? (
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl py-4 px-6 inline-flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Merci ! Vous etes inscrit.</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 outline-none focus:border-amber-400/50 transition-colors text-sm"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="h-4 w-4" />
                  S&apos;inscrire
                </button>
              </form>
            )}

            <p className="text-slate-600 text-xs mt-4 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              +500 personnes inscrites cette semaine. Aucun spam, promis.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}