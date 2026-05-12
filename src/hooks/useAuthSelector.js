"use client"

import { useSelector } from 'react-redux'

export const useAuthSelector = () => {
  return useSelector((state) => state.auth)
}

export const useUser = () => {
  return useSelector((state) => state.auth.user)
}

export const useIsAuthenticated = () => {
  return useSelector((state) => state.auth.isAuthenticated)
}

export const useAuthLoading = () => {
  return useSelector((state) => state.auth.loading)
}

export const useAuthError = () => {
  return useSelector((state) => state.auth.error)
}
