"use client"

import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import {
  loginUser,
  registerUser,
  logoutUser,
  checkAuth,
  clearError,
  setInitialized
} from '@/store/authSlice'

export const useReduxAuth = () => {
  const dispatch = useDispatch()
  const {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    initialized
  } = useSelector((state) => state.auth)

  // Initialize auth on app start
  useEffect(() => {
    if (!initialized) {
      dispatch(checkAuth())
      dispatch(setInitialized())
    }
  }, [dispatch, initialized])

  const login = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }))
    return result
  }

  const register = async (name, email, password) => {
    const result = await dispatch(registerUser({ name, email, password }))
    return result
  }

  const logout = async () => {
    await dispatch(logoutUser())
  }

  const clearAuthError = () => {
    dispatch(clearError())
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    initialized,
    login,
    register,
    logout,
    clearError: clearAuthError
  }
}
