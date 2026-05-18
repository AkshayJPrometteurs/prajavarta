"use client"

import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import {
	loginUser,
	adminLoginUser,
	registerUser,
	logoutUser,
	checkAuth,
	clearError,
	checkAuthAdmin,
	checkAuthAuthor
} from '@/store/slices/authSlice'
import { usePathname } from 'next/navigation'
import { ADMIN_AUTH_COOKIE_NAME, AUTH_COOKIE_NAME, AUTHOR_AUTH_COOKIE_NAME } from '@/lib/auth-cookie'
import Cookies from 'js-cookie'

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

	const pathname = usePathname()
	const userToken = Cookies.get(AUTH_COOKIE_NAME)
	const adminToken = Cookies.get(ADMIN_AUTH_COOKIE_NAME)
	const authorToken = Cookies.get(AUTHOR_AUTH_COOKIE_NAME)

	// Initialize auth on app start
	useEffect(() => {
		if (!initialized) {
			if (pathname?.includes('/admin')) {
				adminToken && dispatch(checkAuthAdmin())
			} else if (pathname?.includes('/author')) {
				authorToken && dispatch(checkAuthAuthor())
			} else {
				userToken && dispatch(checkAuth())
			}
		}
	}, [dispatch, initialized, pathname, userToken, adminToken, authorToken])

	const login = async (email, password) => {
		const action = await dispatch(loginUser({ email, password }))
		if (loginUser.fulfilled.match(action)) {
			return { success: true, ...action.payload }
		}
		return { success: false, error: action.payload || 'Login failed' }
	}

	const adminLogin = async (email, password, type) => {
		const action = await dispatch(adminLoginUser({ email, password, type }))
		if (adminLoginUser.fulfilled.match(action)) {
			return { success: true, ...action.payload }
		}
		return { success: false, error: action.payload || 'Admin login failed' }
	}

	const register = async (name, email, password) => {
		const action = await dispatch(registerUser({ name, email, password }))
		if (registerUser.fulfilled.match(action)) {
			return { success: true, ...action.payload }
		}
		return { success: false, error: action.payload || 'Registration failed' }
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
		adminLogin,
		register,
		logout,
		clearError: clearAuthError
	}
}
