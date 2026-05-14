"use client"

import { useReduxAuth } from '@/hooks/useReduxAuth'
import { useSelector } from 'react-redux'
import { Bell, LogOut, User, Settings } from 'lucide-react'

export default function AdminHeader() {
    const { logout } = useReduxAuth()
    const { user } = useSelector((state) => state.auth)

    const handleLogout = async () => {
        await logout()
        window.location.href = '/admin/login'
    }

    const getInitials = (name) => {
        if (!name) return 'A'
        return name.split(' ').map((n) => n[0]).join('').toUpperCase()
    }

    const notifications = [
        { id: 1, message: 'New user registered', time: '5 minutes ago' },
        { id: 2, message: 'New comment on article', time: '1 hour ago' },
        { id: 3, message: 'System update completed', time: '2 hours ago' }
    ]

    return (
        <header className="sticky top-0 z-20 border-b border-base-200 bg-base-100 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-base-content">Prajavarta</div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications Dropdown */}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative">
                            <Bell size={20} />
                            <span className="badge badge-xs badge-error absolute right-1 top-1" />
                        </div>
                        <div tabIndex={0} className="dropdown-content card card-compact z-50 mt-2 w-80 shadow-lg bg-base-100 border border-base-200">
                            <div className="card-body p-0">
                                <div className="border-b border-base-200 px-4 py-3">
                                    <h3 className="font-semibold text-base-content">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((n) => (
                                        <button key={n.id} className="w-full border-b border-base-200 px-4 py-3 text-left transition-colors hover:bg-base-200">
                                            <p className="text-sm font-medium text-base-content">{n.message}</p>
                                            <p className="mt-1 text-xs text-base-content/60">{n.time}</p>
                                        </button>
                                    ))}
                                </div>
                                <div className="border-t border-base-200 px-4 py-2">
                                    <button className="w-full py-2 text-center text-sm font-medium text-primary hover:text-primary/80">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Dropdown */}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost flex items-center gap-2 rounded-full px-2 py-1">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                                {getInitials(user?.name)}
                            </div>
                            <span className="hidden text-sm font-medium text-base-content sm:inline">
                                {user?.name || 'Admin'}
                            </span>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu z-50 mt-2 w-56 rounded-box bg-base-100 shadow-lg border border-base-200 p-0">
                            <li className="border-b border-base-200 px-4 py-3">
                                <p className="text-sm font-semibold text-base-content pointer-events-none">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-base-content/60 pointer-events-none">{user?.email || 'admin@example.com'}</p>
                            </li>
                            <li>
                                <button onClick={() => {}} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-base-200">
                                    <User size={16} /> Profile
                                </button>
                            </li>
                            <li>
                                <button onClick={() => {}} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-base-200">
                                    <Settings size={16} /> Settings
                                </button>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error/10">
                                    <LogOut size={16} /> Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}
