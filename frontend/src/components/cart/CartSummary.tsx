import { ShoppingBag, Truck } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

interface CartSummaryProps {
  onCheckout: () => void
  isProcessing?: boolean
}

export default function CartSummary({ onCheckout, isProcessing = false }: CartSummaryProps) {
  const { total, totalItems } = useCart()

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-blue-600" />
        Résumé
      </h2>
      
      <div className="space-y-2 border-b border-gray-200 pb-4">
        <div className="flex justify-between text-gray-600">
          <span>Sous-total ({totalItems} articles)</span>
          <span>{total.toLocaleString()} FCFA</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            Livraison
          </span>
          <span className="text-green-600">Gratuite</span>
        </div>
      </div>

      <div className="flex justify-between text-xl font-bold py-4">
        <span>Total</span>
        <span className="text-blue-600">{total.toLocaleString()} FCFA</span>
      </div>

      <button
        onClick={onCheckout}
        disabled={isProcessing || totalItems === 0}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Traitement...
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" />
            Commander via WhatsApp
          </>
        )}
      </button>
    </div>
  )
}