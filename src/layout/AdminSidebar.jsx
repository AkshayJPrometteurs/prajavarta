"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useReduxAuth } from '@/hooks/useReduxAuth'
import { LayoutDashboard, FolderOpen, Image, LogOut, Menu, Newspaper, X, MapPin, Users, Settings, Mail, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'
import CustomImage from '@/components/ui/CustomImage'
import axiosInstance from '@/lib/axios'

export default function AdminSidebar() {
	const pathname = usePathname()
	const { logout } = useReduxAuth()
	const router = useRouter()
	const [isOpen, setIsOpen] = useState(false)
	const [logoUrl, setLogoUrl] = useState(null)

	const menuItems = [
		{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
		{ label: 'Categories', href: '/admin/categories', icon: FolderOpen },
		{ label: 'Advertisement Banner', href: '/admin/main-advertisement-banner', icon: Image },
		{ label: 'Manage News', href: '/admin/news', icon: Newspaper },
		{ label: 'Users', href: '/admin/users', icon: Users },
		{ label: 'Authors', href: '/admin/authors', icon: Users },
		{ label: 'Authors Following', href: '/admin/authors-following', icon: Users },
		{ label: 'Notifications', href: '/admin/notifications', icon: Bell },
		{ label: 'Districts', href: '/admin/districts', icon: MapPin },
		{ label: 'Subdivisions', href: '/admin/subdivisions', icon: MapPin },
		{ label: 'Tehsils', href: '/admin/tehsils', icon: MapPin },
		{ label: 'Locations', href: '/admin/location-list', icon: MapPin },
		{ label: 'SMTP Settings', href: '/admin/smtp', icon: Mail },
		{ label: 'Settings', href: '/admin/settings', icon: Settings },
	]

	const handleLogout = async () => {
		await logout()
		router.push(`/admin/login`)
	}

	const getSettings = async () => {
		try {
			const { data } = await axiosInstance.get('/settings')
			if (data.success && data.data) setLogoUrl(data.data.appLogo || null)
		} catch (err) {
			// ignore
		}
	}

	useEffect(() => { getSettings() }, [])

	return (
		<>
			{/* Mobile Menu Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pink-600 text-white shadow-lg lg:hidden"
			>
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{/* Sidebar */}
			<aside
				className={`fixed left-0 top-0 z-30 h-[stretch] w-64 transform bg-slate-900 text-slate-50 transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
			>
				{/* Logo/Header */}
				<div className="border-b border-slate-700 p-4">
					<div className="flex items-center gap-2">
						<div className="flex h-13 w-13 items-center justify-center rounded-full overflow-hidden bg-linear-to-br from-orange-400 to-pink-600 font-bold text-white">
							{logoUrl ? (
								<CustomImage src={logoUrl} alt="Prajavarta" width={40} height={90} className="rounded-full h-full w-full" />
							) : (
								<div className="flex h-8 w-8 items-center justify-center">প</div>
							)}
						</div>
						<span className="text-lg font-bold text-white">Prajavarta</span>
					</div>
				</div>

				{/* Menu Items */}
				<nav className="space-y-1 px-4 py-6">
					{menuItems.map((item) => {
						const Icon = item.icon
						const isActive = pathname === item.href
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setIsOpen(false)}
								className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive
									? 'bg-slate-700 text-white'
									: 'text-slate-400 hover:bg-slate-800 hover:text-slate-50'
									}`}
							>
								<Icon size={18} />
								<span>{item.label}</span>
							</Link>
						)
					})}
				</nav>

				{/* Logout Button */}
				<div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 px-4 py-4">
					<button
						onClick={handleLogout}
						className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-50"
					>
						<LogOut size={18} />
						<span>Logout</span>
					</button>
				</div>
			</aside>

			{/* Mobile Overlay */}
			{isOpen && (
				<div
					onClick={() => setIsOpen(false)}
					className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
				/>
			)}
		</>
	)
}
