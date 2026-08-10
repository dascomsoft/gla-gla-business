'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingBag,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle,
  Truck,
  ShieldCheck,
  Headphones,
  Star,
  MessageCircle,
  Zap,
  Heart,
  Share2,
  Package,
  RotateCcw,
  ChevronRight,
  Home
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { productService } from '@/services/productService'
import { Product } from '@/types'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [liked, setLiked] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductBySlug(slug)
        if (data) {
          setProduct(data)
        } else {
          console.error('Product not found')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price || 0,
      quantity: quantity,
      image: product.images?.[0],
      stock: product.stock || 0
    })

    toast.success(`${product.name} ajoute au panier`)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
          <p className="text-sm text-slate-400">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <ShoppingBag className="h-10 w-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Produit non trouve</h2>
        <p className="text-sm text-slate-500 mb-6">Le produit que vous cherchez n&apos;existe pas ou a ete retire.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voir tous les produits
        </Link>
      </div>
    )
  }

  const images = product.images || []
  const price = product.price || 0
  const oldPrice = product.oldPrice || 0
  const stock = product.stock || 0
  const isAvailable = product.available && stock > 0
  const discount = oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
            <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              Accueil
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/products" className="hover:text-slate-900 transition-colors">
              Produits
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {product.category && typeof product.category === 'object' && (
              <>
                <Link
                  href={`/categories/${(product.category as any).slug}`}
                  className="hover:text-slate-900 transition-colors"
                >
                  {(product.category as any).name}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
            <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 group">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                  <ShoppingBag className="h-16 w-16 text-slate-300" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    -{discount}%
                  </span>
                )}
                {product.featured && (
                  <span className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="h-3 w-3 fill-slate-900" />
                    Vedette
                  </span>
                )}
              </div>

              {/* Actions flottantes */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all ${
                    liked ? 'bg-rose-500 text-white' : 'bg-white/90 backdrop-blur-sm text-slate-600 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-white' : ''}`} />
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      toast.success('Lien copie !')
                    }
                  }}
                  className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-sm transition-all"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative bg-slate-100 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-amber-500 ring-2 ring-amber-500/20'
                        : 'border-transparent hover:border-slate-200'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {/* Categorie */}
            {product.category && typeof product.category === 'object' && (
              <Link
                href={`/categories/${(product.category as any).slug}`}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium mb-2 inline-flex items-center gap-1 transition-colors"
              >
                {(product.category as any).name}
                <ChevronRight className="h-3 w-3" />
              </Link>
            )}

            {/* Nom */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              {product.name}
            </h1>

            {/* Notation */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500">4.0 (12 avis)</span>
            </div>

            {/* Prix */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl md:text-4xl font-bold text-slate-900">
                {price.toLocaleString()} FCFA
              </span>
              {oldPrice > 0 && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    {oldPrice.toLocaleString()} FCFA
                  </span>
                  <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2 py-1 rounded-lg">
                    ECONOMISEZ {(oldPrice - price).toLocaleString()} FCFA
                  </span>
                </>
              )}
            </div>

            {/* Stock & urgence */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {isAvailable ? (
                <>
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    En stock ({stock} disponible{stock > 1 ? 's' : ''})
                  </div>
                  {stock <= 5 && stock > 0 && (
                    <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-medium animate-pulse">
                      <Zap className="h-3.5 w-3.5" />
                      Plus que {stock} en stock !
                    </div>
                  )}
                </>
              ) : (
                <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-sm font-medium">
                  <Package className="h-4 w-4" />
                  Rupture de stock
                </div>
              )}
            </div>

            {/* Description courte */}
            {product.description && (
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {product.description.length > 200
                  ? product.description.slice(0, 200) + '...'
                  : product.description}
              </p>
            )}

            {/* Marque */}
            {product.brand && (
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <span className="font-medium text-slate-700">Marque :</span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg">{product.brand}</span>
              </div>
            )}

            {/* Actions */}
            {isAvailable && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* Quantite */}
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 hover:bg-slate-100 transition-colors disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4 text-slate-600" />
                    </button>
                    <span className="px-6 py-3 font-semibold text-slate-900 min-w-[3.5rem] text-center tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                      className="px-4 py-3 hover:bg-slate-100 transition-colors disabled:opacity-30"
                      disabled={quantity >= stock}
                    >
                      <Plus className="h-4 w-4 text-slate-600" />
                    </button>
                  </div>

                  {/* CTA principal */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-slate-900/10 hover:shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Ajouter au panier
                  </button>
                </div>

                {/* Paiement a la livraison */}
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-4 py-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Paiement a la livraison disponible. Payez uniquement quand vous recevez votre colis.
                </div>
              </div>
            )}

            {!isAvailable && (
              <div className="bg-slate-50 rounded-xl p-5 text-center border border-slate-100">
                <p className="text-slate-600 font-medium mb-3">Ce produit est actuellement indisponible</p>
                <a
                  href="https://wa.me/237600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  Me prevenir sur WhatsApp
                </a>
              </div>
            )}

            {/* Trust grid */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: Truck, text: 'Livraison 24-48h' },
                { icon: ShieldCheck, text: 'Paiement securise' },
                { icon: RotateCcw, text: 'Retour sous 7 jours' },
                { icon: Headphones, text: 'Support WhatsApp' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA WhatsApp questions */}
            <div className="mt-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">Une question sur ce produit ?</div>
                  <div className="text-xs text-slate-400">Notre equipe repond en moins de 15 min</div>
                </div>
                <a
                  href="https://wa.me/237600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  Ecrire
                </a>
              </div>
            </div>

            {/* Retour */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 mt-8 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux produits
            </Link>
          </div>
        </div>

        {/* Description detaillee */}
        {product.description && product.description.length > 200 && (
          <div className="mt-12 md:mt-16">
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Description du produit</h2>
              <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed">
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}