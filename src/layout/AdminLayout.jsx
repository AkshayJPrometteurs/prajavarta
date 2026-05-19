"use client"

import { useReduxAuth } from '@/hooks/useReduxAuth'
import AdminFooter from '@/layout/AdminFooter'
import AdminHeader from '@/layout/AdminHeader'
import AdminSidebar from '@/layout/AdminSidebar'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import AuthorSidebar from './AuthorSidebar'

const AdminLayout = ({ children }) => {
	const pathname = usePathname()
	return (
		<div className="flex min-h-screen bg-slate-100">
			{pathname.startsWith('/author') ? <AuthorSidebar /> : <AdminSidebar />}
			<div className="flex flex-1 flex-col">
				<AdminHeader />
				<main className="flex-1 overflow-auto">
					<div className="p-4 sm:p-6 lg:p-8">
						{children}
					</div>
				</main>
				<AdminFooter />
			</div>
		</div>
	)
}

export default memo(AdminLayout)