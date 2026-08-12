'use client'

import { useEffect, useState } from 'react'
import { 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle,
  LogOut
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import DashboardStats from '@/components/admin/DashboardStats'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import { orderService } from '@/services/orderService'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    pendingOrders: 0,
    availableProducts: 0,
    outOfStockProducts: 0
  })
  const [loading, setLoading] = useState(true)

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer le token et les données admin du localStorage
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    // Rediriger vers la page de connexion
    router.push('/admin/login')
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categories, ordersRes] = await Promise.all([
          productService.getProducts({ limit: 1 }),
          categoryService.getCategories(),
          orderService.getOrders({ limit: 1 })
        ])

        // Get all products for stats
        const allProducts = await productService.getProducts({ limit: 1000 })
        
        setStats({
          products: productsRes.pagination?.total || 0,
          categories: categories.length || 0,
          orders: ordersRes.pagination?.total || 0,
          pendingOrders: 0, // Would need to filter orders
          availableProducts: allProducts.products.filter(p => p.available && p.stock > 0).length,
          outOfStockProducts: allProducts.products.filter(p => !p.available || p.stock === 0).length
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const statsData: Array<{
    title: string
    value: number
    icon: any
    color: string
    change?: string
    changeType?: 'increase' | 'decrease'
  }> = [
    {
      title: 'Total Produits',
      value: stats.products,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Catégories',
      value: stats.categories,
      icon: FolderTree,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Commandes',
      value: stats.orders,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'En attente',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-3%',
      changeType: 'decrease'
    },
    {
      title: 'Disponibles',
      value: stats.availableProducts,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+10%',
      changeType: 'increase'
    },
    {
      title: 'Rupture de stock',
      value: stats.outOfStockProducts,
      icon: XCircle,
      color: 'bg-red-500',
      change: '+2%',
      changeType: 'increase'
    }
  ]

  return (
    <div>
      {/* Header avec bouton de déconnexion */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Bienvenue dans l'administration de GLA GLA Business</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <DashboardStats 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            change={stat.change}
            changeType={stat.changeType}
          />
        ))}
      </div>

      {/* Recent Activity / Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/admin/products/create'}
              className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
            >
              ➕ Ajouter un produit
            </button>
            <button 
              onClick={() => window.location.href = '/admin/categories/create'}
              className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
            >
              📁 Ajouter une catégorie
            </button>
            <button 
              onClick={() => window.location.href = '/admin/orders'}
              className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
            >
              👁️ Voir les commandes
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Informations</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>📊 Total produits: <span className="font-semibold">{stats.products}</span></p>
            <p>📁 Total catégories: <span className="font-semibold">{stats.categories}</span></p>
            <p>🛒 Total commandes: <span className="font-semibold">{stats.orders}</span></p>
            <p className="pt-2 border-t border-gray-100 text-xs text-gray-400">
              Dernière mise à jour: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}