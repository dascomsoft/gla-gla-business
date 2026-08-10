'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'
import { orderService } from '@/services/orderService'
import toast from 'react-hot-toast'

interface Order {
  _id: string
  customerName: string
  customerPhone: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled'
  createdAt: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    processing: Truck,
    delivered: CheckCircle,
    cancelled: XCircle
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderService.getOrders({
        status: statusFilter || undefined,
        page: currentPage,
        limit: 10
      })
      setOrders(response.orders)
      setTotalPages(response.pagination.pages)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter])

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus)
      toast.success('Statut mis à jour avec succès')
      fetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Commandes</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="processing">En traitement</option>
          <option value="delivered">Livrée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Aucune commande trouvée</p>
          </div>
        ) : (
          orders.map((order) => {
            const StatusIcon = statusIcons[order.status]
            return (
              <div key={order._id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {order.customerName}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        <StatusIcon className="h-3 w-3 inline mr-1" />
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Tél: {order.customerPhone}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-gray-800">
                            {(item.price * item.quantity).toLocaleString()} FCFA
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-blue-600">
                        {order.total.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                  <div className="md:w-48">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value as Order['status'])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="processing">En traitement</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Page {currentPage} sur {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  )
}