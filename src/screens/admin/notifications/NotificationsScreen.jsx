"use client"

import { useEffect, useState } from 'react'
import { Search, CheckCircle2, Bell } from 'lucide-react'
import axiosInstance from '@/lib/axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import Pagination from '@/components/ui/Pagination'
import useDebounce from '@/hooks/useDebounce'

export default function NotificationsScreen() {
    const [state, setState] = useState({
        notifications: [],
        loading: true,
        searchTerm: '',
        page: 1,
        pageSize: 20,
        totalPages: 1,
        totalItems: 0,
        markingRead: false
    })

    const updateState = (data) => setState((prev) => ({ ...prev, ...data }))
    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)

    const fetchNotifications = async () => {
        try {
            updateState({ loading: true })
            const params = new URLSearchParams({
                page: state.page.toString(),
                limit: state.pageSize.toString(),
                ...(debouncedSearchTerm && { search: debouncedSearchTerm })
            })
            const response = await axiosInstance.get(`/admin/notifications?${params}`)
            if (response.data.success) {
                updateState({
                    notifications: response.data.data || [],
                    totalPages: response.data.pagination?.totalPages || 1,
                    totalItems: response.data.pagination?.totalItems || 0
                })
            }
        } catch (error) {
            toast.error('Failed to load notifications')
        } finally {
            updateState({ loading: false })
        }
    }

    useEffect(() => {
        updateState({ page: 1 })
    }, [debouncedSearchTerm])

    useEffect(() => {
        fetchNotifications()
    }, [state.page, debouncedSearchTerm])

    const handleMarkRead = async () => {
        try {
            updateState({ markingRead: true })
            const unreadIds = state.notifications.filter((notification) => !notification.isRead).map((notification) => notification.id)
            if (unreadIds.length === 0) {
                toast.info('No unread notifications to mark')
                return
            }
            const response = await axiosInstance.patch('/admin/notifications', { ids: unreadIds })
            if (response.data.success) {
                toast.success('Marked as read')
                fetchNotifications()
            }
        } catch (error) {
            toast.error('Failed to mark notifications as read')
        } finally {
            updateState({ markingRead: false })
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Notifications</h1>
                        <p className="text-sm text-base-content/60">Live updates from users and authors are delivered here.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label className="input input-bordered flex items-center gap-2 w-full sm:w-80">
                            <Search size={16} className="text-base-content/40" />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={state.searchTerm}
                                onChange={(e) => updateState({ searchTerm: e.target.value })}
                                className="grow bg-transparent"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={handleMarkRead}
                            disabled={state.markingRead}
                            className="btn btn-outline btn-sm gap-2"
                        >
                            <CheckCircle2 size={16} /> Mark all read
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100 shadow-sm">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Notification</th>
                                <th>Type</th>
                                <th>Related</th>
                                <th>When</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.loading ? (
                                <tr><td colSpan={6} className="py-20 text-center"><span className="loading loading-spinner loading-md" /></td></tr>
                            ) : state.notifications.length === 0 ? (
                                <tr><td colSpan={6} className="py-20 text-center text-base-content/50">No notifications yet</td></tr>
                            ) : (
                                state.notifications.map((notification, idx) => (
                                    <tr key={notification.id} className={notification.isRead ? '' : 'bg-base-200'}>
                                        <td>{(state.page - 1) * state.pageSize + idx + 1}</td>
                                        <td>
                                            <div className="text-sm font-medium">{notification.title}</div>
                                            {notification.message && <div className="text-xs text-base-content/60 mt-1">{notification.message}</div>}
                                        </td>
                                        <td>{notification.type || 'General'}</td>
                                        <td>
                                            {notification.user?.name && <div>User: {notification.user.name}</div>}
                                            {notification.author?.name && <div>Author: {notification.author.name}</div>}
                                        </td>
                                        <td>{new Date(notification.createdAt).toLocaleString()}</td>
                                        <td>{notification.isRead ? 'Read' : 'Unread'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {state.totalPages > 1 && (
                    <Pagination currentPage={state.page} totalPages={state.totalPages} onPageChange={(page) => updateState({ page })} />
                )}
            </div>
        </AdminLayout>
    )
}
