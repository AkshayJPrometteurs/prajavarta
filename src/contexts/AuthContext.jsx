"use client"

import { createContext, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{ }}>
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
