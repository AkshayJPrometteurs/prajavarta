"use client"

import axiosInstance from '@/lib/axios';
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
	const [categories, setCategories] = useState([]);
	const getCategories = useCallback(async () => {
		try {
			const { data: { data } } = await axiosInstance.get('/categories')
			const formattedCategories = data.map((cat) => {
				const link = cat.slug === "home-page" ? "/" : `/category/${cat.slug}`
				return {
					id: cat.id,
					name: cat.name,
					nameEnglish: cat.nameEnglish,
					link: link
				}
			})
			setCategories(formattedCategories)
		} catch (error) {
			console.error('Error fetching categories for header:', error)
		}
	}, [])

	useEffect(() => { getCategories() }, [getCategories])
	return (
		<AuthContext.Provider value={{ categories }}>
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
