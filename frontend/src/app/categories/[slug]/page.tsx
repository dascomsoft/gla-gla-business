'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  ChevronRight,
  Home,
  FolderTree,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  CheckCircle,
  MessageCircle,
  Mail,
  Send,
  Clock,
  SearchX,
  Sparkles,
  Package
} from 'lucide-react'
import ProductGrid from '@/components/products/ProductGrid'
import { categoryService } from '@/services/categoryService'
import { productService } from '@/services/productService'
import { useSettings } from '@/hooks/useSettings'
import { Category, Product } from '@/types'

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { settings } = useSettings()

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await categoryService.getCategories()
        const foundCategory = categories.find((c: Category) => c.slug === slug)
        setCategory(foundCategory || null)

        if (foundCategory) {
          const productsRes = await productService.getProducts({
            category: foundCategory._id,
            limit: 20,
            available: 'true'
          })
          setProducts(productsRes.products || [])
        }
      } catch (error) {
        console.error('Error fetching category:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

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
          <p className="text-sm text-slate-400">Chargement de la categorie...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <FolderTree className="h-10 w-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Categorie non trouvee</h2>
        <p className="text-sm text-slate-500 mb-6">La categorie que vous cherchez n&apos;existe pas ou a ete retiree.</p>
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voir toutes les categories
        </Link>
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
              <pattern id="cat-page-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cat-page-grid)" />
          </svg>
        </div>
        <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-amber-500/5 blur-3xl" />

        <div className="container relative py-10 md:py-14">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/categories" className="hover:text-white transition-colors">
              Categories
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-amber-400 font-medium">{category.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-slate-400 max-w-xl text-sm md:text-base">
                  {category.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2">
              <Package className="h-4 w-4 text-amber-400" />
              <span>
                <span className="text-white font-semibold">{products.length}</span> produit
                {products.length > 1 ? 's' : ''} disponible
                {products.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
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

      {/* Category Header Card */}
      <section className="container mt-8">
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {category.image && (
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-100 flex-shrink-0">
              <Image
                src={category.image}
                alt={category.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Parcourez nos produits {category.name.toLowerCase()}
            </h2>
            <p className="text-sm text-slate-500">
              Tous nos articles sont verifies un par un avant expedition. Paiement a la livraison disponible.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors bg-white border border-slate-200 px-4 py-2 rounded-xl hover:border-amber-200"
          >
            <ShoppingBag className="h-4 w-4" />
            Tous les produits
          </Link>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container py-8 md:py-10">
        {products.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <SearchX className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Aucun produit dans cette categorie
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Cette categorie est vide pour le moment. Decouvrez nos autres produits ou contactez-nous pour une demande specifique.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Voir tous les produits
              </Link>
              <a
                href={`https://wa.me/${settings?.whatsappNumber || '237600000000'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Demander sur WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <ProductGrid products={products} loading={false} />
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-50 py-14">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Votre satisfaction, notre priorite
            </h2>
            <p className="text-slate-500 text-sm">
              Chaque commande est traitee avec soin. De la selection a la livraison, nous veillons a ce que vous receviez exactement ce que vous avez commande.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                color: 'bg-amber-500',
                title: 'Produits verifies',
                desc: 'Chaque article est inspecte avant expedition. Zéro mauvaise surprise a la reception.',
              },
              {
                icon: ShieldCheck,
                color: 'bg-emerald-500',
                title: 'Paiement a la livraison',
                desc: 'Payez uniquement quand vous recevez votre colis. Votre tranquillite d\'esprit avant tout.',
              },
              {
                icon: MessageCircle,
                color: 'bg-rose-500',
                title: 'Conseil personnalise',
                desc: 'Notre equipe vous guide par WhatsApp pour choisir le bon produit dans cette categorie.',
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
              Vous cherchez quelque chose de specifique ?
            </h2>
            <p className="text-slate-400 mb-8 text-sm md:text-base">
              Dites-nous ce dont vous avez besoin sur WhatsApp. Nous vous repondrons en moins de 15 minutes avec les meilleures options disponibles.
            </p>
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '237600000000'}`}
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
              Inscrivez-vous et recevez une alerte des que de nouveaux produits arrivent dans la categorie {category.name.toLowerCase()}.
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