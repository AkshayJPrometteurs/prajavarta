import Cookies from 'js-cookie'
import axios from 'axios'
import { AUTH_COOKIE_NAME, ADMIN_AUTH_COOKIE_NAME } from './auth-cookie'

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const isAdmin = config.url.includes('/admin')
        const token = isAdmin 
            ? Cookies.get(ADMIN_AUTH_COOKIE_NAME)
            : Cookies.get(AUTH_COOKIE_NAME)
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
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove(AUTH_COOKIE_NAME)
            Cookies.remove(ADMIN_AUTH_COOKIE_NAME)
        }
        return Promise.reject(error)
    }
)

export default axiosInstance