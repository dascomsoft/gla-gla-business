import { CartItem } from '@/types'

export const formatWhatsAppMessage = (
  items: CartItem[],
  total: number,
  businessName: string = 'GLA GLA Business'
): string => {
  let message = `Bonjour ${businessName},\n\n`
  message += 'Je souhaite passer la commande suivante :\n\n'
  
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`
    message += `Prix : ${item.price.toLocaleString()} FCFA\n`
    message += `Quantité : ${item.quantity}\n\n`
  })
  
  message += `Total estimé : ${total.toLocaleString()} FCFA\n\n`
  message += 'Merci de confirmer la disponibilité de ma commande.'
  
  return encodeURIComponent(message)
}

export const getWhatsAppLink = (phone: string, message?: string): string => {
  const baseUrl = 'https://wa.me/'
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  let url = `${baseUrl}${cleanPhone}`
  if (message) {
    url += `?text=${encodeURIComponent(message)}`
  }
  return url
}

export const formatPhoneNumber = (phone: string): string => {
  const clean = phone.replace(/[^0-9]/g, '')
  if (clean.startsWith('237') && clean.length === 12) {
    return clean
  }
  if (clean.startsWith('0') && clean.length === 9) {
    return `237${clean.substring(1)}`
  }
  if (clean.length === 9) {
    return `237${clean}`
  }
  return clean
}