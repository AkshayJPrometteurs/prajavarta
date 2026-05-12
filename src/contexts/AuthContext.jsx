"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const result = await authService.checkAuth()
      if (result.success) {
        setUser(result.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void Promise.resolve().then(checkAuth)
  }, [])

  const login = async (email, password) => {
    const result = await authService.login(email, password)
    if (result.success) {
      setUser(result.user)
    }
    return result
  }

  const register = async (name, email, password) => {
    const result = await authService.register(name, email, password)
    if (result.success) {
      setUser(result.user)
    }
    return result
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: authService.isAuthenticated(),
    getToken: authService.getToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
