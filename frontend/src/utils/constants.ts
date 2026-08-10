export const APP_NAME = 'GLA GLA Business'
export const APP_DESCRIPTION = 'Votre boutique en ligne au Cameroun'
export const CURRENCY = 'FCFA'
export const DEFAULT_WHATSAPP = '237600000000'

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
}

export const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En traitement',
  delivered: 'Livrée',
  cancelled: 'Annulée'
}

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Plus récent' },
  { value: 'price', label: 'Prix croissant' },
  { value: '-price', label: 'Prix décroissant' },
  { value: '-views', label: 'Les plus vus' },
  { value: 'name', label: 'Nom A-Z' },
]

export const LIMIT_OPTIONS = [12, 24, 48, 96]