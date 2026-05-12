"use client"

import axios from 'axios'
import Cookies from 'js-cookie'
import { AUTH_COOKIE_NAME } from '@/lib/auth-cookie'

const authCookieOptions = {
  expires: 7,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
}

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(AUTH_COOKIE_NAME)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove(AUTH_COOKIE_NAME)
    }
    return Promise.reject(error)
  }
)

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      
      Cookies.set(AUTH_COOKIE_NAME, response.data.token, authCookieOptions)
      return { 
        success: true, 
        user: response.data.user, 
        token: response.data.token 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  },

  async register(name, email, password) {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      
      Cookies.set(AUTH_COOKIE_NAME, response.data.token, authCookieOptions)
      return { 
        success: true, 
        user: response.data.user, 
        token: response.data.token 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      }
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      Cookies.remove(AUTH_COOKIE_NAME)
    }
  },

  async checkAuth() {
    try {
      const token = Cookies.get(AUTH_COOKIE_NAME)
      if (!token) {
        return { success: false, user: null }
      }

      const response = await api.get('/auth/profile')
      return { 
        success: true, 
        user: response.data.user 
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      return { success: false, user: null }
    }
  },

  getToken() {
    return Cookies.get(AUTH_COOKIE_NAME)
  },

  isAuthenticated() {
    return !!Cookies.get(AUTH_COOKIE_NAME)
  },

  // Expose the axios instance for other services
  api
}
