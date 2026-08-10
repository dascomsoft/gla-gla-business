export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  const regex = /^[0-9]{9,13}$/
  return regex.test(phone.replace(/[^0-9]/g, ''))
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && value >= 0
}

export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

export const validateSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}