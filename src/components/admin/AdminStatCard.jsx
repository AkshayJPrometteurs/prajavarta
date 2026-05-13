"use client"

import { Users, FileText, MessageSquare, BarChart3, FolderOpen } from 'lucide-react'

const statsCards = [
  { label: 'Categories', value: '14', icon: FolderOpen, color: 'bg-orange-500' },
  { label: 'News', value: '5865', icon: FileText, color: 'bg-green-500' },
  { label: 'Users', value: '430', icon: Users, color: 'bg-red-500' },
  { label: 'Total Comments', value: '0', icon: MessageSquare, color: 'bg-purple-500' },
  { label: 'Reporter', value: '50', icon: BarChart3, color: 'bg-blue-600' }
]

export default function AdminStatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`${color} rounded-full p-3 text-white`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  )
}
