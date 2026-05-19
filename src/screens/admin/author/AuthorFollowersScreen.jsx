"use client"

import { useEffect, useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import axiosInstance from '@/lib/axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import ExportToExcel from '@/components/ui/ExportToExcel'
import Pagination from '@/components/ui/Pagination'
import useDebounce from '@/hooks/useDebounce'

export default function AuthorFollowersScreen() {
    const [state, setState] = useState({
        followers: [],
        loading: true,
        searchTerm: '',
        page: 1,
        pageSize: 20,
        totalPages: 1,
        totalItems: 0,
    })

    const updateState = (data) => setState((prev) => ({ ...prev, ...data }))
    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)

    const fetchFollowers = async () => {
        try {
            updateState({ loading: true })
            const params = new URLSearchParams({
                page: state.page.toString(),
                limit: state.pageSize.toString(),
                ...(debouncedSearchTerm && { search: debouncedSearchTerm })
            })
            const response = await axiosInstance.get(`/admin/authors/followers?${params}`)
            if (response.data.success) {
                updateState({
                    followers: response.data.data || [],
                    totalPages: response.data.pagination?.totalPages || 1,
                    totalItems: response.data.pagination?.totalItems || 0
                })
            }
        } catch (error) {
            toast.error('Failed to load author following list')
        } finally {
            updateState({ loading: false })
        }
    }

    useEffect(() => {
        updateState({ page: 1 })
    }, [debouncedSearchTerm])

    useEffect(() => {
        fetchFollowers()
    }, [state.page, debouncedSearchTerm])

    const handleUnfollow = async (id) => {
        if (!window.confirm('Remove this follow relationship?')) return
        try {
            const response = await axiosInstance.delete(`/admin/authors/followers?id=${id}`)
            if (response.data.success) {
                toast.success('Unfollow record removed')
                fetchFollowers()
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to remove follow record')
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Authors Following</h1>
                        <p className="text-sm text-base-content/60">View which users are following which authors and remove follows when needed.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label className="input input-bordered flex items-center gap-2 w-full sm:w-80 h-8.5">
                            <Search size={16} className="text-base-content/40" />
                            <input
                                type="text"
                                placeholder="Search users or authors..."
                                value={state.searchTerm}
                                onChange={(e) => updateState({ searchTerm: e.target.value })}
                                className="grow bg-transparent"
                            />
                        </label>
                        {state.followers.length > 0 && (
                            <ExportToExcel
                                filename={`author_followers_${Date.now()}.csv`}
                                data={state.followers.map((item) => ({
                                    userName: item.user?.name,
                                    userEmail: item.user?.email,
                                    authorName: item.author?.name,
                                    authorEmail: item.author?.email,
                                    followedAt: item.createdAt
                                }))}
                                headers={[
                                    { label: 'User Name', key: 'userName' },
                                    { label: 'User Email', key: 'userEmail' },
                                    { label: 'Author Name', key: 'authorName' },
                                    { label: 'Author Email', key: 'authorEmail' },
                                    { label: 'Followed At', key: 'followedAt' }
                                ]}
                                className="btn btn-outline btn-sm"
                            />
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100 shadow-sm">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>User Email</th>
                                <th>Author</th>
                                <th>Author Email</th>
                                <th>Followed At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.loading ? (
                                <tr><td colSpan={7} className="py-20 text-center"><span className="loading loading-spinner loading-md" /></td></tr>
                            ) : state.followers.length === 0 ? (
                                <tr><td colSpan={7} className="py-20 text-center text-base-content/50">No follow records found</td></tr>
                            ) : (
                                state.followers.map((item, idx) => (
                                    <tr key={item.id} className="hover">
                                        <td className="text-base-content/60">{(state.page - 1) * state.pageSize + idx + 1}</td>
                                        <td>{item.user?.name || '-'}</td>
                                        <td>{item.user?.email || '-'}</td>
                                        <td>{item.author?.name || '-'}</td>
                                        <td>{item.author?.email || '-'}</td>
                                        <td>{new Date(item.createdAt).toLocaleString()}</td>
                                        <td>
                                            <button
                                                onClick={() => handleUnfollow(item.id)}
                                                className="btn btn-sm btn-error text-white gap-2"
                                            >
                                                <Trash2 size={14} /> Unfollow
                                            </button>
                                        </td>
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
