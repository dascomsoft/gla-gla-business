'use client'

import { Phone } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

interface WhatsAppButtonProps {
  text?: string
  className?: string
  message?: string
}

export default function WhatsAppButton({ 
  text = 'WhatsApp', 
  className = '',
  message = ''
}: WhatsAppButtonProps) {
  const { settings } = useSettings()
  const phone = settings?.whatsappNumber || '237600000000'

  const handleClick = () => {
    const url = `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`
    window.open(url, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors ${className}`}
    >
      <Phone className="h-4 w-4" />
      {text}
    </button>
  )
}