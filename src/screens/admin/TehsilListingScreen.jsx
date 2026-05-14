"use client"

import { useEffect, useState } from 'react'
import { Edit2, Trash2, Search, Plus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import TehsilFormModal from '@/components/admin/TehsilFormModal'
import Pagination from '@/components/ui/Pagination'
import useDebounce from '@/hooks/useDebounce'

export default function TehsilListingScreen() {
    const [state, setState] = useState({
        tehsils: [], loading: true, searchTerm: '', filterStatus: 'all',
        page: 1, pageSize: 10, totalPages: 1, isFormOpen: false, editingTehsil: null,
    })

    const updateState = (data) => setState((prev) => ({ ...prev, ...data }))

    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)

    const fetchTehsils = async () => {
        try {
            updateState({ loading: true })
            const params = new URLSearchParams({
                page: state.page.toString(), limit: state.pageSize.toString(),
                ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
                ...(state.filterStatus !== 'all' && { isActive: state.filterStatus === 'active' })
            })
            const response = await axios.get(`/api/admin/tehsils?${params}`)
            if (response.data.success) updateState({ tehsils: response.data.data || [], totalPages: response.data.pagination?.pages || 1 })
        } catch { toast.error('Failed to load tehsils') }
        finally { updateState({ loading: false }) }
    }

    useEffect(() => {
        updateState({ page: 1 })
    }, [debouncedSearchTerm])

    useEffect(() => { fetchTehsils() }, [state.page, debouncedSearchTerm, state.filterStatus])

    const handleToggleStatus = async (tehsil) => {
        try {
            const response = await axios.put('/api/admin/tehsils', { id: tehsil.id, name: tehsil.name, nameEnglish: tehsil.nameEnglish, districtId: tehsil.districtId, subdivisionId: tehsil.subdivisionId, isActive: !tehsil.isActive })
            if (response.data.success) { toast.success(`Tehsil ${response.data.data.isActive ? 'enabled' : 'disabled'}`); fetchTehsils() }
        } catch { toast.error('Failed to update status') }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tehsil?')) return
        try {
            const response = await axios.delete(`/api/admin/tehsils?id=${id}`)
            if (response.data.success) { toast.success('Tehsil deleted successfully'); fetchTehsils() }
        } catch (error) { toast.error(error.response?.data?.error || 'Failed to delete tehsil') }
    }

    const handleEdit = (tehsil) => updateState({ editingTehsil: tehsil, isFormOpen: true })
    const handleAdd = () => updateState({ editingTehsil: null, isFormOpen: true })
    const handleFormSubmit = () => { updateState({ isFormOpen: false, editingTehsil: null, page: 1 }); fetchTehsils() }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manage Tehsils</h1>
                    <button onClick={handleAdd} className="btn btn-primary btn-sm gap-2">
                        <Plus size={18} /> Add Tehsil
                    </button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-md">
                        <Search size={16} className="text-base-content/40" />
                        <input type="text" placeholder="Search tehsils..." value={state.searchTerm}
                            onChange={(e) => updateState({ searchTerm: e.target.value })} className="grow" />
                    </label>
                    <select value={state.filterStatus} onChange={(e) => updateState({ filterStatus: e.target.value, page: 1 })} className="select select-bordered w-full sm:w-40">
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100 shadow-sm">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name (Marathi)</th>
                                <th>Name (English)</th>
                                <th>District</th>
                                <th>Subdivision</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.loading ? (
                                <tr><td colSpan={7} className="py-20 text-center"><span className="loading loading-spinner loading-md" /></td></tr>
                            ) : state.tehsils.length === 0 ? (
                                <tr><td colSpan={7} className="py-20 text-center text-base-content/50">No tehsils found</td></tr>
                            ) : (
                                state.tehsils.map((item, idx) => (
                                    <tr key={item.id} className="hover">
                                        <td className="text-base-content/60">{(state.page - 1) * state.pageSize + idx + 1}</td>
                                        <td className="font-medium">{item.name}</td>
                                        <td className="text-base-content/70">{item.nameEnglish || '-'}</td>
                                        <td className="text-base-content/70">{item.district ? `${item.district.name}${item.district.nameEnglish ? ` (${item.district.nameEnglish})` : ''}` : '-'}</td>
                                        <td className="text-base-content/70">{item.subdivision ? `${item.subdivision.name}${item.subdivision.nameEnglish ? ` (${item.subdivision.nameEnglish})` : ''}` : '-'}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" className="toggle toggle-primary toggle-sm"
                                                    checked={item.isActive} onChange={() => handleToggleStatus(item)} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="btn btn-sm gap-1"
                                                >
                                                    <Edit2 size={12} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="btn btn-sm btn-error text-white gap-1"
                                                >
                                                    <Trash2 size={12} /> Delete
                                                </button>
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

                <TehsilFormModal isOpen={state.isFormOpen} tehsil={state.editingTehsil}
                    onClose={() => updateState({ isFormOpen: false, editingTehsil: null })}
                    onSubmit={handleFormSubmit} />
            </div>
        </AdminLayout>
    )
}
