'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  admin: any
  login: (token: string, adminData: any) => void
  logout: () => void
}

// Créer et exporter le contexte
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const adminData = localStorage.getItem('adminData')
    if (token && adminData) {
      setIsAuthenticated(true)
      setAdmin(JSON.parse(adminData))
    }
  }, [])

  const login = (token: string, adminData: any) => {
    localStorage.setItem('adminToken', token)
    localStorage.setItem('adminData', JSON.stringify(adminData))
    setIsAuthenticated(true)
    setAdmin(adminData)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    setIsAuthenticated(false)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}