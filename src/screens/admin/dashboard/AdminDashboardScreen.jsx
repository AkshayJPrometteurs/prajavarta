"use client"

import { useEffect, useState } from 'react'
import AdminStatCard from './AdminStatCard'
import UsersAnalysisChart from './UsersAnalysisChart'
import { Users, FileText, MessageSquare, BarChart3, FolderOpen } from 'lucide-react'
import AdminLayout from '@/layout/AdminLayout'
import axiosInstance from '@/lib/axios'
import { useReduxAuth } from '@/hooks/useReduxAuth'
import { toast } from 'react-toastify'

export default function AdminDashboardScreen() {
	const { user } = useReduxAuth()
	const [stats, setStats] = useState(null)
	const [loading, setLoading] = useState(true)

	const currentYear = new Date().getFullYear()
	const [year, setYear] = useState(currentYear)
	const years = ['all', ...Array.from({ length: 5 }, (_, i) => currentYear - i)]

	const [chartData, setChartData] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchDashboard = async () => {
			try {
				setLoading(true)
				setError(null)
				const res = await axiosInstance.get(`/admin/dashboard?year=${year}`)
				if (res.data?.success) {
					setStats(res.data.stats)
					// pass chart data to chart component via state
					setChartData(res.data.chart)
				} else {
					setStats(null)
					setChartData(null)
				}
			} catch (err) {
				console.error('Failed to load dashboard', err)
				toast.error('Failed to load dashboard data')
				setError('Failed to load dashboard data')
				setStats(null)
				setChartData(null)
			} finally {
				setLoading(false)
			}
		}

		fetchDashboard()
	}, [year])

	const adminCards = stats
		? [
			{ label: 'Categories', value: stats.categories, icon: FolderOpen, color: 'bg-orange-500' },
			{ label: 'News', value: stats.news, icon: FileText, color: 'bg-green-500' },
			{ label: 'Users', value: stats.users, icon: Users, color: 'bg-red-500' },
			{ label: 'Total Views', value: stats.totalViews, icon: MessageSquare, color: 'bg-purple-500' },
			{ label: 'Authors', value: stats.authors, icon: BarChart3, color: 'bg-blue-600' }
		]
		: []

	const authorCards = stats
		? [
			{ label: 'My Articles', value: stats.myNewsCount, icon: FileText, color: 'bg-green-500' },
			{ label: 'My Views', value: stats.myViews, icon: BarChart3, color: 'bg-purple-500' },
			{ label: 'Followers', value: stats.myFollowers, icon: Users, color: 'bg-blue-600' }
		]
		: []

	return (
		<AdminLayout>
			<div className="space-y-8">
				<div className='flex justify-between items-center gap-4'>
					<div>
						<p className="text-sm font-medium uppercase tracking-wide text-orange-600">Prajavarta Admin</p>
						<h1 className="mt-2 text-4xl font-bold text-slate-900">Dashboard</h1>
					</div>

					{/* Year selector + Stats Grid */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<label className="text-sm text-slate-600">Year:</label>
							<select value={String(year)} onChange={(e) => setYear(e.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
								{years.map((y) => (
									<option key={String(y)} value={String(y)}>{y === 'all' ? 'All' : y}</option>
								))}
							</select>
						</div>
						{error && <div className="text-sm text-red-600">{error}</div>}
					</div>
				</div>

				{loading ? (
					<div className="py-8">Loading...</div>
				) : stats ? (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
						{(user?.role === 'AUTHOR' ? authorCards : adminCards).map((card) => (
							<AdminStatCard key={card.label} label={card.label} value={card.value ?? 0} icon={card.icon} color={card.color} />
						))}
					</div>
				) : (
					<div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">No data available for the selected year.</div>
				)}

				<div>
					<UsersAnalysisChart chart={chartData} title={user?.role === 'AUTHOR' ? 'My Articles (Monthly)' : 'User Registrations (Monthly)'} subtitle={user?.role === 'AUTHOR' ? 'Articles per month' : 'New registrations'} />
				</div>
			</div>
		</AdminLayout>
	)
}
