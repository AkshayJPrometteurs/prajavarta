"use client"

import { memo, useEffect, useState } from 'react'
import Link from 'next/link'
import { useReduxAuth } from '@/hooks/useReduxAuth'
import { useSelector } from 'react-redux'
import axiosInstance from '@/lib/axios'
import { Bell, LogOut, User, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CustomImage from '@/components/ui/CustomImage'

const AdminHeader = () => {
    const router = useRouter()
    const { user, logout } = useReduxAuth()
    const [notifications, setNotifications] = useState([])

    const handleLogout = async () => {
        await logout()
        router.push(`/${user?.role?.toLowerCase()}/login`)
    }

    const getInitials = (name) => {
        if (!name) return 'A'
        return name.split(' ').map((n) => n[0]).join('').toUpperCase()
    }

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axiosInstance.get('/admin/notifications?limit=5')
                if (response.data.success) {
                    setNotifications(response.data.data || [])
                }
            } catch (error) {
                console.error('Failed to load admin notifications:', error)
            }
        }

        fetchNotifications()
    }, [])

    const unreadCount = notifications.filter((notification) => !notification.isRead).length

    return (
        <header className="sticky top-0 z-20 border-b border-base-200 bg-base-100 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-base-content">Prajavarta</div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications Dropdown */}
                    {user?.role === 'ADMIN' && (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle relative">
                                <Bell size={25} />
                                {unreadCount > 0 && (
                                    <span className="badge badge-xs badge-error absolute right-1 top-1">{unreadCount}</span>
                                )}
                            </div>
                            <div tabIndex={0} className="dropdown-content card card-compact z-50 mt-2 w-80 shadow-lg bg-base-100 border border-base-200">
                                <div className="card-body p-0">
                                    <div className="border-b border-base-200 px-4 py-3">
                                        <h3 className="font-semibold text-base-content">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-sm text-base-content/60">No notifications yet</div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div key={n.id} className="w-full border-b border-base-200 px-4 py-3 text-left">
                                                    <p className="text-sm font-medium text-base-content">{n.title}</p>
                                                    {n.message && <p className="mt-1 text-xs text-base-content/60">{n.message}</p>}
                                                    <p className="mt-2 text-[11px] uppercase text-base-content/50">{new Date(n.createdAt).toLocaleString()}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="border-t border-base-200 px-4 py-2">
                                        <Link href="/admin/notifications" className="w-full block py-2 text-center text-sm font-medium text-primary hover:text-primary/80">
                                            View all notifications
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Dropdown */}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost flex items-center gap-2 rounded-full px-2 py-1">
                            {user?.image ? (
                                <CustomImage src={user.image} alt={user.name || 'avatar'} width={40} height={40} className="rounded-full" />
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                                    {getInitials(user?.name)}
                                </div>
                            )}
                            <span className="hidden text-sm font-medium text-base-content sm:inline">
                                {user?.name || 'Admin'}
                            </span>
                        </div>

                        <ul tabIndex={0} className="dropdown-content menu z-50 mt-2 w-56 rounded-box bg-base-100 shadow-lg border border-base-200">
                            <li className="border-b border-base-200 px-4 py-3">
                                <p className="text-sm font-semibold text-base-content pointer-events-none mb-0">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-base-content/60 pointer-events-none">{user?.email || 'admin@example.com'}</p>
                            </li>
                            {user?.role === 'AUTHOR' && (
                                <li>
                                    <button
                                        onClick={() => router.push('/author/profile')}
                                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-base-200"
                                    >
                                        <User size={16} /> Profile
                                    </button>
                                </li>
                            )}
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

export default memo(AdminHeader)