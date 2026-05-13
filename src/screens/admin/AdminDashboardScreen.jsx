"use client"

import AdminStatCard from '@/components/admin/AdminStatCard'
import UsersAnalysisChart from '@/components/admin/UsersAnalysisChart'
import { Users, FileText, MessageSquare, BarChart3, FolderOpen } from 'lucide-react'
import AdminLayout from '@/layout/AdminLayout'

const statsCards = [
	{ label: 'Categories', value: '14', icon: FolderOpen, color: 'bg-orange-500' },
	{ label: 'News', value: '5865', icon: FileText, color: 'bg-green-500' },
	{ label: 'Users', value: '430', icon: Users, color: 'bg-red-500' },
	{ label: 'Total Comments', value: '0', icon: MessageSquare, color: 'bg-purple-500' },
	{ label: 'Reporter', value: '50', icon: BarChart3, color: 'bg-blue-600' }
]

export default function AdminDashboardScreen() {
	return (
		<AdminLayout>
			<div className="space-y-8">
				{/* Header */}
				<div>
					<p className="text-sm font-medium uppercase tracking-wide text-orange-600">Prajavarta Admin</p>
					<h1 className="mt-2 text-4xl font-bold text-slate-900">Dashboard</h1>
				</div>

				{/* Stats Grid */}
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
					{statsCards.map((card) => (
						<AdminStatCard
							key={card.label}
							label={card.label}
							value={card.value}
							icon={card.icon}
							color={card.color}
						/>
					))}
				</div>

				{/* Charts Section */}
				<div>
					<UsersAnalysisChart />
				</div>
			</div>
		</AdminLayout>
	)
}
