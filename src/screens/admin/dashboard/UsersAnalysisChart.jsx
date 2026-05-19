"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function UsersAnalysisChart({ chart = null, title = 'Users Analysis', subtitle = 'Last 6 months' }) {
	const data = chart?.labels && chart?.data ? chart.labels.map((label, i) => ({ name: label, value: chart.data[i] })) : []

	return (
		<div className="rounded-lg bg-white p-6 shadow-sm">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold text-slate-900">{title}</h3>
					<p className="mt-1 text-sm text-slate-500">{subtitle}</p>
				</div>
			</div>
			<div className="h-80 w-full">
				{data.length === 0 ? (
					<div className="flex h-80 items-center justify-center text-slate-500">No chart data for selected year.</div>
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={data}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
							<XAxis dataKey="name" stroke="#94a3b8" />
							<YAxis stroke="#94a3b8" />
							<Tooltip
								contentStyle={{
									backgroundColor: '#fff',
									border: '1px solid #e2e8f0',
									borderRadius: '0.375rem'
								}}
							/>
							<Line
								type="monotone"
								dataKey="value"
								stroke="#2563eb"
								strokeWidth={2}
								dot={{ fill: '#2563eb', r: 5 }}
								activeDot={{ r: 7 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	)
}
