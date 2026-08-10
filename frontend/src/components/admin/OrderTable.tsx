'use client'

import { useState } from 'react'
import { Eye, ChevronDown, ChevronUp } from 'lucide-react'

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

interface OrderTableProps {
  orders: Order[]
  onStatusChange: (orderId: string, status: Order['status']) => void
}

export default function OrderTable({ orders, onStatusChange }: OrderTableProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }

  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En traitement',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl">
        <p className="text-gray-500">Aucune commande trouvée</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{order.customerName}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{order.customerPhone}</td>
                <td className="px-4 py-3 font-semibold text-blue-600">
                  {order.total.toLocaleString()} FCFA
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order._id, e.target.value as Order['status'])}
                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statusColors[order.status]} focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 outline-none`}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {expandedOrder === order._id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded order details */}
      {expandedOrder && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {orders.find(o => o._id === expandedOrder)?.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm py-1">
              <span className="text-gray-600">
                {item.name} × {item.quantity}
              </span>
              <span className="text-gray-800">
                {(item.price * item.quantity).toLocaleString()} FCFA
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}