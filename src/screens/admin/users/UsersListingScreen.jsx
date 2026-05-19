"use client"

import { useEffect, useState } from 'react'
import { Edit2, Trash2, Search, Plus } from 'lucide-react'
import ExportToExcel from '@/components/ui/ExportToExcel'
import CustomImage from '@/components/ui/CustomImage'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import UserFormModal from './UserFormModal'
import Pagination from '@/components/ui/Pagination'
import useDebounce from '@/hooks/useDebounce'

export default function UsersListingScreen() {
    const [state, setState] = useState({ users: [], loading: true, searchTerm: '', page: 1, pageSize: 10, totalPages: 1, isFormOpen: false, editingUser: null })
    const updateState = (data) => setState((prev) => ({ ...prev, ...data }))
    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)

    const fetchUsers = async () => {
        try {
            updateState({ loading: true })
            const params = new URLSearchParams({ page: state.page.toString(), limit: state.pageSize.toString(), ...(debouncedSearchTerm && { search: debouncedSearchTerm }) })
            const res = await axios.get(`/api/admin/users?${params}`)
            if (res.data.success) updateState({ users: res.data.data || [], totalPages: res.data.pagination?.pages || 1 })
        } catch (err) { toast.error('Failed to load users') }
        finally { updateState({ loading: false }) }
    }

    useEffect(() => { updateState({ page: 1 }) }, [debouncedSearchTerm])
    useEffect(() => { fetchUsers() }, [state.page, debouncedSearchTerm])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return
        try {
            const res = await axios.delete(`/api/admin/users?id=${id}`)
            if (res.data.success) { toast.success('User deleted'); fetchUsers() }
        } catch (err) { toast.error(err.response?.data?.error || 'Failed to delete user') }
    }

    const handleEdit = async (user) => {
        try {
            updateState({ loading: true })
            const res = await axios.get(`/api/admin/users?id=${user.id}`)
            if (res.data.success) updateState({ editingUser: res.data.data, isFormOpen: true })
            else toast.error(res.data.error || 'Failed to load user')
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to load user')
        } finally {
            updateState({ loading: false })
        }
    }
    const handleAdd = () => updateState({ editingUser: null, isFormOpen: true })
    const handleFormSubmit = () => { updateState({ isFormOpen: false, editingUser: null, page: 1 }); fetchUsers() }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manage Users</h1>
                    <div className="flex items-center gap-2">
                        {state.users.length > 0 && (
                            <ExportToExcel
                                filename={`users_export_${Date.now()}.csv`}
                                fetchUrl={`/api/admin/users?${new URLSearchParams({ ...(debouncedSearchTerm && { search: debouncedSearchTerm }), limit: '100000' })}`}
                                headers={[
                                    { label: 'Name', key: 'name' },
                                    { label: 'Email', key: 'email' },
                                    { label: 'Role', key: 'role' },
                                    { label: 'Active', key: 'isActive' },
                                    { label: 'Created At', key: 'createdAt' },
                                    { label: 'Image', key: 'image' }
                                ]}
                                className="btn btn-outline btn-sm"
                            />
                        )}
                        <button onClick={handleAdd} className="btn btn-primary btn-sm gap-2"><Plus size={18} /> Add User</button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-md">
                        <Search size={16} className="text-base-content/40" />
                        <input type="text" placeholder="Search users..." value={state.searchTerm} onChange={(e) => updateState({ searchTerm: e.target.value })} className="grow" />
                    </label>
                </div>

                <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100 shadow-sm">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.loading ? (
                                <tr><td colSpan={7} className="py-20 text-center"><span className="loading loading-spinner loading-md" /></td></tr>
                            ) : state.users.length === 0 ? (
                                <tr><td colSpan={7} className="py-20 text-center text-base-content/50">No users found</td></tr>
                            ) : (
                                state.users.map((user, idx) => (
                                    <tr key={user.id} className="hover">
                                        <td className="text-base-content/60">{(state.page - 1) * state.pageSize + idx + 1}</td>
                                        <td>
                                            {user.image ? (
                                                <div className="avatar"><div className="w-10 rounded"><img src={user.image.startsWith('http') ? user.image : user.image} alt={user.name || 'avatar'} /></div></div>
                                            ) : (
                                                <div className="avatar placeholder"><div className="w-10 rounded bg-neutral text-neutral-content"><span className="text-xs">No img</span></div></div>
                                            )}
                                        </td>
                                        <td className="font-medium">{user.name || '-'}</td>
                                        <td className="text-base-content/70">{user.email}</td>
                                        <td className="text-base-content/70">{user.role}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" className="toggle toggle-primary toggle-sm" checked={user.isActive} readOnly />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(user)} className="btn btn-sm gap-1"><Edit2 size={12} /> Edit</button>
                                                <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-error text-white gap-1"><Trash2 size={12} /> Delete</button>
                                            </div>
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

                <UserFormModal isOpen={state.isFormOpen} user={state.editingUser} onClose={() => updateState({ isFormOpen: false })} onSubmit={handleFormSubmit} />
            </div>
        </AdminLayout>
    )
}
